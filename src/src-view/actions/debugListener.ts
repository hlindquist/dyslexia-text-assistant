import { debounce } from 'lodash';
import { CharPositionSimple, ContentMessage } from '../../types/types';
import {
  debouncedHandleContentMessage,
  handleCharPositionSimple,
} from './extensionListener';

export const debouncedHandleCharPositionSimple = debounce(
  handleCharPositionSimple,
  50
);

export const debugContentMessage = (message: ContentMessage) => {
  debouncedHandleContentMessage(message);
};

export const debugCharPosition = (charPosition: CharPositionSimple) => {
  debouncedHandleCharPositionSimple(charPosition);
};
