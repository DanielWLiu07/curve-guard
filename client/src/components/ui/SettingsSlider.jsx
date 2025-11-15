import React from 'react';
import { Slider } from './SettingsSliderPrimitive';

const SettingsSlider = ({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  displayValue,
  unit = "",
  className = ""
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        {label}
      </label>
      <Slider
        value={value}
        onValueChange={onValueChange}
        max={max}
        min={min}
        step={step}
        className={`w-full ${className}`}
      />
      <div className="text-center text-slate-400 text-xs">
        {displayValue || value}{unit}
      </div>
    </div>
  );
};

export default SettingsSlider;
