import React from 'react';

const DeviceTypeSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-xs font-medium">
        3D Model
      </label>
      <div className="flex rounded-lg bg-slate-800/50 p-1 gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            e.nativeEvent?.stopImmediatePropagation?.();
            onChange('phone');
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
            (value ?? 'phone') === 'phone'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          Phone
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            e.nativeEvent?.stopImmediatePropagation?.();
            onChange('tablet');
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
            (value ?? 'tablet') === 'tablet'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          Tablet
        </button>
      </div>
    </div>
  );
};

export default DeviceTypeSelector;