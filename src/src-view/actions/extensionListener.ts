import check from 'check-types';
import { LRUCache } from 'lru-cache';
import hash from 'object-hash';

import { CharPosition, ContentMessage } from '../../types/types';
import {
  addToHistory,
  setCharPosition,
  setState,
} from '../redux/textAssistantSlice';
import ChatGPT from './adapters/ChatGPT';
import store from '../redux/store';
import { debounce } from 'lodash';
import {
  getPositionIgnoringNewlines,
  trimToCompleteSentences,
} from '../utils/textUtils';
import { transformTextToTokens } from '../functions/tokenUtils';
import Differ from './adapters/Differ';
import { createSpellingSection } from '../functions/spelling';

const cache = new LRUCache({ max: 200 });

const callChat = async (
  contentMessage: ContentMessage
): Promise<string | undefined> => {
  let response = undefined;
  if (
    contentMessage?.text?.length > 0 &&
    contentMessage?.apiKey &&
    contentMessage?.language
  ) {
    const chat = new ChatGPT(contentMessage.apiKey, contentMessage.language);
    response = await chat
      .spellcheck(contentMessage.text)
      .then((response) => response);
  }

  return response;
};

const handleContentMessage = async (contentMessage: ContentMessage) => {
  const state = store.getState().textAssistant;

  if (
    !!check.nonEmptyString(contentMessage.text) &&
    !!trimToCompleteSentences(contentMessage.text)
  ) {
    const trimmedContentMessage = {
      ...contentMessage,
      text: trimToCompleteSentences(contentMessage.text),
    };

    const hashKey = hash(trimmedContentMessage.text, { algorithm: 'md5' });
    let response = undefined;
    if (cache.has(hashKey)) {
      response = cache.get(hashKey);
    } else {
      response = await callChat(trimmedContentMessage).then(
        (response) => response || ''
      );
      cache.set(hashKey, response);
    }

    const diffChanges = Differ.compare(trimmedContentMessage.text, response);

    const spellingSection = createSpellingSection(
      trimmedContentMessage.text,
      response,
      diffChanges
    );

    if (spellingSection) {
      const originalTokens = transformTextToTokens(spellingSection.original);
      const correctedTokens = transformTextToTokens(spellingSection.corrected);

      const newState = {
        ...state,
        openAiApiKey: trimmedContentMessage.apiKey,
        language: trimmedContentMessage.language,
        text: trimmedContentMessage.text,
        charPosition: getPositionIgnoringNewlines(
          contentMessage.charPosition,
          contentMessage.text
        ),
        originalTokens,
        correctedTokens,
      };

      store.dispatch(setState(newState));
      store.dispatch(
        addToHistory({
          time: new Date().toLocaleTimeString(),
          text: trimmedContentMessage.text,
          charPosition: trimmedContentMessage.charPosition,
          originalTokens,
          correctedTokens,
        })
      );
    }
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

const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const position = getPositionIgnoringNewlines(charPosition, state.text);

  store.dispatch(setCharPosition(position));
};

const debouncedHandleCharPosition = debounce(handleCharPosition, 200);

const conditionallyHandleContentMessage = (contentMessage: ContentMessage) => {
  endsWithStopWord(contentMessage.text)
    ? handleContentMessage(contentMessage)
    : debouncedHandleContentMessage(contentMessage);
};

window.addEventListener('message', (event) => {
  check.assert.nonEmptyObject(event?.data);
  if (check.object(event?.data?.contentMessage)) {
    conditionallyHandleContentMessage(event.data.contentMessage);
  } else if (check.object(event?.data?.charPosition)) {
    debouncedHandleCharPosition(event.data.charPosition);
  }
});

export const debugContentMessage = (message: ContentMessage) => {
  conditionallyHandleContentMessage(message);
};
