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
import { Sentence } from '../../../types/types';
import { insertPositionToken } from '../tokenFunctions';

describe('insertPositionToken', () => {
  it('should insert a token at the beginning of the first sentence', () => {
    const sentences = [
      {
        hash: 'hash1',
        original: 'Sentence 1.',
        corrected: 'Sentence 1.',
        originalTokens: [{ original: 'Sentence ', type: 'current' }],
        correctedTokens: [{ original: 'Sentence ', type: 'current' }],
      },
      {
        hash: 'hash2',
        original: 'Sentence 2.',
        corrected: 'Sentence 2.',
        originalTokens: [{ original: 'Sentence ', type: 'current' }],
        correctedTokens: [{ original: 'Sentence ', type: 'current' }],
      },
    ] as Sentence[];

    const newPosition = 0;

    const result = insertPositionToken(newPosition, sentences);

    expect(result.length).toBe(sentences.length + 1);
    expect(result[newPosition]).toEqual({
      hash: '',
      original: '',
      corrected: '',
      originalTokens: [{ original: '', type: 'current' }],
      correctedTokens: [{ original: '', type: 'current' }],
    });
  });

  it('should insert a token in the middle of sentences', () => {
    const sentences = [
      {
        hash: 'hash1',
        original: 'Sentence 1.',
        corrected: 'Sentence 1.',
        originalTokens: [{ original: 'Sentence ', type: 'current' }],
        correctedTokens: [{ original: 'Sentence ', type: 'current' }],
      },
      {
        hash: 'hash2',
        original: 'Sentence 2.',
        corrected: 'Sentence 2.',
        originalTokens: [{ original: 'Sentence ', type: 'current' }],
        correctedTokens: [{ original: 'Sentence ', type: 'current' }],
      },
    ] as Sentence[];

    const characterPosition = 13;

    const result = insertPositionToken(characterPosition, sentences);

    expect(result.length).toBe(sentences.length + 1);

    expect(result[1]).toEqual({
      hash: '',
      original: '',
      corrected: '',
      originalTokens: [{ original: '', type: 'current' }],
      correctedTokens: [{ original: '', type: 'current' }],
    });
  });

  it.skip('should insert a token at the end of the last sentence', () => {
    const sentences = [
      {
        hash: 'hash1',
        original: 'Sentence 1.',
        corrected: 'Sentence 1.',
        originalTokens: [{ original: 'Sentence ', type: 'current' }],
        correctedTokens: [{ original: 'Sentence ', type: 'current' }],
      },
      {
        hash: 'hash2',
        original: 'Sentence 2.',
        corrected: 'Sentence 2.',
        originalTokens: [{ original: 'Sentence ', type: 'current' }],
        correctedTokens: [{ original: 'Sentence ', type: 'current' }],
      },
    ] as Sentence[];

    const newPosition = 70;

    const result = insertPositionToken(newPosition, sentences);

    expect(result.length).toBe(sentences.length + 1);

    expect(result[2]).toEqual({
      hash: '',
      original: '',
      corrected: '',
      originalTokens: [{ original: '', type: 'current' }],
      correctedTokens: [{ original: '', type: 'current' }],
    });
  });
});
