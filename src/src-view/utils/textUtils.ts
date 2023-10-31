import { escapeRegExp } from 'lodash';
import {
  CharPosition,
  ContentMessage,
  EditorSection,
  TextToken,
  WordChange,
} from '../../types/types';

import check from 'check-types';
import { trimToCompleteSentences } from '../functions/textFunctions';

export const endsWithStopWord = (inputString: string): boolean => {
  const stopWords = ['.', '?', '!'];

  for (const stopWord of stopWords) {
    if (inputString.endsWith(stopWord)) {
      return true;
    }
  }

  return false;
};

export const createTrimmedContentMessage = (contentMessage: ContentMessage) => {
  if (check.nonEmptyString(contentMessage.text)) {
    return {
      ...contentMessage,
      text: trimToCompleteSentences(contentMessage.text),
    };
  } else {
    return contentMessage;
  }
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
  text: string | undefined
): number => {
  const { line, character } = charPosition;
  const lines = (text || '').split('\n');
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

export const extractIncompleteSentence = (text: string): string => {
  const sentences = text.split(/[.?!]/);
  const nonEmptySentences = sentences.filter((sentence) => sentence.length > 0);

  if (nonEmptySentences.length > 0 && !text.match(/[.?!]$/)) {
    return nonEmptySentences[nonEmptySentences.length - 1];
  } else {
    return '';
  }
};
