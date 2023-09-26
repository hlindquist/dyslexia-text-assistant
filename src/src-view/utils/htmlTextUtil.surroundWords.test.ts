import { describe, it, expect } from '@jest/globals';
import { TextToken, WordChange } from '../../types/types';
import { surroundWordsWithSpan } from './htmlTextUtil';

describe('surroundWordsWithSpan', () => {
  it('should surround words with <span> tags when changes are "added" or "removed"', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'added' },
      { word: 'banana', change: 'removed' },
    ];

    const splitText: string[] = ['apple', 'banana', 'cherry'];

    const result: TextToken[] = surroundWordsWithSpan(wordChanges, splitText);

    // Define the expected result based on the input
    const expected: TextToken[] = [
      { original: 'apple', modified: '<span class="added">apple</span>' },
      { original: 'banana', modified: '<span class="removed">banana</span>' },
      { original: 'cherry', modified: 'cherry' },
    ];

    // Use Jest's expect function to assert that the result matches the expected output
    expect(result).toEqual(expected);
  });

  it('should not surround words with <span> tags when changes are not "added" or "removed"', () => {
    const wordChanges: WordChange[] = [
      { word: 'apple', change: 'skip' },
      { word: 'banana', change: 'skip' },
    ];

    const splitText: string[] = ['apple', 'banana', 'cherry'];

    const result: TextToken[] = surroundWordsWithSpan(wordChanges, splitText);

    // Define the expected result based on the input
    const expected: TextToken[] = [
      { original: 'apple', modified: 'apple' },
      { original: 'banana', modified: 'banana' },
      { original: 'cherry', modified: 'cherry' },
    ];

    // Use Jest's expect function to assert that the result matches the expected output
    expect(result).toEqual(expected);
  });

  // Add more test cases as needed to cover different scenarios
});