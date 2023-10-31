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
import { trimToCompleteSentences } from '../textFunctions';

describe('trimToCompleteSentences', () => {
  it('should trim to the last full stop', () => {
    const input =
      'This is a test. This is another test? And one more. And incomplete';
    const output = trimToCompleteSentences(input);
    expect(output).toBe('This is a test. This is another test? And one more.');
  });

  it('should trim to the last exclamation mark', () => {
    const input = 'Hello! How are you doing? Good? Great';
    const output = trimToCompleteSentences(input);
    expect(output).toBe('Hello! How are you doing? Good?');
  });

  it('should trim to the last question mark', () => {
    const input = 'Who are you? I am good. Really?';
    const output = trimToCompleteSentences(input);
    expect(output).toBe('Who are you? I am good. Really?');
  });

  it('should return the entire string if it ends with a stop character', () => {
    const input = 'This is a complete sentence.';
    const output = trimToCompleteSentences(input);
    expect(output).toBe(input);
  });

  it('should return an empty string if no stop character is present', () => {
    const input = 'This is an incomplete sentence';
    const output = trimToCompleteSentences(input);
    expect(output).toBe('');
  });
});
