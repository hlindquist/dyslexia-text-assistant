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
import { extractNoncorrectablesFromFront } from '../textFunctions';

describe('extractNoncorrectablesFromFront', () => {
  it('should extract non correctable characters from the beginning of the string', () => {
    const input = '"\n\r  \n@#$Hello123';
    const result = extractNoncorrectablesFromFront(input);
    expect(result.matched).toBe('"\n\r  \n');
    expect(result.text).toBe('@#$Hello123');
  });

  it('should handle cases with no special characters', () => {
    const input = 'Hello123';
    const result = extractNoncorrectablesFromFront(input);
    expect(result.matched).toBe('');
    expect(result.text).toBe('Hello123');
  });

  it('should handle empty input', () => {
    const input = '';
    const result = extractNoncorrectablesFromFront(input);
    expect(result.matched).toBe('');
    expect(result.text).toBe('');
  });

  it('should handle input with only special characters', () => {
    const input = '\n\r  \n';
    const result = extractNoncorrectablesFromFront(input);
    expect(result.matched).toBe('\n\r  \n');
    expect(result.text).toBe('');
  });
});
