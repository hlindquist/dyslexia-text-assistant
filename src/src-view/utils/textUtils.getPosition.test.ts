import { describe, it, expect } from '@jest/globals';
import { getPositionIgnoringNewlines } from './textUtils';

describe('getPositionIgnoringNewlines', () => {
  it('should calculate position correctly for a character within a line', () => {
    const charPosition = { line: 1, character: 3 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(24);
  });

  it('should calculate position correctly for a character at the beginning of a line', () => {
    const charPosition = { line: 2, character: 0 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(40);
  });

  it('should calculate position correctly for a character at the end of a line', () => {
    const charPosition = { line: 0, character: 18 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(18);
  });
});
