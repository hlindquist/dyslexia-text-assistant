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
import { splitIntoSentences } from '../textFunctions';

describe('splitIntoSentences', () => {
  it('should split the input string into an array with special characters preserved', () => {
    const inputString = '.hei!halo,,';
    const expectedOutput = ['.', 'hei!', 'halo,,'];

    const result = splitIntoSentences(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it('should not split single sentence', () => {
    const inputString = 'One single sentence.';
    const expectedOutput = ['One single sentence.'];

    const result = splitIntoSentences(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it('should split a paragraph into individual sentences', () => {
    const inputString =
      // eslint-disable-next-line quotes
      "This is the first sentence. Here's the second one! And, finally, the third?";
    const expectedOutput = [
      'This is the first sentence.',
      // eslint-disable-next-line quotes
      "Here's the second one!",
      'And, finally, the third?',
    ];

    const result = splitIntoSentences(inputString);

    expect(result).toEqual(expectedOutput);
  });
});
