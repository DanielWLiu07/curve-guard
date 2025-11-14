import React from 'react';
import { Switch } from '@radix-ui/react-switch';
import { SettingsSlider } from '../ui/SettingsSlider';
import { SoundSelect } from '../ui/SoundSelect';

export const AlertsTab = ({ settings, setSettings }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        Audio Alerts
      </label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={settings.enableAudioAlerts}
          onCheckedChange={(checked) => setSettings({ ...settings, enableAudioAlerts: checked })}
        />
        <span className="text-slate-400 text-xs">
          {settings.enableAudioAlerts ? 'On' : 'Off'}
        </span>
      </div>
    </div>

    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        Visual Alerts
      </label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={settings.enableVisualAlerts}
          onCheckedChange={(checked) => setSettings({ ...settings, enableVisualAlerts: checked })}
        />
        <span className="text-slate-400 text-xs">
          {settings.enableVisualAlerts ? 'On' : 'Off'}
        </span>
      </div>
    </div>

    <SettingsSlider
      label="Alert Cooldown"
      value={settings.alertCooldown}
      onChange={(value) => setSettings({ ...settings, alertCooldown: value })}
      min={5}
      max={120}
      step={5}
      displayValue={`${settings.alertCooldown}s`}
    />

    <SoundSelect
      value={settings.alertSound}
      onChange={(value) => setSettings({ ...settings, alertSound: value })}
    />
  </div>
);