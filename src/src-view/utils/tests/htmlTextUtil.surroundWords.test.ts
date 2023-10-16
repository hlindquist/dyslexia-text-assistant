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
import { TextToken, WordChange } from '../../../types/types';
import { surroundWordsWithSpan } from '../htmlTextUtil';

describe('surroundWordsWithSpan', () => {
  it('should surround words with <span> tags when changes are "added" or "removed"', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'added' },
      { word: 'banana', change: 'removed' },
    ];

    const splitText: string[] = ['apple', 'banana', 'cherry'];

    const result: TextToken[] = surroundWordsWithSpan(wordChanges, splitText);

    const expected: TextToken[] = [
      { original: 'apple', modified: '<span class="added">apple</span>' },
      { original: 'banana', modified: '<span class="removed">banana</span>' },
      { original: 'cherry', modified: 'cherry' },
    ];

    expect(result).toEqual(expected);
  });

  it('should not surround words with <span> tags when changes are not "added" or "removed"', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'skipped' },
      { word: 'banana', change: 'skipped' },
    ];

    const splitText: string[] = ['apple', 'banana', 'cherry'];

    const result: TextToken[] = surroundWordsWithSpan(wordChanges, splitText);

    const expected: TextToken[] = [
      { original: 'apple', modified: 'apple' },
      { original: 'banana', modified: 'banana' },
      { original: 'cherry', modified: 'cherry' },
    ];

    expect(result).toEqual(expected);
  });
});
