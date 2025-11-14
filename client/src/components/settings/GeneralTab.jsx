import React from 'react';
import { ToggleButton } from '../ui/ToggleButton';
import { ColorSelect } from '../ui/ColorSelect';

export const GeneralTab = ({ settings, setSettings }) => (
  <div className="grid grid-cols-2 gap-4">
    <ToggleButton
      label="Show Landmarks"
      value={settings.showLandmarks}
      onChange={(value) => setSettings({ ...settings, showLandmarks: value })}
      trueText="Hide Landmarks"
      falseText="Show Landmarks"
    />

    <ToggleButton
      label="Record Data"
      value={settings.isRecording}
      onChange={(value) => setSettings({ ...settings, isRecording: value })}
      trueText="Stop Recording"
      falseText="Start Recording"
    />

    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        Landmark Radius
      </label>
      <input
        type="number"
        value={settings.landmarkRadius || 3}
        onChange={(e) => setSettings({ ...settings, landmarkRadius: parseInt(e.target.value) || 1 })}
        className="w-full bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-xs h-8"
        min="1"
        max="20"
        step="1"
      />
    </div>

    <ColorSelect
      value={settings.landmarkColor}
      onChange={(value) => setSettings({ ...settings, landmarkColor: value })}
    />
  </div>
);