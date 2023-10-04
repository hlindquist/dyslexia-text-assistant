import { escapeRegExp } from 'lodash';
import {
  CharPosition,
  EditorSection,
  TextToken,
  WordChange,
} from '../../types/types';

export function multiSplit(
  inputString: string,
  tokensToSplitOn: string[]
): string[] {
  const regexPattern = tokensToSplitOn
    .map((token) => `(${escapeRegExp(token)})`)
    .join('|');

  const parts = inputString.split(new RegExp(regexPattern));

  return tokensToSplitOn?.length && inputString !== ''
    ? parts.filter((part) => !!part && part !== '')
    : [inputString];
}

export const transformTextsToTextTokens = (texts: string[]): TextToken[] =>
  texts.map((text) => ({ original: text }));

export const splitText = (section: EditorSection): string[] => {
  const wordChanges: WordChange[] = section.changes || [];
  const allWords = wordChanges.map((change) => change.word);
  const tokensToSplitOn = Array.from(new Set(allWords));
  return multiSplit(section.text, tokensToSplitOn);
};

export const getPositionIgnoringNewlines = (
  charPosition: CharPosition,
  text: string
): number => {
  const { line, character } = charPosition;
  const lines = text.split('\n');
  let currentPosition = 0;

  for (let i = 0; i < line; i++) {
    currentPosition += lines[i]?.length;
  }

  currentPosition += character;

  return currentPosition;
};

export const splitFullSentences = (tokens: TextToken[]): TextToken[] => {
  const resultArray: TextToken[] = [];

  tokens.forEach((token) => {
    if (token.original.includes('.')) {
      const sentences = token.original.split('.');
      sentences.forEach((sentence, index) => {
        if (sentence.trim() !== '') {
          let originalSentence = sentence;
          if (index < sentences.length - 1) {
            originalSentence += '.';
          }
          const newToken: TextToken = {
            original: originalSentence.trim(),
            modified: originalSentence.trim(),
          };
          resultArray.push(newToken);
        }
      });
    } else {
      resultArray.push(token);
    }
  });

  return resultArray;
};
