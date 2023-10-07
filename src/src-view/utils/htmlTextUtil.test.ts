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
import { transformTextToHtml } from './htmlTextUtil';
import { CharPosition, EditorSection } from '../../types/types';

const charPosition: CharPosition = {
  line: 0,
  character: 0,
};

describe('transformTextToHtml', () => {
  it('should surround added words with span tags', () => {
    const section: EditorSection = {
      text: 'The quick brown fox',
      lines: 1,
      ranges: [
        { word: 'quick', change: 'added' },
        { word: 'fox', change: 'added' },
      ],
    };

    const result = transformTextToHtml(section, charPosition);

    expect(result).toContain('<span class="added">quick</span>');
    expect(result).toContain('<span class="added">fox</span>');
  });

  it('should handle multiple occurrences of the same word', () => {
    const section: EditorSection = {
      text: 'quick quick quick',
      lines: 1,
      ranges: [
        { word: 'quick', change: 'added' },
        { word: ' ', change: 'skip' },
        { word: 'quick', change: 'skip' },
        { word: ' ', change: 'skip' },
        { word: 'quick', change: 'added' },
      ],
    };

    const result = transformTextToHtml(section, charPosition);

    expect(result).toEqual(
      '<span class="currentPosition"></span><span class="added">quick</span> quick <span class="added">quick</span>'
    );
  });

  it('should surround added and removed words with span tags', () => {
    const section: EditorSection = {
      text: 'Hello, bah here is text.',
      lines: 2,
      ranges: [
        { word: 'Hello', change: 'skip' },
        { word: ',', change: 'skip' },
        { word: ' ', change: 'skip' },
        { word: 'bah', change: 'removed' },
        { word: ' ', change: 'skip' },
        { word: 'here', change: 'skip' },
        { word: ' ', change: 'skip' },
        { word: 'is', change: 'skip' },
        { word: ' ', change: 'skip' },
        { word: 'text', change: 'added' },
        { word: '.', change: 'skip' },
      ],
    };

    const result = transformTextToHtml(section, charPosition);

    expect(result).toEqual(
      '<span class="currentPosition"></span>Hello, <span class="removed">bah</span> here is <span class="added">text</span>.'
    );
  });

  it('should surround correct instance of word with span tag when multiple instances', () => {
    const section: EditorSection = {
      text: 'Hey, hi, you.',
      lines: 1,
      ranges: [
        { word: 'Hey', change: 'skip' },
        { word: ',', change: 'skip' },
        { word: ' ', change: 'skip' },
        { word: 'hi', change: 'skip' },
        { word: ',', change: 'removed' },
        { word: ' ', change: 'skip' },
        { word: 'you', change: 'skip' },
        { word: '.', change: 'skip' },
      ],
    };

    const result = transformTextToHtml(section, charPosition);

    expect(result).toEqual(
      '<span class="currentPosition"></span>Hey, hi<span class="removed">,</span> you.'
    );
  });
});
