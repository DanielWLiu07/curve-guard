import React from 'react';
import SettingsToggle from '../ui/SettingsToggle';
import SettingsSlider from '../ui/SettingsSlider';
import SettingsSelect from '../ui/SettingsSelect';

const AlertsTab = ({ settings, setSettings }) => {
  return (
    <div className="space-y-3">
      <SettingsToggle
        label="Audio Alerts"
        checked={settings.enableAudioAlerts}
        onCheckedChange={(checked) => setSettings({...settings, enableAudioAlerts: checked})}
      />

      <SettingsToggle
        label="Visual Alerts"
        checked={settings.enableVisualAlerts}
        onCheckedChange={(checked) => setSettings({...settings, enableVisualAlerts: checked})}
      />

      <SettingsSlider
        label="Alert Cooldown"
        value={[settings.alertCooldown]}
        onValueChange={([value]) => setSettings({...settings, alertCooldown: value})}
        min={5}
        max={120}
        step={5}
        displayValue={settings.alertCooldown}
        unit="s"
      />

      <SettingsSelect
        label="Alert Sound"
        value={settings.alertSound}
        onValueChange={(value) => setSettings({...settings, alertSound: value})}
        options={[
          { value: 'beep', label: 'Beep' },
          { value: 'chime', label: 'Chime' },
          { value: 'bell', label: 'Bell' },
          { value: 'none', label: 'None' }
        ]}
      />
    </div>
  );
};

export default AlertsTab;
