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

export type ChangeType = 'skipped' | 'added' | 'removed';

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
  ranges: WordChange[];
}

export interface SpellingSection {
  original: EditorSection;
  corrected: EditorSection;
}

export interface DiffChanges {
  original: WordChange[];
  corrected: WordChange[];
}

export interface Conversation {
  role: 'user' | 'assistant';
  content: string;
}

export interface Sentence {
  hash: string;
  original: string;
  corrected?: string;
  originalTokens?: TextToken[];
  correctedTokens?: TextToken[];
  needsCorrection?: boolean;
  underCorrection?: boolean;
}

export interface HtmlSentence {
  hash: string;
  original: string;
  originalHtml: string | undefined;
  correctedHtml: string | undefined;
  needsCorrection?: boolean;
}

export interface SentenceWithConversation extends Sentence {
  conversationPrefix: Sentence[];
}

export interface RestRequest {
  url: string;
  body: any;
  headers: object;
}

export interface AjaxResponse<T> {
  data: T;
  ok: boolean;
  httpCode: number;
  statusText: string;
}

export type Language = 'norwegian' | 'english' | '';

export interface ContentMessage {
  text: string;
  language: Language;
  apiKey: string;
}

export interface ChangeHistory {
  time: string;
  text: string;
  charPosition: CharPosition;
}

export interface TextAssistantState {
  text: string | undefined;
  chatConfiguration: ChatConfiguration;
  charPosition: number | undefined;
  sentences: Sentence[];
  sentencesNeedingCorrection: Sentence[];
  incompleteSentence: string;
  debug: ChangeHistory[];
}

export interface ChatConfiguration {
  apiKey: string;
  language: Language;
}

export interface CorrectionParams extends ChatConfiguration {
  sentence: SentenceWithConversation;
}

export interface Dispatcher {
  dispatch: (action: any) => void;
}

export interface Logger {
  log: (message: string, obj: any) => void;
}

export interface Spellchecker {
  correct: (
    params: CorrectionParams
  ) => Promise<[undefined, Sentence] | [Error, undefined]>;
}

export interface SentenceCacher {
  get: (hash: string) => Sentence | undefined;
  set: (hash: string, sentence: Sentence) => void;
}

export interface TextAssitantStore {}

export interface RegexExtract {
  matched: string;
  text: string;
}
