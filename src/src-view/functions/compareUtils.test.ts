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

import {
  compareWords,
  includeLeftSideChanges,
  includeRightSideChanges,
} from './compareUtil';

describe('compareWords', () => {
  it('should compare words in the texts', () => {
    const leftText = 'Hello world of john Hello world';
    const rightText = 'Hello universe of teddy Hello universe';

    const result = compareWords(leftText, rightText);

    const leftSide = includeLeftSideChanges(result);
    const rightSide = includeRightSideChanges(result);

    // Assert that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Assert the leftSide values
    expect(leftSide.map((change) => change.word)).toEqual([
      'world',
      'john',
      'world',
    ]);

    // Assert the rightSide values
    expect(rightSide.map((change) => change.word)).toEqual([
      'universe',
      'teddy',
      'universe',
    ]);
  });

  it('should compare stopwords in the texts', () => {
    const leftText = 'Hello world. Of john Hello world.';
    const rightText = 'Hello world! Of teddy, Hello world.';

    const result = compareWords(leftText, rightText);
    const leftSide = includeLeftSideChanges(result);
    const rightSide = includeRightSideChanges(result);

    // Assert that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Assert the leftSide values
    expect(leftSide.map((change) => change.word)).toEqual(['.', 'john']);

    // Assert the rightSide values
    expect(rightSide.map((change) => change.word)).toEqual(['!', 'teddy', ',']);
  });

  it('should compare multi line texts', () => {
    const leftText = 'Hello John and Seb\nHello Clease. How is it going?';
    const rightText = 'Hello Clease and Seb\nHello Astrid. How did it go John?';

    const result = compareWords(leftText, rightText);

    const leftSide = includeLeftSideChanges(result);
    const rightSide = includeRightSideChanges(result);

    // Assert that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Assert the leftSide values
    expect(leftSide.map((change) => change.word)).toEqual([
      'John',
      'Clease',
      'is',
      'going',
    ]);

    // Assert the rightSide values
    expect(rightSide.map((change) => change.word)).toEqual([
      'Clease',
      'Astrid',
      'did',
      'go',
      ' ',
      'John',
    ]);
  });

  it('should compare casesensitively', () => {
    const leftText = 'Hello John.';
    const rightText = 'Hello john.';

    const result = compareWords(leftText, rightText);

    const leftSide = includeLeftSideChanges(result);
    const rightSide = includeRightSideChanges(result);

    // Assert that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Assert the leftSide values
    expect(leftSide.map((change) => change.word)).toEqual(['John']);

    // Assert the rightSide values
    expect(rightSide.map((change) => change.word)).toEqual(['john']);
  });
});
