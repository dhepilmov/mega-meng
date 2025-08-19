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
    hourAngle: hourAngle,
    minuteAngle: minuteAngle,
    secondAngle: secondAngle,
    timestamp: Date.now()
  };
}

/**
 * Calculate timezone-adjusted clock angles
 */
export function calculateTimezoneClockAngles(utcOffset: number, use24Hour: boolean = true): ClockState { {
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

// ===== PHASE 3: DUAL ROTATION SYSTEM ENHANCEMENTS =====

/**
 * Calculate advanced orbital position with time-based rotation
 * Core function for rotation2 orbital mechanics
 */
export function calculateAdvancedOrbitalPosition(
  orbitCenterX: number,
  orbitCenterY: number,
  orbitRadius: number,
  startingAngle: number,
  currentTime: number,
  startTime: number,
  rotationSpeed: number,
  rotationDirection: '+' | '-' | 'no' | '' | null
): { x: number; y: number; currentAngle: number } {
  
  let currentAngle = startingAngle;
  
  // Calculate rotation if enabled
  if (rotationDirection === '+' || rotationDirection === '-') {
    const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
    const degreesPerSecond = 360 / rotationSpeed; // Full rotation based on rotationSpeed
    const rotatedDegrees = elapsed * degreesPerSecond;
    
    if (rotationDirection === '+') {
      currentAngle = normalize360(startingAngle + rotatedDegrees);
    } else if (rotationDirection === '-') {
      currentAngle = normalize360(startingAngle - rotatedDegrees);
    }
  }
  
  // Calculate orbital position
  const position = calculateOrbitalPosition(orbitCenterX, orbitCenterY, orbitRadius, currentAngle);
  
  return {
    x: position.x,
    y: position.y,
    currentAngle: currentAngle
  };
}

/**
 * Calculate dual rotation system positioning
 * Combines rotation1 (spin + position) and rotation2 (orbital)
 */
export interface DualRotationResult {
  finalPosition: { x: number; y: number };
  rotation1Angle: number;
  rotation2Angle: number;
  rotation1Transform: string;
  rotation2Transform: string;
  combinedTransform: string;
}

export function calculateDualRotationSystem(
  config: {
    rotation1?: {
      enabled: 'yes' | 'no' | null;
      itemPositionX: number;
      itemPositionY: number;
      rotationSpeed: number;
      rotationWay: '+' | '-' | 'no' | '' | null;
      itemTiltPosition: number;
    };
    rotation2?: {
      enabled: 'yes' | 'no' | null;
      itemRotateAxisX: number;
      itemRotateAxisY: number;
      itemPositionX: number; // Orbital radius
      itemPositionY: number; // Starting angle
      rotationSpeed: number;
      rotationWay: '+' | '-' | 'no' | '' | null;
      itemTiltPosition: number;
    };
  },
  currentTime: number,
  startTime: number,
  scale: number = 1
): DualRotationResult {
  
  let finalX = 0;
  let finalY = 0;
  let rotation1Angle = 0;
  let rotation2Angle = 0;
  
  // ROTATION1: Spin + Basic Positioning
  if (config.rotation1?.enabled === 'yes') {
    // Basic positioning from rotation1
    finalX += config.rotation1.itemPositionX;
    finalY += config.rotation1.itemPositionY;
    
    // Calculate spin rotation
    if (config.rotation1.rotationWay === '+' || config.rotation1.rotationWay === '-') {
      rotation1Angle = calculateRotationAngle(
        startTime,
        currentTime,
        config.rotation1.rotationSpeed,
        config.rotation1.rotationWay,
        config.rotation1.itemTiltPosition
      );
    } else {
      rotation1Angle = config.rotation1.itemTiltPosition;
    }
  }
  
  // ROTATION2: Orbital System
  if (config.rotation2?.enabled === 'yes') {
    const orbitalResult = calculateAdvancedOrbitalPosition(
      config.rotation2.itemRotateAxisX, // Orbit center X
      config.rotation2.itemRotateAxisY, // Orbit center Y
      config.rotation2.itemPositionX,   // Orbit radius
      config.rotation2.itemPositionY,   // Starting angle
      currentTime,
      startTime,
      config.rotation2.rotationSpeed,
      config.rotation2.rotationWay
    );
    
    // Add orbital position to final position
    finalX += orbitalResult.x;
    finalY += orbitalResult.y;
    rotation2Angle = orbitalResult.currentAngle;
  }
  
  // Generate transform strings
  const rotation1Transform = `rotate(${rotation1Angle}deg)`;
  const rotation2Transform = `translate(${finalX}px, ${finalY}px)`;
  const combinedTransform = `${rotation2Transform} ${rotation1Transform} scale(${scale})`;
  
  return {
    finalPosition: { x: finalX, y: finalY },
    rotation1Angle,
    rotation2Angle,
    rotation1Transform,
    rotation2Transform,
    combinedTransform
  };
}

/**
 * Calculate transform origin for complex rotations
 */
export function calculateAdvancedTransformOrigin(
  rotationConfig: {
    itemAxisX?: number;
    itemAxisY?: number;
  },
  isOrbitalSystem: boolean = false
): string {
  if (isOrbitalSystem) {
    // For orbital systems, use center as origin
    return '50% 50%';
  }
  
  // For spin systems, use configured axis points
  const axisX = rotationConfig.itemAxisX ?? 50;
  const axisY = rotationConfig.itemAxisY ?? 50;
  return `${axisX}% ${axisY}%`;
}

/**
 * Optimize rotation calculations for performance
 * Use this for high-frequency updates (60fps)
 */
export function optimizedRotationCalculation(
  lastCalculation: DualRotationResult | null,
  timeDelta: number,
  rotationSpeed: number,
  direction: '+' | '-' | 'no' | '' | null
): number {
  if (!lastCalculation || !direction || direction === 'no' || !direction.trim()) {
    return 0;
  }
  
  const deltaSeconds = timeDelta / 1000;
  const degreesPerSecond = 360 / rotationSpeed;
  const increment = deltaSeconds * degreesPerSecond;
  
  return direction === '+' ? increment : -increment;
}

/**
 * Calculate performance impact of layer configuration
 * Helps optimize complex multi-layer setups
 */
export function calculateLayerComplexity(config: {
  rotation1?: { enabled: 'yes' | 'no' | null };
  rotation2?: { enabled: 'yes' | 'no' | null };
  hasEffects?: boolean;
  isClockHand?: boolean;
}): {
  complexity: 'low' | 'medium' | 'high';
  score: number;
  recommendations: string[];
} {
  let score = 0;
  const recommendations: string[] = [];
  
  // Base complexity scoring
  if (config.rotation1?.enabled === 'yes') score += 1;
  if (config.rotation2?.enabled === 'yes') score += 2; // Orbital is more complex
  if (config.hasEffects) score += 1;
  if (config.isClockHand) score += 0.5; // Clock hands are optimized
  
  // Dual rotation adds extra complexity
  if (config.rotation1?.enabled === 'yes' && config.rotation2?.enabled === 'yes') {
    score += 1;
    recommendations.push('Dual rotation system active - monitor performance');
  }
  
  let complexity: 'low' | 'medium' | 'high';
  if (score <= 1) {
    complexity = 'low';
  } else if (score <= 3) {
    complexity = 'medium';
    if (score > 2.5) {
      recommendations.push('Consider optimizing rotation speeds for better performance');
    }
  } else {
    complexity = 'high';
    recommendations.push('High complexity layer - consider simplifying for better performance');
    recommendations.push('Monitor frame rate when multiple high-complexity layers are active');
  }
  
  return {
    complexity,
    score,
    recommendations
  };
}