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
import { transformToPulsatingBlocks } from '../htmlTextFunctions';

describe('transformToPulsatingBlocks', () => {
  it('should transform non-space characters to pulsating blocks', () => {
    const input = 'abc';
    const expectedOutput =
      '<span class="pulsatingBlock"></span><span class="pulsatingBlock"></span><span class="pulsatingBlock"></span>';

    const result = transformToPulsatingBlocks(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should preserve spaces in the sentence', () => {
    const input = 'a b';
    const expectedOutput =
      '<span class="pulsatingBlock"></span> <span class="pulsatingBlock"></span>';

    const result = transformToPulsatingBlocks(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle a sentence that is entirely spaces', () => {
    const input = '   ';
    const expectedOutput = '   ';

    const result = transformToPulsatingBlocks(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle an empty string', () => {
    const input = '';
    const expectedOutput = '';

    const result = transformToPulsatingBlocks(input);

    expect(result).toEqual(expectedOutput);
  });
});
