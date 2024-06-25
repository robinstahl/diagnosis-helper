import React, { useState } from 'react';
import SpeechToText from '../../components/SpeechToText/SpeechToText';
import Tabs from '../../components/Tabs/Tabs';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import useClassifyText from '../../hooks/useClassifyText';
import './DiagnosisHelper.css';
import AiArena from '../../components/AiArena/AiArena';

const DiagnosisHelper = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const { classifyText, loading, error } = useClassifyText();

  const handleSpeechToText = (transcript: string) => {
    setDiagnosis(transcript);
  };

  const handleDiagnosisRequest = async (
    model: 'TinyBrollt' | 'GelectraLarge'
  ) => {
    const response = await classifyText(model, diagnosis);
    if (response) {
      console.log(`Diagnose Ergebnis für ${model}:`, response);
    }
  };

  const tabs = [
    {
      label: 'Huggingface v.1',
      content: (
        <>
          <span>
            Bitte geben Sie hier die Symptomatik und Patientendaten an
          </span>
          <SpeechToText onSpeechToText={handleSpeechToText} />
          <div className="diagnosis-helper__model-tabs__text-input">
            <TextInput
              value={diagnosis}
              onChange={setDiagnosis}
              height="70vh"
              width="100%"
            />
          </div>
          <div className="diagnosis-helper__model-tabs__button">
            <Button
              onClick={() => handleDiagnosisRequest('TinyBrollt')}
              styleType={'primary'}
              text={
                loading ? 'Diagnose wird angefordert...' : 'Diagnose anfordern'
              }
              disabled={loading}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      ),
    },
    {
      label: 'Huggingface v.2',
      content: (
        <>
          <span>
            Bitte geben Sie hier die Symptomatik und Patientendaten an
          </span>
          <SpeechToText onSpeechToText={handleSpeechToText} />
          <div className="diagnosis-helper__model-tabs__text-input">
            <TextInput
              value={diagnosis}
              onChange={setDiagnosis}
              height="70vh"
              width="100%"
            />
          </div>
          <div className="diagnosis-helper__model-tabs__button">
            <Button
              onClick={() => handleDiagnosisRequest('GelectraLarge')}
              styleType={'primary'}
              text={
                loading ? 'Diagnose wird angefordert...' : 'Diagnose anfordern'
              }
              disabled={loading}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      ),
    },
    {
      label: 'Feedback',
      content: <div>Bitte gib hier dein Feedback...</div>,
    },
  ];

  return (
    <div className="diagnosis-helper">
      <div className="diagnosis-helper__model-tabs">
        <div className="diagnosis-helper__model-tabs__left">
          <AiArena />
        </div>
        <div className="diagnosis-helper__model-tabs__right">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHelper;
