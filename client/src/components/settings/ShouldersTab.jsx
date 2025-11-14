import React from 'react';
import { ToggleButton } from '../ui/ToggleButton';
import { SettingsSlider } from '../ui/SettingsSlider';

export const ShouldersTab = ({ settings, setSettings }) => (
  <>
    <ToggleButton
      label="Enable Shoulder Detection"
      value={settings.enableShoulderDetection}
      onChange={(value) => setSettings({ ...settings, enableShoulderDetection: value })}
      trueText="Disable Shoulder Detection"
      falseText="Enable Shoulder Detection"
    />

    <div className="grid grid-cols-2 gap-4">
      <SettingsSlider
        label="Shoulder Unevenness"
        value={settings.shoulderUnevennessLeniency || 0.1}
        onChange={(value) => setSettings({ ...settings, shoulderUnevennessLeniency: value })}
        min={0.01}
        max={0.3}
        step={0.01}
        displayValue={`${(settings.shoulderUnevennessLeniency * 100).toFixed(1)}%`}
      />

      <SettingsSlider
        label="Shoulder Time Tolerance"
        value={settings.shoulderTimeTolerance || 2}
        onChange={(value) => setSettings({ ...settings, shoulderTimeTolerance: value })}
        min={1}
        max={10}
        step={0.5}
        displayValue={`${settings.shoulderTimeTolerance || 2}s`}
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
              shoulderUnevennessLeniency: 0.1,
              shoulderTimeTolerance: 2
            });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  </>
);