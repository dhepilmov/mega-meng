//==============================================
// ROTATION SYSTEM TYPE DEFINITIONS
//==============================================
// DETAILED DESCRIPTION:
// Specialized type definitions for the dual rotation system.
// Covers rotation mechanics, orbital calculations, and animation states.
// Provides type safety for complex rotation and positioning logic.
// TWEAK:
// Add new rotation modes by extending RotationMode union type.
// Modify calculation interfaces to add new mathematical properties.
// Change animation timing types to adjust performance characteristics.
// Add new orbital mechanics by extending OrbitalConfig interface.

// ===== IMPORTS =====

import { ValidationResult } from '../launcher_core/launcher_core_settings/launcher_settings_validator';

// ===== ROTATION MODES =====

export type RotationMode = 'spin' | 'orbital' | 'hybrid' | 'disabled';
export type RotationDirection = '+' | '-' | 'clockwise' | 'counterclockwise' | 'none';
export type RotationState = 'idle' | 'spinning' | 'paused' | 'error';

// ===== ADVANCED ROTATION CONFIGURATION =====

export interface AdvancedRotationConfig {
  // Basic rotation properties
  mode: RotationMode;
  direction: RotationDirection;
  speed: number;                     // Rotations per second
  
  // Axis configuration
  pivotPoint: { x: number; y: number }; // Rotation axis (percentage from center)
  
  // Position in space
  position: { x: number; y: number };   // Position relative to container center
  
  // Advanced properties
  acceleration?: number;             // Acceleration factor for smooth start/stop
  deceleration?: number;             // Deceleration factor for smooth stop
  maxSpeed?: number;                 // Maximum rotation speed limit
  minSpeed?: number;                 // Minimum rotation speed limit
  
  // Timing
  delay?: number;                    // Start delay in milliseconds
  duration?: number;                 // Total duration (0 = infinite)
  
  // Easing
  easing?: EasingFunction;           // Custom easing function
  
  // Conditional rotation
  conditions?: RotationCondition[];  // Conditions for enabling rotation
}

// ===== ORBITAL SYSTEM =====

export interface OrbitalConfig {
  // Orbital center point
  centerPoint: { x: number; y: number }; // Center of orbital motion
  
  // Orbital parameters
  radius: number;                    // Distance from center
  eccentricity?: number;             // Elliptical orbit (0 = circle, >0 = ellipse)
  inclination?: number;              // Orbital plane tilt in degrees
  
  // Orbital motion
  orbitalSpeed: number;              // Orbital period in seconds
  direction: RotationDirection;      // Orbital direction
  startingAngle: number;             // Initial position on orbit (degrees)
  
  // Advanced orbital mechanics
  periapsis?: number;                // Closest approach to center
  apoapsis?: number;                 // Farthest distance from center
  gravitationalPull?: number;       // Simulated gravity effect
}

// ===== DUAL ROTATION SYSTEM =====

export interface DualRotationConfig {
  // Primary rotation (spin around own axis)
  spin: AdvancedRotationConfig;
  
  // Secondary rotation (orbital motion)
  orbital: OrbitalConfig;
  
  // Interaction between rotations
  coupling?: {
    enabled: boolean;               // Whether rotations affect each other
    ratio?: number;                 // Speed coupling ratio
    phase?: number;                 // Phase offset in degrees
  };
  
  // Synchronization
  synchronization?: {
    enabled: boolean;               // Sync with other layers
    masterLayer?: number;           // Layer to sync with
    offset?: number;                // Time offset in seconds
  };
}

// ===== ANIMATION & TIMING =====

export type EasingFunction = (t: number) => number;

export interface AnimationTiming {
  startTime: number;                // Animation start timestamp
  currentTime: number;              // Current timestamp
  elapsed: number;                  // Elapsed time in milliseconds
  progress: number;                 // Animation progress (0-1)
  frameRate: number;                // Current frame rate
}

export interface RotationAnimation {
  timing: AnimationTiming;
  state: RotationState;
  currentAngle: number;             // Current rotation angle
  targetAngle?: number;             // Target angle for transitions
  velocity: number;                 // Current rotational velocity
  acceleration: number;             // Current acceleration
}

// ===== CALCULATION RESULTS =====

export interface RotationCalculation {
  // Final transformation values
  angle: number;                    // Final rotation angle
  position: { x: number; y: number }; // Final position
  transform: string;                // CSS transform string
  
  // Calculation metadata
  timestamp: number;                // When calculation was performed
  frameId: number;                  // Animation frame identifier
  
  // Debug information
  debug?: {
    spinAngle: number;              // Spin component angle
    orbitalAngle: number;           // Orbital component angle
    orbitalPosition: { x: number; y: number }; // Raw orbital position
    appliedForces: any[];           // Applied forces/modifiers
  };
}

export interface OrbitalCalculation {
  // Position on orbital path
  angle: number;                    // Current angle on orbit (degrees)
  position: { x: number; y: number }; // Position relative to orbital center
  velocity: { x: number; y: number }; // Velocity vector
  
  // Orbital mechanics
  distance: number;                 // Current distance from center
  speed: number;                    // Current orbital speed
  
  // Advanced calculations
  eccentricAnomaly?: number;        // For elliptical orbits
  trueAnomaly?: number;             // True position on ellipse
}

// ===== PHYSICS SIMULATION =====

export interface PhysicsState {
  // Position and motion
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  
  // Rotation
  angle: number;
  angularVelocity: number;
  angularAcceleration: number;
  
  // Forces
  forces: Force[];
  torques: number[];
  
  // Properties
  mass?: number;
  inertia?: number;
  drag?: number;
}

export interface Force {
  id: string;
  magnitude: number;
  direction: number;                // Angle in degrees
  origin: { x: number; y: number };
  type: 'gravity' | 'magnetic' | 'spring' | 'custom';
}

// ===== CONDITIONS & TRIGGERS =====

export interface RotationCondition {
  id: string;
  type: 'time' | 'position' | 'speed' | 'custom';
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=';
  value: number;
  property: string;                 // Property to check
}

export interface RotationTrigger {
  id: string;
  condition: RotationCondition;
  action: 'start' | 'stop' | 'pause' | 'reverse' | 'custom';
  parameters?: any;
}

// ===== PERFORMANCE & OPTIMIZATION =====

export interface PerformanceMetrics {
  frameRate: number;                // Current FPS
  averageFrameTime: number;         // Average frame calculation time
  droppedFrames: number;            // Number of dropped frames
  memoryUsage?: number;             // Memory usage in MB
  calculationsPerSecond: number;    // Number of calculations per second
}

export interface OptimizationSettings {
  // Performance limits
  maxFrameRate: number;             // FPS cap
  dynamicQuality: boolean;          // Auto-adjust quality for performance
  
  // Calculation optimization
  useApproximations: boolean;       // Use fast approximations when possible
  cacheResults: boolean;            // Cache calculation results
  batchUpdates: boolean;            // Batch multiple updates
  
  // Rendering optimization
  cullOffscreen: boolean;           // Skip offscreen calculations
  levelOfDetail: boolean;           // Reduce detail for distant objects
  skipInvisible: boolean;           // Skip invisible layer calculations
}

// ===== COORDINATE SYSTEMS =====

export type CoordinateSystem = 'screen' | 'normalized' | 'polar' | 'world';

export interface CoordinateTransform {
  from: CoordinateSystem;
  to: CoordinateSystem;
  origin: { x: number; y: number };
  scale: { x: number; y: number };
  rotation?: number;
}

export interface PolarCoordinates {
  radius: number;                   // Distance from origin
  angle: number;                    // Angle in degrees
}

export interface WorldCoordinates {
  x: number;                        // World X position
  y: number;                        // World Y position
  z?: number;                       // Optional Z coordinate for 3D
}

// ===== HELPER TYPES =====

export interface RotationValidator {
  validateConfig: (config: AdvancedRotationConfig) => ValidationResult;
  validateOrbital: (config: OrbitalConfig) => ValidationResult;
  validatePhysics: (state: PhysicsState) => ValidationResult;
}

export interface RotationCalculator {
  calculateSpin: (config: AdvancedRotationConfig, time: number) => RotationCalculation;
  calculateOrbital: (config: OrbitalConfig, time: number) => OrbitalCalculation;
  calculateDual: (config: DualRotationConfig, time: number) => RotationCalculation;
}

// ===== DEFAULT CONFIGURATIONS =====

export const DEFAULT_ADVANCED_ROTATION: AdvancedRotationConfig = {
  mode: 'disabled',
  direction: 'none',
  speed: 0,
  pivotPoint: { x: 50, y: 50 },
  position: { x: 0, y: 0 },
  acceleration: 1,
  deceleration: 1,
  delay: 0,
  duration: 0,
};

export const DEFAULT_ORBITAL_CONFIG: OrbitalConfig = {
  centerPoint: { x: 0, y: 0 },
  radius: 100,
  eccentricity: 0,
  inclination: 0,
  orbitalSpeed: 86400, // 24 hours
  direction: 'clockwise',
  startingAngle: 0,
};

export const DEFAULT_PHYSICS_STATE: PhysicsState = {
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  angle: 0,
  angularVelocity: 0,
  angularAcceleration: 0,
  forces: [],
  torques: [],
  mass: 1,
  inertia: 1,
  drag: 0,
};