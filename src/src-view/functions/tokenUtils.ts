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

import { EditorSection, TextToken } from '../../types/types';
import {
  identifyChangeTypesInText,
  transformTextsToTextTokens,
} from '../utils/htmlTextUtil';
import { splitFullSentences, splitText } from '../utils/textUtils';

export const insertsCharacterPositionToken = (
  tokens: TextToken[],
  position: number
): TextToken[] => {
  const modifiedTokens = [...tokens];

  const insertIndex = modifiedTokens.findIndex(
    (token) => (position -= token.original?.length) <= 0
  );

  modifiedTokens.splice(insertIndex, 0, {
    original: '',
    modified: '',
    type: 'current',
  });

  return modifiedTokens;
};

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
