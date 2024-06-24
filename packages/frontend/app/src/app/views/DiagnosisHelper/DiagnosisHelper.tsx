import React, { useState } from 'react';
import SpeechToText from '../../components/SpeechToText/SpeechToText';
import Tabs from '../../components/Tabs/Tabs';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import './DiagnosisHelper.css';

const DiagnosisHelper = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const handleSpeechToText = (transcript: string) => {
    setDiagnosis(transcript);
  };
  const handleDiagnosisRequest = () => {
    console.log('Diagnose anfordern');
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
              onClick={handleDiagnosisRequest}
              styleType={'primary'}
              text={'Diagnose anfordern'}
            />
          </div>
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
              onClick={handleDiagnosisRequest}
              styleType={'primary'}
              text={'Diagnose anfordern'}
            />
          </div>
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
          {/* Hier können zusätzliche Inhalte für die linke Seite eingefügt werden */}
        </div>
        <div className="diagnosis-helper__model-tabs__right">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};
export default DiagnosisHelper;
