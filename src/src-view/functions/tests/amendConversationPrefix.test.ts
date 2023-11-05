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
import { amendConversationPrefix } from '../spellingFunctions';

const createSentences = (length: number) => {
  const myNumbers: number[] = Array.from(
    { length: length },
    (_, index) => index + 1
  );
  const sentences = myNumbers.map((number) => ({
    hash: 'hash' + number,
    original: 'Original sentence ' + number,
    corrected: 'Corrected sentence ' + number,
  }));

  return sentences;
};

describe('amendConversationPrefix', () => {
  const sentences15 = createSentences(15);
  const sentences7 = createSentences(7);

  it('should correctly amend the conversation prefix', () => {
    const sentenceToPrefix = sentences15[4];

    const result = amendConversationPrefix(sentenceToPrefix, sentences15);

    expect(result.conversationPrefix).toEqual([
      sentences15[0],
      sentences15[1],
      sentences15[2],
      sentences15[3],
      sentences15[5],
    ]);
  });

  it('should correctly amend the conversation prefix when few sentences', () => {
    const sentenceToPrefix = sentences7[1];

    const result = amendConversationPrefix(sentenceToPrefix, sentences7);

    expect(result.conversationPrefix).toEqual([
      sentences7[0],
      sentences7[2],
      sentences7[3],
      sentences7[4],
      sentences7[5],
    ]);
  });

  it.skip('should handle sentences with no corrected versions', () => {
    const sentenceToPrefix = {
      hash: 'hash3',
      original: 'Original sentence 3',
    };

    const result = amendConversationPrefix(sentenceToPrefix, sentences15);

    expect(result.conversationPrefix).toEqual([]);
  });

  it.skip('should limit the conversation prefix to 10 sentences', () => {
    const manySentences = Array.from({ length: 15 }, (_, i) => ({
      hash: `hash${i}`,
      original: `Original sentence ${i}`,
      corrected: `Corrected sentence ${i}`,
    }));

    const sentenceToPrefix = manySentences[5];

    const result = amendConversationPrefix(sentenceToPrefix, manySentences);

    expect(result.conversationPrefix.length).toBe(10);
  });

  it.skip('should handle when no sentences', () => {
    const sentenceToPrefix = {
      hash: 'hash3',
      original: 'Original sentence 3',
    };

    const result = amendConversationPrefix(sentenceToPrefix, []);

    expect(result.conversationPrefix).toEqual([]);
  });
});
