import * as React from 'react';
import './App.scss';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { scrollToTarget } from '../actions/utils/browserUtils';
import { transformToHtmlSentences } from '../functions/htmlTextFunctions';
import { insertMissingTokens } from '../functions/tokenFunctions';
import {
  selectCharPosition,
  selectIncompleteSentence,
  selectSentences,
} from '../redux/textAssistantSlice';

const App: React.FC = () => {
  const charPosition = useSelector(selectCharPosition);
  const sentences = useSelector(selectSentences);
  const incompleteSentence = useSelector(selectIncompleteSentence);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const maxRows = [Math.floor((windowHeight - 20 * 4) / (16 * 1.25 * 2))].map(
    (max) => (max < 4 ? 4 : max)
  )[0];

  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWindowHeight);

    return () => {
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  const scrollToCurrentPosition = () => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  };

  useEffect(() => {
    scrollToCurrentPosition();
  }, [charPosition]);

  useEffect(() => {
    window.addEventListener('resize', scrollToCurrentPosition);

    return () => {
      window.removeEventListener('resize', scrollToCurrentPosition);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const modifiedSentences = insertMissingTokens(sentences, charPosition);
  const htmlSentences = transformToHtmlSentences(modifiedSentences);

  const shouldShowIncompleteSentence = () => incompleteSentence.trim() !== '';

  return (
    <div>
      <div className="originalWrapper">
        <div className="original" style={{ maxHeight: 1.25 * maxRows + 'rem' }}>
          {htmlSentences.map((sentence) => (
            <span key={sentence.hash + 'original'}>
              {sentence.needsCorrection && (
                <span className="underCorrection"> </span>
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: sentence.originalHtml || sentence.original,
                }}
                onMouseDown={handleMouseDown}
                onDragStart={handleDragStart}
              />
            </span>
          ))}
          {shouldShowIncompleteSentence() && (
            <>
              <span className="incompleteSentence">{incompleteSentence}</span>
              <span className="endPrompt"></span>
            </>
          )}
        </div>
      </div>
      <div className="correctedWrapper">
        <div
          className="corrected"
          style={{ maxHeight: 1.25 * maxRows + 'rem' }}
        >
          {htmlSentences.map((sentence) => (
            <span key={sentence.hash + 'corrected'}>
              {sentence.needsCorrection && (
                <span className="underCorrection"> </span>
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: sentence.correctedHtml || sentence.original,
                }}
                onMouseDown={handleMouseDown}
                onDragStart={handleDragStart}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
