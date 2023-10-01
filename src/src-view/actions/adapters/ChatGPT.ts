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

import { ChatResponse } from '../../../types/types';
import Ajax from './Ajax';

const API_URL = 'https://api.openai.com/v1/chat/completions';

const createHeaders = (apiKey: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
});

const createPrompt = (promptText: string, language: string) => ({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: `
You are correcting spelling mistakes in all the texts I send you.
Add a period to lines of texts that have a newline, but not a period at the end.
You are conservative when correcting.
You do not delete repeated words or sentences.
You keep lines without period, but with newline, inside the corrected text.
The texts I send you are in ${language}.`,
    },
    { role: 'user', content: promptText },
  ],
  temperature: 0,
  presence_penalty: 0,
  frequency_penalty: 0,
  top_p: 0,
});

const createRequest = (
  promptText: string,
  apiKey: string,
  language: string
) => ({
  url: API_URL,
  body: createPrompt(promptText, language),
  headers: createHeaders(apiKey),
});

class ChatGPT {
  apikey: string;
  language: string;

  constructor(apiKey: string, language: string) {
    this.apikey = apiKey;
    this.language = language;
  }

  spellcheck = async (text: string): Promise<string | undefined> => {
    const request = createRequest(text, this.apikey, this.language);

    const content = Ajax.post<ChatResponse>(request)
      .then((response) => {
        const responseData = response.data;

        if (
          responseData.choices &&
          responseData.choices?.length > 0 &&
          responseData.choices[0].message
        ) {
          return responseData.choices[0].message.content;
        } else {
          return undefined;
        }
      })
      .catch((error) => {
        console.error('Chat message failed', error);
        return undefined;
      });

    return content;
  };
}

export default ChatGPT;
