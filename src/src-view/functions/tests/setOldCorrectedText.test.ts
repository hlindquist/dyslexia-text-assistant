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
import { setOldCorrectedText } from '../spellingFunctions';

describe('setOldCorrectedText', () => {
  it('should set old corrected text on first element based on siblings', () => {
    const sentences: Sentence[] = [
      { hash: 'hash11', original: 'Original 11', underCorrection: true },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      { hash: 'hash3', original: 'Original 3', corrected: 'Corrected 3' },
    ];

    const oldSentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Corrected 1' },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      { hash: 'hash3', original: 'Original 3', corrected: 'Corrected 3' },
    ];

    const updatedSentences = setOldCorrectedText(sentences, oldSentences);

    expect(updatedSentences).toEqual([
      {
        hash: 'hash11',
        original: 'Original 11',
        corrected: 'Corrected 1',
        underCorrection: true,
      },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      { hash: 'hash3', original: 'Original 3', corrected: 'Corrected 3' },
    ]);
  });

  it('should set old corrected text on last element based on siblings', () => {
    const sentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Corrected 1' },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      { hash: 'hash33', original: 'Original 33', underCorrection: true },
    ];

    const oldSentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', corrected: 'Corrected 1' },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      { hash: 'hash3', original: 'Original 3', corrected: 'Corrected 3' },
    ];

    const updatedSentences = setOldCorrectedText(sentences, oldSentences);

    expect(updatedSentences).toEqual([
      {
        hash: 'hash1',
        original: 'Original 1',
        corrected: 'Corrected 1',
      },
      { hash: 'hash2', original: 'Original 2', corrected: 'Corrected 2' },
      {
        hash: 'hash33',
        original: 'Original 33',
        corrected: 'Corrected 3',
        underCorrection: true,
      },
    ]);
  });

  it('should set old corrected text from only element', () => {
    const sentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', underCorrection: true },
    ];

    const oldSentences: Sentence[] = [
      { hash: 'hash11', original: 'Original 11', corrected: 'Corrected 11' },
    ];

    const updatedSentences = setOldCorrectedText(sentences, oldSentences);

    expect(updatedSentences).toEqual([
      {
        hash: 'hash1',
        original: 'Original 1',
        corrected: 'Corrected 11',
        underCorrection: true,
      },
    ]);
  });

  it('should not set corrected text when no match', () => {
    const sentences: Sentence[] = [
      { hash: 'hash1', original: 'Original 1', underCorrection: true },
    ];

    const oldSentences: Sentence[] = [];

    const updatedSentences = setOldCorrectedText(sentences, oldSentences);

    expect(updatedSentences).toEqual([
      {
        hash: 'hash1',
        original: 'Original 1',
        underCorrection: true,
      },
    ]);
  });
});
