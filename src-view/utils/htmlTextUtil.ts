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

/* eslint-disable indent */
import { EditorSection, WordChange } from '../types';

export function multiSplit(
  inputString: string,
  tokensToSplitOn: string[]
): string[] {
  const regexPattern = tokensToSplitOn
    .map((token) => `(${escapeRegExp(token)})`)
    .join('|');

  const parts = inputString.split(new RegExp(regexPattern));

  return tokensToSplitOn.length && inputString !== ''
    ? parts.filter((part) => !!part && part !== '')
    : [inputString];
}

const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const transformNewlinesToBreaklines = (text: string) =>
  text.replace(/(?:\r\n|\r|\n)/g, '<br>');

export function surroundWordsWithSpan(section: EditorSection): string {
  const wordChanges: WordChange[] = section.ranges || [];
  const resultArray: string[] = [];
  const allWords = wordChanges.map((change) => change.word);
  const tokensToSplitOn = Array.from(new Set(allWords));
  const splitText = multiSplit(section.text, tokensToSplitOn);

  splitText.forEach((text: string) => {
    const nextChange = wordChanges[0];
    if (text === nextChange.word) {
      if (['removed', 'added'].includes(nextChange.change)) {
        resultArray.push(
          [
            '<span class="',
            nextChange.change,
            '">',
            nextChange.word,
            '</span>',
          ].join('')
        );
      } else {
        resultArray.push(nextChange.word);
      }
      wordChanges.shift();
    } else {
      resultArray.push(text);
    }
  });

  return resultArray.join('');
}
