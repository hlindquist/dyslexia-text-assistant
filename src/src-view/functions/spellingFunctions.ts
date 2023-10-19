/* eslint-disable indent */
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

import * as R from 'ramda';

import {
  ContentMessage,
  DiffChanges,
  Dispatcher,
  EditorSection,
  Logger,
  SentenceCacher,
  Spellchecker,
  SpellingSection,
  TextAssistantState,
  WordChange,
} from '../../types/types';
import { Sentence, SentenceWithConversation } from '../../types/types';
import hash from 'object-hash';
import SentenceCache from '../actions/adapters/SentenceCache';
import Differ from '../actions/adapters/Differ';
import { transformTextToTokens } from './tokenUtils';
import {
  splitIntoSentences,
  trimToCompleteSentences,
} from '../utils/textUtils';
import {
  setSentences,
  setText,
  updateSentence,
} from '../redux/textAssistantSlice';

export const markNewSentences = (sentences: Sentence[]): Sentence[] =>
  sentences.map((sentence) => {
    return !sentence.corrected
      ? {
          ...sentence,
          underCorrection: true,
        }
      : sentence;
  });

export const setOldCorrectedText = (
  sentences: Sentence[],
  oldSentences: Sentence[]
): Sentence[] => {
  return sentences.map((sentence: Sentence, index: number) => {
    if (sentence.underCorrection) {
      const oldCorrection =
        findCorrectionByLeftSibling(index, sentences, oldSentences) ||
        findCorrectionByRightSibling(index, sentences, oldSentences);
      if (oldCorrection) {
        return {
          ...sentence,
          corrected: oldCorrection,
        };
      }
    }

    return sentence;
  });
};

const runAddTokensOnMarkedSentences = (sentences: Sentence[]) =>
  sentences.map((sentence) =>
    sentence.corrected && sentence.underCorrection
      ? addTokens(sentence)
      : sentence
  );

export const abstractCheckSpelling =
  (
    state: TextAssistantState,
    spellchecker: Spellchecker,
    dispatcher: Dispatcher,
    logger: Logger,
    cache: SentenceCacher
  ) =>
  (contentMessage: ContentMessage): Promise<Sentence | undefined>[] => {
    const { apiKey, language, text } = contentMessage;
    const oldSentences = state.sentences;

    const updatedSentences: Sentence[] = R.pipe(
      (text: string) => trimToCompleteSentences(text),
      (text: string) => splitIntoSentences(text),
      (sentences: string[]) => transformToSentenceObjects(sentences),
      (sentences: Sentence[]) => updateSentencesFromCache(sentences)
    )(text);

    const updatedWithTemporaryCorrections: Sentence[] = R.pipe(
      (sentences: Sentence[]) => markNewSentences(sentences),
      (sentences: Sentence[]) => setOldCorrectedText(sentences, oldSentences),
      (sentences: Sentence[]) => runAddTokensOnMarkedSentences(sentences)
    )(updatedSentences);

    dispatcher.dispatch(setText(contentMessage.text));

    dispatcher.dispatch(setSentences(updatedWithTemporaryCorrections));

    const sentencesWithConversation: SentenceWithConversation[] = R.pipe(
      (sentences: Sentence[]) => getSentencesWithoutCorrection(sentences),
      (sentencesWithoutCorrection: Sentence[]) =>
        amendConversationPrefixes(sentencesWithoutCorrection, updatedSentences)
    )(updatedSentences);

    return sentencesWithConversation.map(
      async (sentence: SentenceWithConversation) => {
        const [error, corrected] = await spellchecker.correct({
          sentence,
          apiKey,
          language,
        });
        if (corrected) {
          const tokenized = addTokens(corrected);
          const strippedSentence = {
            ...tokenized,
            conversationPrefix: undefined,
          };
          cache.set(corrected.hash, strippedSentence);
          dispatcher.dispatch(updateSentence(strippedSentence));
          return corrected;
        } else if (error) {
          logger.log('Failed to correct sentence', error);
        }
        return undefined;
      }
    );
  };

export const addTokens = (sentence: Sentence): Sentence => {
  const diffChanges = Differ.compare(
    sentence.original,
    sentence.corrected || ''
  );
  const spellingSection = createSpellingSection(
    sentence.original,
    sentence.corrected || '',
    diffChanges
  );
  const originalTokens = transformTextToTokens(spellingSection.original);
  const correctedTokens = transformTextToTokens(spellingSection.corrected);

  return {
    ...sentence,
    originalTokens,
    correctedTokens,
  };
};

export const createSpellingSection = (
  content: string,
  response: string,
  diffChanges: DiffChanges
): SpellingSection => {
  return {
    original: createSection(content, diffChanges.original),
    corrected: createSection(response, diffChanges.corrected),
  };
};

export const createSection = (
  content: string,
  wordChanges: WordChange[]
): EditorSection => ({
  text: content,
  ranges: wordChanges,
});

export const transformToSentenceObjects = (sentences: string[]): Sentence[] =>
  sentences.map((sentence) => ({
    hash: hash(sentence, { algorithm: 'md5' }),
    original: sentence,
  }));

export const updateSentencesFromCache = (sentences: Sentence[]): Sentence[] =>
  sentences.map((sentence) => {
    const cachedSentence = SentenceCache.get(sentence.hash);
    return cachedSentence || sentence;
  });

export const getSentencesWithoutCorrection = (
  sentences: Sentence[]
): Sentence[] => sentences.filter((sentence) => !sentence.corrected);

export const amendConversationPrefix = (
  sentenceToPrefix: Sentence,
  sentences: Sentence[]
): SentenceWithConversation => {
  const index = sentences.findIndex(
    (sentence) => sentence.hash === sentenceToPrefix.hash
  );

  const beforeSentences = sentences
    .slice(0, index)
    .filter((s) => s.corrected !== undefined);

  const afterSentences = sentences
    .slice(index + 1)
    .filter((s) => s.corrected !== undefined);

  const surroundingSentences = [...beforeSentences, ...afterSentences].slice(
    0,
    5
  );

  return {
    ...sentenceToPrefix,
    conversationPrefix: surroundingSentences,
  };
};

export const amendConversationPrefixes = (
  sentencesWithoutCorrection: Sentence[],
  sentences: Sentence[]
): SentenceWithConversation[] =>
  sentencesWithoutCorrection.map((sentence) =>
    amendConversationPrefix(sentence, sentences)
  );

const findCorrectionByLeftSibling = (
  index: number,
  sentences: Sentence[],
  oldSentences: Sentence[]
) => findCorrectionBySibling(index - 1, sentences, oldSentences);
const findCorrectionByRightSibling = (
  index: number,
  sentences: Sentence[],
  oldSentences: Sentence[]
) => findCorrectionBySibling(index + 1, sentences, oldSentences);

const findCorrectionBySibling = (
  siblingIndex: number,
  sentences: Sentence[],
  oldSentences: Sentence[]
) => {
  const leftSiblingHash = sentences[siblingIndex]?.hash;
  const selfSiblingCorrectionIndex = oldSentences.findIndex(
    (s) => s.hash === leftSiblingHash
  );
  return oldSentences[selfSiblingCorrectionIndex + 1]?.corrected;
};
