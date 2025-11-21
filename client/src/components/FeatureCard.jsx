import React from 'react';

const FeatureCard = ({ title, description, color, index }) => {
  return (
    <div className="group relative">
      {/* Animated background glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

      {/* Main card */}
      <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 h-32 md:h-64 w-full md:w-80 flex flex-col shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-transform duration-300">

        {/* Title section */}
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 group-hover:bg-clip-text transition-all duration-300">
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="flex-1 flex flex-col justify-start">
          <p className="text-slate-300 leading-relaxed text-sm md:text-base group-hover:text-slate-200 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 border border-slate-600/30 rounded-full group-hover:border-slate-500/50 transition-colors duration-300"></div>
        <div className="absolute bottom-4 right-6 w-4 h-4 bg-gradient-to-br from-slate-600/20 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default FeatureCard;