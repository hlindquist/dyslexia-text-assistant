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

export type ChangeType = 'skip' | 'added' | 'removed';

export interface WordChange {
  word: string;
  change: ChangeType;
}

export interface TextToken {
  original: string;
  modified?: string;
  type?: ChangeType | 'current';
}

export interface CharPosition {
  line: number;
  character: number;
}

export interface TextPosition {
  line: number;
  character: number;
}

export interface ChatResponse {
  choices?: {
    message?: {
      content: string;
    };
  }[];
}

export interface EditorSection {
  text: string;
  lines: number;
  ranges: WordChange[];
}

export interface SpellingSection {
  original: EditorSection;
  corrected: EditorSection;
}

export interface RestRequest {
  url: string;
  body: any;
  headers: object;
}

export interface AjaxResponse<T> {
  data: T;
}

export interface ContentMessage {
  text: string;
  language: string;
  apiKey: string;
  charPosition: CharPosition;
}

export interface TextAssistantState {
  openAiApiKey: string | undefined;
  language: string | undefined;
  text: string | undefined;
  charPosition: number | undefined;
  spellingSection: SpellingSection | undefined;
  originalTokens: TextToken[] | undefined;
  correctedTokens: TextToken[] | undefined;
  originalHtml: string | undefined;
  correctedHtml: string | undefined;
}
