import React from 'react';
import StatusItem from './StatusItem.jsx';

const StatusSection = ({ title, items }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h3 className="text-white font-medium mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <StatusItem
            key={index}
            label={item.label}
            value={item.value}
            statusColor={item.statusColor}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusSection;