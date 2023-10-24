import * as React from 'react';
import './App.scss';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  selectCharPosition,
  selectIncompleteSentence,
  selectSentences,
} from '../redux/textAssistantSlice';
import { scrollToTarget } from '../utils/browserTools';
import { insertMissingTokens } from '../functions/tokenUtils';
import {
  transformToHtmlSentences,
  transformToPulsatingBlocks,
} from '../utils/htmlTextUtil';
import { isScrollingEnabled } from '../utils/featureToggle';

const App: React.FC = () => {
  const charPosition = useSelector(selectCharPosition);
  const sentences = useSelector(selectSentences);
  const incompleteSentence = useSelector(selectIncompleteSentence);

  const scrollToCurrentPosition = () => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  };

  useEffect(() => {
    if (isScrollingEnabled()) {
      scrollToCurrentPosition();
    }
  }, [charPosition]);

  useEffect(() => {
    if (isScrollingEnabled()) {
      window.addEventListener('resize', scrollToCurrentPosition);

      return () => {
        window.removeEventListener('resize', scrollToCurrentPosition);
      };
    }
    return undefined;
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
        <div>
          {htmlSentences.map((sentence, index) => (
            <span key={sentence.hash + 'original'}>
              {index > 0 && <span> </span>}
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    sentence.originalHtml ||
                    transformToPulsatingBlocks(sentence.original),
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
        <div>
          {htmlSentences.map((sentence, index) => (
            <span key={sentence.hash + 'corrected'}>
              {index > 0 && <span> </span>}
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    sentence.correctedHtml ||
                    transformToPulsatingBlocks(sentence.original),
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
