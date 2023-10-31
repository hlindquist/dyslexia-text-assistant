import { findLastIndex } from 'lodash';

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
        result.push(currentSentence.trim());
        currentSentence = '';
      }
    } else {
      currentSentence += char;
    }
  }

  if (currentSentence) {
    result.push(currentSentence.trim());
  }

  return result;
};
