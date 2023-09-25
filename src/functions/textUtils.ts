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

import { ChangeType, TextPosition, WordChange } from '../types/types';
import { isDefined } from '../utils/generalUtils';

export const addLocations = (
  text: string,
  change: ChangeType,
  wordChanges: WordChange[]
): WordChange[] =>
  wordChanges
    .reduce((changes: WordChange[], _currentValue, index) => {
      const newChanges = addLocation(wordChanges[index], text);
      return changes.concat(newChanges);
    }, [])
    .filter(isDefined)
    .filter((wordChange) => wordChange.change === change);

export const addLocation = (
  wordChange: WordChange,
  text: string,
  startingLocation?: TextPosition
): WordChange => {
  let changeWithLocation: WordChange = { ...wordChange };

  for (let index = 0; index < text.split('\n').length; index++) {
    let wordIndex = findWordIndex(startingLocation, text, wordChange, index);

    if (wordIndex !== undefined) {
      const location = createLocation(index, wordIndex, wordChange);

      changeWithLocation = { ...changeWithLocation, location };
      break;
    }
  }

  return changeWithLocation;
};

export const findWordIndex = (
  startingLocation: TextPosition | undefined,
  text: string,
  wordChange: WordChange,
  lineIndex: number
) => {
  let wordIndex = undefined;

  if (!startingLocation || lineIndex >= startingLocation.line) {
    const lines = text.split('\n');
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const line = lines[lineIndex];
      const wordStartPosition =
        startingLocation?.line === lineIndex && startingLocation?.character
          ? startingLocation?.character - 1
          : 0;

      if (wordChange.word.length === 1) {
        wordIndex = line.indexOf(wordChange.word, wordStartPosition);
      } else {
        const escapedWord = wordChange.word.replace(
          /[.*+\-?^${}()|[\]\\]/g,
          '\\$&'
        );
        const wordRegex = new RegExp(`\\b${escapedWord}\\b`);
        const match = line.slice(wordStartPosition).match(wordRegex);

        if (match?.index !== undefined) {
          wordIndex = wordStartPosition + match.index;
        }
      }

      wordIndex = wordIndex === -1 ? undefined : wordIndex;
    }
  }

  return wordIndex;
};

const createLocation = (
  lineIndex: number,
  wordIndex: number,
  wordChange: WordChange
) => {
  const start: TextPosition = { line: lineIndex, character: wordIndex };
  const end: TextPosition = {
    line: lineIndex,
    character: wordIndex + wordChange.word.length,
  };
  const location = { start, end };
  return location;
};

export const splitStringWithStopwords = (inputString: string) =>
  inputString.match(/[.,!?]|[^.,!?]+/g) || [];
