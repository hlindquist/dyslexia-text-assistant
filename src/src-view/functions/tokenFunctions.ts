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
  EditorSection,
  Sentence,
  TextToken,
  WordChange,
} from '../../types/types';
import {
  findTokensToSplitOn,
  splitFullSentences,
  splitText,
} from './textFunctions';

export const findIndexOfSentence = (
  sentences: Sentence[],
  position: number
) => {
  let currentPosition = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const sentenceLength = sentence.original.length;

    if (position <= currentPosition + sentenceLength) {
      return i;
    }

    currentPosition += sentenceLength;
  }

  return sentences.length;
};

const currentPositionSentence = {
  hash: '',
  original: '',
  corrected: '',
  originalTokens: [{ original: '', type: 'current' }],
  correctedTokens: [{ original: '', type: 'current' }],
} as Sentence;

export const transformTextsToTextTokens = (texts: string[]): TextToken[] =>
  texts.map((text) => ({ original: text }));

export const identifyChangeTypesInText = (
  wordChanges: WordChange[],
  splitText: TextToken[]
): TextToken[] => {
  let index = 0;

  const resultArray: TextToken[] = splitText.map((textToken: TextToken) => {
    if (
      index < wordChanges.length &&
      textToken.original === wordChanges[index].word
    ) {
      const changeType = wordChanges[index].change;
      index++;
      return { original: textToken.original, type: changeType };
    }
    return { original: textToken.original };
  });

  return resultArray;
};

export const insertMissingTokens = (
  sentences: Sentence[],
  position: number
): Sentence[] => insertPositionToken(position, sentences);

const insertPositionSentence = (sentences: Sentence[], indexToInsert: number) =>
  sentences
    .map((sentence: Sentence, index) =>
      index === indexToInsert ? [currentPositionSentence, sentence] : [sentence]
    )
    .flat();

export const insertPositionToken = (
  position: number,
  sentences: Sentence[]
): Sentence[] =>
  R.pipe(
    (sentences: Sentence[]) => findIndexOfSentence(sentences, position),
    (index: number) => insertPositionSentence(sentences, index)
  )(sentences);

export const deleteCurrentPosition = (textTokens: TextToken[]): TextToken[] =>
  textTokens.filter((token) => token.type !== 'current');

export const transformTextToTokens = (section: EditorSection) =>
  R.pipe(
    (section: EditorSection) => findTokensToSplitOn(section.changes),
    (tokens: string[]) => splitText(section.text, tokens),
    (texts: string[]) => transformTextsToTextTokens(texts),
    (texts: TextToken[]) => identifyChangeTypesInText(section.changes, texts),
    (tokens: TextToken[]) => splitFullSentences(tokens)
  )(section);
