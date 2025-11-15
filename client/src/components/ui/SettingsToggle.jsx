import React from 'react';
import { Switch } from '@radix-ui/react-switch';

const SettingsToggle = ({
  label,
  checked,
  onCheckedChange,
  className = ""
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={className}
        />
        <span className="text-slate-400 text-xs">
          {checked ? 'On' : 'Off'}
        </span>
      </div>
    </div>
  );
};

export default SettingsToggle;