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
  SentenceCacher,
  SentenceWithConversation,
  Spellchecker,
} from '../../types/types';
import {
  findNeedsCorrection,
  markUncorrectedForCorrection,
  transformToSentenceObjects,
  updateSentencesFromCache,
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
  addSentencesNeedingCorrection,
  removeSentenceNeedingCorrection,
  setSentences,
  updateNeedingCorrection,
  updateSentence,
} from '../redux/textAssistantSlice';
import ChatGPTConversational from './adapters/ChatGptConversational';
import SentenceCache from './adapters/SentenceCache';

let previousText = '';

export const handleCachedCorrections = () => {
  const state = store.getState().textAssistant;

  if (state.text !== undefined && previousText !== state.text) {
    previousText = state.text;

    const updatedSentences: Sentence[] = R.pipe(
      (text: string) => trimToCompleteSentences(text),
      (text: string) => splitIntoSentences(text),
      (sentences: string[]) => transformToSentenceObjects(sentences),
      (sentences: Sentence[]) =>
        matchWithCurrentSentences(sentences, state.sentences),
      (sentences: Sentence[]) =>
        updateSentencesFromCache(sentences, SentenceCache),
      (sentences: Sentence[]) => markUncorrectedForCorrection(sentences),
      (sentences: Sentence[]) =>
        setOldCorrectedText(sentences, state.sentences),
      (sentences: Sentence[]) => runAddTokensOnMarkedSentences(sentences)
    )(state.text);

    store.dispatch(setSentences(updatedSentences));

    const sentencesNeedingCorrection = findNeedsCorrection(updatedSentences);
    store.dispatch(addSentencesNeedingCorrection(sentencesNeedingCorrection));
  }
};

export const handleNewCorrections = () => {
  const spellchecker: Spellchecker = new ChatGPTConversational();
  const dispatcher: Dispatcher = store;
  const logger: Logger = console;
  const cache: SentenceCacher = SentenceCache;

  const state = store.getState().textAssistant;
  const needsCorrection = state.sentencesNeedingCorrection.filter(
    (sentence) => !sentence.underCorrection
  );

  if (needsCorrection.length > 0) {
    const underCorrection = needsCorrection.map((sentence) => ({
      ...sentence,
      underCorrection: true,
    }));
    dispatcher.dispatch(updateNeedingCorrection(underCorrection));
  }

  const sentencesWithConversation = amendConversationPrefixes(
    needsCorrection,
    state.sentences
  );

  const correctionPromises = sentencesWithConversation.map(
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
        cache.set(corrected.hash, tokenized);
        dispatcher.dispatch(updateSentence(tokenized));
        dispatcher.dispatch(removeSentenceNeedingCorrection(corrected));
        return corrected;
      } else if (error) {
        logger.log('Failed to correct sentence', error);
      }
      return undefined;
    }
  );

  Promise.all(correctionPromises).catch((error) => {
    logger.log('System error when correcting sentence', error);
  });
};
