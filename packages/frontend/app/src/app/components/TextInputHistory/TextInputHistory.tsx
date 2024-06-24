import React, { useState } from 'react';
import './TextInputHistory.css';

interface Props {
  maxLength: number;
}

const TextInputHistory: React.FC<Props> = ({ maxLength }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = () => {
    if (inputValue.trim() !== '') {
      setHistory(prevHistory => [inputValue, ...prevHistory.slice(0, maxLength - 1)]);
      setInputValue('');
    }
  };

  return (
    <div className="text-input-history">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Gib hier etwas ein"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addToHistory();
          }
        }}
      />
      <button onClick={addToHistory}>Hinzufügen</button>
      <div className="history-list">
        <h3>Letzte Eingaben:</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TextInputHistory;
