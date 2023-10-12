import {
  CharPosition,
  ContentMessage,
  SpellingSection,
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
import { transformTextToTokens } from '../functions/tokenUtils';
import { ilog } from '../../utils/debugUtils';

const channel = new BroadcastChannel('text-assistant');

const callChat = async (
  contentMessage: ContentMessage
): Promise<SpellingSection | undefined> => {
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

  const completedContentMessage = {
    ...contentMessage,
    text: trimToCompleteSentences(contentMessage.text),
  };

  ilog(completedContentMessage, 'completedContentMessage');

  const spellingSection = await callChat(completedContentMessage).then(
    (spellingSection) => spellingSection
  );

  if (spellingSection) {
    const originalTokens = transformTextToTokens(
      spellingSection.original,
      completedContentMessage.charPosition
    );
    const correctedTokens = transformTextToTokens(
      spellingSection.corrected,
      completedContentMessage.charPosition
    );
    const originalHtml = transformTokensToHtml(originalTokens);
    const correctedHtml = transformTokensToHtml(correctedTokens);

    const newState = {
      ...state,
      openAiApiKey: completedContentMessage.apiKey,
      language: completedContentMessage.language,
      text: completedContentMessage.text,
      charPosition: getPositionIgnoringNewlines(
        completedContentMessage.charPosition,
        completedContentMessage.text
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
    const originalHtml = transformTokensToHtml(state.originalTokens || []);
    const correctedHtml = transformTokensToHtml(state.correctedTokens || []);

    store.dispatch(setOriginalHtml(originalHtml));
    store.dispatch(setCorrectedHtml(correctedHtml));
  }

  store.dispatch(setCharPosition(charPosition));
};

const debouncedHandleCharPosition = debounce(handleCharPosition, 200);

const handleEvent = (event: MessageEvent) => {
  const contentMessage: ContentMessage | undefined =
    event?.data?.contentMessage;
  if (contentMessage) {
    debouncedHandleContentMessage(contentMessage);
  }

  const charPosition: CharPosition | undefined = event?.data?.charPosition;
  if (charPosition) {
    debouncedHandleCharPosition(charPosition);
  }
};

window.addEventListener('message', (event) => {
  handleEvent(event);
});

channel.addEventListener('message', (event) => {
  handleEvent(event);
});
