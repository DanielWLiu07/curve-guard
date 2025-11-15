import React from 'react';

const SettingsInput = ({
  label,
  type = "number",
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  className = ""
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`w-full bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-xs h-8 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${className}`}
      />
    </div>
  );
};

export default SettingsInput;