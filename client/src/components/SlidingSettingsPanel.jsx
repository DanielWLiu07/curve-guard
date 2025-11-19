import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { PanelHeader, PanelContent } from './ui/PanelParts';
import PanelControls from './ui/PanelControls';

const SlidingSettingsPanel = ({ isOpen, onToggle, mode, onModeChange, settingsContent, dataContent }) => {
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
        <div className="flex-1 flex flex-col min-h-0">
          <PanelHeader mode={mode} />
          <PanelContent mode={mode} settingsContent={settingsContent} dataContent={dataContent} />
        </div>

        <PanelControls
          isOpen={isOpen}
          mode={mode}
          onToggle={onToggle}
          onModeChange={onModeChange}
        />
      </div>
    </div>
  );
};

export default SlidingSettingsPanel;