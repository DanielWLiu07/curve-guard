import React from 'react';
import SettingsSelect from './SettingsSelect';

const SettingsColorSelect = ({
  label,
  value,
  onValueChange,
  className = ""
}) => {
  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'white', label: 'White' }
  ];

  return (
    <SettingsSelect
      label={label}
      value={value}
      onValueChange={onValueChange}
      options={colorOptions}
      placeholder="Select color..."
      className={className}
    />
  );
};

export default SettingsColorSelect;