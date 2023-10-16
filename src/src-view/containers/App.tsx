import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  selectCharPosition,
  selectCorrectedTokens,
  selectOriginalTokens,
} from '../redux/textAssistantSlice';
import { scrollToTarget } from '../utils/browserTools';
import { transformTokensToHtml } from '../utils/htmlTextUtil';
import { insertsCharacterPositionToken } from '../functions/tokenUtils';

const App: React.FC = () => {
  const originalTokens = useSelector(selectOriginalTokens);
  const correctedTokens = useSelector(selectCorrectedTokens);
  const charPosition = useSelector(selectCharPosition);

  const scrollToCurrentPosition = () => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  };

  useEffect(() => {
    scrollToCurrentPosition();
  }, [originalTokens, correctedTokens, charPosition]);

  useEffect(() => {
    window.addEventListener('resize', scrollToCurrentPosition);

    return () => {
      window.removeEventListener('resize', scrollToCurrentPosition);
    };
  }, []);

  if (!originalTokens || !correctedTokens) {
    return <></>;
  }
  const originalHtml = transformTokensToHtml(
    insertsCharacterPositionToken(originalTokens, charPosition || 0)
  );
  const correctedHtml = transformTokensToHtml(
    insertsCharacterPositionToken(correctedTokens, charPosition || 0)
  );

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

export default App;
