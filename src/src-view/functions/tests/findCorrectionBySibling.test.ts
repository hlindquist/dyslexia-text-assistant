/* eslint-disable indent */
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
import { Sentence } from '../../../types/types';
import { findCorrectionByRightSibling } from '../spellingFunctions';

describe('findCorrectionByRightSibling', () => {
  it('should return the correct correction by right sibling', () => {
    const sentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Corrected 1' },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      { hash: 'hash3', original: 'Original 3', corrected: 'Corrected 3' },
    ];

    const oldSentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Old Corrected 1' },
      { hash: 'hash2', original: 'Original 2', corrected: 'Old Corrected 2' },
      { hash: 'hash3', original: 'Original 3', corrected: 'Old Corrected 3' },
    ];

    const index = 0;
    const correction = findCorrectionByRightSibling(
      index,
      sentences,
      oldSentences
    );

    expect(correction).toEqual('Old Corrected 1');
  });

  it('should return undefined when there is no right sibling', () => {
    const sentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Corrected 1' },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
    ];

    const oldSentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Old Corrected 1' },
    ];

    const index = 1;
    const correction = findCorrectionByRightSibling(
      index,
      sentences,
      oldSentences
    );

    expect(correction).toBeUndefined();
  });
});
