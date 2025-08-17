import { useEffect, useRef, useState } from 'react';
import { TimezoneConfig } from './rotate_config';

/**
 * Enhanced Clock Logic with Timezone Support
 * 24h mapping: NOON (12:00) => 0°, clockwise from top
 * Timezone support for individual hour hands
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

/** Calculate current time as rotation angles (device system time) */
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

/** Calculate timezone-aware angles for specific timezone configuration */
export function calculateTimezoneAngles(timezoneConfig?: TimezoneConfig): ClockState {
  // If timezone is not enabled, use device time
  if (!timezoneConfig || timezoneConfig.enabled !== 'yes') {
    return calculateAngles();
  }

  // Calculate timezone-adjusted time
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const timezoneTime = new Date(utc + (timezoneConfig.utcOffset * 3600000));
  
  const hours = timezoneTime.getHours();
  const minutes = timezoneTime.getMinutes();  
  const seconds = timezoneTime.getSeconds();
  const millis = timezoneTime.getMilliseconds();

  // Smooth fractional calculations
  const secondFraction = (seconds * 1000 + millis) / 60000;
  const minuteFraction = (minutes + secondFraction) / 60;
  
  // Hour angle calculation based on 24h or 12h mode
  let hourAngle: number;
  
  if (timezoneConfig.use24Hour === 'yes') {
    // 24-hour mode: 1 rotation per 24 hours (noon = 0°, clockwise)
    const totalMinutes = hours * 60 + minutes + (seconds + millis/1000) / 60;
    const noonShiftMinutes = totalMinutes - 12 * 60; // Shift so 12:00 = 0°
    hourAngle = normalize360((noonShiftMinutes / (24 * 60)) * 360);
  } else {
    // 12-hour mode: 2 rotations per 24 hours (traditional clock)
    const totalMinutes = (hours % 12) * 60 + minutes + (seconds + millis/1000) / 60;
    hourAngle = normalize360((totalMinutes / (12 * 60)) * 360);
  }
  
  // Standard minute and second angles (same worldwide)
  const minuteAngle = minuteFraction * 360;
  const secondAngle = ((seconds + millis/1000) / 60) * 360;

  return { hourAngle, minuteAngle, secondAngle };
}

/** Get hour angle for specific timezone (for individual hands) */
export function getTimezoneHourAngle(timezoneConfig?: TimezoneConfig): number {
  const timezoneAngles = calculateTimezoneAngles(timezoneConfig);
  return timezoneAngles.hourAngle;
}

/** Normalize angle to 0-360 range */
function normalize360(angle: number): number {
  const result = angle % 360;
  return result < 0 ? result + 360 : result;
}