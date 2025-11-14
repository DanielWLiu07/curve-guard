import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

export const SoundSelect = ({ value, onChange, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-white text-xs font-medium">
      Alert Sound
    </label>
    <Select value={value || 'beep'} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 hover:border-slate-500 text-white h-9 text-xs rounded-lg px-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
        <SelectValue>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Beep'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl">
        <SelectItem value="beep" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Beep</SelectItem>
        <SelectItem value="chime" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Chime</SelectItem>
        <SelectItem value="bell" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Bell</SelectItem>
        <SelectItem value="none" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">None</SelectItem>
      </SelectContent>
    </Select>
  </div>
);