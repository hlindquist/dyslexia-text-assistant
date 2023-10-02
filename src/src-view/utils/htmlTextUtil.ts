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
  CharPosition,
  EditorSection,
  TextToken,
  WordChange,
} from '../../types/types';
import * as R from 'ramda';

/* eslint-disable indent */

export function multiSplit(
  inputString: string,
  tokensToSplitOn: string[]
): string[] {
  const regexPattern = tokensToSplitOn
    .map((token) => `(${escapeRegExp(token)})`)
    .join('|');

  const parts = inputString.split(new RegExp(regexPattern));

  return tokensToSplitOn?.length && inputString !== ''
    ? parts.filter((part) => !!part && part !== '')
    : [inputString];
}

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const transformNewlinesToBreaklines = (text: string) =>
  text.replace(/(?:\r\n|\r|\n)/g, '<br>');

export const splitText = (section: EditorSection) => {
  const wordChanges: WordChange[] = section.ranges || [];
  const allWords = wordChanges.map((change) => change.word);
  const tokensToSplitOn = Array.from(new Set(allWords));
  return multiSplit(section.text, tokensToSplitOn);
};

export const surroundWordsWithSpan = (
  wordChanges: WordChange[],
  splitText: string[]
): TextToken[] => {
  const resultArray: TextToken[] = [];
  const changes = wordChanges.slice();

  splitText.forEach((text: string) => {
    const nextChange = changes[0];
    if (text === nextChange?.word) {
      if (['removed', 'added'].includes(nextChange.change)) {
        resultArray.push({
          original: nextChange.word,
          modified: `<span class="${nextChange.change}">${nextChange.word}</span>`,
        });
      } else {
        resultArray.push({
          original: nextChange.word,
          modified: nextChange.word,
        });
      }
      changes.shift();
    } else {
      resultArray.push({
        original: text,
        modified: text,
      });
    }
  });

  return resultArray;
};

export const insertsCharacterPositionElement = (
  tokens: TextToken[],
  position: number
): TextToken[] => {
  const modifiedTokens = [...tokens];

  const insertIndex = modifiedTokens.findIndex(
    (token) => (position -= token.original?.length) <= 0
  );

  modifiedTokens.splice(insertIndex, 0, {
    original: '',
    modified: '<span class="currentPosition"></span>',
  });

  return modifiedTokens;
};

export const getPositionIgnoringNewlines = (
  charPosition: CharPosition,
  text: string
): number => {
  const { line, character } = charPosition;
  const lines = text.split('\n');
  let currentPosition = 0;

  for (let i = 0; i < line; i++) {
    currentPosition += lines[i]?.length;
  }

  currentPosition += character;

  return currentPosition;
};

export const splitFullSentences = (tokens: TextToken[]): TextToken[] => {
  const resultArray: TextToken[] = [];

  tokens.forEach((token) => {
    if (token.original.includes('.') && token.original === token.modified) {
      const sentences = token.original.split('.');
      sentences.forEach((sentence, index) => {
        if (sentence.trim() !== '') {
          const newToken: TextToken = {
            original: sentence,
            modified: sentence,
          };
          resultArray.push(newToken);
        }
        if (index < sentences?.length - 1) {
          const periodToken: TextToken = {
            original: '.',
            modified: '.',
          };
          resultArray.push(periodToken);
        }
      });
    } else {
      resultArray.push(token);
    }
  });

  return resultArray;
};

export const transformTextToHtml = (
  section: EditorSection,
  charPosition: CharPosition
) => {
  const position = getPositionIgnoringNewlines(charPosition, section.text);
  return R.pipe(
    splitText,
    (texts: string[]) => surroundWordsWithSpan(section.ranges, texts),
    (tokens: TextToken[]) => splitFullSentences(tokens),
    (tokens: TextToken[]) => insertsCharacterPositionElement(tokens, position),
    (tokens: TextToken[]) => tokens.map(R.prop('modified')),
    (texts: string[]) => texts.join(''),
    transformNewlinesToBreaklines
  )(section);
};
