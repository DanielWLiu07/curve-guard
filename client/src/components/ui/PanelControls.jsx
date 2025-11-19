import React from 'react';

const PanelControls = ({ isOpen, mode, onToggle, onModeChange }) => {
  return (
    <div className="absolute -left-12 top-8 bottom-8 w-12 bg-slate-800/80 border-r border-slate-600 shadow-lg flex flex-col z-10 rounded-lg overflow-hidden">
      <div
        className={`flex-1 transition-all duration-200 cursor-pointer ${isOpen && mode === 'settings' ? 'shadow-[0_0_30px_rgba(59,130,246,0.5)] bg-slate-700/90 ring-4 ring-blue-500/40' : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:bg-slate-700/90 hover:ring-4 hover:ring-blue-500/40'}`}
        onClick={() => {
          if (mode === 'settings' && isOpen) {
            onToggle();
          } else {
            onModeChange('settings');
          }
        }}
      >
        <button
          className={`w-full h-full transform -rotate-90 text-center py-3 px-2 font-medium text-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center pointer-events-none ${
            isOpen && mode === 'settings' ? 'text-white bg-slate-700 shadow-md shadow-blue-500/20' : 'text-white/60'
          }`}
        >
          {isOpen && mode === 'settings' ? '▶ Settings' : 'Settings'}
        </button>
      </div>
      <div
        className={`flex-1 transition-all duration-200 cursor-pointer ${isOpen && mode === 'data' ? 'shadow-[0_0_30px_rgba(59,130,246,0.5)] bg-slate-700/90 ring-4 ring-blue-500/40' : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:bg-slate-700/90 hover:ring-4 hover:ring-blue-500/40'}`}
        onClick={() => {
          if (mode === 'data' && isOpen) {
            onToggle();
          } else {
            onModeChange('data');
          }
        }}
      >
        <button
          className={`w-full h-full transform -rotate-90 text-center py-3 px-2 font-medium text-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center pointer-events-none ${
            isOpen && mode === 'data' ? 'text-white bg-slate-700 shadow-md shadow-blue-500/20' : 'text-white/60'
          }`}
        >
          {isOpen && mode === 'data' ? '▶ Data' : 'Data'}
        </button>
      </div>
    </div>
  );
};

export default PanelControls;