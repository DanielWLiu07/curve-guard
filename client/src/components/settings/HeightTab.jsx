import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsSlider from '../ui/SettingsSlider';

const HeightTab = ({ settings, setSettings, onCalibrateHeight }) => {
  return (
    <div className="space-y-3">
      <SettingsButton
        label="Enable Height Detection"
        isActive={settings.enableHeightDetection}
        onClick={() => {
          const newValue = !settings.enableHeightDetection;
          setSettings({...settings, enableHeightDetection: newValue});
        }}
        activeText="Disable Height Detection"
        inactiveText="Enable Height Detection"
      />

      <SettingsSlider
        label="Eye Height Tolerance (px)"
        value={[settings.eyeHeightTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, eyeHeightTolerance: value});
        }}
        min={5}
        max={100}
        step={5}
        displayValue={settings.eyeHeightTolerance}
        unit="px"
      />

      <SettingsSlider
        label="Eye Height Time Tolerance"
        value={[settings.eyeHeightTimeTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, eyeHeightTimeTolerance: value});
        }}
        min={1}
        max={10}
        step={0.5}
        displayValue={settings.eyeHeightTimeTolerance}
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
              eyeHeightTolerance: 20,
              eyeHeightTimeTolerance: 3
            });
          }}
        >
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-white text-xs font-medium">
          Height Calibration
        </label>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs h-8 transition-colors"
          onClick={onCalibrateHeight}
        >
          Calibrate
        </button>
      </div>
    </div>
  );
};

export default HeightTab;
