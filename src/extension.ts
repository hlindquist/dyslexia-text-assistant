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
import { isEqual } from 'lodash';
import AssistantView from './extension/AssistantView';
import { CharPosition, Language } from './types/types';
import check from 'check-types';

const getConfiguredLanguage = (
  configuration: vscode.WorkspaceConfiguration
) => {
  const language = (configuration.get<string>(
    'dyslexiaTextAssistant.language'
  ) || '') as Language;

  check.assert.in(language, ['norwegian', 'english', '']);
  return language;
};

const getConfiguredApiKey = (configuration: vscode.WorkspaceConfiguration) => {
  return configuration.get<string>('dyslexiaTextAssistant.openAiApiKey') || '';
};

export function activate(context: vscode.ExtensionContext) {
  let assistantView: AssistantView | undefined = undefined;

  let lastChange: string | undefined = undefined;
  const handleTextChange = (event: vscode.TextDocumentChangeEvent) => {
    if (event?.contentChanges?.length > 0) {
      const activeEditor = vscode.window.activeTextEditor;

      const text = activeEditor?.document.getText();
      if (text !== lastChange) {
        const configuration = vscode.workspace.getConfiguration();
        const apiKey = getConfiguredApiKey(configuration);
        const language = getConfiguredLanguage(configuration);
        const charPosition = activeEditor?.selection.active as CharPosition;
        lastChange = text;

        if (text) {
          assistantView?.updateText({
            text,
            language,
            apiKey,
            charPosition,
          });
        }
      }
    }
  };

  vscode.workspace.onDidChangeTextDocument(handleTextChange);

  let lastPosition: CharPosition | undefined = undefined;
  vscode.window.onDidChangeTextEditorSelection((event) => {
    if (!isEqual(lastPosition, event.textEditor.selection.active)) {
      assistantView?.updatePosition(event.textEditor.selection.active);
      lastPosition = event.textEditor.selection.active;
    }
  });

  let assistantViewCommand = vscode.commands.registerCommand(
    'dyslexia-text-assistant.assistantView',
    () => (assistantView = new AssistantView(context))
  );

  context.subscriptions.push(assistantViewCommand);
}
