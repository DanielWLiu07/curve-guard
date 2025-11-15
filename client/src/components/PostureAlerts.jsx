import React from 'react';

const PostureAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-40 space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-lg border ${
            alert.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-red-100'
              : alert.type === 'warning'
              ? 'bg-yellow-900/90 border-yellow-700 text-yellow-100'
              : 'bg-blue-900/90 border-blue-700 text-blue-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              alert.type === 'error' ? 'bg-red-400' :
              alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
            }`} />
            <span className="font-medium">{alert.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostureAlerts;