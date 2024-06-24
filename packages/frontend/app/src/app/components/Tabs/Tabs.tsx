import React, { useState } from "react";
import "./Tabs.css";

type TabProps = {
  tabs: { label: string; content: React.ReactNode }[];
};

const Tabs: React.FC<TabProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="tab-container">
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-header ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeIndex].content}</div>
    </div>
  );
};

export default Tabs;
