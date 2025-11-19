import React from 'react';
import SettingsSelect from './SettingsSelect';

const SettingsStyleSelect = ({
  label,
  value,
  onValueChange,
  className = ""
}) => {
  const styleOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'dashed', label: 'Dashed' }
  ];

  return (
    <SettingsSelect
      label={label}
      value={value}
      onValueChange={onValueChange}
      options={styleOptions}
      placeholder="Select style..."
      className={className}
    />
  );
};

export default SettingsStyleSelect;