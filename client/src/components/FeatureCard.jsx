import React from 'react';

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 h-32 md:h-64 max-w-96 md:max-w-full flex flex-col">
      <div className="flex-1 flex flex-col justify-start">
        <h3 className="text-xl font-semibold text-white mb-3 text-left">{title}</h3>
        <p className="text-slate-300 text-left leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;