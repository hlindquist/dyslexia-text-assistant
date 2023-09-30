import { describe, it, expect } from '@jest/globals';
import { getPositionIgnoringNewlines } from './htmlTextUtil';

describe('getPositionIgnoringNewlines', () => {
  it('should calculate position correctly for a character within a line', () => {
    const charPosition = { line: 1, character: 3 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(24); // 'T' (line 1) + 'h' + 'i' + 's' + ' ' (line 2)
  });

  it('should calculate position correctly for a character at the beginning of a line', () => {
    const charPosition = { line: 2, character: 0 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(40); // 'T' (line 1) + 'h' + 'i' + 's' + ' ' (line 2) + 'w'
  });

  it('should calculate position correctly for a character at the end of a line', () => {
    const charPosition = { line: 0, character: 18 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    const position = getPositionIgnoringNewlines(charPosition, text);

    expect(position).toBe(18); // 'T' + 'h' + 'i' + 's' + ' ' + 'i' + 's' + ' ' + 'a' + ' ' + 't' + 'e' + 's' + 't' + ' ' + 's' + 't' + 'r' + 'i' + 'n' + 'g'
  });

  it('should throw an error for invalid line or character positions', () => {
    const invalidCharPosition = { line: 3, character: 10 };
    const text = 'This is a test string\nwith multiple lines\nand line breaks';

    expect(() => {
      getPositionIgnoringNewlines(invalidCharPosition, text);
    }).toThrow('Invalid line or character position');
  });
});
