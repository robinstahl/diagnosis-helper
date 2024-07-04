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
  const { classifyText, loading, error } = useClassifyText();

  const handleDiagnosisRequests = async () => {
    const tinyBrolltPromise = classifyText('TinyBrollt', diagnosis);
    const gelectraLargePromise = classifyText('GelectraLarge', diagnosis);

    const [tinyBrolltRes, gelectraLargeRes] = await Promise.all([
      tinyBrolltPromise,
      gelectraLargePromise,
    ]);

    if (tinyBrolltRes) {
      setTinyBrolltResponse(tinyBrolltRes as DiagnosisResponse);
      console.log(`Diagnose Ergebnis für TinyBrollt:`, tinyBrolltRes);
    }

    if (gelectraLargeRes) {
      setGelectraLargeResponse(gelectraLargeRes as DiagnosisResponse);
      console.log(`Diagnose Ergebnis für GelectraLarge:`, gelectraLargeRes);
    }
  };

  const renderResponse = (response: DiagnosisResponse | null) => {
    if (!response || !response.input) {
      return <p>Noch kein Vergleich möglich, bitte Text eingeben!</p>;
    }

    return (
      <div className="response-container">
        <div className="response-item">
          {response.input.split(' ').map((word, index) => (
            <React.Fragment key={index}>
              <span>
                {word}{' '}
                {response.DIAG.includes(word) && (
                  <Badge badgeType={BadgeTypes.DIAGNOSE} />
                )}
                {response.MED.includes(word) && (
                  <Badge badgeType={BadgeTypes.MEDICINE} />
                )}
                {response.TREAT.includes(word) && (
                  <Badge badgeType={BadgeTypes.TREATMENT} />
                )}{' '}
              </span>
            </React.Fragment>
          ))}
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
              loading ? 'Diagnose wird angefordert...' : 'Diagnose anfordern'
            }
            disabled={loading}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="response-container">
          <div className="response-box">
            <h2>TinyBrollt Response</h2>
            {renderResponse(tinyBrolltResponse)}
          </div>
          <div className="response-box">
            <h2>GelectraLarge Response</h2>
            {renderResponse(gelectraLargeResponse)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiArena;
