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
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import './index.scss';
import './actions/extensionListener';
import { Provider } from 'react-redux';
import store from './redux/store';
import {
  selectCorrectedHtml,
  selectOriginalHtml,
} from './redux/textAssistantSlice';

const App: React.FC = () => {
  const originalHtml = useSelector(selectOriginalHtml);
  const correctedHtml = useSelector(selectCorrectedHtml);

  const handleResize = () => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  };

  useEffect(() => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  }, [originalHtml, correctedHtml]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return originalHtml && correctedHtml ? (
    <div>
      <div className="originalWrapper">
        <div
          className="original"
          dangerouslySetInnerHTML={{ __html: originalHtml }}
          onMouseDown={handleMouseDown}
          onDragStart={handleDragStart}
        />
      </div>
      <div className="correctedWrapper">
        <div
          className="corrected"
          dangerouslySetInnerHTML={{ __html: correctedHtml }}
          onMouseDown={handleMouseDown}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  ) : (
    <></>
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
  const leftSide = height / 2;
  const rightSide = 16 * 1.25;

  const x = Math.ceil(leftSide / rightSide);

  return x;
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
