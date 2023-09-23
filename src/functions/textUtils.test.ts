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

import { describe, it, expect } from '@jest/globals';
import { addLocation } from './textUtils';
import { TextPosition, WordChange } from '../types/types';

describe('addLocation', () => {
  it('should add location information when the word is found in the text', () => {
    const wordChange: WordChange = { word: 'apple', change: 'added' };
    const text = 'This is an apple text with a banana in it.';
    const result = addLocation(wordChange, text);

    const expectedLocation: { start: TextPosition; end: TextPosition } = {
      start: { line: 0, character: 11 },
      end: { line: 0, character: 16 },
    };

    const expected: WordChange = { ...wordChange, location: expectedLocation };

    expect(result).toEqual(expected);
  });

  it('should add location information for two equal words on the same line', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'added' },
      { word: 'apple', change: 'added' },
    ];
    const text = 'This is an apple text with an apple in it.';
    const changeOne = addLocation(wordChanges[0], text);
    const changeTwo = addLocation(
      wordChanges[1],
      text,
      changeOne.location?.end
    );

    const result = [changeOne, changeTwo];

    const expected: WordChange[] = [
      {
        word: 'apple',
        change: 'added',
        location: {
          start: { line: 0, character: 11 },
          end: { line: 0, character: 16 },
        },
      },
      {
        word: 'apple',
        change: 'added',
        location: {
          start: { line: 0, character: 30 },
          end: { line: 0, character: 35 },
        },
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return the original wordChange when the word is not found in the text', () => {
    const wordChange: WordChange = { word: 'orange', change: 'removed' };
    const text = 'This is an apple text with an apple in it.';
    const result = addLocation(wordChange, text);

    expect(result).toEqual(wordChange);
  });

  it('should add location information when the word is found on third line', () => {
    const wordChange: WordChange = { word: 'symphony', change: 'added' };
    const text = `In twilight's embrace, stars softly gleam,
  Whispers of dreams dance in moonlit beam.
  Nature's symphony, a timeless theme.
  chadGPT`;
    const result = addLocation(wordChange, text);

    const expectedLocation: { start: TextPosition; end: TextPosition } = {
      start: { line: 2, character: 11 },
      end: { line: 2, character: 19 },
    };

    const expected: WordChange = { ...wordChange, location: expectedLocation };

    expect(result).toEqual(expected);
  });

  it('should add location information only on first whole word matches', () => {
    const wordChange: WordChange = { word: 'is', change: 'added' };
    const text = 'This is as is';
    const result = addLocation(wordChange, text);

    const expectedLocation: { start: TextPosition; end: TextPosition } = {
      start: { line: 0, character: 5 },
      end: { line: 0, character: 7 },
    };

    const expected: WordChange = { ...wordChange, location: expectedLocation };

    expect(result).toEqual(expected);
  });

  it('should add location information on first word in sentences', () => {
    const wordChanges: WordChange[] = [
      { word: 'axel', change: 'removed' },
      { word: 'an', change: 'removed' },
    ];
    const text = `axel is
an banana.`;
    const changeOne = addLocation(wordChanges[0], text);
    const changeTwo = addLocation(
      wordChanges[1],
      text,
      changeOne.location?.end
    );

    const expected: WordChange[] = [
      {
        word: 'axel',
        change: 'removed',
        location: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 4 },
        },
      },
      {
        word: 'an',
        change: 'removed',
        location: {
          start: { line: 1, character: 0 },
          end: { line: 1, character: 2 },
        },
      },
    ];

    const result = [changeOne, changeTwo];

    expect(result).toEqual(expected);
  });

  it('should add location information for stopwords characters (, and !)', () => {
    const specialCharacterChanges: WordChange[] = [
      { word: ',', change: 'added' },
      { word: '!', change: 'removed' },
    ];

    const text = 'This is a test, with some punctuation!';

    const changeOne = addLocation(specialCharacterChanges[0], text);
    const changeTwo = addLocation(
      specialCharacterChanges[1],
      text,
      changeOne.location?.end
    );

    const expected: WordChange[] = [
      {
        word: ',',
        change: 'added',
        location: {
          start: { line: 0, character: 14 },
          end: { line: 0, character: 15 },
        },
      },
      {
        word: '!',
        change: 'removed',
        location: {
          start: { line: 0, character: 37 },
          end: { line: 0, character: 38 },
        },
      },
    ];

    const result = [changeOne, changeTwo];

    expect(result).toEqual(expected);
  });
});
