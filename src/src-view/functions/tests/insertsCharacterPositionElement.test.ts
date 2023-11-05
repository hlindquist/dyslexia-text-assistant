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
import { insertsCharacterPositionElement } from '../htmlTextFunctions';
import { TextToken } from '../../../types/types';

describe('insertsCharacterPositionElement', () => {
  it('should insert an empty span at the beginning of the tokens array', () => {
    const tokens = [
      { original: 'Hello', modified: 'Hello' },
      { original: ' world', modified: ' world' },
    ];

    const modifiedTokens = insertsCharacterPositionElement(tokens, 0);

    expect(modifiedTokens).toEqual([
      { original: '', modified: '<span class="currentPosition"></span>' },
      { original: 'Hello', modified: 'Hello' },
      { original: ' world', modified: ' world' },
    ]);
  });

  it('should insert an empty span in the middle of the tokens array', () => {
    const tokens = [
      { original: 'This', modified: 'This' },
      { original: ' is', modified: ' is' },
      { original: ' a', modified: ' a' },
      { original: ' test', modified: ' test' },
    ];

    const modifiedTokens = insertsCharacterPositionElement(tokens, 8);

    expect(modifiedTokens).toEqual([
      { original: 'This', modified: 'This' },
      { original: ' is', modified: ' is' },
      { original: '', modified: '<span class="currentPosition"></span>' },
      { original: ' a', modified: ' a' },
      { original: ' test', modified: ' test' },
    ]);
  });

  it('should insert an empty span before the end of the tokens array', () => {
    const tokens = [
      { original: 'The', modified: 'The' },
      { original: ' end', modified: ' end' },
    ];

    const modifiedTokens = insertsCharacterPositionElement(tokens, 7);

    expect(modifiedTokens).toEqual([
      { original: 'The', modified: 'The' },
      { original: '', modified: '<span class="currentPosition"></span>' },
      { original: ' end', modified: ' end' },
    ]);
  });

  it('should handle an empty tokens array', () => {
    const tokens: TextToken[] = [];

    const modifiedTokens = insertsCharacterPositionElement(tokens, 0);

    expect(modifiedTokens).toEqual([
      { original: '', modified: '<span class="currentPosition"></span>' },
    ]);
  });

  it('should insert at the beginning when position is 0', () => {
    const tokens = [{ original: 'Text', modified: 'Text' }];

    const modifiedTokens = insertsCharacterPositionElement(tokens, 0);

    expect(modifiedTokens).toEqual([
      { original: '', modified: '<span class="currentPosition"></span>' },
      { original: 'Text', modified: 'Text' },
    ]);
  });
});
