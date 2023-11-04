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

import { EditorSection, Sentence, TextToken } from '../../types/types';
import {
  identifyChangeTypesInText,
  transformTextsToTextTokens,
} from '../actions/utils/htmlTextUtil';
import { splitFullSentences, splitText } from '../actions/utils/textUtils';

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

const insertSkipTokens = (sentences: Sentence[]): Sentence[] => sentences;

export const insertMissingTokens = (
  sentences: Sentence[],
  position: number
): Sentence[] =>
  R.pipe(
    (sentences: Sentence[]) => insertPositionToken(position, sentences),
    (sentences: Sentence[]) => insertSkipTokens(sentences)
  )(sentences);

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

export const transformTextToTokens = (section: EditorSection) => {
  const changes = section.ranges;

  return R.pipe(
    (section: EditorSection) => splitText(section),
    (texts: string[]) => transformTextsToTextTokens(texts),
    (texts: TextToken[]) => identifyChangeTypesInText(changes, texts),
    (tokens: TextToken[]) => splitFullSentences(tokens)
  )(section);
};
