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

import { ContentMessage } from '../../types/types';
import { extractIncompleteSentence } from '../functions/textFunctions';
import store from '../redux/store';
import {
  setChatConfiguration,
  setIncompleteSentence,
  setText,
} from '../redux/textAssistantSlice';
import { handleCorrectionsFromCache } from './spellingService';

export const handleContentMessage = (contentMessage: ContentMessage) => {
  const incompleteSentence = extractIncompleteSentence(contentMessage.text);
  const state = store.getState().textAssistant;
  const hasConfigChanged =
    state.chatConfiguration.apiKey !== contentMessage.apiKey ||
    state.chatConfiguration.language !== contentMessage.language;

  hasConfigChanged &&
    store.dispatch(
      setChatConfiguration({
        apiKey: contentMessage.apiKey,
        language: contentMessage.language,
      })
    );
  store.dispatch(setIncompleteSentence(incompleteSentence));
  store.dispatch(setText(contentMessage.text));

  handleCorrectionsFromCache();
};
