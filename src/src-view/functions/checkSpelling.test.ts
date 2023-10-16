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

import { jest, describe, it, expect } from '@jest/globals';

import { abstractCheckSpelling } from './spellingFunctions';
import {
  CorrectionParams,
  Dispatcher,
  Logger,
  Sentence,
  Spellchecker,
} from '../../types/types';

const mockedSentence: Sentence = {
  hash: '9ab954a9f3b110563706651dd63b96d0',
  original: 'This is an original mock sentence.',
  corrected: 'This is a corrected mock sentence.',
};

const mockedSpellchecker: Spellchecker = {
  correct: async (_params: CorrectionParams) =>
    Promise.resolve([undefined, mockedSentence]),
};

const mockedLogger: Logger = {
  log: (_message: string, _obj: any) => {},
};

const mockedSentenceCache = {
  get: (_hash: string) => undefined,
  set: (_hash: string, _sentence: Sentence) => {},
};

describe('checkSpelling', () => {
  it('should process and dispatch a corrected sentence', async () => {
    const mockedDispatcher: Dispatcher = {
      dispatch: (_action: any) => {},
    };

    const mockedCheckSpelling = abstractCheckSpelling(
      mockedSpellchecker,
      mockedDispatcher,
      mockedLogger,
      mockedSentenceCache
    );
    const sampleSentence = 'This is an original mock sentence.';

    const dispatchSpy = jest.spyOn(mockedDispatcher, 'dispatch');
    const logSpy = jest.spyOn(mockedLogger, 'log');

    await Promise.all(
      mockedCheckSpelling({
        text: sampleSentence,
        apiKey: 'apiKey',
        language: 'english',
      })
    );

    const dispatchCalls = dispatchSpy.mock.calls;

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchCalls[0][0]).toEqual({
      payload: [
        {
          hash: '9ab954a9f3b110563706651dd63b96d0',
          original: 'This is an original mock sentence.',
        },
      ],
      type: 'textAssistant/setSentences',
    });
    expect(dispatchCalls[1][0]).toEqual({
      type: 'textAssistant/updateSentence',
      payload: {
        corrected: 'This is a corrected mock sentence.',
        correctedTokens: [
          { original: 'This is ', type: 'skipped' },
          { original: 'a', type: 'added' },
          { original: ' ', type: 'skipped' },
          { original: 'corrected', type: 'added' },
          { original: ' ' },
          { original: 'mock' },
          { original: ' ' },
          { original: 'sentence.' },
        ],
        hash: '9ab954a9f3b110563706651dd63b96d0',
        original: 'This is an original mock sentence.',
        originalTokens: [
          { original: 'This is ', type: 'skipped' },
          { original: 'an', type: 'removed' },
          { original: ' ', type: 'skipped' },
          { original: 'original', type: 'removed' },
          { original: ' ' },
          { original: 'mock' },
          { original: ' ' },
          { original: 'sentence.' },
        ],
      },
    });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should handle an error returned by the spellchecker', async () => {
    const mockedDispatcher: Dispatcher = {
      dispatch: (_action: any) => {},
    };

    const mockedSpellcheckerWithError: Spellchecker = {
      correct: async (_params: CorrectionParams) =>
        Promise.resolve([new Error('Spellcheck error'), undefined]),
    };

    const dispatchSpy = jest.spyOn(mockedDispatcher, 'dispatch');

    const checkSpellingWithMockedError = abstractCheckSpelling(
      mockedSpellcheckerWithError,
      mockedDispatcher,
      mockedLogger,
      mockedSentenceCache
    );

    const sampleSentence = 'This is an original mock sentence.';

    Promise.all(
      checkSpellingWithMockedError({
        text: sampleSentence,
        apiKey: 'apiKey',
        language: 'english',
      })
    );

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
