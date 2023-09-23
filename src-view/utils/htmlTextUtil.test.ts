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
import { surroundWordsWithSpan } from './htmlTextUtil';
import { EditorSection } from '../types';

describe('surroundWordsWithSpan', () => {
  it('should surround added words with span tags', () => {
    const section: EditorSection = {
      text: 'The quick brown fox',
      lines: 1,
      color: 'black',
      ranges: [
        { word: 'quick', change: 'added' },
        { word: 'fox', change: 'added' },
      ],
    };

    const result = surroundWordsWithSpan(section);

    expect(result).toContain('<span class="added">quick</span>');
    expect(result).toContain('<span class="added">fox</span>');
  });

  it('should surround removed words with span tags', () => {
    const section: EditorSection = {
      text: 'The quick brown fox',
      lines: 1,
      color: 'black',
      ranges: [
        { word: 'quick', change: 'removed' },
        { word: 'brown', change: 'removed' },
      ],
    };

    const result = surroundWordsWithSpan(section);

    expect(result).toContain('<span class="removed">quick</span>');
    expect(result).toContain('<span class="removed">brown</span>');
  });

  it('should not surround unchanged words', () => {
    const section: EditorSection = {
      text: 'The quick brown fox',
      lines: 1,
      color: 'black',
      ranges: [
        { word: 'lazy', change: 'added' },
        { word: 'dog', change: 'removed' },
      ],
    };

    const result = surroundWordsWithSpan(section);

    expect(result).not.toContain('<span class="added">lazy</span>');
    expect(result).not.toContain('<span class="removed">dog</span>');
  });

  it('should handle multiple occurrences of the same word', () => {
    const section: EditorSection = {
      text: 'quick quick quick',
      lines: 1,
      color: 'black',
      ranges: [
        { word: 'quick', change: 'added' },
        { word: 'quick', change: 'added' },
      ],
    };

    const result = surroundWordsWithSpan(section);

    expect(result).toContain('<span class="added">quick</span>');
    expect(result).toContain('<span class="added">quick</span>');
  });

  // Split the string by multiple tokens
  // Iterate over the list
  // Find word number 1, add a span
  // Remove it from the word list
  // Find word number 2, add a span
  // Remove it from the word list
  // Continue until the word list is empty
  // Flatten the list of strings
  // transform the list to a single string
  // return the new string

  it('should surround added and removed words with span tags', () => {
    const section: EditorSection = {
      text: 'Hei, her er lit tekst å rete, Hei, her er lit tekst å rete.',
      lines: 2,
      color: '#A0D4A4',
      ranges: [
        { word: 'lit', change: 'removed' },
        { word: 'lit', change: 'removed' },
        { word: 'rete', change: 'removed' },
      ],
    };

    const result = surroundWordsWithSpan(section);

    expect(result).toContain(
      'Hei, her er <span class="removed">lit</span> tekst å rete, Hei, her er <span class="removed">lit</span> tekst å <span class="removed">rete</span>.'
    );
  });
});
