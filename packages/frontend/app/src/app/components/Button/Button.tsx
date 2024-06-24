import React from "react";
import "./Button.css";

interface Props {
  onClick: () => void;
  styleType: "primary" | "secondary" | "danger";
  text: string;
}

const Button: React.FC<Props> = ({ onClick, styleType, text }) => {
  return (
    <button onClick={onClick} className={`button ${styleType}`}>
      {text}
    </button>
  );
};

export default Button;
