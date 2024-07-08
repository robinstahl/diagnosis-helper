import React from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  onSelect: (tabLabel: 'TinyBrollt' | 'GelectraLarge') => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, onSelect }) => {
  const [selectedTab, setSelectedTab] = React.useState<
    'TinyBrollt' | 'GelectraLarge'
  >(tabs[0].label as 'TinyBrollt' | 'GelectraLarge');

  const handleTabClick = (tab: Tab) => {
    const tabLabel = tab.label as 'TinyBrollt' | 'GelectraLarge';
    setSelectedTab(tabLabel);
    onSelect(tabLabel);
  };

  return (
    <div className="tab-container">
      <div className="tab-headers">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`tab-header ${
              selectedTab === tab.label ? 'active' : ''
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.find((tab) => tab.label === selectedTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
