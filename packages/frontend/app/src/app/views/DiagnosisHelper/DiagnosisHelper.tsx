import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpeechToText from '../../components/SpeechToText/SpeechToText';
import Tabs from '../../components/Tabs/Tabs';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import useClassifyText from '../../hooks/useClassifyText';
import './DiagnosisHelper.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Table from '../../components/Table/Table';

const DiagnosisHelper: React.FC = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<{ [key: string]: any }[]>([]);
  const { classifyText, loading, error } = useClassifyText();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/requests');
        const result = await response.json();
        setColumns([
          'input_text',
          'missed_tokens',
          'wrong_tokens',
          'generatedResponse',
          'model',
          'timestamp',
        ]);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSpeechToText = (transcript: string) => {
    setDiagnosis(transcript);
  };

  const handleDiagnosisRequest = async (
    model: 'TinyBrollt' | 'GelectraLarge'
  ) => {
    const response = await classifyText(model, diagnosis);
    if (response) {
      console.log(`Diagnose Ergebnis für ${model}:`, response);
      setColumns([
        'input_text',
        'missed_tokens',
        'wrong_tokens',
        'generated_response',
        'model',
        'timestamp',
      ]);
      setData([
        {
          input_text: 'Example Input',
          missed_tokens: 'Token1, Token2',
          wrong_tokens: 'Token3, Token4',
          generated_response: 'Response Text',
          model: 'TinyBrollt',
          timestamp: new Date().toLocaleString(),
        },
      ]);
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
              height="60vh"
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
              height="60vh"
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
    <div className="diagnosis-helper-container">
      <Link to="/" className="back-arrow">
        <AiOutlineArrowLeft />
      </Link>
      <div className="diagnosis-helper">
        <div className="diagnosis-helper__model-tabs">
          <div className="diagnosis-helper__model-tabs__left">
            <Table columns={columns} data={data} />
          </div>
          <div className="diagnosis-helper__model-tabs__right">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHelper;
