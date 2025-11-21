import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsInput from '../ui/SettingsInput';
import SettingsSelect from '../ui/SettingsSelect';
import SettingsSlider from '../ui/SettingsSlider';
import SettingsActionButton from '../ui/SettingsActionButton';
import DeviceTypeSelector from '../ui/DeviceTypeSelector';

const GeneralTab = ({ settings, setSettings, onStartRecording, onStopRecording }) => {
  const handleRecordingToggle = () => {
    if (settings.isRecording) {
      console.log('🛑 Stopping recording from GeneralTab', { currentState: settings.isRecording });
      onStopRecording();
    } else {
      console.log('🎬 Starting recording from GeneralTab', { currentState: settings.isRecording });
      onStartRecording();
    }
  };

  return (
    <div className="space-y-3">
      <SettingsButton
        label="Show Landmarks"
        isActive={settings.showLandmarks}
        onClick={() => {
          const newValue = !settings.showLandmarks;
          setSettings({...settings, showLandmarks: newValue});
        }}
        activeText="Hide Landmarks"
        inactiveText="Show Landmarks"
      />

      <SettingsButton
        label="Record Data"
        isActive={settings.isRecording}
        onClick={() => {
          console.log('🔘 Button clicked, current isRecording:', settings.isRecording);
          handleRecordingToggle();
        }}
        activeText="Stop Recording"
        inactiveText="Start Recording"
      />

      <SettingsInput
        label="Landmark Radius (px)"
        type="number"
        value={settings.landmarkRadius}
        onChange={(e) => setSettings({...settings, landmarkRadius: parseInt(e.target.value) || 0})}
        min="0"
        max="20"
        step="1"
      />

      <SettingsSelect
        label="Landmark Color"
        value={settings.landmarkColor}
        onValueChange={(value) => setSettings({...settings, landmarkColor: value})}
        options={[
          { value: 'white', label: 'White' },
          { value: 'red', label: 'Red' },
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'cyan', label: 'Cyan' }
        ]}
      />

      <SettingsSlider
        label="Phone Rotation"
        value={settings.phoneRotation ?? 0}
        onValueChange={(value) => setSettings({...settings, phoneRotation: value})}
        min={-45}
        max={45}
        step={1}
        unit="°"
      />

      <DeviceTypeSelector
        value={settings.deviceType}
        onChange={(value) => setSettings({...settings, deviceType: value})}
      />

      <SettingsActionButton
        label=""
        onClick={() => setSettings({
          ...settings,
          showLandmarks: true,
          isRecording: false,
          landmarkRadius: 3,
          landmarkColor: 'white',
          enableAudioAlerts: true,
          enableVisualAlerts: true,
          alertVolume: 50,
          alertSound: 'beep',
          enableHeadTiltDetection: true,
          headTiltTolerance: 15,
          headTiltTimeTolerance: 2,
          enableHeightDetection: true,
          eyeHeightTolerance: 20,
          eyeHeightTimeTolerance: 3,
          enableShoulderDetection: true,
          shoulderUnevennessTolerancePx: 10,
          shoulderTimeTolerance: 2,
          phoneRotation: 0,
          deviceType: 'phone'
        })}
        buttonText="Reset All"
        variant="danger"
      />
    </div>
  );
};

export default GeneralTab;
