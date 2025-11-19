import React from 'react';

const SettingsToggleButton = ({
  label,
  isActive,
  onClick,
  activeText,
  inactiveText,
  className = ""
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        {label}
      </label>
      <button
        onClick={onClick}
        className={`w-full px-4 py-2 rounded-lg text-white text-xs font-medium transition-colors ${
          isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } ${className}`}
      >
        {isActive ? activeText : inactiveText}
      </button>
    </div>
  );
};

export default SettingsToggleButton;