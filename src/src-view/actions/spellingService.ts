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

import R from 'ramda';
import {
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
  splitIntoSentences,
  trimToCompleteSentences,
} from '../functions/textFunctions';
import store from '../redux/store';
import {
  removeSentenceNeedingCorrection,
  setSentences,
  updateNeedingCorrection,
  updateSentence,
} from '../redux/textAssistantSlice';
import CacheableSpellchecker from './adapters/CacheableSpellchecker';
import ChatGPTConversational from './adapters/ChatGptConversational';

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
