import React, { useState, useEffect } from 'react';
import PostureStats from './PostureStats';
import { usePostureRecording } from '../hooks/usePostureRecording';

const DataSection = ({ user }) => {
  const userId = user?.userId || 'demo-user';
  const { isRecording } = usePostureRecording(userId);
  const [showStats, setShowStats] = useState(true);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-jade-9 via-jade-6 to-white bg-clip-text text-transparent animate-pulse">
              Your Posture Data
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Track your posture habits and see your progress over time. Start recording from the Detection page.
          </p>
        </div>

        {/* Stats Display */}
        {showStats && (
          <div className="animate-fadeIn">
            <PostureStats userId={userId} isRecording={isRecording} />
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-8 bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
          <h3 className="text-xl font-bold text-white mb-4">💡 Tips for Better Posture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-white">Keep your head level:</span> Avoid tilting forward or to the sides
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-white">Shoulders back:</span> Keep shoulders relaxed and aligned
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-white">Take breaks:</span> Stand up and stretch every 30 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSection;
