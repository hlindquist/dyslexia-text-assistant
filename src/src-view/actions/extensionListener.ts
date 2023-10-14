import * as R from 'ramda';

import {
  CharPosition,
  ContentMessage,
  SpellingSection,
  TextToken,
} from '../../types/types';
import { transformTokensToHtml } from '../utils/htmlTextUtil';
import {
  setCharPosition,
  setCorrectedHtml,
  setOriginalHtml,
  setState,
} from '../redux/textAssistantSlice';
import ChatGPT from './adapters/ChatGPT';
import { createSpellingSection } from '../functions/modules/spelling';
import store from '../redux/store';
import { debounce } from 'lodash';
import {
  getPositionIgnoringNewlines,
  trimToCompleteSentences,
} from '../utils/textUtils';
import {
  deleteCurrentPosition,
  insertsCharacterPositionToken,
  transformTextToTokens,
} from '../functions/tokenUtils';

const callChat = async (
  contentMessage: ContentMessage
): Promise<SpellingSection> | undefined => {
  let spellingSection = undefined;

  const completedContentMessage = {
    ...contentMessage,
    text: trimToCompleteSentences(contentMessage.text),
  };

  if (
    completedContentMessage?.text?.length > 0 &&
    completedContentMessage?.apiKey &&
    completedContentMessage?.language
  ) {
    const chat = new ChatGPT(
      completedContentMessage.apiKey,
      completedContentMessage.language
    );
    spellingSection = await chat
      .spellcheck(completedContentMessage.text)
      .then((response) =>
        response
          ? createSpellingSection(completedContentMessage.text, response)
          : undefined
      );
  }

  return spellingSection;
};

const handleContentMessage = async (contentMessage: ContentMessage) => {
  const state = store.getState().textAssistant;

  const spellingSection = await callChat(contentMessage).then(
    (spellingSection) => spellingSection
  );

  if (spellingSection) {
    const originalTokens = transformTextToTokens(
      spellingSection.original,
      contentMessage.charPosition
    );
    const correctedTokens = transformTextToTokens(
      spellingSection.corrected,
      contentMessage.charPosition
    );
    const originalHtml = transformTokensToHtml(originalTokens);
    const correctedHtml = transformTokensToHtml(correctedTokens);

    const newState = {
      ...state,
      openAiApiKey: contentMessage.apiKey,
      language: contentMessage.language,
      text: contentMessage.text,
      charPosition: getPositionIgnoringNewlines(
        contentMessage.charPosition,
        contentMessage.text
      ),
      spellingSection,
      originalHtml,
      correctedHtml,
      originalTokens,
      correctedTokens,
    };

    store.dispatch(setState(newState));
  }
};

const debouncedHandleContentMessage = debounce(handleContentMessage, 500);

const endsWithStopWord = (inputString): boolean => {
  const stopWords = ['.', '?', '!'];

  for (const stopWord of stopWords) {
    if (inputString.endsWith(stopWord)) {
      return true;
    }
  }

  return false;
};

const replaceCurrentPositionToken = (
  tokens: TextToken[],
  charPosition: number
) =>
  R.pipe(
    (tokens: TextToken[]) => deleteCurrentPosition(tokens),
    (tokens: TextToken[]) => insertsCharacterPositionToken(tokens, charPosition)
  )(tokens);

const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const spellingSection = state.spellingSection;
  const positionNumber = getPositionIgnoringNewlines(
    charPosition,
    spellingSection?.original?.text || ''
  );
  if (state.originalTokens && state.correctedTokens) {
    const modifiedOriginalTokens = replaceCurrentPositionToken(
      state.originalTokens,
      positionNumber
    );
    const originalHtml = transformTokensToHtml(modifiedOriginalTokens);
    const correctedHtml = transformTokensToHtml(
      replaceCurrentPositionToken(state.correctedTokens, positionNumber)
    );

    store.dispatch(setOriginalHtml(originalHtml));
    store.dispatch(setCorrectedHtml(correctedHtml));
  }

  store.dispatch(setCharPosition(charPosition));
};

const debouncedHandleCharPosition = debounce(handleCharPosition, 200);

const handleEvent = (message: any) => {
  if ((message as ContentMessage)?.text) {
    endsWithStopWord(message.text)
      ? handleContentMessage(message)
      : debouncedHandleContentMessage(message);
  } else if (message?.character) {
    debouncedHandleCharPosition(message);
  }
};

window.addEventListener('message', (event) => {
  handleEvent(event?.data?.contentMessage || event?.data.charPosition);
});

export const sendMessage = (message: any) => {
  handleEvent(message);
};
