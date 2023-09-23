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

import { EditorSection, SpellingSection, WordChange } from '../../types/types';
import { compareWords } from '../compareUtil';
import { addLocations } from '../textUtils';

export const createSpellingSection = (
  content: string,
  response: string
): SpellingSection => {
  const wordChanges = compareWords(content, response);

  return {
    original: createOriginalSection(content, wordChanges),
    corrected: createCorrectedSection(response, wordChanges),
  };
};

export const createOriginalSection = (
  content: string,
  wordChanges: WordChange[]
) => {
  const wordChangesOriginal = addLocations(content, 'removed', wordChanges);
  const originalSection = {
    text: content,
    lines: content.split('\n').length,
    ranges: wordChangesOriginal,
    color: '#A0D4A4',
  } as EditorSection;
  return originalSection;
};

export const createCorrectedSection = (
  response: string,
  wordChanges: WordChange[]
) => {
  const textRanges = addLocations(response, 'added', wordChanges);
  const correctedSection = {
    text: response,
    lines: response.split('\n').length,
    ranges: textRanges,
    color: '#00B4FF',
  } as EditorSection;
  return correctedSection;
};
