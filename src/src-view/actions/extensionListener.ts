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

import { debounce } from 'lodash';
import { CharPosition, ContentMessage } from '../../types/types';
import { getPositionIgnoringNewlines } from '../functions/textFunctions';
import store from '../redux/store';
import { setCharPosition } from '../redux/textAssistantSlice';
import { handleContentMessage } from './contentMessageService';

const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const position = getPositionIgnoringNewlines(charPosition, state.text);

  store.dispatch(setCharPosition(position));
};

const debouncedHandleContentMessage = debounce(handleContentMessage, 200);
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
