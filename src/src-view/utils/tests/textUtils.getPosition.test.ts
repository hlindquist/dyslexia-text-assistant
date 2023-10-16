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
import { getPositionIgnoringNewlines } from '../textUtils';

describe('getPositionIgnoringNewlines', () => {
  it('should calculate position correctly for a character within a line', () => {
    const charPosition = { line: 1, character: 3 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(24);
  });

  it('should calculate position correctly for a character at the beginning of a line', () => {
    const charPosition = { line: 2, character: 0 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(40);
  });

  it('should calculate position correctly for a character at the end of a line', () => {
    const charPosition = { line: 0, character: 18 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(18);
  });
});
