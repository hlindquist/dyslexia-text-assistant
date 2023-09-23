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

import * as vscode from 'vscode';
import { createSpellingSection } from './functions/modules/spelling';
import ChatGPT from './actions/adapters/ChatGPT';
import { debounce } from 'lodash';
import AssistantView from './extension/AssistantView';

export function activate(context: vscode.ExtensionContext) {
  const configuration = vscode.workspace.getConfiguration();
  const apiKey =
    configuration.get<string>('dyslexiaTextAssistant.openAiApiKey') || '';
  const language =
    configuration.get<string>('dyslexiaTextAssistant.language') || '';
  const chat = new ChatGPT(apiKey, language);
  let assistantView: AssistantView | undefined = undefined;

  let debouncedChat = debounce((content: string) => {
    chat.spellcheck(content).then((response) => {
      if (response) {
        const spellingSection = createSpellingSection(content, response);
        assistantView?.updateText(spellingSection);
      }
    });
  }, 1000);

  let lastChange: string | undefined = undefined;
  const handleTextChange = (event: vscode.TextDocumentChangeEvent) => {
    const activeEditor = vscode.window.activeTextEditor;

    if (event.contentChanges.length > 0) {
      const content = activeEditor?.document.getText();
      if (content !== lastChange) {
        lastChange = content;

        if (content) {
          debouncedChat(content);
        }
      }
    }
  };

  vscode.workspace.onDidChangeTextDocument(handleTextChange);

  let assistantViewCommand = vscode.commands.registerCommand(
    'dyslexia-text-assistant.assistantView',
    () => (assistantView = new AssistantView(context))
  );

  context.subscriptions.push(assistantViewCommand);
}
