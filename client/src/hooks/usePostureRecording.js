import { useState, useEffect, useRef } from 'react';

export const usePostureRecording = (userId) => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionIndex, setSessionIndex] = useState(null);
  const [currentStats, setCurrentStats] = useState({
    goodPosturePercentage: 0,
    goodTime: 0,
    badTime: 0
  });
  
  const lastUpdateTime = useRef(Date.now());
  const lastPostureState = useRef(null); // null = not initialized yet
  const lastViolationType = useRef(null);
  const lastStateChangeTime = useRef(Date.now());
  const accumulatedGoodTime = useRef(0);
  const accumulatedBadTime = useRef(0);
  const updateInterval = useRef(null);
  const sessionIdRef = useRef(null);
  const sessionIndexRef = useRef(null);
  const isRecordingRef = useRef(false);

  const startRecording = async () => {
    try {
      const response = await fetch('/api/posture/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        sessionIdRef.current = result.sessionId;
        sessionIndexRef.current = result.sessionIndex;
        isRecordingRef.current = true;
        
        setSessionId(result.sessionId);
        setSessionIndex(result.sessionIndex);
        setIsRecording(true);
        
        const now = Date.now();
        lastUpdateTime.current = now;
        lastStateChangeTime.current = now;
        lastPostureState.current = null; // Reset to null so first state is recorded properly
        lastViolationType.current = null;
        accumulatedGoodTime.current = 0;
        accumulatedBadTime.current = 0;

        console.log('Recording started - state reset');

        updateInterval.current = setInterval(() => {
          sendAccumulatedUpdate();
        }, 5000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');

      if (updateInterval.current) {
        clearInterval(updateInterval.current);
        updateInterval.current = null;
      }

      // Send any remaining accumulated data
      await sendAccumulatedUpdate();

      const response = await fetch('/api/posture/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          sessionIndex: sessionIndexRef.current
        })
      });

      const result = await response.json();
      console.log('Stop recording result:', result);

      if (result.success) {
        isRecordingRef.current = false;
        setIsRecording(false);
        setCurrentStats({
          goodPosturePercentage: result.totalStats.goodPosturePercentage,
          goodTime: result.totalStats.totalGoodTime,
          badTime: result.totalStats.totalBadTime
        });

        // Emit custom event to force refresh of stats
        window.dispatchEvent(new CustomEvent('postureRecordingStopped', {
          detail: {
            userId,
            timestamp: Date.now()
          }
        }));
        console.log('Recording stopped successfully, event dispatched');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const updatePostureData = async (isGoodPosture, violationType = null, duration = null) => {
    if (!isRecordingRef.current || !sessionIdRef.current) {
      console.log('updatePostureData: Not recording or no session');
      return;
    }

    try {
      if (duration === null) {
        const now = Date.now();
        duration = now - lastUpdateTime.current;
        lastUpdateTime.current = now;
      }

      const payload = {
        sessionId: sessionIdRef.current,
        sessionIndex: sessionIndexRef.current,
        isGoodPosture,
        violationType,
        duration
      };

      console.log('Sending to /api/posture/update:', payload);

      const response = await fetch('/api/posture/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (result.success) {
        setCurrentStats({
          goodPosturePercentage: result.goodPosturePercentage || 0,
          goodTime: result.totalGoodTime || 0,
          badTime: result.totalBadTime || 0
        });
      }
    } catch (error) {
      console.error('Error updating posture data:', error);
    }
  };

  const sendAccumulatedUpdate = async () => {
    if (!isRecordingRef.current || !sessionIdRef.current) {
      console.log('sendAccumulatedUpdate: Not recording or no session');
      return;
    }

    const now = Date.now();
    const timeSinceLastChange = now - lastStateChangeTime.current;

    console.log('sendAccumulatedUpdate: Current state:', {
      lastPostureState: lastPostureState.current ? 'good' : 'bad',
      timeSinceLastChange,
      accumulatedGood: accumulatedGoodTime.current,
      accumulatedBad: accumulatedBadTime.current
    });

    if (lastPostureState.current) {
      accumulatedGoodTime.current += timeSinceLastChange;
    } else {
      accumulatedBadTime.current += timeSinceLastChange;
    }

    lastStateChangeTime.current = now;

    if (accumulatedGoodTime.current > 0) {
      console.log('Sending good posture data:', accumulatedGoodTime.current);
      await updatePostureData(true, null, accumulatedGoodTime.current);
      accumulatedGoodTime.current = 0;
    }

    if (accumulatedBadTime.current > 0) {
      console.log('Sending bad posture data:', accumulatedBadTime.current, 'violationType:', lastViolationType.current);
      await updatePostureData(false, lastViolationType.current, accumulatedBadTime.current);
      accumulatedBadTime.current = 0;
    }
  };

  const recordPostureState = (isGoodPosture, violationType = null) => {
    if (!isRecordingRef.current) {
      console.log('recordPostureState: Not recording, skipping');
      return;
    }

    // First time recording? Just set the state without accumulating
    if (lastPostureState.current === null) {
      console.log('recordPostureState: First state recorded:', isGoodPosture ? 'good' : 'bad');
      lastPostureState.current = isGoodPosture;
      lastViolationType.current = violationType;
      lastStateChangeTime.current = Date.now();
      return;
    }

    if (lastPostureState.current !== isGoodPosture) {
      const now = Date.now();
      const duration = now - lastStateChangeTime.current;

      console.log('Posture state changed:', {
        from: lastPostureState.current ? 'good' : 'bad',
        to: isGoodPosture ? 'good' : 'bad',
        duration: duration,
        violationType
      });

      if (lastPostureState.current) {
        accumulatedGoodTime.current += duration;
        console.log('Added to good time:', duration, 'Total good:', accumulatedGoodTime.current);
      } else {
        accumulatedBadTime.current += duration;
        console.log('Added to bad time:', duration, 'Total bad:', accumulatedBadTime.current);
      }

      lastStateChangeTime.current = now;
    }

    lastPostureState.current = isGoodPosture;
    lastViolationType.current = violationType;
  };

  useEffect(() => {
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, []);

  return {
    isRecording,
    currentStats,
    startRecording,
    stopRecording,
    recordPostureState
  };
};
