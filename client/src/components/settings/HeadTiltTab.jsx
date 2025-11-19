import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsSlider from '../ui/SettingsSlider';
import SettingsActionButton from '../ui/SettingsActionButton';

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
        min={0}
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
        min={0}
        max={10}
        step={0.5}
        displayValue={settings.headTiltTimeTolerance}
        unit="s"
      />

      <SettingsActionButton
        label="Reset Settings"
        onClick={() => {
          setSettings({
            ...settings,
            headTiltTolerance: 15,
            headTiltTimeTolerance: 2
          });
        }}
        buttonText="Reset"
        variant="danger"
      />
    </div>
  );
};

export default HeadTiltTab;
