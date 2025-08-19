//==============================================
// CLOCK ANIMATIONS
//==============================================
// DETAILED DESCRIPTION:
// Animation management for clock system including smooth transitions,
// easing functions, and performance-optimized animation loops.
// TWEAK:
// Modify easing functions for different animation feels.
// Adjust frame rate targets for performance balance.
// Change transition durations for smoother or snappier animations.

import { ClockState } from '../../types/launcher.types';
import { interpolateAngles, normalize360 } from '../../utils/mathUtils';
import { ANIMATION_CONSTANTS } from '../../constants/launcher.constants';

// ===== ANIMATION INTERFACES =====

export interface AnimationConfig {
  duration: number;
  easing: EasingFunction;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export interface ClockAnimationState {
  isAnimating: boolean;
  startTime: number;
  duration: number;
  fromState: ClockState;
  toState: ClockState;
  currentState: ClockState;
  progress: number;
}

export type EasingFunction = (t: number) => number;

// ===== EASING FUNCTIONS =====

export const EasingFunctions = {
  // Linear
  linear: (t: number): number => t,
  
  // Quadratic
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Sine
  easeInSine: (t: number): number => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: (t: number): number => Math.sin(t * Math.PI / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
  
  // Exponential
  easeInExpo: (t: number): number => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  
  // Elastic
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  // Bounce
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

// ===== CLOCK ANIMATION MANAGER =====

export class ClockAnimationManager {
  private animationState: ClockAnimationState | null = null;
  private animationId: number | null = null;
  private frameCallbacks: Set<(state: ClockState) => void> = new Set();

  /**
   * Start animating between two clock states
   */
  animateToState(
    fromState: ClockState,
    toState: ClockState,
    config: Partial<AnimationConfig> = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      // Stop any existing animation
      this.stopAnimation();

      const fullConfig: AnimationConfig = {
        duration: ANIMATION_CONSTANTS.SMOOTH_TRANSITION,
        easing: EasingFunctions.easeOutQuad,
        ...config,
        onComplete: () => {
          config.onComplete?.();
          resolve();
        },
      };

      this.animationState = {
        isAnimating: true,
        startTime: performance.now(),
        duration: fullConfig.duration,
        fromState,
        toState,
        currentState: fromState,
        progress: 0,
      };

      const animate = (currentTime: number) => {
        if (!this.animationState) return;

        const elapsed = currentTime - this.animationState.startTime;
        const rawProgress = Math.min(elapsed / this.animationState.duration, 1);
        const easedProgress = fullConfig.easing(rawProgress);

        // Interpolate clock angles with smooth wrapping
        const currentState: ClockState = {
          hourAngle: interpolateAngles(
            this.animationState.fromState.hourAngle,
            this.animationState.toState.hourAngle,
            easedProgress
          ),
          minuteAngle: interpolateAngles(
            this.animationState.fromState.minuteAngle,
            this.animationState.toState.minuteAngle,
            easedProgress
          ),
          secondAngle: interpolateAngles(
            this.animationState.fromState.secondAngle,
            this.animationState.toState.secondAngle,
            easedProgress
          ),
          timestamp: Date.now(),
        };

        this.animationState.currentState = currentState;
        this.animationState.progress = easedProgress;

        // Notify subscribers
        this.frameCallbacks.forEach(callback => callback(currentState));
        fullConfig.onUpdate?.(easedProgress);

        if (rawProgress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          // Animation complete
          this.animationState = null;
          fullConfig.onComplete?.();
        }
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  /**
   * Stop current animation
   */
  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.animationState = null;
  }

  /**
   * Get current animation state
   */
  getCurrentState(): ClockState | null {
    return this.animationState?.currentState || null;
  }

  /**
   * Check if currently animating
   */
  isAnimating(): boolean {
    return this.animationState?.isAnimating || false;
  }

  /**
   * Get animation progress (0-1)
   */
  getProgress(): number {
    return this.animationState?.progress || 0;
  }

  /**
   * Subscribe to animation frames
   */
  subscribe(callback: (state: ClockState) => void): () => void {
    this.frameCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.frameCallbacks.delete(callback);
    };
  }

  /**
   * Clear all subscribers
   */
  clearSubscriptions(): void {
    this.frameCallbacks.clear();
  }
}

// ===== ANIMATION PRESETS =====

export const ANIMATION_PRESETS = {
  // Quick snap for real-time updates
  realtime: {
    duration: 50,
    easing: EasingFunctions.linear,
  },
  
  // Smooth transition for user interactions
  smooth: {
    duration: ANIMATION_CONSTANTS.SMOOTH_TRANSITION,
    easing: EasingFunctions.easeOutQuad,
  },
  
  // Slow, elegant transition
  elegant: {
    duration: ANIMATION_CONSTANTS.SLOW_TRANSITION,
    easing: EasingFunctions.easeInOutSine,
  },
  
  // Bouncy, playful animation
  bouncy: {
    duration: 800,
    easing: EasingFunctions.easeOutBounce,
  },
  
  // Elastic, springy animation
  elastic: {
    duration: 600,
    easing: EasingFunctions.easeOutElastic,
  },
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Create smooth clock state transition
 */
export function createSmoothTransition(
  fromState: ClockState,
  toState: ClockState,
  progress: number,
  easing: EasingFunction = EasingFunctions.easeOutQuad
): ClockState {
  const easedProgress = easing(progress);
  
  return {
    hourAngle: interpolateAngles(fromState.hourAngle, toState.hourAngle, easedProgress),
    minuteAngle: interpolateAngles(fromState.minuteAngle, toState.minuteAngle, easedProgress),
    secondAngle: interpolateAngles(fromState.secondAngle, toState.secondAngle, easedProgress),
    timestamp: Date.now(),
  };
}

/**
 * Calculate optimal animation duration based on angle change
 */
export function calculateOptimalDuration(
  fromState: ClockState,
  toState: ClockState,
  baseDuration: number = ANIMATION_CONSTANTS.SMOOTH_TRANSITION
): number {
  // Calculate total angle change
  const hourChange = Math.abs(interpolateAngles(fromState.hourAngle, toState.hourAngle, 1) - fromState.hourAngle);
  const minuteChange = Math.abs(interpolateAngles(fromState.minuteAngle, toState.minuteAngle, 1) - fromState.minuteAngle);
  const secondChange = Math.abs(interpolateAngles(fromState.secondAngle, toState.secondAngle, 1) - fromState.secondAngle);
  
  // Use the largest change to determine duration
  const maxChange = Math.max(hourChange, minuteChange, secondChange);
  const changeFactor = Math.min(maxChange / 180, 2); // Cap at 2x duration
  
  return Math.max(baseDuration * changeFactor, 100); // Minimum 100ms
}

/**
 * Create animation sequence for multiple states
 */
export async function animateSequence(
  manager: ClockAnimationManager,
  states: ClockState[],
  config: Partial<AnimationConfig> = {}
): Promise<void> {
  if (states.length < 2) return;

  for (let i = 0; i < states.length - 1; i++) {
    await manager.animateToState(states[i], states[i + 1], config);
  }
}

/**
 * Create spring animation with physics
 */
export function createSpringEasing(
  stiffness: number = 100,
  damping: number = 10,
  mass: number = 1
): EasingFunction {
  return (t: number): number => {
    const omega = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    
    if (zeta < 1) {
      // Underdamped
      const omegaD = omega * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * omega * t) * Math.cos(omegaD * t);
    } else {
      // Critically damped or overdamped
      return 1 - Math.exp(-omega * t) * (1 + omega * t);
    }
  };
}

// ===== GLOBAL ANIMATION MANAGER INSTANCE =====

export const globalClockAnimationManager = new ClockAnimationManager();