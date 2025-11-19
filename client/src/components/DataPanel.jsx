import React from 'react';
import StatusSection from './StatusSection.jsx';

const DataPanel = ({ settings, poseLandmarks, alerts, isStreaming, cameraStatus }) => {
  const getRecordingStatus = () => {
    if (!isStreaming) return 'Camera not streaming';
    if (settings.isRecording) return 'Recording active';
    return 'Ready to record';
  };

  const getPoseData = () => {
    if (!poseLandmarks || poseLandmarks.length === 0) {
      return 'No pose data detected';
    }
    return `${poseLandmarks.length} landmarks detected`;
  };

  const getActiveAlerts = () => {
    const activeAlerts = Object.values(alerts).filter(alert => alert !== null);
    if (activeAlerts.length === 0) return 'No active alerts';
    return `${activeAlerts.length} active alert(s)`;
  };

  const recordingItems = [
    {
      label: 'Status',
      value: getRecordingStatus(),
      statusColor: settings.isRecording ? 'text-green-400' : isStreaming ? 'text-yellow-400' : 'text-red-400'
    },
    {
      label: 'Camera',
      value: cameraStatus,
      statusColor: cameraStatus === 'streaming' ? 'text-green-400' : cameraStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400'
    }
  ];

  const liveDataItems = [
    {
      label: 'Pose Detection',
      value: getPoseData(),
      statusColor: 'text-white'
    },
    {
      label: 'Active Alerts',
      value: getActiveAlerts(),
      statusColor: 'text-white'
    }
  ];

  const detectionSettingsItems = [
    {
      label: 'Height Detection',
      value: settings.enableHeightDetection ? 'ON' : 'OFF',
      statusColor: settings.enableHeightDetection ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Shoulder Detection',
      value: settings.enableShoulderDetection ? 'ON' : 'OFF',
      statusColor: settings.enableShoulderDetection ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Head Tilt Detection',
      value: settings.enableHeadTiltDetection ? 'ON' : 'OFF',
      statusColor: settings.enableHeadTiltDetection ? 'text-green-400' : 'text-red-400'
    }
  ];

  const alertSettingsItems = [
    {
      label: 'Audio Alerts',
      value: settings.enableAudioAlerts ? 'ON' : 'OFF',
      statusColor: settings.enableAudioAlerts ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Visual Alerts',
      value: settings.enableVisualAlerts ? 'ON' : 'OFF',
      statusColor: settings.enableVisualAlerts ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Alert Volume',
      value: `${settings.alertVolume}%`,
      statusColor: 'text-white'
    },
    {
      label: 'Alert Sound',
      value: settings.alertSound.charAt(0).toUpperCase() + settings.alertSound.slice(1),
      statusColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-4">
      <StatusSection title="Recording Status" items={recordingItems} />
      <StatusSection title="Live Data" items={liveDataItems} />
      <StatusSection title="Detection Settings" items={detectionSettingsItems} />
      <StatusSection title="Alert Settings" items={alertSettingsItems} />
    </div>
  );
};

export default DataPanel;