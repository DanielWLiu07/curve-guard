import React from 'react';

const DetectionControls = ({ settings, setSettings, onCalibrateHeight }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => {
            const newValue = !settings.showLandmarks;
            setSettings({...settings, showLandmarks: newValue});
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            settings.showLandmarks
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {settings.showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}
        </button>
      </div>

      {settings.enableHeightDetection && (
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={onCalibrateHeight}
            className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Calibrate Height
          </button>
          <div className="text-xs text-gray-400 text-center">
            Position your head at the desired height and click calibrate
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        Detection: {settings.enableHeightDetection || settings.enableShoulderDetection || settings.enableHeadTiltDetection ? 'Active' : 'Disabled'}
      </div>
    </div>
  );
};

export default DetectionControls;