import React from 'react';
import './Button.css';

interface Props {
  onClick?: () => void;
  styleType: 'primary' | 'secondary' | 'danger';
  text: string;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({ onClick, styleType, text, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`button ${styleType}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
