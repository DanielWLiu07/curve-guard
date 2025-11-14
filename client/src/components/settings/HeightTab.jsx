import React from 'react';
import { ToggleButton } from '../ui/ToggleButton';
import { SettingsSlider } from '../ui/SettingsSlider';

export const HeightTab = ({ settings, setSettings, onCalibrateHeight }) => (
  <>
    <ToggleButton
      label="Enable Height Detection"
      value={settings.enableHeightDetection}
      onChange={(value) => setSettings({ ...settings, enableHeightDetection: value })}
      trueText="Disable Height Detection"
      falseText="Enable Height Detection"
    />

    <div className="grid grid-cols-2 gap-4">
      <SettingsSlider
        label="Eye Height Tolerance (px)"
        value={settings.eyeHeightTolerance || 20}
        onChange={(value) => setSettings({ ...settings, eyeHeightTolerance: value })}
        min={5}
        max={100}
        step={5}
        displayValue={`${settings.eyeHeightTolerance || 20}px`}
      />

      <SettingsSlider
        label="Eye Height Time Tolerance"
        value={settings.eyeHeightTimeTolerance || 3}
        onChange={(value) => setSettings({ ...settings, eyeHeightTimeTolerance: value })}
        min={1}
        max={10}
        step={0.5}
        displayValue={`${settings.eyeHeightTimeTolerance || 3}s`}
      />

      <div className="space-y-2 col-span-2">
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

      <div className="space-y-2 col-span-2">
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
  </>
);