import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import './DebugPane.css';
import { debugContentMessage } from '../actions/extensionListener';

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

  return (
    <div>
      <Resizable
        defaultSize={{
          width: '100%',
          height: '180px',
        }}
        enable={{
          top: true,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        style={{ position: 'absolute', bottom: '0', border: '1px solid black' }}
      >
        <div className="debug-tools">
          <textarea
            rows={10}
            cols={120}
            value={text}
            onChange={handleChange}
          ></textarea>
        </div>
      </Resizable>
    </div>
  );
};

export default DebugPane;
