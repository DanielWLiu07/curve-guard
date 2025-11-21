import React from 'react';

const DebugPanel = ({ settings, currentStats, isRecording }) => {
  if (!isRecording) return null;

  const hasActiveError = settings.activeErrors.eyeHeight.active || 
                         settings.activeErrors.shoulder.active || 
                         settings.activeErrors.headTilt.active;

  return (
    <div className="bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-md">
      <div className="font-bold mb-2 text-green-400">RECORDING</div>
      <div className="space-y-1">
        <div>
          Height Calibrated: {settings.eyeHeightCalibrationLine !== null ? 'YES' : 'NO - Click "Calibrate Height"'}
        </div>
        
        <div className="mt-2 font-semibold">Current Recording State:</div>
        <div className={!hasActiveError ? 'text-green-400' : 'text-red-400'}>
          Recording as: {!hasActiveError ? 'GOOD POSTURE' : 'BAD POSTURE'}
        </div>
        
        <div className="mt-2 font-semibold">Active Errors (trigger bad posture):</div>
        <div className={settings.activeErrors.eyeHeight.active ? 'text-red-400' : 'text-gray-500'}>
          Eye Height: {settings.activeErrors.eyeHeight.active ? 'ACTIVE' : 'Good'}
        </div>
        <div className={settings.activeErrors.shoulder.active ? 'text-red-400' : 'text-gray-500'}>
          Shoulder: {settings.activeErrors.shoulder.active ? 'ACTIVE' : 'Good'}
        </div>
        <div className={settings.activeErrors.headTilt.active ? 'text-red-400' : 'text-gray-500'}>
          Head Tilt: {settings.activeErrors.headTilt.active ? 'ACTIVE' : 'Good'}
        </div>
        
        <div className="mt-2 font-semibold">Current Stats:</div>
        <div className="text-green-400">Good: {(currentStats.goodTime / 1000).toFixed(1)}s</div>
        <div className="text-red-400">Bad: {(currentStats.badTime / 1000).toFixed(1)}s</div>
        <div className="text-blue-400">Percentage: {currentStats.goodPosturePercentage.toFixed(1)}%</div>
        
        <div className="mt-2 text-yellow-300 text-[10px]">
          Violations must last {settings.eyeHeightTimeTolerance}s (height), {settings.shoulderTimeTolerance}s (shoulder), {settings.headTiltTimeTolerance}s (head) to become active errors
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
