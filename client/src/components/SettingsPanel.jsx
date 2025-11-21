import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import GeneralTab from './settings/GeneralTab';
import HeightTab from './settings/HeightTab';
import ShouldersTab from './settings/ShouldersTab';
import HeadTiltTab from './settings/HeadTiltTab';
import AlertsTab from './settings/AlertsTab';

const SettingsPanel = ({ settings, setSettings, onStartCamera, onStopCamera, isStreaming, onCalibrateHeight, onStartRecording, onStopRecording }) => {
  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={isStreaming ? onStopCamera : onStartCamera}
          className={`w-full px-3 py-2 text-sm ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-semibold transition-colors`}
        >
          {isStreaming ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>

      <Tabs.Root defaultValue="general" className="w-full">
        <Tabs.List className="grid grid-cols-5 gap-1 bg-slate-800/50 p-1 rounded-lg mb-4">
          <Tabs.Trigger
            value="general"
            className="px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            General
          </Tabs.Trigger>
          <Tabs.Trigger
            value="height"
            className="px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Height
          </Tabs.Trigger>
          <Tabs.Trigger
            value="shoulders"
            className="px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white flex items-center justify-center"
          >
            Shoulders
          </Tabs.Trigger>
          <Tabs.Trigger
            value="head-tilt"
            className="px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Head Tilt
          </Tabs.Trigger>
          <Tabs.Trigger
            value="alerts"
            className="px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Alerts
          </Tabs.Trigger>
        </Tabs.List>

        <div className="overflow-y-auto h-[65vh]">
          <Tabs.Content value="general" className="space-y-3 mt-0">
            <GeneralTab 
              settings={settings} 
              setSettings={setSettings} 
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
            />
          </Tabs.Content>

          <Tabs.Content value="height" className="space-y-3 mt-0">
            <HeightTab settings={settings} setSettings={setSettings} onCalibrateHeight={onCalibrateHeight} />
          </Tabs.Content>

          <Tabs.Content value="shoulders" className="space-y-3 mt-0">
            <ShouldersTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>

          <Tabs.Content value="head-tilt" className="space-y-3 mt-0">
            <HeadTiltTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>

          <Tabs.Content value="alerts" className="space-y-3 mt-0">
            <AlertsTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>
        </div>

        <div className="border-t border-slate-600 my-4"></div>
        <div className="flex justify-end">
          <a
            href="https://github.com/LTKers/curve-guard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
            title="View on GitHub"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default SettingsPanel;