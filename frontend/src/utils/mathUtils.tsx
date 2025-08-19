//==============================================
// MATH UTILITIES
//==============================================
// DETAILED DESCRIPTION:
// Mathematical utilities for rotation calculations, orbital mechanics, and positioning.
// Handles angle normalization, coordinate transformations, and smooth animations.
// Essential for dual rotation system (spin + orbital) and clock hand calculations.
// TWEAK:
// Adjust angle normalization ranges by modifying normalize360 function.
// Change rotation speed calculations in calculateRotationAngle function.
// Modify positioning algorithms in calculateOrbitalPosition for different orbital mechanics.
// Adjust smooth animation curves by changing easing functions.

/**
 * Normalize angle to 0-360 degree range
 */
export function normalize360(angle: number): number {
  const result = angle % 360;
  return result < 0 ? result + 360 : result;
}

/**
 * Normalize angle to -180 to +180 degree range
 */
export function normalize180(angle: number): number {
  let result = angle % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate rotation angle based on time and speed
 */
export function calculateRotationAngle(
  startTime: number,
  currentTime: number,
  rotationSpeed: number,
  direction: '+' | '-' | 'no' | '' | null,
  initialAngle: number = 0
): number {
  if (!rotationSpeed || rotationSpeed <= 0 || direction === 'no' || direction === '' || direction === null) {
    return initialAngle;
  }

  const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
  const rotationsPerSecond = 1 / rotationSpeed; // Rotations per second
  const anglePerSecond = rotationsPerSecond * 360; // Degrees per second
  
  let angle = initialAngle;
  
  if (direction === '+') {
    angle += elapsed * anglePerSecond;
  } else if (direction === '-') {
    angle -= elapsed * anglePerSecond;
  }
  
  return normalize360(angle);
}

/**
 * Calculate orbital position around a center point
 */
export function calculateOrbitalPosition(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): { x: number; y: number } {
  const rad = degToRad(angle);
  return {
    x: centerX + radius * Math.cos(rad),
    y: centerY + radius * Math.sin(rad)
  };
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  x1: number, y1: number,
  x2: number, y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Smooth step interpolation (S-curve)
 */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Calculate transform matrix for rotation and position
 */
export function calculateTransformMatrix(
  positionX: number,
  positionY: number,
  rotationAngle: number,
  scale: number = 1
): string {
  return `translate(${positionX}px, ${positionY}px) rotate(${rotationAngle}deg) scale(${scale})`;
}

/**
 * Calculate position from percentage to pixels
 */
export function percentageToPixels(
  percentage: number,
  containerSize: number,
  centerOffset: boolean = true
): number {
  if (centerOffset) {
    // -50% to +50% range mapped to container size
    return (percentage / 100) * containerSize;
  } else {
    // 0% to 100% range mapped to container size
    return (percentage / 100) * containerSize;
  }
}

/**
 * Calculate current time angles for clock hands
 */
export function calculateClockAngles(): {
  hour: number;
  minute: number;
  second: number;
} {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Smooth fractional calculations
  const secondFraction = (seconds * 1000 + milliseconds) / 60000;
  const minuteFraction = (minutes + secondFraction) / 60;
  
  // 24-hour angle (noon = 0°, clockwise)
  const totalMinutes = hours * 60 + minutes + (seconds + milliseconds/1000) / 60;
  const noonShiftMinutes = totalMinutes - 12 * 60; // Shift so 12:00 = 0°
  const hourAngle = normalize360((noonShiftMinutes / (24 * 60)) * 360);
  
  // Standard minute and second angles
  const minuteAngle = minuteFraction * 360;
  const secondAngle = ((seconds + milliseconds/1000) / 60) * 360;

  return {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle
  };
}

/**
 * Calculate timezone-adjusted clock angles
 */
export function calculateTimezoneClockAngles(utcOffset: number, use24Hour: boolean = true): {
  hour: number;
  minute: number;
  second: number;
} {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const timezoneTime = new Date(utc + (utcOffset * 3600000));
  
  const hours = timezoneTime.getHours();
  const minutes = timezoneTime.getMinutes();
  const seconds = timezoneTime.getSeconds();
  const milliseconds = timezoneTime.getMilliseconds();

  // Smooth fractional calculations
  const secondFraction = (seconds * 1000 + milliseconds) / 60000;
  const minuteFraction = (minutes + secondFraction) / 60;
  
  // Hour angle calculation based on 24h or 12h mode
  let hourAngle: number;
  
  if (use24Hour) {
    // 24-hour mode: 1 rotation per 24 hours (noon = 0°, clockwise)
    const totalMinutes = hours * 60 + minutes + (seconds + milliseconds/1000) / 60;
    const noonShiftMinutes = totalMinutes - 12 * 60; // Shift so 12:00 = 0°
    hourAngle = normalize360((noonShiftMinutes / (24 * 60)) * 360);
  } else {
    // 12-hour mode: 2 rotations per 24 hours (traditional clock)
    const totalMinutes = (hours % 12) * 60 + minutes + (seconds + milliseconds/1000) / 60;
    hourAngle = normalize360((totalMinutes / (12 * 60)) * 360);
  }
  
  // Standard minute and second angles
  const minuteAngle = minuteFraction * 360;
  const secondAngle = ((seconds + milliseconds/1000) / 60) * 360;

  return {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle
  };
}