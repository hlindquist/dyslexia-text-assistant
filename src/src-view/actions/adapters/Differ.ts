import { Change, diffWords } from 'diff';
import { DiffChanges, WordChange } from '../../../types/types';
import { splitIntoSentences } from '../../functions/textFunctions';

const consolidateWordChanges = (wordChanges: WordChange[]): WordChange[] => {
  if (wordChanges.length === 0) {
    return [];
  }

  const consolidatedChanges: WordChange[] = [];
  let currentChange = { ...wordChanges[0] };

  for (let i = 1; i < wordChanges.length; i++) {
    const nextChange = wordChanges[i];

    if (currentChange.change === nextChange.change) {
      currentChange.word += nextChange.word;
    } else {
      consolidatedChanges.push(currentChange);
      currentChange = { ...nextChange };
    }
  }

  consolidatedChanges.push(currentChange);

  return consolidatedChanges;
};

export const transformToWordChange = (diffChange: Change): WordChange => {
  const wordChange: WordChange = {
    word: diffChange.value,
    change: 'skipped',
  };

  if (diffChange.added) {
    wordChange.change = 'added';
  } else if (diffChange.removed) {
    wordChange.change = 'removed';
  }

  return wordChange;
};

const splitStopwords = (
  changes: WordChange[],
  currentChange: WordChange
): WordChange[] => {
  const splitChanges = splitIntoSentences(currentChange.word);
  if (currentChange?.word?.length > 1 && splitChanges?.length > 1) {
    const splittedList = splitChanges
      .filter((word) => word !== '')
      .map(
        (word) =>
          ({
            ...currentChange,
            word,
          } as WordChange)
      );
    return changes.concat(splittedList);
  }

  return changes.concat([currentChange]);
};

class Differ {
  static compare = (original: string, corrected: string): DiffChanges => {
    const tokens = diffWords(original, corrected)
      .map(transformToWordChange)
      .reduce(splitStopwords, []);

    const originalTokens = tokens.filter((token) => token.change !== 'added');
    const correctedTokens = tokens.filter(
      (token) => token.change !== 'removed'
    );

    return {
      original: consolidateWordChanges(originalTokens),
      corrected: consolidateWordChanges(correctedTokens),
    };
  };
}

export default Differ;
