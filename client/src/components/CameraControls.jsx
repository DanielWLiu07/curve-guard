import React from 'react';

const CameraControls = ({ isStreaming, cameraStatus, onStartCamera, onStopCamera }) => {
  const getStatusColor = () => {
    switch (cameraStatus) {
      case 'streaming': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'connected': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (cameraStatus) {
      case 'streaming': return 'Streaming';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          Camera: {getStatusText()}
        </div>
      </div>

      <button
        onClick={isStreaming ? onStopCamera : onStartCamera}
        className={`px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
          isStreaming
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isStreaming ? 'Stop Camera' : 'Start Camera'}
      </button>
    </div>
  );
};

export default CameraControls;