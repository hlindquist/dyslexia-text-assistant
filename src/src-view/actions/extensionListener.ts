/* eslint-disable indent */
/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Author: Håkon Lindquist
 */

import check from 'check-types';

import { CharPosition, ContentMessage } from '../../types/types';
import {
  addToDebugHistory,
  setCharPosition,
  setIncompleteSentence,
  setText,
} from '../redux/textAssistantSlice';
import store from '../redux/store';
import { debounce } from 'lodash';
import {
  getPositionIgnoringNewlines,
  extractIncompleteSentence,
} from '../utils/textUtils';
import { checkSpelling } from './spellingService';
import { getTimeInMilliseconds } from '../utils/timeTools';

const handleContentMessage = async (contentMessage: ContentMessage) => {
  const hasApiKey = check.nonEmptyString(contentMessage.apiKey);
  const hasLanguage = check.nonEmptyString(contentMessage.language);

  if (!hasApiKey) {
    console.error('Missing API key');
    return;
  }

  if (!hasLanguage) {
    console.error('No language specified');
    return;
  }

  store.dispatch(setText(contentMessage.text));
  store.dispatch(
    addToDebugHistory({
      time: getTimeInMilliseconds(),
      text: contentMessage.text,
    })
  );

  const incompleteSentence = extractIncompleteSentence(contentMessage.text);
  store.dispatch(setIncompleteSentence(incompleteSentence));

  await Promise.all(checkSpelling(contentMessage));
};

const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const position = getPositionIgnoringNewlines(charPosition, state.text);

  store.dispatch(setCharPosition(position));
};

const debouncedHandleContentMessage = debounce(handleContentMessage, 300);
const debouncedHandleCharPosition = debounce(handleCharPosition, 200);

window.addEventListener('message', (event) => {
  if (check.object(event?.data?.contentMessage)) {
    debouncedHandleContentMessage(event.data.contentMessage);
  } else if (check.object(event?.data?.charPosition)) {
    debouncedHandleCharPosition(event.data.charPosition);
  }
});

export const debugContentMessage = (message: ContentMessage) => {
  debouncedHandleContentMessage(message);
};
