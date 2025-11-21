import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          x: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      <div ref={cardRef} className="max-w-lg relative z-10">
        {/* Animated background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur opacity-60"></div>

        {/* Main card */}
        <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/60 shadow-2xl">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-jade-9 via-jade-6 to-white bg-clip-text text-transparent animate-pulse">
              About Curve Guard
            </h2>
          </div>          {/* Main description */}
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            Revolutionizing posture correction through cutting-edge AI technology and immersive 3D visualization.
            Built with passion to help you maintain better posture habits.
          </p>

          {/* Key points */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-base text-slate-400 leading-relaxed">
                <span className="text-slate-300 font-medium">AI-Powered Detection:</span> Advanced computer vision algorithms analyze your posture in real-time
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-base text-slate-400 leading-relaxed">
                <span className="text-slate-300 font-medium">3D Visualization:</span> Immersive feedback helps you understand and correct posture issues
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-base text-slate-400 leading-relaxed">
                <span className="text-slate-300 font-medium">Privacy First:</span> All processing happens locally on your device
              </p>
            </div>
          </div>

          {/* Mission statement */}
          <div className="border-t border-slate-700/50 pt-6">
            <p className="text-base text-slate-400 leading-relaxed italic">
              In today's digital age, poor posture has become an epidemic affecting millions worldwide.
              Curve Guard was born from the vision to combat this issue through innovative technology,
              making posture correction accessible, engaging, and effective for everyone.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-6 h-6 border border-slate-600/30 rounded-full"></div>
          <div className="absolute bottom-4 right-6 w-4 h-4 bg-gradient-to-br from-slate-600/20 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;