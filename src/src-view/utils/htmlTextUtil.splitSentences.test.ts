import { describe, it, expect } from '@jest/globals';
import { TextToken } from '../../types/types';
import { splitFullSentences } from './htmlTextUtil';

describe('splitFullSentences', () => {
  it('should split tokens with periods in the middle of the texts', () => {
    const tokens: TextToken[] = [
      {
        original: 'Sentence one. More text.',
        modified: 'Sentence one. More text.',
      },
      {
        original: 'Another sentence. Some more text.',
        modified: 'Another sentence. Some more text.',
      },
      { original: 'NoSplit', modified: 'NoSplit' },
      { original: 'Single.Sentence.', modified: 'Single.Sentence.' },
    ];

    const result: TextToken[] = splitFullSentences(tokens);

    const expected: TextToken[] = [
      { original: 'Sentence one', modified: 'Sentence one' },
      { original: '.', modified: '.' },
      { original: ' More text', modified: ' More text' },
      { original: '.', modified: '.' },
      { original: 'Another sentence', modified: 'Another sentence' },
      { original: '.', modified: '.' },
      { original: ' Some more text', modified: ' Some more text' },
      { original: '.', modified: '.' },
      { original: 'NoSplit', modified: 'NoSplit' },
      { original: 'Single', modified: 'Single' },
      { original: '.', modified: '.' },
      { original: 'Sentence', modified: 'Sentence' },
      { original: '.', modified: '.' },
    ];

    expect(result).toEqual(expected);
  });

  it('should not modify tokens without periods', () => {
    const tokens: TextToken[] = [
      { original: 'NoSplit', modified: 'NoSplit' },
      { original: 'Single Sentence', modified: 'Single Sentence' },
    ];

    const result: TextToken[] = splitFullSentences(tokens);

    expect(result).toEqual(tokens);
  });
});
