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
import { findIndexOfSentence } from '../tokenFunctions';

const sentences = [
  { hash: 'hash1', original: 'Sentence 1' },
  { hash: 'hash2', original: 'Sentence 2' },
  { hash: 'hash3', original: 'Sentence 3' },
];

describe('findIndexOfSentence', () => {
  it('should return the correct index for the first sentence', () => {
    const position = 10;
    const result = findIndexOfSentence(sentences, position);
    expect(result).toBe(0);
  });

  it('should return the correct index for the second sentence', () => {
    const position = 20;
    const result = findIndexOfSentence(sentences, position);
    expect(result).toBe(1);
  });

  it('should return the correct index for the third sentence', () => {
    const position = 30;
    const result = findIndexOfSentence(sentences, position);
    expect(result).toBe(2);
  });

  it('should return 0 for position before any sentence', () => {
    const position = 5;
    const result = findIndexOfSentence(sentences, position);
    expect(result).toBe(0);
  });

  it('should return length + 1 for position after all sentences', () => {
    const position = 100;
    const result = findIndexOfSentence(sentences, position);
    expect(result).toBe(3);
  });

  it('should return 0 when empty array of sentences', () => {
    const emptySentences: Sentence[] = [];
    const position = 10;
    const result = findIndexOfSentence(emptySentences, position);
    expect(result).toBe(0);
  });
});
