import React from "react";
import "./TextInput.css";

const texts = {
  placeholder: "Erwarte Daten...",
};

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  width,
  height,
  style,
}) => {
  return (
    <div className="text-input-container" style={{ width, height, ...style }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={texts.placeholder}
        className="text-input"
      />
    </div>
  );
};

export default TextInput;
