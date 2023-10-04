import { describe, it, expect } from '@jest/globals';
import { TextToken } from '../../types/types';
import { insertsCharacterPositionToken } from './textTokenUtils';

describe('insertsCharacterPositionToken', () => {
  it('should insert an empty token at the beginning of the tokens array', () => {
    const tokens = [
      { original: 'Hello', modified: 'Hello' },
      { original: ' world', modified: ' world' },
    ];

    const modifiedTokens = insertsCharacterPositionToken(tokens, 0);

    expect(modifiedTokens).toEqual([
      { original: '', modified: '', type: 'current' },
      { original: 'Hello', modified: 'Hello' },
      { original: ' world', modified: ' world' },
    ]);
  });

  it('should insert an empty token in the middle of the tokens array', () => {
    const tokens = [
      { original: 'This', modified: 'This' },
      { original: ' is', modified: ' is' },
      { original: ' a', modified: ' a' },
      { original: ' test', modified: ' test' },
    ];

    const modifiedTokens = insertsCharacterPositionToken(tokens, 8);

    expect(modifiedTokens).toEqual([
      { original: 'This', modified: 'This' },
      { original: ' is', modified: ' is' },
      { original: '', modified: '', type: 'current' },
      { original: ' a', modified: ' a' },
      { original: ' test', modified: ' test' },
    ]);
  });

  it('should insert an empty token before the end of the tokens array', () => {
    const tokens = [
      { original: 'The', modified: 'The' },
      { original: ' end', modified: ' end' },
    ];

    const modifiedTokens = insertsCharacterPositionToken(tokens, 7);

    expect(modifiedTokens).toEqual([
      { original: 'The', modified: 'The' },
      { original: '', modified: '', type: 'current' },
      { original: ' end', modified: ' end' },
    ]);
  });

  it('should handle an empty tokens array', () => {
    const tokens: TextToken[] = [];

    const modifiedTokens = insertsCharacterPositionToken(tokens, 0);

    expect(modifiedTokens).toEqual([
      { original: '', modified: '', type: 'current' },
    ]);
  });

  it('should insert at the beginning when position is 0', () => {
    const tokens = [{ original: 'Text', modified: 'Text' }];

    const modifiedTokens = insertsCharacterPositionToken(tokens, 0);

    expect(modifiedTokens).toEqual([
      { original: '', modified: '', type: 'current' },
      { original: 'Text', modified: 'Text' },
    ]);
  });
});
