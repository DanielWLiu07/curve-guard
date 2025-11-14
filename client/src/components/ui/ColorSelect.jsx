import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

export const ColorSelect = ({ value, onChange, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-white text-xs font-medium">
      Landmark Color
    </label>
    <Select value={value || 'white'} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 hover:border-slate-500 text-white h-9 text-xs rounded-lg px-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
        <SelectValue>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'White'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl">
        <SelectItem value="white" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">White</SelectItem>
        <SelectItem value="red" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Red</SelectItem>
        <SelectItem value="green" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Green</SelectItem>
        <SelectItem value="blue" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Blue</SelectItem>
        <SelectItem value="yellow" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Yellow</SelectItem>
        <SelectItem value="cyan" className="text-white hover:bg-slate-700/80 focus:bg-slate-700/80 text-xs px-3 py-2 rounded-md transition-colors cursor-pointer">Cyan</SelectItem>
      </SelectContent>
    </Select>
  </div>
);