import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const SlidingSettingsPanel = ({ isOpen, onToggle, children }) => {
  const panelRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.set(panelRef.current, {
        x: '100%  ',
        opacity: 1,
        display: 'block'
      });

      timelineRef.current = gsap.timeline({ paused: true });
      timelineRef.current
        .to(panelRef.current, {
          x: '0%',
          duration: 0.3,
          ease: 'power2.out'
        });
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      if (isOpen) {
        timelineRef.current.play();
      } else {
        timelineRef.current.reverse();
      }
    }
  }, [isOpen]);

  return (
    <div className="fixed top-0 right-0 h-screen z-50">
      <div
        ref={panelRef}
        className="w-96 h-screen bg-slate-900/95 backdrop-blur-sm border-l border-slate-700 shadow-lg flex relative"
      >
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Settings</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {children}
          </div>
        </div>

        <div className="absolute -left-12 top-0 h-full w-12 bg-slate-800/80 border-r border-slate-600 shadow-lg flex flex-col justify-center z-10">
          <button
            onClick={onToggle}
            className="transform -rotate-90 text-center py-8 px-2 font-medium text-sm text-white/80 hover:text-white transition-all duration-300 whitespace-nowrap w-full h-full flex items-center justify-center"
          >
            {isOpen ? '▶ Settings' : '◀ Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlidingSettingsPanel;