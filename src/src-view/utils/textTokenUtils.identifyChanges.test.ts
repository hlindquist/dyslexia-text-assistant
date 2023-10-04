import { describe, it, expect } from '@jest/globals';
import { TextToken, WordChange } from '../../types/types';
import { identifyChangeTypesInText } from './textTokenUtils';

describe('identifyChangeTypesInText', () => {
  it('should identify changes in text and set the type accordingly', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'added' },
      { word: 'banana', change: 'removed' },
    ];

    const splitText: TextToken[] = [
      { original: 'apple' },
      { original: 'banana' },
      { original: 'cherry' },
    ];

    const result: TextToken[] = identifyChangeTypesInText(
      wordChanges,
      splitText
    );

    const expected: TextToken[] = [
      { original: 'apple', type: 'added' },
      { original: 'banana', type: 'removed' },
      { original: 'cherry' },
    ];

    expect(result).toEqual(expected);
  });

  it('should not set type for words not in wordChanges', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'added' },
      { word: 'banana', change: 'removed' },
    ];

    const splitText: TextToken[] = [
      { original: 'grape' },
      { original: 'cherry' },
      { original: 'pear' },
    ];

    const result: TextToken[] = identifyChangeTypesInText(
      wordChanges,
      splitText
    );

    const expected: TextToken[] = [
      { original: 'grape' },
      { original: 'cherry' },
      { original: 'pear' },
    ];

    expect(result).toEqual(expected);
  });
});
