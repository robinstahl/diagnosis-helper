import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useClassifyText from '../../hooks/useClassifyText';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import Badge, { BadgeTypes } from '../../components/Badge/Badge';
import './AiArena.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';

interface DiagnosisResponse {
  DIAG: string[];
  MED: string[];
  TREAT: string[];
  input: string;
}

const AiArena = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [tinyBrolltResponse, setTinyBrolltResponse] =
    useState<DiagnosisResponse | null>(null);
  const [gelectraLargeResponse, setGelectraLargeResponse] =
    useState<DiagnosisResponse | null>(null);
  const [tinyBrolltTime, setTinyBrolltTime] = useState<number | null>(null);
  const [gelectraLargeTime, setGelectraLargeTime] = useState<number | null>(
    null
  );
  const [responsesReceived, setResponsesReceived] = useState(0);
  const { classifyText, loading, error } = useClassifyText();

  const handleDiagnosisRequests = async () => {
    setTinyBrolltResponse(null);
    setTinyBrolltTime(null);
    setGelectraLargeResponse(null);
    setGelectraLargeTime(null);
    setResponsesReceived(0);

    const startTimeTinyBrollt = performance.now();
    classifyText('TinyBrollt', diagnosis).then((response) => {
      const endTimeTinyBrollt = performance.now();
      setTinyBrolltResponse(response as DiagnosisResponse);
      setTinyBrolltTime((endTimeTinyBrollt - startTimeTinyBrollt) / 1000);
      setResponsesReceived((prev) => prev + 1);
      console.log(`Diagnose Ergebnis für TinyBrollt:`, response);
    });

    const startTimeGelectraLarge = performance.now();
    classifyText('GelectraLarge', diagnosis).then((response) => {
      const endTimeGelectraLarge = performance.now();
      setGelectraLargeResponse(response as DiagnosisResponse);
      setGelectraLargeTime(
        (endTimeGelectraLarge - startTimeGelectraLarge) / 1000
      );
      setResponsesReceived((prev) => prev + 1);
      console.log(`Diagnose Ergebnis für GelectraLarge:`, response);
    });

    setResponsesReceived(0);
  };

  const renderResponse = (response: DiagnosisResponse | null) => {
    if (!response || !response.input) {
      return <p>Noch kein Vergleich möglich, bitte Text eingeben!</p>;
    }

    return (
      <div className="response-container">
        <div className="response-item">
          {response.input.split(' ').map((word, index) => {
            if (response.DIAG.includes(word)) {
              return (
                <React.Fragment key={index}>
                  <Badge badgeType={BadgeTypes.DIAGNOSE} text={word} />{' '}
                </React.Fragment>
              );
            } else if (response.MED.includes(word)) {
              return (
                <React.Fragment key={index}>
                  <Badge badgeType={BadgeTypes.MEDICINE} text={word} />{' '}
                </React.Fragment>
              );
            } else if (response.TREAT.includes(word)) {
              return (
                <React.Fragment key={index}>
                  <Badge badgeType={BadgeTypes.TREATMENT} text={word} />{' '}
                </React.Fragment>
              );
            } else {
              return <span key={index}>{word} </span>;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ai-arena-container">
      <Link to="/" className="back-arrow">
        <AiOutlineArrowLeft size={24} />
      </Link>
      <div className="ai-arena">
        <h1>AI Arena</h1>
        <div className="input-container">
          <TextInput
            value={diagnosis}
            onChange={setDiagnosis}
            height="30vh"
            width="100%"
          />
        </div>
        <div className="button-container">
          <Button
            onClick={handleDiagnosisRequests}
            styleType={'primary'}
            text={
              loading
                ? 'Diagnose wird angefordert...'
                : responsesReceived < 2
                ? 'Warte auf letzte Antwort...'
                : 'Diagnose anfordern'
            }
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="response-container">
          <div className="response-box">
            {tinyBrolltTime !== null && (
              <div className="timer">Zeit: {tinyBrolltTime.toFixed(2)} s</div>
            )}
            <h2>TinyBrollt</h2>
            {renderResponse(tinyBrolltResponse)}
          </div>
          <div className="response-box">
            {gelectraLargeTime !== null && (
              <div className="timer">
                Zeit: {gelectraLargeTime.toFixed(2)} s
              </div>
            )}
            <h2>GelectraLarge</h2>
            {renderResponse(gelectraLargeResponse)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiArena;
