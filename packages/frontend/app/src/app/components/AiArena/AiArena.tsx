import React, { useState } from 'react';
import useClassifyText from '../../hooks/useClassifyText';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import './AiArena.css';

const AiArena = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [tinyBrolltResponse, setTinyBrolltResponse] = useState<any>(null);
  const [gelectraLargeResponse, setGelectraLargeResponse] = useState<any>(null);
  const { classifyText, loading, error } = useClassifyText();

  const handleDiagnosisRequests = async () => {
    const tinyBrolltPromise = classifyText('TinyBrollt', diagnosis);
    const gelectraLargePromise = classifyText('GelectraLarge', diagnosis);

    const [tinyBrolltResponse, gelectraLargeResponse] = await Promise.all([
      tinyBrolltPromise,
      gelectraLargePromise,
    ]);

    if (tinyBrolltResponse) {
      setTinyBrolltResponse(tinyBrolltResponse);
      console.log(`Diagnose Ergebnis für TinyBrollt:`, tinyBrolltResponse);
    }

    if (gelectraLargeResponse) {
      setGelectraLargeResponse(gelectraLargeResponse);
      console.log(
        `Diagnose Ergebnis für GelectraLarge:`,
        gelectraLargeResponse
      );
    }
  };

  return (
    <div className="ai-arena">
      <h1>AI Arena</h1>
      <div className="input-button-container">
        <TextInput
          value={diagnosis}
          onChange={setDiagnosis}
          height="20vh"
          width="100%"
        />
        <Button
          onClick={handleDiagnosisRequests}
          styleType={'primary'}
          text={loading ? 'Diagnose wird angefordert...' : 'Diagnose anfordern'}
          disabled={loading}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="response-container">
        <div className="response-box">
          <h2>TinyBrollt Response</h2>
          <pre>
            {tinyBrolltResponse
              ? JSON.stringify(tinyBrolltResponse, null, 2)
              : 'No response yet'}
          </pre>
        </div>
        <div className="response-box">
          <h2>GelectraLarge Response</h2>
          <pre>
            {gelectraLargeResponse
              ? JSON.stringify(gelectraLargeResponse, null, 2)
              : 'No response yet'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AiArena;
