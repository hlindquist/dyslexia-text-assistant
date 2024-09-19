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

import { debounce } from 'lodash';
import { CharPosition, CharPositionSimple } from '../../types/types';
import { getPositionIgnoringNewlines } from '../functions/textFunctions';
import store from '../redux/store';
import { setCharPosition } from '../redux/textAssistantSlice';
import { handleContentMessage } from './contentMessageService';

const handleCharPosition = (charPosition: CharPosition) => {
  const state = store.getState().textAssistant;
  const simplePosition = getPositionIgnoringNewlines(charPosition, state.text);

  handleCharPositionSimple(simplePosition);
};

export const handleCharPositionSimple = (charPosition: CharPositionSimple) => {
  store.dispatch(setCharPosition(charPosition));
};

export const debouncedHandleContentMessage = debounce(handleContentMessage, 50);
export const debouncedHandleCharPosition = debounce(handleCharPosition, 50);
