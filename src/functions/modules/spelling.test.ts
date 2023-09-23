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
import { EditorSection, SpellingSection, WordChange } from '../../types/types';
import {
  createCorrectedSection,
  createOriginalSection,
  createSpellingSection,
} from './spelling';

describe('createOriginalSection', () => {
  it('should return a corrected section with the provided response and text ranges', () => {
    // Arrange
    const content = 'This are origina';
    const wordChanges: WordChange[] = [
      { word: 'This', change: 'skip' },
      { word: 'are', change: 'removed' },
      { word: 'origina', change: 'removed' },
    ];
    const expectedText = 'This are origina';
    const expectedLines = 1;
    const expectedColor = '#A0D4A4';
    const expectedRanges: WordChange[] = [
      {
        location: {
          start: { line: 0, character: 5 },
          end: { line: 0, character: 8 },
        },
        word: 'are',
        change: 'removed',
      },
      {
        location: {
          start: { line: 0, character: 9 },
          end: { line: 0, character: 16 },
        },
        word: 'origina',
        change: 'removed',
      },
    ];

    // Act
    const result: EditorSection = createOriginalSection(content, wordChanges);

    // Assert
    expect(result.text).toEqual(expectedText);
    expect(result.lines).toEqual(expectedLines);
    expect(result.color).toEqual(expectedColor);
    expect(result.ranges).toEqual(expectedRanges);
  });
});

describe('createCorrectedSection', () => {
  it('should return a corrected section with the provided response and text ranges', () => {
    // Arrange
    const response = 'This is original';
    const wordChanges: WordChange[] = [
      { word: 'This', change: 'skip' },
      { word: 'is', change: 'added' },
      { word: 'original', change: 'added' },
    ];

    const result: EditorSection = createCorrectedSection(response, wordChanges);

    const expectedText = 'This is original';
    const expectedLines = 1;
    const expectedColor = '#00B4FF';
    const expectedRanges: WordChange[] = [
      {
        location: {
          start: { line: 0, character: 5 },
          end: { line: 0, character: 7 },
        },
        word: 'is',
        change: 'added',
      },
      {
        location: {
          start: { line: 0, character: 8 },
          end: { line: 0, character: 16 },
        },
        word: 'original',
        change: 'added',
      },
    ];

    // Assert
    expect(result.text).toEqual(expectedText);
    expect(result.lines).toEqual(expectedLines);
    expect(result.color).toEqual(expectedColor);
    expect(result.ranges).toEqual(expectedRanges);
  });
});

describe('createSpellingSections', () => {
  it('should return an array of EditorSection objects', () => {
    // Arrange
    const content = 'Angus. Helo world';
    const response = 'Angus, Hello my world';

    const result: SpellingSection = createSpellingSection(content, response);

    // Assert the original section
    const originalSection = result.original;
    expect(originalSection.lines).toBe(1);
    expect(originalSection.color).toBe('#A0D4A4');
    expect(originalSection.ranges).toEqual([
      {
        word: '.',
        change: 'removed',
        location: {
          start: { line: 0, character: 5 },
          end: { line: 0, character: 6 },
        },
      },
      {
        word: 'Helo',
        change: 'removed',
        location: {
          start: { line: 0, character: 7 },
          end: { line: 0, character: 11 },
        },
      },
    ]);

    // Assert the corrected section
    const correctedSection = result.corrected;
    expect(correctedSection.lines).toBe(1);
    expect(correctedSection.color).toBe('#00B4FF');
    expect(correctedSection.ranges).toEqual([
      {
        word: ',',
        change: 'added',
        location: {
          start: { line: 0, character: 5 },
          end: { line: 0, character: 6 },
        },
      },
      {
        word: 'Hello',
        change: 'added',
        location: {
          start: { line: 0, character: 7 },
          end: { line: 0, character: 12 },
        },
      },
      {
        word: 'my',
        change: 'added',
        location: {
          start: { line: 0, character: 13 },
          end: { line: 0, character: 15 },
        },
      },
    ]);
  });
});
