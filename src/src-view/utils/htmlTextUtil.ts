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

import { CharPosition, EditorSection, TextToken } from '../../types/types';
import * as R from 'ramda';
import { isDefined } from '../../utils/generalUtils';
import {
  identifyChangeTypesInText,
  insertsCharacterPositionToken,
} from './textTokenUtils';
import {
  getPositionIgnoringNewlines,
  splitText,
  transformTextsToTextTokens,
} from './textUtils';

/* eslint-disable indent */
export const transformNewlinesToBreaklines = (text: string) =>
  text.replace(/(?:\r\n|\r|\n)/g, '<br>');

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
  token.type === 'skip' ? { ...token, modified: token.original } : token;

export const transformTokens = (tokens: TextToken[]): TextToken[] =>
  tokens
    .map(transformCurrentToken)
    .map(transformAddedOrRemovedTokens)
    .map(transformSkippedToken);

const getModifiedValues = (tokens: TextToken[]): string[] =>
  tokens.map((token) => token.modified).filter(isDefined);

const transformToSingleString = (texts: string[]) => texts.join('');

// interface Sentence {
//   text: string;
//   tokens?: TextToken;
//   complete?: boolean;
// }

// const sentenceRegex = (text: string) => text.split(/[\\.\\!\\?]/);

// const isCompleteSentence = (text: string): boolean =>
//   /[.!?]$/.test(text.trim());

// const splitIntoSentences = (text: string): Sentence[] =>
//   sentenceRegex(text)
//     .filter((sentence) => sentence !== '')
//     .map((sentence) => ({
//       text: sentence,
//       complete: isCompleteSentence(sentence),
//     }));

export const transformTextToHtml = (
  section: EditorSection,
  charPosition: CharPosition
) => {
  const position = getPositionIgnoringNewlines(charPosition, section.text);
  const changes = section.changes;

  return R.pipe(
    (section: EditorSection): string[] => splitText(section),
    (texts: string[]) => transformTextsToTextTokens(texts),
    (texts: TextToken[]) => identifyChangeTypesInText(changes, texts),
    (tokens: TextToken[]) => insertsCharacterPositionToken(tokens, position),
    (tokens: TextToken[]) => transformTokens(tokens),
    (tokens: TextToken[]) => getModifiedValues(tokens),
    (texts: string[]) => transformToSingleString(texts),
    (text: string) => transformNewlinesToBreaklines(text)
  )(section);
};
