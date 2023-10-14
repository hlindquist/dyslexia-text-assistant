import { escapeRegExp } from 'lodash';
import {
  CharPosition,
  EditorSection,
  TextToken,
  WordChange,
} from '../../types/types';

import { findLastIndex } from 'lodash';

export const splitStringWithStopwords = (inputString: string) => {
  const result = [];
  let currentWord = '';

  for (let i = 0; i < inputString?.length; i++) {
    const char = inputString[i];

    if (/[.,!? ]/.test(char)) {
      if (currentWord) {
        result.push(currentWord);
        currentWord = '';
      }
      result.push(char);
    } else {
      currentWord += char;
    }
  }

  if (currentWord) {
    result.push(currentWord);
  }

  return result;
};

export const trimToCompleteSentences = (text: string): string => {
  const charList = text.split('');
  const lastStopCharacter = findLastIndex(charList, (char: string) =>
    ['.', '!', '?'].includes(char)
  );
  return charList.slice(0, lastStopCharacter + 1).join('');
};

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

export const splitText = (section: EditorSection): string[] => {
  const wordChanges: WordChange[] = section.ranges || [];
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
    if (token.original.includes('.') && token.original === token.modified) {
      const sentences = token.original.split('.');
      sentences.forEach((sentence, index) => {
        if (sentence.trim() !== '') {
          const newToken: TextToken = {
            original: sentence,
            modified: sentence,
          };
          resultArray.push(newToken);
        }
        if (index < sentences?.length - 1) {
          const periodToken: TextToken = {
            original: '.',
            modified: '.',
          };
          resultArray.push(periodToken);
        }
      });
    } else {
      resultArray.push(token);
    }
  });

  return resultArray;
};
