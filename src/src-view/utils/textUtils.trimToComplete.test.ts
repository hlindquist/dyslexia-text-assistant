import { describe, it, expect } from '@jest/globals';
import { trimToCompleteSentences } from './textUtils';

describe('trimToCompleteSentences', () => {
  it('should return the original string if it ends with a stop character', () => {
    const input = 'This is a sentence.';
    const expectedOutput = 'This is a sentence.';
    const output = trimToCompleteSentences(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should return the original string up to the last stop character', () => {
    const input = 'This is a sentence. This is another sentence.';
    const expectedOutput = 'This is a sentence. This is another sentence.';
    const output = trimToCompleteSentences(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should return an empty string if the input is empty', () => {
    const input = '';
    const expectedOutput = '';
    const output = trimToCompleteSentences(input);
    expect(output).toEqual(expectedOutput);
  });

  it('should return an empty string if the input does not contain any stop characters', () => {
    const input = 'This is a sentence without stop characters';
    const expectedOutput = '';
    const output = trimToCompleteSentences(input);
    expect(output).toEqual(expectedOutput);
  });
});
