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
import {
  getPositionIgnoringNewlines,
  splitFullSentences,
  splitText,
} from './textUtils';

/* eslint-disable indent */
export const transformNewlinesToBreaklines = (text: string) =>
  text.replace(/(?:\r\n|\r|\n)/g, '<br>');

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
