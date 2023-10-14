import {
  CharPosition,
  ContentMessage,
  SpellingSection,
} from '../../types/types';
import {
  transformTextToHtml,
  transformTokensToHtml,
} from '../utils/htmlTextUtil';
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
import { getPositionIgnoringNewlines } from '../utils/textUtils';
import { transformTextToTokens } from '../functions/tokenUtils';

const callChat = async (
  contentMessage: ContentMessage
): Promise<SpellingSection> | undefined => {
  let spellingSection = undefined;
  if (
    contentMessage?.text?.length > 0 &&
    contentMessage?.apiKey &&
    contentMessage?.language
  ) {
    const chat = new ChatGPT(contentMessage.apiKey, contentMessage.language);
    spellingSection = await chat
      .spellcheck(contentMessage.text)
      .then((response) =>
        response
          ? createSpellingSection(contentMessage.text, response)
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
    };

    store.dispatch(setState(newState));
  }
};

const debouncedHandleContentMessage = debounce(handleContentMessage, 500);

const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const spellingSection = state.spellingSection;
  if (spellingSection) {
    const originalHtml = transformTextToHtml(
      spellingSection.original,
      charPosition
    );
    const correctedHtml = transformTextToHtml(
      spellingSection.corrected,
      charPosition
    );

    store.dispatch(setOriginalHtml(originalHtml));
    store.dispatch(setCorrectedHtml(correctedHtml));
  }

  store.dispatch(setCharPosition(charPosition));
};

const debouncedHandleCharPosition = debounce(handleCharPosition, 200);

const handleEvent = (contentMessage: any) => {
  if ((contentMessage as ContentMessage)?.text) {
    debouncedHandleContentMessage(contentMessage);
  }

  const charPosition: CharPosition | undefined = contentMessage.charPosition;
  if (charPosition) {
    debouncedHandleCharPosition(charPosition);
  }
};

window.addEventListener('message', (event) => {
  handleEvent(event?.data);
});

export const sendMessage = (message: any) => {
  handleEvent(message);
};
