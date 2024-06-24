import React, { useState } from "react";
import SpeechToText from "../../components/SpeechToText/SpeechToText";
import Tabs from "../../components/Tabs/Tabs";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";

const DiagnosisHelper = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const handleSpeechToText = (transcript: string) => {
    setDiagnosis(transcript);
  };
  const handleDiagnosisRequest = () => {
    console.log("Diagnose anfordern");
  };
  const tabs = [
    {
      label: "Huggingface v.1",
      content: (
        <div className="diagnosis-helper">
          <i className="fa-solid fa-stethoscope"></i>
          <span>
            Bitte geben Sie hier die Symptomatik und Patientendaten an
          </span>
          <SpeechToText onSpeechToText={handleSpeechToText} />
          <TextInput
            value={diagnosis}
            onChange={setDiagnosis}
            height="100%"
            width="100%"
          />
          <div className="button">
            <Button
              onClick={handleDiagnosisRequest}
              styleType={"primary"}
              text={"Diagnose anfordern"}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Huggingface v.2",
      content: (
        <div className="diagnosis-helper">
          <i className="fa-solid fa-stethoscope"></i>
          <span>
            Bitte geben Sie hier die Symptomatik und Patientendaten an
          </span>
          <SpeechToText onSpeechToText={handleSpeechToText} />
          <div className="text-input">
            <TextInput value={diagnosis} onChange={setDiagnosis} />
          </div>
          <div className="button">
            <Button
              onClick={handleDiagnosisRequest}
              styleType={"primary"}
              text={"Diagnose anfordern"}
            />
          </div>
        </div>
      ),
    },
    {
      label: "Feedback",
      content: <div>Bitte gib hier dein Feedback...</div>,
    },
  ];
  return (
    <>
      <Tabs tabs={tabs} />
    </>
  );
};
export default DiagnosisHelper;
