import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { GeneralTab } from './settings/GeneralTab';
import { HeightTab } from './settings/HeightTab';
import { ShouldersTab } from './settings/ShouldersTab';
import { HeadTiltTab } from './settings/HeadTiltTab';
import { AlertsTab } from './settings/AlertsTab';

const SettingsPanel = ({ settings, setSettings, onStartCamera, onStopCamera, isStreaming, onCalibrateHeight }) => {
  return (
    <div className="fixed bottom-4 right-4 z-30 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg w-[600px] max-h-[500px] overflow-hidden">
      <div className="p-4 pb-2">
        <button
          onClick={isStreaming ? onStopCamera : onStartCamera}
          className={`w-full px-4 py-2 ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-semibold transition-colors text-sm`}
        >
          {isStreaming ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>

      <Tabs.Root defaultValue="general" className="w-full">
        <Tabs.List className="flex space-x-1 bg-slate-800/50 p-1 mx-4 mt-4 rounded-lg">
          <Tabs.Trigger
            value="general"
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            General
          </Tabs.Trigger>
          <Tabs.Trigger
            value="height"
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Height
          </Tabs.Trigger>
          <Tabs.Trigger
            value="shoulders"
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Shoulders
          </Tabs.Trigger>
          <Tabs.Trigger
            value="head-tilt"
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Head Tilt
          </Tabs.Trigger>
          <Tabs.Trigger
            value="alerts"
            className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md transition-colors data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Alerts
          </Tabs.Trigger>
        </Tabs.List>

        <div className="p-4 max-h-[420px] overflow-y-auto">
          <Tabs.Content value="general" className="space-y-4 mt-0 min-h-[275px]">
            <GeneralTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>

          <Tabs.Content value="height" className="space-y-4 mt-0 min-h-[275px]">
            <HeightTab settings={settings} setSettings={setSettings} onCalibrateHeight={onCalibrateHeight} />
          </Tabs.Content>

          <Tabs.Content value="shoulders" className="space-y-4 mt-0 min-h-[275px]">
            <ShouldersTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>

          <Tabs.Content value="head-tilt" className="space-y-4 mt-0 min-h-[275px]">
            <HeadTiltTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>

          <Tabs.Content value="alerts" className="space-y-4 mt-0 min-h-[275px]">
            <AlertsTab settings={settings} setSettings={setSettings} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default SettingsPanel;