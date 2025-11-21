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
  const lastPostureState = useRef(true);
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
        accumulatedGoodTime.current = 0;
        accumulatedBadTime.current = 0;
        
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
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
        updateInterval.current = null;
      }

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
      
      if (result.success) {
        isRecordingRef.current = false;
        setIsRecording(false);
        setCurrentStats({
          goodPosturePercentage: result.totalStats.goodPosturePercentage,
          goodTime: result.totalStats.totalGoodTime,
          badTime: result.totalStats.totalBadTime
        });
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const updatePostureData = async (isGoodPosture, violationType = null, duration = null) => {
    if (!isRecordingRef.current || !sessionIdRef.current) {
      return;
    }

    try {
      if (duration === null) {
        const now = Date.now();
        duration = now - lastUpdateTime.current;
        lastUpdateTime.current = now;
      }

      const response = await fetch('/api/posture/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          sessionIndex: sessionIndexRef.current,
          isGoodPosture,
          violationType,
          duration
        })
      });
      
      const result = await response.json();
      
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
    if (!isRecordingRef.current || !sessionIdRef.current) return;
    
    const now = Date.now();
    const timeSinceLastChange = now - lastStateChangeTime.current;
    
    if (lastPostureState.current) {
      accumulatedGoodTime.current += timeSinceLastChange;
    } else {
      accumulatedBadTime.current += timeSinceLastChange;
    }
    
    lastStateChangeTime.current = now;
    
    if (accumulatedGoodTime.current > 0) {
      await updatePostureData(true, null, accumulatedGoodTime.current);
      accumulatedGoodTime.current = 0;
    }
    
    if (accumulatedBadTime.current > 0) {
      await updatePostureData(false, lastViolationType.current, accumulatedBadTime.current);
      accumulatedBadTime.current = 0;
    }
  };

  const recordPostureState = (isGoodPosture, violationType = null) => {
    if (!isRecordingRef.current) return;
    
    if (lastPostureState.current !== isGoodPosture) {
      const now = Date.now();
      const duration = now - lastStateChangeTime.current;
      
      if (lastPostureState.current) {
        accumulatedGoodTime.current += duration;
      } else {
        accumulatedBadTime.current += duration;
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
