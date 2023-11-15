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

import {
  EditorSection,
  Sentence,
  SentenceWithConversation,
  WordChange,
} from '../../types/types';
import { ilog } from '../../utils/debugUtils';
import Differ from '../actions/adapters/Differ';
import { transformTextToTokens } from './tokenFunctions';

export const runAddTokensOnMarkedSentences = (sentences: Sentence[]) =>
  sentences.map((sentence) =>
    sentence.corrected && sentence.needsCorrection
      ? addTokens(sentence)
      : sentence
  );

export const addTokens = (sentence: Sentence): Sentence => {
  const diffChanges = Differ.compare(sentence.original, sentence.corrected);
  ilog(diffChanges, 'diffChanges');
  const originalSection = createSection(
    sentence.original,
    diffChanges.original
  );
  const correctedSection = createSection(
    sentence.corrected,
    diffChanges.corrected
  );
  const originalTokens = transformTextToTokens(originalSection);
  const correctedTokens = transformTextToTokens(correctedSection);
  ilog(originalTokens, 'originalTokens');

  return {
    ...sentence,
    originalTokens,
    correctedTokens,
  };
};

export const createSection = (
  content: string,
  wordChanges: WordChange[]
): EditorSection => ({
  text: content,
  changes: wordChanges,
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

export const matchWithCurrentSentences = (
  sentences: Sentence[],
  currentSentences: Sentence[]
): Sentence[] =>
  sentences.map(
    (sentence) =>
      currentSentences.find((s) => s.hash === sentence.hash) || sentence
  );

export const setOldCorrectedText = (
  sentences: Sentence[],
  oldSentences: Sentence[]
): Sentence[] =>
  sentences.map((sentence: Sentence, index: number) => {
    if (sentence.needsCorrection) {
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

export const findCorrectionByLeftSibling = (
  index: number,
  sentences: Sentence[],
  oldSentences: Sentence[]
) => {
  const siblingHash = sentences[index - 1]?.hash;
  const selfSiblingCorrectionIndex = oldSentences.findIndex(
    (sentence) => sentence.hash === siblingHash
  );
  return oldSentences[selfSiblingCorrectionIndex + 1]?.corrected;
};

export const findCorrectionByRightSibling = (
  index: number,
  sentences: Sentence[],
  oldSentences: Sentence[]
) => {
  const siblingHash = sentences[index + 1]?.hash;
  const selfSiblingCorrectionIndex = oldSentences.findIndex(
    (sentence) => sentence.hash === siblingHash
  );
  return oldSentences[selfSiblingCorrectionIndex - 1]?.corrected;
};
