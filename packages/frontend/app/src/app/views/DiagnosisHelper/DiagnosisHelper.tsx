import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpeechToText from '../../components/SpeechToText/SpeechToText';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import useClassifyText from '../../hooks/useClassifyText';
import './DiagnosisHelper.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Table from '../../components/Table/Table';
import Badge, { BadgeTypes } from '../../components/Badge/Badge';
import Tabs from '../../components/Tabs/Tabs';

interface DiagnosisResponse {
  DIAG: string[];
  MED: string[];
  TREAT: string[];
  input: string;
}

const DiagnosisHelper: React.FC = () => {
  const [addMissedToken_Diag, set_addMissedToken_Diag] = useState('');
  const [addMissedToken_Med, set_addMissedToken_Med] = useState('');
  const [addMissedToken_Treat, set_addMissedToken_Treat] = useState('');

  const [addWrongToken_Diag, set_addWrongToken_Diag] = useState('');
  const [addWrongToken_Med, set_addWrongToken_Med] = useState('');
  const [addWrongToken_Treat, set_addWrongToken_Treat] = useState('');

  const [diagnosis, setDiagnosis] = useState('');
  const [diagnosisId, setDiagnosisId] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<{ [key: string]: React.ReactNode }[]>([]);
  const { classifyText, loading, error } = useClassifyText();
  const [tableVisible, setTableVisible] = useState<boolean>(false);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [tinyBrolltResponse, setTinyBrolltResponse] =
    useState<DiagnosisResponse | null>(null);
  const [gelectraLargeResponse, setGelectraLargeResponse] =
    useState<DiagnosisResponse | null>(null);
  const [tinyBrolltTime, setTinyBrolltTime] = useState<number | null>(null);
  const [gelectraLargeTime, setGelectraLargeTime] = useState<number | null>(
    null
  );
  const [responsesReceived, setResponsesReceived] = useState(0);
  const [selectedTab, setSelectedTab] = useState<
    'TinyBrollt' | 'GelectraLarge'
  >('TinyBrollt');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3030/api/requests');
      const result = await response.json();
      setColumns([
        'ID',
        'Eingegebener Text',
        'Fehlende Token',
        'Falsche Token',
        'Generierte Antwort',
        'Modell',
        'Zeitstempel',
      ]);
      setData(
        result.map((item: any) => ({
          ID: item.id,
          'Eingegebener Text': item.input_text,
          'Fehlende Token': JSON.stringify(item.missed_tokens),
          'Falsche Token': JSON.stringify(item.wrong_tokens),
          'Generierte Antwort':
            typeof item.generatedResponse === 'string'
              ? renderGeneratedResponse(item.generatedResponse)
              : item.generatedResponse,
          Modell: item.model,
          Zeitstempel: formatTimestamp(item.timestamp),
        }))
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Formats the date and time in the local time zone
  };

  const handleSpeechToText = (transcript: string) => {
    setDiagnosis(transcript);
  };

  const sendMissedTokens = async () => {
    const missedTokensData = {
      id: diagnosisId,
      tokens: {
        MED: addMissedToken_Med.split(','),
        DIAG: addMissedToken_Diag.split(','),
        TREAT: addMissedToken_Treat.split(','),
      },
    };

    try {
      const response = await fetch(
        'http://localhost:3030/database/missedToken',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(missedTokensData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send missed tokens');
      }

      console.log('Missed tokens sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending missed tokens:', error);
      return false;
    }
  };

  const sendWrongTokens = async () => {
    const wrongTokensData = {
      id: diagnosisId,
      tokens: {
        MED: addWrongToken_Med.split(','),
        DIAG: addWrongToken_Diag.split(','),
        TREAT: addWrongToken_Treat.split(','),
      },
    };

    try {
      const response = await fetch(
        'http://localhost:3030/database/wrongToken',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(wrongTokensData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send wrong tokens');
      }

      console.log('Wrong tokens sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending wrong tokens:', error);
      return false;
    }
  };

  const handle_feedback = async () => {
    const missedTokensSuccess = await sendMissedTokens();
    const wrongTokensSuccess = await sendWrongTokens();

    if (missedTokensSuccess && wrongTokensSuccess) {
      setFeedbackMessage('Feedback erfolgreich gesendet');
    } else {
      setFeedbackMessage('Fehler beim Senden des Feedbacks');
    }
  };

  const handleDiagnosisRequest = async (
    model: 'TinyBrollt' | 'GelectraLarge'
  ) => {
    const response = await classifyText(model, diagnosis);
    if (response) {
      console.log(`Diagnose Ergebnis für ${model}:`, response);
      if (model === 'TinyBrollt') {
        setTinyBrolltResponse(response);
      } else {
        setGelectraLargeResponse(response);
      }
      fetchData();
    }
  };

  const renderGeneratedResponse = (generatedResponse: string) => {
    try {
      if (!generatedResponse) {
        return <div>Keine Antwort vorhanden</div>;
      }

      const responseObj = JSON.parse(generatedResponse);

      if (!responseObj) {
        return <div>Ungültige Antwort</div>;
      }

      return (
        <div>
          {responseObj.DIAG &&
            responseObj.DIAG.map((diag: string, index: number) => (
              <Badge key={index} badgeType={BadgeTypes.DIAGNOSE} text={diag} />
            ))}
          {responseObj.MED &&
            responseObj.MED.map((med: string, index: number) => (
              <Badge key={index} badgeType={BadgeTypes.MEDICINE} text={med} />
            ))}
          {responseObj.TREAT &&
            responseObj.TREAT.map((treat: string, index: number) => (
              <Badge
                key={index}
                badgeType={BadgeTypes.TREATMENT}
                text={treat}
              />
            ))}
        </div>
      );
    } catch (error) {
      console.error(
        'Error parsing generatedResponse:',
        error,
        generatedResponse
      );
      return <div>Fehler beim Anzeigen der Antwort</div>;
    }
  };

  const renderResponse = (response: DiagnosisResponse | null) => {
    if (!response || !response.input) {
      return <p>Erwarte Text</p>;
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

  const tabs = [
    {
      label: 'Huggingface-TinyBroLLT',
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
      label: 'Huggingface-GelectraLarge',
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
      content: (
        <>
          <div className="diagnosis-helper__model-tabs_feedback_choseDiagnosis">
            <label>ID der Diagnose</label>
            <TextInput
              value={diagnosisId}
              onChange={setDiagnosisId}
              height="4vh"
            />
          </div>

          <div className="diagnosis-helper__model-tabs_feedback_addMissedToken">
            <p>Token die nicht erkannt wurden (Durch komma getrennt)</p>
            <div className="feedback-input-row">
              <div className="feedback-input-container">
                <label>Diagnose</label>
                <TextInput
                  value={addMissedToken_Diag}
                  onChange={set_addMissedToken_Diag}
                  height="4vh"
                />
              </div>
              <div className="feedback-input-container">
                <label>Medikament</label>
                <TextInput
                  value={addMissedToken_Med}
                  onChange={set_addMissedToken_Med}
                  height="4vh"
                />
              </div>
              <div className="feedback-input-container">
                <label>Behandlung</label>
                <TextInput
                  value={addMissedToken_Treat}
                  onChange={set_addMissedToken_Treat}
                  height="4vh"
                />
              </div>
            </div>
          </div>

          <div className="diagnosis-helper__model-tabs_feedback_addWrongToken">
            <p>Token die falsch erkannt wurden (Durch komma getrennt)</p>
            <div className="feedback-input-row">
              <div className="feedback-input-container">
                <label>Diagnose</label>
                <TextInput
                  value={addWrongToken_Diag}
                  onChange={set_addWrongToken_Diag}
                  height="4vh"
                />
              </div>
              <div className="feedback-input-container">
                <label>Medikament</label>
                <TextInput
                  value={addWrongToken_Med}
                  onChange={set_addWrongToken_Med}
                  height="4vh"
                />
              </div>
              <div className="feedback-input-container">
                <label>Behandlung</label>
                <TextInput
                  value={addWrongToken_Treat}
                  onChange={set_addWrongToken_Treat}
                  height="4vh"
                />
              </div>
            </div>
            <div className="diagnosis-helper__model-tabs__button">
              <Button
                onClick={handle_feedback}
                styleType={'primary'}
                text={
                  loading
                    ? 'Korrektur wird hinzugefügt...'
                    : 'Korrektur hinzufügen'
                }
                disabled={loading}
              />
            </div>
            {feedbackMessage && <p>{feedbackMessage}</p>}
          </div>
        </>
      ),
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
            <div className="diagnosis-helper__response">
              <div className="response-box">
                {selectedTab === 'TinyBrollt' && tinyBrolltTime !== null && (
                  <div className="timer">
                    Zeit: {tinyBrolltTime.toFixed(2)} s
                  </div>
                )}
                {selectedTab === 'GelectraLarge' &&
                  gelectraLargeTime !== null && (
                    <div className="timer">
                      Zeit: {gelectraLargeTime.toFixed(2)} s
                    </div>
                  )}
                <h2>{selectedTab}</h2>
                {selectedTab === 'TinyBrollt'
                  ? renderResponse(tinyBrolltResponse)
                  : renderResponse(gelectraLargeResponse)}
              </div>
            </div>
            <div className="badge-container">
              <Badge badgeType={BadgeTypes.DIAGNOSE} text={'DIAGNOSE'} />
              <Badge badgeType={BadgeTypes.MEDICINE} text={'MEDIZIN'} />
              <Badge badgeType={BadgeTypes.TREATMENT} text={'BEHANDLUNG'} />
            </div>
            <div className="diagnosis-helper__controls">
              <Button
                onClick={() => setTableVisible(!tableVisible)}
                styleType={'primary'}
                text={tableVisible ? 'Tabelle verstecken' : 'Tabelle anzeigen'}
              ></Button>
              {tableVisible && (
                <div className="diagnosis-helper__table">
                  <Table columns={columns} data={data} />
                </div>
              )}
            </div>
          </div>
          <div className="diagnosis-helper__model-tabs__right">
            <Tabs
              tabs={tabs}
              onSelect={(tabLabel) =>
                setSelectedTab(tabLabel as 'TinyBrollt' | 'GelectraLarge')
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHelper;
