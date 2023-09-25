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
  const text = section.text;
  const wordChanges: WordChange[] = section.ranges || [];
  const wordsToSurround: string[] = [];

  wordChanges.forEach((change: WordChange) => {
    if (change.change === 'added' || change.change === 'removed') {
      wordsToSurround.push(change.word);
    }
  });

  const tokensToSplitOn = Array.from(new Set(wordsToSurround));
  const splitText = multiSplit(text, tokensToSplitOn);
  console.log(splitText, 'splitText');

  const resultArray: string[] = [];
  splitText.forEach((part: string) => {
    if (wordsToSurround.length > 0 && part === wordsToSurround[0]) {
      resultArray.push(
        [
          '<span class="',
          changeTypeToClassName(wordChanges, part),
          '">',
          part,
          '</span>',
        ].join('')
      );
      wordsToSurround.shift();
    } else {
      resultArray.push(part);
    }
  });

  return resultArray.join('');
}

function changeTypeToClassName(
  wordChanges: WordChange[],
  word: string
): string {
  const changeType = wordChanges.find(
    (change: WordChange) => change.word === word
  )?.change;
  switch (changeType) {
    case 'added':
      return 'added';
    case 'removed':
      return 'removed';
    default:
      return '';
  }
}
