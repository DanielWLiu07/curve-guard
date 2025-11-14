import { useState, useCallback } from 'react';

export const usePostureViolations = () => {
  const [alerts, setAlerts] = useState([]);

  const handleViolation = useCallback((violationType, isViolating, settings, violationStartKey, timeToleranceKey) => {
    const now = Date.now();

    if (isViolating) {
      if (!settings[violationStartKey]) {
        return { ...settings, [violationStartKey]: now };
      } else {
        const violationDuration = (now - settings[violationStartKey]) / 1000;
        if (violationDuration >= settings[timeToleranceKey]) {
          const errorMessages = {
            eyeHeight: 'Poor posture: Head too low',
            shoulder: 'Uneven shoulders',
            headTilt: 'Head tilt detected'
          };

          setAlerts(prev => [...prev, { type: 'error', message: errorMessages[violationType] }]);
          return { ...settings, [violationStartKey]: null };
        }
      }
    } else {
      if (settings[violationStartKey]) {
        return { ...settings, [violationStartKey]: null };
      }
    }

    return settings;
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    setAlerts,
    handleViolation,
    clearAlerts
  };
};