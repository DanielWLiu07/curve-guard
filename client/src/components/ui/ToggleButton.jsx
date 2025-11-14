import React from 'react';

export const ToggleButton = ({ label, value, onChange, trueText, falseText, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-white text-xs font-medium">
      {label}
    </label>
    <button
      onClick={() => onChange(!value)}
      className={`w-full px-2 py-1 rounded text-xs h-8 transition-colors ${
        value
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      {value ? trueText : falseText}
    </button>
  </div>
);