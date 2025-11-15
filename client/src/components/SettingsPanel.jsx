import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import GeneralTab from './settings/GeneralTab';
import HeightTab from './settings/HeightTab';
import ShouldersTab from './settings/ShouldersTab';
import HeadTiltTab from './settings/HeadTiltTab';
import AlertsTab from './settings/AlertsTab';

const SettingsPanel = ({ settings, setSettings, onStartCamera, onStopCamera, isStreaming, onCalibrateHeight }) => {
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

        <div className="overflow-y-auto max-h-[60vh]">
          <Tabs.Content value="general" className="space-y-3 mt-0">
            <GeneralTab settings={settings} setSettings={setSettings} />
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
      </Tabs.Root>
    </div>
  );
};

export default SettingsPanel;