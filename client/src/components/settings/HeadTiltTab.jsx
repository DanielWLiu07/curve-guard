import React from 'react';
import { ToggleButton } from '../ui/ToggleButton';
import { SettingsSlider } from '../ui/SettingsSlider';

export const HeadTiltTab = ({ settings, setSettings }) => (
  <>
    <ToggleButton
      label="Enable Head Tilt Detection"
      value={settings.enableHeadTiltDetection}
      onChange={(value) => setSettings({ ...settings, enableHeadTiltDetection: value })}
      trueText="Disable Head Tilt Detection"
      falseText="Enable Head Tilt Detection"
    />

    <div className="grid grid-cols-2 gap-4">
      <SettingsSlider
        label="Head Tilt Tolerance"
        value={settings.headTiltTolerance || 15}
        onChange={(value) => setSettings({ ...settings, headTiltTolerance: value })}
        min={5}
        max={50}
        step={1}
        displayValue={`${settings.headTiltTolerance || 15}°`}
      />

      <SettingsSlider
        label="Head Tilt Time Tolerance"
        value={settings.headTiltTimeTolerance || 2}
        onChange={(value) => setSettings({ ...settings, headTiltTimeTolerance: value })}
        min={1}
        max={10}
        step={0.5}
        displayValue={`${settings.headTiltTimeTolerance || 2}s`}
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
              headTiltTolerance: 15,
              headTiltTimeTolerance: 2
            });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  </>
);