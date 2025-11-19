import React from 'react';

const PanelHeader = ({ mode }) => {
  return (
    <div className="p-3 border-b border-slate-700 flex-shrink-0">
      <h2 className="text-base font-semibold text-white">
        {mode === 'settings' ? 'Settings' : 'Data & Recording'}
      </h2>
    </div>
  );
};

const PanelContent = ({ mode, settingsContent, dataContent }) => {
  return (
    <div className="flex-1 p-3 overflow-y-auto min-h-0">
      {mode === 'settings' ? settingsContent : dataContent}
    </div>
  );
};

export { PanelHeader, PanelContent };