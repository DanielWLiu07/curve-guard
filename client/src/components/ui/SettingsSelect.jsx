import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

const SettingsSelect = ({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = "Select...",
  className = ""
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className={`w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 hover:border-slate-500 text-white h-8 text-xs rounded-lg px-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingsSelect;