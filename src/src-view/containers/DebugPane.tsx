import { Resizable } from 're-resizable';
import React, { useState } from 'react';
import {
  debugCharPosition,
  debugContentMessage,
} from '../actions/extensionListener';
import './DebugPane.css';

declare const OPENAI_TEST_KEY: string;

const DebugPane = () => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    const newText = event.target.value;

    debugContentMessage({
      text: newText,
      language: 'norwegian',
      apiKey: OPENAI_TEST_KEY,
    });
    setText(newText);
  };

  const handleKeyUp = (event) => {
    const selectionStart = event.target.selectionStart;

    debugCharPosition(selectionStart);
  };

  return (
    <div>
      <Resizable
        defaultSize={{
          width: '100%',
          height: '180px',
        }}
        enable={{
          top: true,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        style={{ position: 'absolute', bottom: '0' }}
      >
        <div className="debug-tools">
          <textarea
            rows={10}
            cols={60}
            value={text}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
          ></textarea>
        </div>
      </Resizable>
    </div>
  );
};

export default DebugPane;
