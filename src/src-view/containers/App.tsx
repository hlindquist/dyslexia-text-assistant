import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  selectCorrectedHtml,
  selectOriginalHtml,
} from '../redux/textAssistantSlice';
import { scrollToTarget } from '../utils/browserTools';

const App: React.FC = () => {
  const originalHtml = useSelector(selectOriginalHtml);
  const correctedHtml = useSelector(selectCorrectedHtml);

  const handleResize = () => {
    scrollToTarget('.original', '.currentPosition');
    scrollToTarget('.corrected', '.currentPosition');
  };

  useEffect(() => {
    handleResize();
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

export default App;
