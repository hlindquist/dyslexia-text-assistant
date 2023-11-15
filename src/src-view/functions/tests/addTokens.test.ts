import { describe, expect, it } from '@jest/globals';
import { Sentence, TextToken } from '../../../types/types';
import { addTokens } from '../spellingFunctions';

describe('addTokens', () => {
  it('should add tokens to a sentence with corrections', () => {
    const sentence: Sentence = {
      hash: 'sampleHash',
      original: 'Me dete må vel også retes.',
      corrected: 'Men dette må vel også rettes.',
      needsCorrection: true,
    };

    const expectedOriginalTokens: TextToken[] = [
      {
        original: 'Me',
        type: 'removed',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'dete',
        type: 'removed',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'må',
        type: 'skipped',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'vel',
        type: 'skipped',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'også',
        type: 'skipped',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'retes',
        type: 'removed',
      },
      {
        original: '.',
        type: 'skipped',
      },
    ];

    const expectedCorrectedTokens: TextToken[] = [
      {
        original: 'Men',
        type: 'added',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'dette',
        type: 'added',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'må',
        type: 'skipped',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'vel',
        type: 'skipped',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'også',
        type: 'skipped',
      },
      {
        original: ' ',
        type: 'skipped',
      },
      {
        original: 'rettes',
        type: 'added',
      },
      {
        original: '.',
        type: 'skipped',
      },
    ];

    const result = addTokens(sentence);

    // ilog(result, 'result');

    expect(result.originalTokens).toEqual(expectedOriginalTokens);
    expect(result.correctedTokens).toEqual(expectedCorrectedTokens);
  });

  it.skip('should not add tokens to a sentence without corrections', () => {
    const sentence: Sentence = {
      hash: 'sampleHash',
      original: 'Me dete må vel også retes.',
      corrected: 'Me dete må vel også retes.',
      needsCorrection: false,
    };

    const result = addTokens(sentence);

    expect(result.originalTokens).toBeUndefined();
    expect(result.correctedTokens).toBeUndefined();
  });
});
