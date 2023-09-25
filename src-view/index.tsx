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
import { useState } from 'react';
import { SpellingSection } from './types';
import * as R from 'ramda';
// import json from './mock-data/spellingSection.json';

import './index.css';
import {
  surroundWordsWithSpan,
  transformNewlinesToBreaklines,
} from './utils/htmlTextUtil';

const App: React.FC = () => {
  const [original, setOriginal] = useState<string>();
  const [corrected, setCorrected] = useState<string>();

  const transformTextToHtml = R.pipe(
    surroundWordsWithSpan,
    transformNewlinesToBreaklines
  );

  window.addEventListener('message', (event) => {
    if (event?.data?.original && event?.data?.corrected) {
      const spellingSection = event?.data as SpellingSection;
      setOriginal(transformTextToHtml(spellingSection.original));
      setCorrected(transformTextToHtml(spellingSection.corrected));
    }
  });
  // React.useEffect(() => {
  //   const spellingSection = json as SpellingSection;
  //   setOriginal(surroundWordsWithSpan(spellingSection.original));
  //   setCorrected(surroundWordsWithSpan(spellingSection.corrected));
  // }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return original && corrected ? (
    <>
      <div>
        <div
          className="original"
          dangerouslySetInnerHTML={{ __html: original }}
          onMouseDown={handleMouseDown}
          onDragStart={handleDragStart}
        ></div>
        <div
          className="corrected"
          dangerouslySetInnerHTML={{ __html: corrected }}
          onMouseDown={handleMouseDown}
          onDragStart={handleDragStart}
        ></div>
      </div>
    </>
  ) : (
    <div>No messages</div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
