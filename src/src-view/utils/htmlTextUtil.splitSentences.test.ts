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
import { TextToken } from '../../types/types';
import { splitFullSentences } from './textUtils';

describe('splitFullSentences', () => {
  describe('splitFullSentences', () => {
    it.skip('should split tokens with periods in the middle of the texts', () => {
      const tokens: TextToken[] = [
        {
          original: 'Sentence one. More text.',
          modified: 'Sentence one. More text.',
        },
        {
          original: 'Another sentence. Some more text.',
          modified: 'Another sentence. Some more text.',
        },
        { original: 'NoSplit', modified: 'NoSplit' },
        { original: 'Single.Sentence.', modified: 'Single.Sentence.' },
      ];

      const result: TextToken[] = splitFullSentences(tokens);

      const expected: TextToken[] = [
        { original: 'Sentence one.', modified: 'Sentence one.' },
        { original: ' More text.', modified: ' More text.' },
        { original: 'Another sentence.', modified: 'Another sentence.' },
        { original: ' Some more text.', modified: ' Some more text.' },
        { original: 'NoSplit', modified: 'NoSplit' },
        { original: 'Single.', modified: 'Single.' },
        { original: 'Sentence.', modified: 'Sentence.' },
      ];

      expect(result).toEqual(expected);
    });
  });

  it.skip('should not modify tokens without periods', () => {
    const tokens: TextToken[] = [
      { original: 'NoSplit', modified: 'NoSplit' },
      { original: 'Single Sentence', modified: 'Single Sentence' },
    ];

    const result: TextToken[] = splitFullSentences(tokens);

    expect(result).toEqual(tokens);
  });

  it.skip('should preserve tokens with just period', () => {
    const tokens: TextToken[] = [{ original: '.', modified: '.' }];

    const result: TextToken[] = splitFullSentences(tokens);

    expect(result).toEqual(tokens);
  });
});
