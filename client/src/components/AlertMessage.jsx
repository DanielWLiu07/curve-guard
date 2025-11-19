import React from 'react';

const AlertMessage = ({ message, type = 'error', className = '' }) => {
  const baseClasses = "w-80 px-6 py-3 rounded-lg font-bold text-lg shadow-lg border-2 animate-pulse pointer-events-none text-center";

  const typeClasses = {
    error: "bg-red-600/90 text-white border-red-400",
    warning: "bg-yellow-600/90 text-white border-yellow-400",
    success: "bg-green-600/90 text-white border-green-400",
    info: "bg-blue-600/90 text-white border-blue-400"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {message}
    </div>
  );
};

export default AlertMessage;