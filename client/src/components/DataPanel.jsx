import React, { useState } from 'react';
import PostureStats from './PostureStats';
import DebugPanel from './DebugPanel';

const DataPanel = ({ settings, poseLandmarks, alerts, isStreaming, cameraStatus, currentStats }) => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="space-y-3 pb-4">
      <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Status</span>
            <span className={`text-xs font-medium ${
              settings.isRecording ? 'text-green-400' : 
              isStreaming ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {!isStreaming ? 'Camera off' : 
               settings.isRecording ? 'Recording' : 'Ready'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Landmarks</span>
            <span className="text-xs text-white">
              {!poseLandmarks || poseLandmarks.length === 0 
                ? 'None' 
                : poseLandmarks.length}
            </span>
          </div>
          {settings.isRecording && (
            <>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                <span className="text-xs text-slate-400">Recording Active</span>
                <span className="text-xs text-green-400 font-medium">
                  Data updating...
                </span>
              </div>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="w-full mt-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 rounded transition-colors"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </button>
            </>
          )}
        </div>
      </div>

      {showDebug && settings.isRecording && (
        <DebugPanel 
          settings={settings} 
          currentStats={currentStats}
          isRecording={settings.isRecording}
        />
      )}

      <PostureStats 
        userId="demo-user" 
        compact={true} 
        alwaysShow={true}
        isRecording={settings.isRecording}
      />
    </div>
  );
};

export default DataPanel;