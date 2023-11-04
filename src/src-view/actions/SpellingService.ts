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

import store from '../redux/store';
import {
  addToDebugHistory,
  setIncompleteSentence,
  setText,
} from '../redux/textAssistantSlice';
import { getTimeInMilliseconds } from './utils/timeTools';
import { extractIncompleteSentence } from './utils/textUtils';
import { checkApiKey, checkLanguage } from '../../utils/generalUtils';
import { checkSpelling } from './utils/spellingUtils';

class SpellingService {
  static handleContentMessage = async (contentMessage) => {
    try {
      checkApiKey(contentMessage.apiKey);
      checkLanguage(contentMessage.language);

      store.dispatch(setText(contentMessage.text));
      store.dispatch(
        addToDebugHistory({
          time: getTimeInMilliseconds(),
          text: contentMessage.text,
        })
      );

      const incompleteSentence = extractIncompleteSentence(contentMessage.text);
      store.dispatch(setIncompleteSentence(incompleteSentence));

      const sentences = store.getState().textAssistant.sentences;
      await Promise.all(checkSpelling(contentMessage, sentences));
    } catch (error) {
      console.error(error);
    }
  };
}

export default SpellingService;
