import { useEffect, useRef, useState } from 'react';

/**
 * Essential Clock Logic - Clean & Simple
 * 24h mapping: NOON (12:00) => 0°, clockwise from top
 */

/** Essential clock state - just the angles we need */
export interface ClockState {
  /** 24-hour hand angle (noon = 0°, clockwise) */
  hourAngle: number;
  /** Minute hand angle (0-360°) */
  minuteAngle: number;  
  /** Second hand angle (0-360°) */
  secondAngle: number;
}

/** Essential hook - smooth real-time clock angles */
export function useClock(): ClockState {
  const [angles, setAngles] = useState<ClockState>(() => calculateAngles());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateAngles = () => {
      setAngles(calculateAngles());
      rafRef.current = requestAnimationFrame(updateAngles);
    };
    
    rafRef.current = requestAnimationFrame(updateAngles);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return angles;
}

/** Calculate current time as rotation angles */
function calculateAngles(): ClockState {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();  
  const seconds = now.getSeconds();
  const millis = now.getMilliseconds();

  // Smooth fractional calculations
  const secondFraction = (seconds * 1000 + millis) / 60000;
  const minuteFraction = (minutes + secondFraction) / 60;
  
  // 24-hour angle (noon = 0°, clockwise)
  const totalMinutes = hours * 60 + minutes + (seconds + millis/1000) / 60;
  const noonShiftMinutes = totalMinutes - 12 * 60; // Shift so 12:00 = 0°
  const hourAngle = normalize360((noonShiftMinutes / (24 * 60)) * 360);
  
  // Standard minute and second angles
  const minuteAngle = minuteFraction * 360;
  const secondAngle = ((seconds + millis/1000) / 60) * 360;

  return { hourAngle, minuteAngle, secondAngle };
}

/** Normalize angle to 0-360 range */
function normalize360(angle: number): number {
  const result = angle % 360;
  return result < 0 ? result + 360 : result;
}