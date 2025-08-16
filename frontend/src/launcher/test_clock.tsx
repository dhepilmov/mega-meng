import React from 'react';
import { useClock } from './clock_logic';

/** Test component to verify clock logic works */
export const ClockTest: React.FC = () => {
  const { hourAngle, minuteAngle, secondAngle } = useClock();

  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      background: 'rgba(0,0,0,0.7)', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>🕐 Clock Angles:</div>
      <div>Hour: {hourAngle.toFixed(1)}°</div>
      <div>Min: {minuteAngle.toFixed(1)}°</div>
      <div>Sec: {secondAngle.toFixed(1)}°</div>
    </div>
  );
};