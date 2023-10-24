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
import { extractIncompleteSentence } from '../textUtils';

describe('handleIncompleteSentencePart', () => {
  it('should return an empty string for an empty input', () => {
    expect(extractIncompleteSentence('')).toBe('');
  });

  it('should return an empty string for input with complete sentences', () => {
    expect(
      extractIncompleteSentence(
        'This is a complete sentence. Another complete sentence.'
      )
    ).toBe('');
  });

  it('should return the last sentence without stop word', () => {
    expect(extractIncompleteSentence('This is an incomplete sentence')).toBe(
      'This is an incomplete sentence'
    );
  });

  it('should return the sentence that is not complete', () => {
    expect(
      extractIncompleteSentence(
        'First sentence. Next sentence! Incomplete sentenc'
      )
    ).toBe(' Incomplete sentenc');
  });
});
