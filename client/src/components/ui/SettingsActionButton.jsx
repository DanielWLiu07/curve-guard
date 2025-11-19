import React from 'react';

const SettingsActionButton = ({
  label,
  onClick,
  buttonText,
  variant = 'primary',
  className = ""
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        {label}
      </label>
      <button
        onClick={onClick}
        className={`w-full px-2 py-1 rounded text-xs h-8 transition-colors text-white ${variantStyles[variant]} ${className}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SettingsActionButton;