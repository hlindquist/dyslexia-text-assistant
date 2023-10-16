import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import './DebugPane.css';
import { debugContentMessage } from '../actions/extensionListener';

declare const OPENAI_TEST_KEY: string;

const DebugPane = () => {
  const [text, setText] = useState('');
  const [charPosition, setCharPosition] = useState({ line: 0, character: 0 });

  const handleChange = (event) => {
    const newText = event.target.value;

    const selectionStart = event.target.selectionStart;

    const lines = newText.substr(0, selectionStart).split('\n');
    const line = lines.length - 1;
    const character = lines[line].length;

    setCharPosition({ line, character });

    debugContentMessage({
      text: newText,
      language: 'norwegian',
      apiKey: OPENAI_TEST_KEY,
      charPosition: { ...charPosition },
    });
    setText(newText);
  };

  return (
    <div>
      <Resizable
        defaultSize={{
          width: '100%',
          height: '50px',
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
            rows={5}
            cols={40}
            value={text}
            onChange={handleChange}
          ></textarea>
        </div>
      </Resizable>
    </div>
  );
};

export default DebugPane;
