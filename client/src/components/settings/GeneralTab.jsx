import React from 'react';
import SettingsButton from '../ui/SettingsButton';
import SettingsInput from '../ui/SettingsInput';
import SettingsSelect from '../ui/SettingsSelect';

const GeneralTab = ({ settings, setSettings }) => {
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
          setSettings({...settings, isRecording: !settings.isRecording});
        }}
        activeText="Stop Recording"
        inactiveText="Start Recording"
      />

      <SettingsInput
        label="Landmark Radius"
        type="number"
        value={settings.landmarkRadius}
        onChange={(e) => setSettings({...settings, landmarkRadius: parseInt(e.target.value) || 1})}
        min="1"
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
    </div>
  );
};

export default GeneralTab;
