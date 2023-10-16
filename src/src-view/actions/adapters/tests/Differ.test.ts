import { describe, it, expect } from '@jest/globals';
import Differ from '../Differ';
import { DiffChanges } from '../../../../types/types';

describe('Differ.compare', () => {
  it('should compare words in the texts', () => {
    const leftText = 'Hello world world of john Hello world';
    const rightText = 'Hello universe of teddy Hello universe';

    const result: DiffChanges = Differ.compare(leftText, rightText);

    const expected: DiffChanges = {
      original: [
        { word: 'Hello ', change: 'skipped' },
        { word: 'world', change: 'removed' },
        { word: ' ', change: 'skipped' },
        { word: 'world ', change: 'removed' },
        { word: 'of ', change: 'skipped' },
        { word: 'john', change: 'removed' },
        { word: ' Hello ', change: 'skipped' },
        { word: 'world', change: 'removed' },
      ],
      corrected: [
        { word: 'Hello ', change: 'skipped' },
        { word: 'universe', change: 'added' },
        { word: ' of ', change: 'skipped' },
        { word: 'teddy', change: 'added' },
        { word: ' Hello ', change: 'skipped' },
        { word: 'universe', change: 'added' },
      ],
    };

    expect(result).toEqual(expected);
  });

  it('should keep multiple words in one skip', () => {
    const leftText = 'Much the same here, no?';
    const rightText = 'Much the same here, yes?';

    const result: DiffChanges = Differ.compare(leftText, rightText);

    const expected: DiffChanges = {
      original: [
        { word: 'Much the same here, ', change: 'skipped' },
        { word: 'no', change: 'removed' },
        { word: '?', change: 'skipped' },
      ],
      corrected: [
        { word: 'Much the same here, ', change: 'skipped' },
        { word: 'yes', change: 'added' },
        { word: '?', change: 'skipped' },
      ],
    };

    expect(result).toEqual(expected);
  });
});
