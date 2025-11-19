import React from 'react';

const AboutSection = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-end pr-12">
      <div className="max-w-lg bg-slate-800/70 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
          About Curve Guard
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed mb-6">
          Revolutionizing posture correction through cutting-edge AI technology and immersive 3D visualization.
          Built with passion to help you maintain better posture habits.
        </p>
        <p className="text-base text-slate-400 leading-relaxed">
          In today's digital age, poor posture has become an epidemic affecting millions worldwide.
          Curve Guard was born from the vision to combat this issue through innovative technology,
          making posture correction accessible, engaging, and effective for everyone.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;