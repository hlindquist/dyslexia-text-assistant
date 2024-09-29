/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Author: Håkon Lindquist
 */

import { debounce } from 'lodash';
import R from 'ramda';
import {
  CharPosition,
  CharPositionSimple,
  ContentMessage,
  Dispatcher,
  Logger,
  Sentence,
  SentenceWithConversation,
  Spellchecker,
} from '../../types/types';
import {
  findNeedsCorrection,
  markUncorrectedForCorrection,
  transformToSentenceObjects,
} from '../functions/sentenceFunctions';
import {
  addTokens,
  amendConversationPrefixes,
  matchWithCurrentSentences,
  runAddTokensOnMarkedSentences,
  setOldCorrectedText,
} from '../functions/spellingFunctions';
import {
  extractIncompleteSentence,
  getPositionIgnoringNewlines,
  splitIntoSentences,
  trimToCompleteSentences,
} from '../functions/textFunctions';
import store from '../redux/store';
import {
  removeSentenceNeedingCorrection,
  setCharPosition,
  setChatConfiguration,
  setIncompleteSentence,
  setSentences,
  setText,
  updateNeedingCorrection,
  updateSentence,
} from '../redux/textAssistantSlice';
import CacheableSpellchecker from './adapters/CacheableSpellchecker';
import ChatGPTConversational from './adapters/ChatGptConversational';

export const handleContentMessage = (contentMessage: ContentMessage) => {
  const incompleteSentence = extractIncompleteSentence(contentMessage.text);
  const state = store.getState().textAssistant;
  const hasConfigChanged =
    state.chatConfiguration.apiKey !== contentMessage.apiKey ||
    state.chatConfiguration.language !== contentMessage.language;

  hasConfigChanged &&
    store.dispatch(
      setChatConfiguration({
        apiKey: contentMessage.apiKey,
        language: contentMessage.language,
      })
    );
  store.dispatch(setIncompleteSentence(incompleteSentence));
  store.dispatch(setText(contentMessage.text));
};

export const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const simplePosition = getPositionIgnoringNewlines(charPosition, state.text);

  handleCharPositionSimple(simplePosition);
};

export const handleCharPositionSimple = (charPosition: CharPositionSimple) => {
  store.dispatch(setCharPosition(charPosition));
};

export const debouncedHandleContentMessage = debounce(handleContentMessage, 50);
export const debouncedHandleCharPosition = debounce(handleCharPosition, 50);

export const debouncedHandleCharPositionSimple = debounce(
  handleCharPositionSimple,
  50
);

let previousText = '';

export const handleCorrections = () => {
  handleNewCorrections();
};

const handleNewCorrections = () => {
  const spellchecker: Spellchecker = new CacheableSpellchecker(
    new ChatGPTConversational()
  );
  const dispatcher: Dispatcher = store;
  const logger: Logger = console;

  const state = store.getState().textAssistant;

  if (state.text !== undefined && previousText !== state.text) {
    previousText = state.text;

    const updatedSentences: Sentence[] = R.pipe(
      (text: string) => trimToCompleteSentences(text),
      (text: string) => splitIntoSentences(text),
      (sentences: string[]) => transformToSentenceObjects(sentences),
      (sentences: Sentence[]) =>
        matchWithCurrentSentences(sentences, state.sentences),
      (sentences: Sentence[]) => markUncorrectedForCorrection(sentences),
      (sentences: Sentence[]) =>
        setOldCorrectedText(sentences, state.sentences),
      (sentences: Sentence[]) => runAddTokensOnMarkedSentences(sentences)
    )(state.text);

    store.dispatch(setSentences(updatedSentences));

    const sentencesNeedingCorrection = findNeedsCorrection(updatedSentences);
    if (sentencesNeedingCorrection.length > 0) {
      const underCorrection = sentencesNeedingCorrection.map((sentence) => ({
        ...sentence,
        underCorrection: true,
      }));
      dispatcher.dispatch(updateNeedingCorrection(underCorrection));
    }

    const sentencesWithConversation = amendConversationPrefixes(
      sentencesNeedingCorrection,
      state.sentences
    );

    const correctedSentences = sentencesWithConversation.map(
      async (sentence: SentenceWithConversation) => {
        const [error, corrected] = await spellchecker.correct({
          sentence: {
            hash: sentence.hash,
            original: sentence.original,
            conversationPrefix: sentence.conversationPrefix,
          },
          apiKey: state.chatConfiguration.apiKey,
          language: state.chatConfiguration.language,
        });
        if (corrected) {
          const tokenized = addTokens(corrected);
          dispatcher.dispatch(updateSentence(tokenized));
          dispatcher.dispatch(removeSentenceNeedingCorrection(corrected));
          return corrected;
        } else if (error) {
          logger.log('Failed to correct sentence', error);
        }
        return undefined;
      }
    );

    Promise.all(correctedSentences).catch((error) => {
      logger.log('System error when correcting sentence', error);
    });
  }
};
