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

import { TextToken, WordChange } from '../../types/types';
import * as R from 'ramda';

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

const transformCurrentToken = (token: TextToken) =>
  token.type === 'current'
    ? { ...token, modified: '<span class="currentPosition"></span>' }
    : token;

const transformAddedOrRemovedTokens = (token: TextToken) =>
  ['added', 'removed'].includes(token?.type || '')
    ? {
        ...token,
        modified: `<span class="${token.type}">${token.original}</span>`,
      }
    : token;

const transformSkippedToken = (token: TextToken) =>
  token.type === 'skipped' ? { ...token, modified: token.original } : token;

export const transformTokens = (tokens: TextToken[]): TextToken[] =>
  tokens
    .map(transformCurrentToken)
    .map(transformAddedOrRemovedTokens)
    .map(transformSkippedToken);

const getModifiedValue = (tokens: TextToken[]) =>
  tokens.map((token) => token.modified || token.original);

export const transformTokensToHtml = (textTokens: TextToken[]) =>
  R.pipe(
    (tokens: TextToken[]) => transformTokens(tokens),
    (tokens: TextToken[]) => getModifiedValue(tokens),
    (texts: string[]) => texts.join(''),
    (text: string) => transformNewlinesToBreaklines(text)
  )(textTokens);
