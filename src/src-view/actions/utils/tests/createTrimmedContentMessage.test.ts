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
import { createTrimmedContentMessage } from '../textUtils';
import { ContentMessage } from '../../../../types/types';

describe('createTrimmedContentMessage', () => {
  it('should trim content to the last complete sentence', () => {
    const input: ContentMessage = {
      text: 'This is a complete sentence. This one is not',
      language: 'english',
      apiKey: 'testKey123',
    };
    const expectedOutput = {
      ...input,
      text: 'This is a complete sentence.',
    };
    const result = createTrimmedContentMessage(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should return empty text content with incomplete sentence without any stop character', () => {
    const input: ContentMessage = {
      text: 'This is an incomplete sentence without a stop character',
      language: 'english',
      apiKey: 'testKey123',
    };
    const expectedOutput: ContentMessage = {
      ...input,
      text: '',
    };
    const result = createTrimmedContentMessage(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should return the original message if content is empty', () => {
    const input: ContentMessage = {
      text: '',
      language: 'english',
      apiKey: 'testKey123',
    };
    const result = createTrimmedContentMessage(input);
    expect(result).toEqual(input);
  });
});
