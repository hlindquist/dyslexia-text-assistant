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

import { describe, expect, it } from '@jest/globals';
import { multiSplit } from '../textFunctions';

describe('multiSplit', () => {
  it('should split a string based on multiple tokens', () => {
    const inputString =
      'Hey, here is some text to split, Hey, here is some text to split.';
    const tokensToSplitOn = ['some', 'split'];

    const result = multiSplit(inputString, tokensToSplitOn);

    expect(result).toEqual([
      'Hey, here is ',
      'some',
      ' text to ',
      'split',
      ', Hey, here is ',
      'some',
      ' text to ',
      'split',
      '.',
    ]);
  });

  it('should split a string with no tokens', () => {
    const inputString = 'NoTokensHere';
    const tokensToSplitOn: string[] = [];

    const result = multiSplit(inputString, tokensToSplitOn);

    expect(result).toEqual([inputString]);
  });

  it('should handle an empty input string', () => {
    const inputString = '';
    const tokensToSplitOn = [' '];

    const result = multiSplit(inputString, tokensToSplitOn);

    expect(result).toEqual(['']);
  });
});
