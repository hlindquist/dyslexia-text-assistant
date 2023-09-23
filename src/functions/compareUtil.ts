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

import { Change, diffChars, diffWords } from 'diff';
import { WordChange } from '../types/types';

const trimSpaces = (change: WordChange) => ({
  ...change,
  word: change.word?.trim(),
});

export const compareStopwords = (
  leftText: string,
  rightText: string
): Change[] => diffChars(leftText, rightText);

export const splitStringWithStopwords = (inputString: string) =>
  inputString.match(/[.,!?]|[^.,!?]+/g) || [];

const splitStopwords = (
  changes: WordChange[],
  currentChange: WordChange
): WordChange[] => {
  const splitChanges = splitStringWithStopwords(currentChange.word);
  if (currentChange.word.length > 1 && splitChanges.length > 1) {
    const splittedList = splitChanges
      .filter((word) => word !== '')
      .map(
        (word) =>
          ({
            ...currentChange,
            word,
          } as WordChange)
      );
    return changes.concat(splittedList);
  }

  return changes.concat([currentChange]);
};

export const compareWords = (
  leftText: string,
  rightText: string
): WordChange[] =>
  diffWords(leftText, rightText, { ignoreWhitespace: true })
    .map(adaptWordChange)
    .map(trimSpaces)
    .reduce(splitStopwords, []);

export const adaptWordChange = (diffChange: Change): WordChange => {
  const wordChange: WordChange = {
    word: diffChange.value,
    change: 'skip',
  };

  if (diffChange.added) {
    wordChange.change = 'added';
  } else if (diffChange.removed) {
    wordChange.change = 'removed';
  }

  return wordChange;
};

export const adaptWordChanges = (diffResult: Change[]): WordChange[] => {
  const wordChanges: WordChange[] = [];

  for (const part of diffResult) {
    const wordChange: WordChange = {
      word: part.value,
      change: 'skip',
    };

    if (part.added) {
      wordChange.change = 'added';
    } else if (part.removed) {
      wordChange.change = 'removed';
    }

    wordChanges.push(wordChange);
  }

  return wordChanges;
};

export const includeLeftSideChanges = (
  wordChanges: WordChange[]
): WordChange[] => {
  return wordChanges.filter((change) => change.change === 'removed');
};

export const includeRightSideChanges = (
  wordChanges: WordChange[]
): WordChange[] => {
  return wordChanges.filter((change) => change.change === 'added');
};
