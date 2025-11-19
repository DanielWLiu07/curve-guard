import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsSlider from '../ui/SettingsSlider';
import SettingsColorSelect from '../ui/SettingsColorSelect';
import SettingsStyleSelect from '../ui/SettingsStyleSelect';
import SettingsActionButton from '../ui/SettingsActionButton';

const HeightTab = ({ settings, setSettings, onCalibrateHeight }) => {
  return (
    <div className="space-y-3">
      <SettingsButton
        label="Enable Height Detection"
        isActive={settings.enableHeightDetection}
        onClick={() => {
          const newValue = !settings.enableHeightDetection;
          setSettings({...settings, enableHeightDetection: newValue});
        }}
        activeText="Disable Height Detection"
        inactiveText="Enable Height Detection"
      />

      <SettingsSlider
        label="Eye Height Tolerance (px)"
        value={[settings.eyeHeightTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, eyeHeightTolerance: value});
        }}
        min={0}
        max={100}
        step={5}
        displayValue={settings.eyeHeightTolerance}
        unit="px"
      />

      <SettingsSlider
        label="Eye Height Time Tolerance"
        value={[settings.eyeHeightTimeTolerance]}
        onValueChange={([value]) => {
          setSettings({...settings, eyeHeightTimeTolerance: value});
        }}
        min={0}
        max={10}
        step={0.5}
        displayValue={settings.eyeHeightTimeTolerance}
        unit="s"
      />

      <SettingsActionButton
        label="Height Calibration"
        onClick={onCalibrateHeight}
        buttonText="Calibrate"
        variant="primary"
      />

      <SettingsColorSelect
        label="Calibration Bar Color"
        value={settings.calibrationBarColor || 'red'}
        onValueChange={(value) => setSettings({...settings, calibrationBarColor: value})}
      />

      <SettingsStyleSelect
        label="Calibration Bar Style"
        value={settings.calibrationBarStyle || 'solid'}
        onValueChange={(value) => setSettings({...settings, calibrationBarStyle: value})}
      />

      <SettingsActionButton
        label="Reset Settings"
        onClick={() => {
          setSettings({
            ...settings,
            eyeHeightTolerance: 20,
            eyeHeightTimeTolerance: 3,
            eyeHeightCalibrationLine: 0,
            calibrationBarColor: 'red',
            calibrationBarStyle: 'solid'
          });
        }}
        buttonText="Reset"
        variant="danger"
      />
    </div>
  );
};

export default HeightTab;
