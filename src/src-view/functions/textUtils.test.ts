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
import { splitStringWithStopwords } from './textUtils';

describe('splitStringWithSpecialChars', () => {
  it('should split the input string into an array with special characters preserved', () => {
    const inputString = '.hei!halo,,';
    const expectedOutput = ['.', 'hei', '!', 'halo', ',', ','];

    const result = splitStringWithStopwords(inputString);

    expect(result).toEqual(expectedOutput);
  });
});
