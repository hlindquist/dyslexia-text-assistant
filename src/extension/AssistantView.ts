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

import * as path from 'path';
import * as vscode from 'vscode';
import { SpellingSection } from '../types/types';

class AssistantView {
  private _panel: vscode.WebviewPanel;
  private _extensionPath: string;

  constructor(context: vscode.ExtensionContext) {
    this._panel = vscode.window.createWebviewPanel(
      'assistantView',
      'Text Assistant',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'dist')),
        ],
      }
    );
    this._extensionPath = context.extensionPath;
    this._panel.webview.html = this.getWebviewContent();
  }

  updateText(spellingSection: SpellingSection) {
    this._panel.webview.postMessage(spellingSection);
  }

  private getWebviewContent(): string {
    if (this._extensionPath) {
      const appUri = this._panel?.webview.asWebviewUri(
        vscode.Uri.file(path.join(this._extensionPath, 'dist', 'viewBundle.js'))
      );
      const cssUri = this._panel?.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(this._extensionPath, 'dist', 'viewStyles.css')
        )
      );
      const nonce = generateNonce();
      return `<!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}' 'unsafe-eval'">
            <link rel="stylesheet" type="text/css" href="${cssUri}">
            <title>Assistant View</title>
        </head>
        <body>
            <div id="root">This is a start</div>
          <script src="${appUri}" nonce="${nonce}"></script>
        </body>
      </html>`;
    } else {
      return `<!DOCTYPE html>
      <html lang="en">
      No extension path
      </html>`;
    }
  }
}

export default AssistantView;

function generateNonce(): string {
  const nonceChars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const nonceLength = 32;
  let nonce = '';
  for (let i = 0; i < nonceLength; i++) {
    nonce += nonceChars.charAt(Math.floor(Math.random() * nonceChars.length));
  }
  return nonce;
}
