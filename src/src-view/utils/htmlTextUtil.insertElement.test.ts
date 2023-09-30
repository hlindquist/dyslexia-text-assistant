import { describe, it, expect } from '@jest/globals';
import { insertsCharacterPositionElement } from './htmlTextUtil';
import { TextToken } from '../../types/types';

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
