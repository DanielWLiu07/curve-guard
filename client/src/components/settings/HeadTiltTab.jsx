import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsSlider from '../ui/SettingsSlider';

const HeadTiltTab = ({ settings, setSettings }) => {
  return (
    <div className="space-y-3">
      <SettingsButton
        label="Enable Head Tilt Detection"
        isActive={settings.enableHeadTiltDetection}
        onClick={() => {
          const newValue = !settings.enableHeadTiltDetection;
          setSettings({...settings, enableHeadTiltDetection: newValue});
        }}
        activeText="Disable Head Tilt Detection"
        inactiveText="Enable Head Tilt Detection"
      />

      <SettingsSlider
        label="Head Tilt Tolerance"
        value={[settings.headTiltTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, headTiltTolerance: value});
        }}
        min={5}
        max={50}
        step={1}
        displayValue={settings.headTiltTolerance}
        unit="°"
      />

      <SettingsSlider
        label="Head Tilt Time Tolerance"
        value={[settings.headTiltTimeTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, headTiltTimeTolerance: value});
        }}
        min={1}
        max={10}
        step={0.5}
        displayValue={settings.headTiltTimeTolerance}
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
              headTiltTolerance: 15,
              headTiltTimeTolerance: 2
            });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default HeadTiltTab;
