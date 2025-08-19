//==============================================
// CLOCK UTILITIES
//==============================================
// DETAILED DESCRIPTION:
// Shared utilities for clock system including time calculations, angle conversions,
// animation helpers, and clock-specific mathematical functions.
// TWEAK:
// Modify time conversion functions for different clock behaviors.
// Adjust animation smoothing for different visual effects.
// Change validation functions for stricter or looser clock rules.

import { ClockState, TimezoneConfig } from '../../types/launcher.types';
import { normalize360, degToRad, radToDeg, calculateClockAngles, calculateTimezoneClockAngles } from '../../utils/mathUtils';
import { safeNumber, safeString, safeBoolean } from '../../utils/safeAccessors';
import { VALIDATION_LIMITS, DEFAULT_VALUES } from '../../constants/launcher.constants';

// ===== TIME CALCULATION UTILITIES =====

/**
 * Get current time in different formats for clock calculations
 */
export function getCurrentTimeData(): {
  localTime: Date;
  utcTime: Date;
  epochMs: number;
  timeString: string;
  timeComponents: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
} {
  const now = new Date();
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  
  return {
    localTime: now,
    utcTime: utc,
    epochMs: now.getTime(),
    timeString: now.toISOString(),
    timeComponents: {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
    },
  };
}

/**
 * Convert time to different timezone
 */
export function convertToTimezone(utcOffset: number): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (utcOffset * 3600000));
}

/**
 * Get timezone-aware clock state
 */
export function getTimezoneClockState(timezone?: TimezoneConfig | null): ClockState {
  if (!timezone || timezone.enabled !== 'yes') {
    const angles = calculateClockAngles();
    return {
      hourAngle: angles.hour,
      minuteAngle: angles.minute,
      secondAngle: angles.second,
      timestamp: Date.now(),
    };
  }

  const angles = calculateTimezoneClockAngles(
    safeNumber(timezone.utcOffset, 0, -12, 14, 0),
    timezone.use24Hour === 'yes'
  );
  
  return {
    hourAngle: angles.hour,
    minuteAngle: angles.minute,
    secondAngle: angles.second,
    timestamp: Date.now(),
  };
}

// ===== ANGLE VALIDATION & CORRECTION =====

/**
 * Validate and correct clock angles
 */
export function validateClockAngles(state: ClockState): ClockState {
  return {
    hourAngle: normalize360(safeNumber(state.hourAngle, 0, 360, 0)),
    minuteAngle: normalize360(safeNumber(state.minuteAngle, 0, 360, 0)),
    secondAngle: normalize360(safeNumber(state.secondAngle, 0, 360, 0)),
    timestamp: state.timestamp || Date.now(),
  };
}

/**
 * Calculate angle difference for smooth transitions
 */
export function calculateAngleDifference(from: number, to: number): number {
  const diff = normalize360(to - from);
  return diff > 180 ? diff - 360 : diff;
}

/**
 * Interpolate between two angles smoothly
 */
export function interpolateAngles(from: number, to: number, factor: number): number {
  const diff = calculateAngleDifference(from, to);
  return normalize360(from + (diff * factor));
}

// ===== CLOCK HAND CALCULATIONS =====

/**
 * Calculate hand angle for specific time
 */
export function calculateHandAngleForTime(
  hours: number, 
  minutes: number, 
  seconds: number, 
  handType: 'hour' | 'minute' | 'second',
  use24Hour: boolean = true
): number {
  switch (handType) {
    case 'hour':
      if (use24Hour) {
        // 24-hour mode: 1 rotation per 24 hours
        const totalMinutes = (hours * 60) + minutes + (seconds / 60);
        const noonShiftMinutes = totalMinutes - (12 * 60); // Shift so 12:00 = 0°
        return normalize360((noonShiftMinutes / (24 * 60)) * 360);
      } else {
        // 12-hour mode: 2 rotations per 24 hours
        const totalMinutes = ((hours % 12) * 60) + minutes + (seconds / 60);
        return normalize360((totalMinutes / (12 * 60)) * 360);
      }
    
    case 'minute':
      return normalize360((minutes + (seconds / 60)) * 6); // 6° per minute
    
    case 'second':
      return normalize360(seconds * 6); // 6° per second
    
    default:
      return 0;
  }
}

/**
 * Get hand angle from clock state
 */
export function getHandAngleFromClockState(
  clockState: ClockState, 
  handType: 'hour' | 'minute' | 'second'
): number {
  switch (handType) {
    case 'hour':
      return clockState.hourAngle;
    case 'minute':
      return clockState.minuteAngle;
    case 'second':
      return clockState.secondAngle;
    default:
      return 0;
  }
}

// ===== PERFORMANCE UTILITIES =====

/**
 * Throttle clock updates for performance
 */
export function createClockThrottle(callback: () => void, fps: number = 60): () => void {
  let lastUpdate = 0;
  const interval = 1000 / fps;
  
  return () => {
    const now = Date.now();
    if (now - lastUpdate >= interval) {
      lastUpdate = now;
      callback();
    }
  };
}

/**
 * Debounce clock configuration changes
 */
export function createClockDebounce<T extends any[]>(
  callback: (...args: T) => void, 
  delay: number = 300
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

// ===== CLOCK VALIDATION =====

/**
 * Validate timezone configuration
 */
export function validateTimezone(timezone: any): TimezoneConfig | null {
  if (!timezone || typeof timezone !== 'object') return null;
  
  const enabled = timezone.enabled === 'yes' ? 'yes' : 'no';
  const utcOffset = safeNumber(
    timezone.utcOffset, 
    VALIDATION_LIMITS.TIMEZONE_OFFSET.MIN,
    VALIDATION_LIMITS.TIMEZONE_OFFSET.MAX,
    DEFAULT_VALUES.UTC_OFFSET
  );
  const use24Hour = timezone.use24Hour === 'no' ? 'no' : 'yes';
  
  return { enabled, utcOffset, use24Hour };
}

/**
 * Check if clock state is valid
 */
export function isValidClockState(state: any): state is ClockState {
  return (
    state &&
    typeof state === 'object' &&
    typeof state.hourAngle === 'number' &&
    typeof state.minuteAngle === 'number' &&
    typeof state.secondAngle === 'number'
  );
}

// ===== HELPER FUNCTIONS =====

/**
 * Format time for display
 */
export function formatTimeDisplay(
  hours: number, 
  minutes: number, 
  seconds: number, 
  use24Hour: boolean = true,
  includeSeconds: boolean = true
): string {
  const h = use24Hour ? hours : (hours % 12) || 12;
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  const ampm = use24Hour ? '' : (hours >= 12 ? ' PM' : ' AM');
  
  if (includeSeconds) {
    return `${h}:${m}:${s}${ampm}`;
  } else {
    return `${h}:${m}${ampm}`;
  }
}

/**
 * Create clock state from manual time input
 */
export function createClockStateFromTime(
  hours: number,
  minutes: number, 
  seconds: number,
  use24Hour: boolean = true
): ClockState {
  return {
    hourAngle: calculateHandAngleForTime(hours, minutes, seconds, 'hour', use24Hour),
    minuteAngle: calculateHandAngleForTime(hours, minutes, seconds, 'minute', use24Hour),
    secondAngle: calculateHandAngleForTime(hours, minutes, seconds, 'second', use24Hour),
    timestamp: Date.now(),
  };
}

/**
 * Calculate clock performance metrics
 */
export function calculateClockPerformance(): {
  fps: number;
  deltaTime: number;
  averageFrameTime: number;
} {
  // Simple performance tracking
  const frameHistory: number[] = [];
  let lastFrameTime = performance.now();
  
  return {
    fps: Math.round(1000 / (performance.now() - lastFrameTime)),
    deltaTime: performance.now() - lastFrameTime,
    averageFrameTime: frameHistory.length > 0 
      ? frameHistory.reduce((a, b) => a + b, 0) / frameHistory.length 
      : 16.67, // 60fps default
  };
}

/**
 * Safe clock state merger
 */
export function mergeClockStates(base: ClockState, update: Partial<ClockState>): ClockState {
  return {
    hourAngle: safeNumber(update.hourAngle ?? base.hourAngle, 0, 360, base.hourAngle),
    minuteAngle: safeNumber(update.minuteAngle ?? base.minuteAngle, 0, 360, base.minuteAngle),
    secondAngle: safeNumber(update.secondAngle ?? base.secondAngle, 0, 360, base.secondAngle),
    timestamp: update.timestamp ?? base.timestamp ?? Date.now(),
  };
}