import React from 'react';
import SettingsSelect from '../ui/SettingsSelect';
import SettingsColorSelect from '../ui/SettingsColorSelect';
import SettingsStyleSelect from '../ui/SettingsStyleSelect';
import SettingsToggleButton from '../ui/SettingsToggleButton';
import SettingsSlider from '../ui/SettingsSlider';
import SettingsActionButton from '../ui/SettingsActionButton';

const AlertsTab = ({ settings, setSettings }) => {
  return (
    <div className="space-y-3">
      <SettingsToggleButton
        label="Audio Alerts"
        isActive={settings.enableAudioAlerts}
        onClick={() => setSettings({...settings, enableAudioAlerts: !settings.enableAudioAlerts})}
        activeText="Disable Audio Alerts"
        inactiveText="Enable Audio Alerts"
      />

      <SettingsToggleButton
        label="Visual Alerts"
        isActive={settings.enableVisualAlerts}
        onClick={() => setSettings({...settings, enableVisualAlerts: !settings.enableVisualAlerts})}
        activeText="Disable Visual Alerts"
        inactiveText="Enable Visual Alerts"
      />

      <SettingsSlider
        label="Alert Volume"
        value={[settings.alertVolume]}
        onValueChange={(value) => setSettings({...settings, alertVolume: value[0]})}
        min={0}
        max={100}
        unit="%"
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

      <SettingsColorSelect
        label="Error Bar Color"
        value={settings.errorBarColor || 'red'}
        onValueChange={(value) => setSettings({...settings, errorBarColor: value})}
      />

      <SettingsStyleSelect
        label="Error Bar Border Style"
        value={settings.errorBarBorderStyle || 'solid'}
        onValueChange={(value) => setSettings({...settings, errorBarBorderStyle: value})}
      />

      <SettingsActionButton
        label=""
        onClick={() => setSettings({
          ...settings,
          enableAudioAlerts: true,
          enableVisualAlerts: true,
          alertVolume: 50,
          alertSound: 'beep',
          errorBarColor: 'red',
          errorBarBorderStyle: 'solid'
        })}
        buttonText="Reset Alerts"
        variant="danger"
      />
    </div>
  );
};

export default AlertsTab;
