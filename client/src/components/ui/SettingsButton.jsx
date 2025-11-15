import React from 'react';

const SettingsButton = ({
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
        className={`w-full px-2 py-1 rounded text-xs h-8 transition-colors ${
          isActive
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        } ${className}`}
      >
        {isActive ? activeText : inactiveText}
      </button>
    </div>
  );
};

export default SettingsButton;