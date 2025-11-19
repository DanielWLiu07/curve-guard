import React from 'react';

const StatusItem = ({ label, value, statusColor }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-300 text-sm">{label}:</span>
      <span className={`text-sm font-medium ${statusColor}`}>
        {value}
      </span>
    </div>
  );
};

export default StatusItem;