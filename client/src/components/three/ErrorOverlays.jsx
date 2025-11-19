import React from 'react';
import ErrorOverlay from './ErrorOverlay.jsx';

const ErrorOverlays = ({ alerts, settings, effectiveWidth }) => {
  return (
    <>
      {Object.entries(alerts || {})
        .filter(([key, alert]) => alert)
        .map(([key, alert], index) => (
          <ErrorOverlay
            key={key}
            alert={{ key, ...alert }}
            index={index}
            effectiveWidth={effectiveWidth}
            settings={settings}
          />
        ))}
    </>
  );
};

export default ErrorOverlays;