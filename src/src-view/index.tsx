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

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import json from './mock-data/spellingSection.json';
import { useDebouncedCallback } from 'use-debounce';

import './index.scss';
import {
  CharPosition,
  ContentMessage,
  EditorSection,
  SpellingSection,
} from '../types/types';
import { transformTextToHtml } from './utils/htmlTextUtil';
import ChatGPT from './actions/adapters/ChatGPT';
import { createSpellingSection } from './functions/modules/spelling';

const debug = false;

const charPositionDebug = {
  line: 0,
  character: 220,
};

const App: React.FC = () => {
  const [originalSection, setOriginalSection] = useState<EditorSection>();
  const [correctedSection, setCorrectedSection] = useState<EditorSection>();
  const [original, setOriginal] = useState<string>();
  const [corrected, setCorrected] = useState<string>();
  const [charPosition, setCharPosition] = useState<CharPosition>();
  const [contentMessage, setContentMessage] = useState<ContentMessage>();

  useEffect(() => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  }, [original]);

  useEffect(() => {
    generateWithNewPosition();
  }, [charPosition]);

  const handleResize = () => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const callChat = () => {
    if (
      contentMessage?.text.length > 0 &&
      contentMessage?.apiKey &&
      contentMessage?.language
    ) {
      const chat = new ChatGPT(contentMessage.apiKey, contentMessage.language);
      chat.spellcheck(contentMessage.text).then((response) => {
        if (response) {
          const spellingSection = createSpellingSection(
            contentMessage.text,
            response
          );
          setOriginalSection(spellingSection.original);
          setOriginal(
            transformTextToHtml(spellingSection.original, charPosition)
          );
          setCorrectedSection(spellingSection.corrected);
          setCorrected(
            transformTextToHtml(spellingSection.corrected, charPosition)
          );
        }
      });
    }
  };

  const generateWithNewPosition = () => {
    if (originalSection && correctedSection && charPosition) {
      setOriginal(transformTextToHtml(originalSection, charPosition));
      setCorrected(transformTextToHtml(correctedSection, charPosition));
    }
  };

  const debouncedCallChat = useDebouncedCallback(callChat, 1000);

  useEffect(() => {
    if (
      contentMessage?.text.length > 0 &&
      contentMessage?.apiKey &&
      contentMessage?.language
    ) {
      debouncedCallChat();
    }
  }, [contentMessage]);

  window.addEventListener('message', (event) => {
    if (!debug) {
      const contentMessage: ContentMessage = event?.data.contentMessage;
      if (contentMessage?.text) {
        setContentMessage(contentMessage);
      }

      const messageCharPosition: CharPosition = event?.data?.charPosition;
      if (messageCharPosition?.character) {
        setCharPosition(messageCharPosition);
      }
    }
  });

  React.useEffect(() => {
    if (debug) {
      const spellingSection = json as SpellingSection;
      setOriginal(
        transformTextToHtml(spellingSection.original, charPositionDebug)
      );
      setCorrected(
        transformTextToHtml(spellingSection.corrected, charPositionDebug)
      );
      setCharPosition({ line: 0, character: 20 });
    }
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return original && corrected ? (
    <div>
      <div className="originalWrapper">
        <div
          className="original"
          dangerouslySetInnerHTML={{ __html: original }}
          onMouseDown={handleMouseDown}
          onDragStart={handleDragStart}
        />
      </div>
      <div className="correctedWrapper">
        <div
          className="corrected"
          dangerouslySetInnerHTML={{ __html: corrected }}
          onMouseDown={handleMouseDown}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  ) : (
    <div>No messages</div>
  );
};

function scrollToTarget(parent: string, target: string) {
  const targetSpan = document.querySelector(target) as HTMLElement;

  if (targetSpan) {
    const parentDiv = document.querySelector(parent) as HTMLElement;

    if (parentDiv) {
      const targetPosition = targetSpan.offsetTop;
      const parentHeight = parentDiv.offsetHeight;

      parentDiv.scrollTo({
        top: targetPosition - 16 * 1.25 * getLinesNumber(parentHeight),
        behavior: 'smooth',
      });
    }
  }
}

function getLinesNumber(height: number) {
  // Define the values of the equation
  const leftSide = height / 2;
  const rightSide = 16 * 1.25;

  // Calculate the approximate value of x
  const x = Math.ceil(leftSide / rightSide);

  return x;
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
