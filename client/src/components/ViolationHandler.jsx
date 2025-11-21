export const handleViolation = (
  violationType,
  isViolating,
  timeToleranceKey,
  violationStartKey,
  alertMessage,
  settingsRef,
  setSettings,
  setAlerts
) => {
  const currentSettings = settingsRef.current;
  const now = Date.now();

  if (isViolating) {
    if (!currentSettings[violationStartKey]) {
      setSettings(prev => ({ ...prev, [violationStartKey]: now }));
    } else {
      const violationDuration = (now - currentSettings[violationStartKey]) / 1000;
      if (violationDuration >= currentSettings[timeToleranceKey]) {
        setSettings(prev => ({
          ...prev,
          activeErrors: {
            ...prev.activeErrors,
            [violationType]: { active: true, lastActive: now }
          }
        }));
        setAlerts(prev => ({ ...prev, [violationType]: { type: 'error', message: alertMessage } }));
      }
    }
  } else {
    if (currentSettings[violationStartKey]) {
      setSettings(prev => ({ ...prev, [violationStartKey]: null }));
    }
    if (currentSettings.activeErrors[violationType].active) {
      setSettings(prev => ({
        ...prev,
        activeErrors: {
          ...prev.activeErrors,
          [violationType]: { active: false, lastActive: null }
        }
      }));
      setAlerts(prev => ({ ...prev, [violationType]: null }));
    }
  }
};
