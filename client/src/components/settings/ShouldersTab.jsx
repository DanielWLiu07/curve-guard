import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsSlider from '../ui/SettingsSlider';

const ShouldersTab = ({ settings, setSettings }) => {
  return (
    <div className="space-y-3">
      <SettingsButton
        label="Enable Shoulder Detection"
        isActive={settings.enableShoulderDetection}
        onClick={() => {
          const newValue = !settings.enableShoulderDetection;
          setSettings({...settings, enableShoulderDetection: newValue});
        }}
        activeText="Disable Shoulder Detection"
        inactiveText="Enable Shoulder Detection"
      />

      <SettingsSlider
        label="Shoulder Unevenness"
        value={[settings.shoulderUnevennessLeniency]}
        onValueChange={([value]) => setSettings({...settings, shoulderUnevennessLeniency: value})}
        min={0.01}
        max={0.3}
        step={0.01}
        displayValue={(settings.shoulderUnevennessLeniency * 100).toFixed(1)}
        unit="%"
      />

      <SettingsSlider
        label="Shoulder Time Tolerance"
        value={[settings.shoulderTimeTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, shoulderTimeTolerance: value});
        }}
        min={1}
        max={10}
        step={0.5}
        displayValue={settings.shoulderTimeTolerance}
        unit="s"
      />

      <div className="space-y-2">
        <label className="block text-white text-xs font-medium">
          Reset Settings
        </label>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs h-8 transition-colors"
          onClick={() => {
            setSettings({
              ...settings,
              shoulderUnevennessLeniency: 0.1,
              shoulderTimeTolerance: 2
            });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ShouldersTab;
