import { TextToken, WordChange } from '../../types/types';

export const insertsCharacterPositionToken = (
  tokens: TextToken[],
  position: number
): TextToken[] => {
  const modifiedTokens = [...tokens];

  const insertIndex = modifiedTokens.findIndex(
    (token) => (position -= token.original?.length) <= 0
  );

  modifiedTokens.splice(insertIndex, 0, {
    original: '',
    modified: '',
    type: 'current',
  });

  return modifiedTokens;
};

export const identifyChangeTypesInText = (
  wordChanges: WordChange[],
  splitText: TextToken[]
): TextToken[] => {
  let index = 0;

  const resultArray: TextToken[] = splitText.map((textToken: TextToken) => {
    if (
      index < wordChanges.length &&
      textToken.original === wordChanges[index].word
    ) {
      const changeType = wordChanges[index].change;
      index++;
      return { original: textToken.original, type: changeType };
    }
    return { original: textToken.original };
  });

  return resultArray;
};
