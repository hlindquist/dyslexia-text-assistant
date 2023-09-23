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

import { TextPosition, WordChange } from '../types/types';
import { findWordIndex } from './textUtils';

describe('findWordIndex function', () => {
  const startingLocationTen: TextPosition = {
    line: 0,
    character: 10,
  };
  const text = 'This is a sample text for testing.';
  const wordChangeSample: WordChange = {
    word: 'sample',
    change: 'added',
  };

  it('should find the word index when starting location is undefined', () => {
    const index = findWordIndex(undefined, text, wordChangeSample, 0);
    expect(index).toBe(10);
  });

  it('should find the word index when starting location matches index', () => {
    const index = findWordIndex(startingLocationTen, text, wordChangeSample, 0);
    expect(index).toBe(10);
  });

  const startingLocationTwenty: TextPosition = {
    line: 0,
    character: 25,
  };
  const wordChangeThis: WordChange = {
    word: 'This',
    change: 'added',
  };

  it('should not find the word index when starting location is after the word', () => {
    const index = findWordIndex(
      startingLocationTwenty,
      text,
      wordChangeThis,
      0
    );
    expect(index).toBe(undefined);
  });

  const startingLocationZero: TextPosition = {
    line: 0,
    character: 0,
  };
  const wordChangeIs: WordChange = {
    word: 'is',
    change: 'added',
  };

  it('should find the first word in the sentence', () => {
    const index = findWordIndex(startingLocationZero, text, wordChangeThis, 0);
    expect(index).toBe(0);
  });
  it('should only find whole words', () => {
    const index = findWordIndex(startingLocationZero, text, wordChangeIs, 0);
    expect(index).toBe(5);
  });

  const wordChangeMultiline: WordChange = {
    word: 'multiline',
    change: 'added',
  };
  const multilineText = `This is a sample text for testing.
  It
  is multiline.`;

  it('should find word in multiline text', () => {
    const index = findWordIndex(
      startingLocationZero,
      multilineText,
      wordChangeMultiline,
      2
    );
    expect(index).toBe(5);
  });

  it('should find the word index when word contains a period (.)', () => {
    const textWithPeriod = 'This is a sample text for testing.';
    const wordChangeWithPeriod: WordChange = {
      word: '.',
      change: 'added',
    };
    const index = findWordIndex(
      startingLocationZero,
      textWithPeriod,
      wordChangeWithPeriod,
      0
    );
    expect(index).toBe(33);
  });

  it('should find the word index when word contains a comma (,)', () => {
    const textWithComma = 'This is a sample text, for testing.';
    const wordChangeWithComma: WordChange = {
      word: ',',
      change: 'added',
    };
    const index = findWordIndex(
      startingLocationZero,
      textWithComma,
      wordChangeWithComma,
      0
    );
    expect(index).toBe(21);
  });
});
