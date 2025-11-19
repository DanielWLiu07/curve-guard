import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsSlider from '../ui/SettingsSlider';
import SettingsActionButton from '../ui/SettingsActionButton';

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
        label="Shoulder Unevenness Tolerance"
        value={[settings.shoulderUnevennessTolerancePx]}
        onValueChange={([value]) => setSettings({...settings, shoulderUnevennessTolerancePx: value})}
        min={0}
        max={50}
        step={1}
        displayValue={settings.shoulderUnevennessTolerancePx}
        unit="px"
      />

      <SettingsSlider
        label="Shoulder Time Tolerance"
        value={[settings.shoulderTimeTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, shoulderTimeTolerance: value});
        }}
        min={0}
        max={10}
        step={0.5}
        displayValue={settings.shoulderTimeTolerance}
        unit="s"
      />

      <SettingsActionButton
        label="Reset Settings"
        onClick={() => {
          setSettings({
            ...settings,
            shoulderUnevennessTolerancePx: 10,
            shoulderTimeTolerance: 2
          });
        }}
        buttonText="Reset"
        variant="danger"
      />
    </div>
  );
};

export default ShouldersTab;
