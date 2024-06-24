import React from "react";
import "./Badge.css";

export enum BadgeTypes {
  MEDICINE = "med",
  DIAGNOSE = "diag",
  TREATMENT = "treat",
  INFO = "info",
}

interface BadgeProps {
  badgeType: BadgeTypes;
}

const Badge: React.FC<BadgeProps> = ({ badgeType }) => {
  return (
    <span className={`badge badge-${badgeType}`}>
      {badgeType.toUpperCase()}
    </span>
  );
};

export default Badge;
