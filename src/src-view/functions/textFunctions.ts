import check from 'check-types';
import { escapeRegExp, findLastIndex } from 'lodash';

import {
  CharPosition,
  ContentMessage,
  RegexExtract,
  TextToken,
  WordChange,
} from '../../types/types';

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

export function splitText(text: string, tokensToSplitOn: string[]): string[] {
  const regexPattern = tokensToSplitOn
    .map((token) => `(${escapeRegExp(token)})`)
    .join('|');

  const parts = text.split(new RegExp(regexPattern));

  return tokensToSplitOn?.length && text !== ''
    ? parts.filter((part) => !!part && part !== '')
    : [text];
}

export const findTokensToSplitOn = (wordChanges: WordChange[]): string[] => {
  const allWords = wordChanges.map((change) => change.word);
  const tokensToSplitOn = Array.from(new Set(allWords));

  return tokensToSplitOn;
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

export const trimToCompleteSentences = (text: string): string => {
  const charList = text.split('');
  const lastStopCharacter = findLastIndex(charList, (char: string) =>
    ['.', '!', '?'].includes(char)
  );
  return charList.slice(0, lastStopCharacter + 1).join('');
};

export const splitIntoSentences = (inputString: string): string[] => {
  const result = [];
  let currentSentence = '';

  for (let i = 0; i < inputString?.length; i++) {
    const char = inputString[i];

    if (/[.!?]/.test(char)) {
      currentSentence += char;

      if (currentSentence) {
        result.push(currentSentence);
        currentSentence = '';
      }
    } else {
      currentSentence += char;
    }
  }

  if (currentSentence) {
    result.push(currentSentence);
  }

  return result;
};

export const extractWithRegex = (text: string, regex: RegExp): RegexExtract => {
  const matched = text.match(regex)?.[0] || '';
  const remainingText = text.replace(regex, '');

  return { matched, text: remainingText };
};

export const extractNoncorrectablesFromFront = (text: string): RegexExtract =>
  extractWithRegex(text, /^(\\n|\\r|\s|")+/);
export const extractNoncorrectablesFromEnd = (text: string): RegexExtract =>
  extractWithRegex(text, /(\\n|\\r|\s|")+$/);
