import React from 'react';
import './Badge.css';

export enum BadgeTypes {
  MEDICINE = 'med',
  DIAGNOSE = 'diag',
  TREATMENT = 'treat',
  INFO = 'info',
}

interface BadgeProps {
  badgeType: BadgeTypes;
  text?: string;
}

const Badge: React.FC<BadgeProps> = ({ badgeType, text }) => {
  const getClassName = () => {
    switch (badgeType) {
      case BadgeTypes.MEDICINE:
        return 'badge badge-medicine';
      case BadgeTypes.DIAGNOSE:
        return 'badge badge-diagnose';
      case BadgeTypes.TREATMENT:
        return 'badge badge-treatment';
      case BadgeTypes.INFO:
        return 'badge badge-info';
      default:
        return 'badge';
    }
  };

  return <span className={getClassName()}>{text}</span>;
};

export default Badge;
