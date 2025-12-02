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
    <div ref={sectionRef} className="absolute inset-0 flex items-start md:items-center justify-center md:justify-end md:pr-16 overflow-y-auto md:overflow-hidden overflow-x-hidden pt-24 md:pt-0 pb-8 md:pb-0">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent pointer-events-none z-20 md:hidden"></div>

      <div ref={cardRef} className="max-w-xl relative z-10 mx-4 md:mx-0">
        <div className="relative bg-slate-900/70 backdrop-blur-sm rounded-lg p-6 md:p-6 border border-slate-700/40">
          <div className="mb-5">
            <h2 className="text-3xl font-bold text-white mb-2">
              About Curve Guard
            </h2>
            <div className="w-16 h-1 bg-emerald-500"></div>
          </div>

          <p className="text-base text-slate-300 leading-relaxed mb-5">
            Curve Guard monitors your posture using your webcam and MediaPipe pose detection.
            When you slouch or lean forward, the app alerts you so you can correct your position.
          </p>

          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5">Real-time pose detection</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Uses MediaPipe to track 33 body landmarks and calculate shoulder-to-hip angles
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5">3D skeleton visualization</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  See your posture represented in 3D with Three.js to better understand your alignment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5">Local processing only</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Everything runs in your browser - no video data is uploaded or stored
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium text-sm mb-0.5">Customizable thresholds</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Adjust sensitivity and alert settings to match your needs and environment
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              The app calculates the forward lean angle from your shoulder and hip positions.
              When this angle exceeds your threshold, you'll get a visual alert.
              Alerts include a brief cooldown period to avoid notification fatigue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;