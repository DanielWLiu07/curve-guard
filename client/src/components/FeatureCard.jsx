import React from 'react';

const FeatureCard = ({ title, description, color, index }) => {
  return (
    <div className="group relative">
      {/* Animated background glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

      {/* Main card */}
      <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 pb-8 md:pb-10 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 min-h-[160px] md:h-64 w-full md:w-80 flex flex-col shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-transform duration-300">

        {/* Title section */}
        <div className="mb-3 md:mb-4">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 group-hover:bg-clip-text transition-all duration-300">
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="flex-1 flex flex-col justify-start mb-4">
          <p className="text-slate-300 leading-relaxed text-sm md:text-base group-hover:text-slate-200 transition-colors duration-300">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default FeatureCard;