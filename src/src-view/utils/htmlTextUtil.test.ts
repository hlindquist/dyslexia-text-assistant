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
import { transformTokensToHtml } from './htmlTextUtil'; // Import the new function
import { TextToken } from '../../types/types';

describe('transformTokensToHtml', () => {
  it('should surround added words with span tags', () => {
    const tokens: TextToken[] = [
      { original: '', type: 'current' },
      { original: 'The', type: 'skip' },
      { original: 'quick', type: 'added' },
      { original: 'brown', type: 'skip' },
      { original: 'fox', type: 'added' },
    ];

    const result = transformTokensToHtml(tokens);

    expect(result).toContain('<span class="added">quick</span>');
    expect(result).toContain('<span class="added">fox</span>');
  });

  it('should handle multiple occurrences of the same word', () => {
    const tokens: TextToken[] = [
      { original: '', type: 'current' },
      { original: 'quick', type: 'added' },
      { original: ' ', type: 'skip' },
      { original: 'quick', type: 'skip' },
      { original: ' ', type: 'skip' },
      { original: 'quick', type: 'added' },
    ];

    const result = transformTokensToHtml(tokens);

    expect(result).toEqual(
      '<span class="currentPosition"></span><span class="added">quick</span> quick <span class="added">quick</span>'
    );
  });

  it('should surround added and removed words with span tags', () => {
    const tokens: TextToken[] = [
      { original: '', type: 'current' },
      { original: 'Hello', type: 'skip' },
      { original: ',', type: 'skip' },
      { original: ' ', type: 'skip' },
      { original: 'bah', type: 'removed' },
      { original: ' ', type: 'skip' },
      { original: 'here', type: 'skip' },
      { original: ' ', type: 'skip' },
      { original: 'is', type: 'skip' },
      { original: ' ', type: 'skip' },
      { original: 'text', type: 'added' },
      { original: '.', type: 'skip' },
    ];

    const result = transformTokensToHtml(tokens);

    expect(result).toEqual(
      '<span class="currentPosition"></span>Hello, <span class="removed">bah</span> here is <span class="added">text</span>.'
    );
  });

  it('should surround correct instance of word with span tag when multiple instances', () => {
    const tokens: TextToken[] = [
      { original: '', type: 'current' },
      { original: 'Hey', type: 'skip' },
      { original: ',', type: 'skip' },
      { original: ' ', type: 'skip' },
      { original: 'hi', type: 'skip' },
      { original: ',', type: 'removed' },
      { original: ' ', type: 'skip' },
      { original: 'you', type: 'skip' },
      { original: '.', type: 'skip' },
    ];

    const result = transformTokensToHtml(tokens);

    expect(result).toEqual(
      '<span class="currentPosition"></span>Hey, hi<span class="removed">,</span> you.'
    );
  });
});
