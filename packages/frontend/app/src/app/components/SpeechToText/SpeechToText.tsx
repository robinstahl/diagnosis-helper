import React, { useState } from "react";
import "./SpeechToText.css";

interface SpeechToTextProps {
  onSpeechToText: (text: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onSpeechToText }) => {
  const [recording, setRecording] = useState(false);

  const handleSpeech = () => {
    const recognition = new ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    recognition.lang = "de-DE";

    if (!recording) {
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSpeechToText(transcript);
      };
    } else {
      recognition.stop();
    }

    setRecording(!recording);
  };

  return (
    <button
      className={`microphone ${recording ? "recording" : ""}`}
      onClick={handleSpeech}
    >
      <i className="fa-solid fa-microphone"></i>
    </button>
  );
};

export default SpeechToText;
