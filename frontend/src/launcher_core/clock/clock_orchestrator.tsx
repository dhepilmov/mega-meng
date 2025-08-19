//==============================================
// CLOCK ORCHESTRATOR
//==============================================
// DETAILED DESCRIPTION:
// Central coordinator for the 20-layer clock system. Manages clock state,
// distributes updates to all layers, and handles timezone-aware calculations.
// Serves as the main hub for clock functionality and layer synchronization.
// TWEAK:
// Adjust update frequency in CLOCK_CONFIG for performance tuning.
// Modify timezone calculation logic for different timezone behaviors.
// Change layer coordination logic for custom synchronization patterns.
// Update error handling for better resilience.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RotateItemConfig, ClockState, TimezoneConfig } from '../../types/launcher.types';
import { calculateClockAngles, calculateTimezoneClockAngles, normalize360 } from '../../utils/mathUtils';
import { safeGet, safeNumber, safeString } from '../../utils/safeAccessors';
import { ANIMATION_CONSTANTS, VALIDATION_LIMITS } from '../../constants/launcher.constants';

// ===== CLOCK ORCHESTRATOR CONFIGURATION =====

interface ClockOrchestratorConfig {
  updateRate: number;        // FPS for clock updates
  enableSmoothing: boolean;  // Enable smooth animations
  enableTimezones: boolean;  // Support multiple timezones
  maxLayers: number;         // Maximum number of layers
  errorRecovery: boolean;    // Auto-recovery from errors
}

const DEFAULT_CLOCK_CONFIG: ClockOrchestratorConfig = {
  updateRate: 60,
  enableSmoothing: true,
  enableTimezones: true,
  maxLayers: 20,
  errorRecovery: true,
};

// ===== CLOCK STATE INTERFACE =====

export interface ExtendedClockState extends ClockState {
  isRunning: boolean;
  frameId: number;
  lastUpdate: number;
  frameRate: number;
  errors: string[];
}

// ===== LAYER CLOCK STATE =====

interface LayerClockState {
  layerId: number;
  clockState: ClockState;
  isActive: boolean;
  lastUpdate: number;
  timezone?: TimezoneConfig;
}

// ===== CLOCK ORCHESTRATOR HOOK =====

export interface UseClockOrchestratorReturn {
  // Main clock state
  clockState: ExtendedClockState;
  
  // Layer management
  layerStates: Map<number, LayerClockState>;
  
  // Control methods
  start: () => void;
  stop: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
  
  // Layer control
  addLayer: (layerId: number, config: RotateItemConfig) => void;
  removeLayer: (layerId: number) => void;
  updateLayerConfig: (layerId: number, config: RotateItemConfig) => void;
  getLayerClockState: (layerId: number) => ClockState | null;
  
  // Configuration
  updateConfig: (config: Partial<ClockOrchestratorConfig>) => void;
  
  // Status
  getStatus: () => {
    isRunning: boolean;
    frameRate: number;
    activeLayerCount: number;
    errors: string[];
  };
}

export const useClockOrchestrator = (
  initialConfig?: Partial<ClockOrchestratorConfig>
): UseClockOrchestratorReturn => {
  
  // ===== STATE MANAGEMENT =====
  
  const [config] = useState<ClockOrchestratorConfig>({
    ...DEFAULT_CLOCK_CONFIG,
    ...initialConfig,
  });
  
  const [clockState, setClockState] = useState<ExtendedClockState>({
    hourAngle: 0,
    minuteAngle: 0,
    secondAngle: 0,
    timestamp: Date.now(),
    isRunning: false,
    frameId: 0,
    lastUpdate: Date.now(),
    frameRate: 0,
    errors: [],
  });
  
  const [layerStates, setLayerStates] = useState<Map<number, LayerClockState>>(new Map());
  
  // ===== REFS =====
  
  const animationRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const frameRateRef = useRef(0);
  
  // ===== CLOCK UPDATE FUNCTION =====
  
  const updateClock = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastFrameTimeRef.current;
    
    try {
      // Calculate main clock angles
      const angles = calculateClockAngles();
      
      // Update frame rate calculation
      frameCountRef.current++;
      if (deltaTime >= 1000) { // Update FPS every second
        frameRateRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }
      
      // Update main clock state
      setClockState(prev => ({
        ...prev,
        ...angles,
        timestamp: now,
        lastUpdate: now,
        frameId: prev.frameId + 1,
        frameRate: frameRateRef.current,
        errors: [], // Clear errors on successful update
      }));
      
      // Update layer states
      setLayerStates(prev => {
        const updated = new Map(prev);
        
        for (const [layerId, layerState] of updated) {
          if (!layerState.isActive) continue;
          
          let layerAngles: ClockState;
          
          if (layerState.timezone?.enabled === 'yes') {
            // Calculate timezone-specific angles
            layerAngles = calculateTimezoneClockAngles(
              layerState.timezone.utcOffset,
              layerState.timezone.use24Hour === 'yes'
            );
          } else {
            // Use main clock angles
            layerAngles = angles;
          }
          
          updated.set(layerId, {
            ...layerState,
            clockState: {
              ...layerAngles,
              timestamp: now,
            },
            lastUpdate: now,
          });
        }
        
        return updated;
      });
      
    } catch (error) {
      console.error('Clock update error:', error);
      
      if (config.errorRecovery) {
        setClockState(prev => ({
          ...prev,
          errors: [...prev.errors, error instanceof Error ? error.message : 'Unknown error'],
        }));
      } else {
        throw error;
      }
    }
    
    // Schedule next update
    if (clockState.isRunning) {
      const targetFrameTime = 1000 / config.updateRate;
      const actualFrameTime = Date.now() - now;
      const delay = Math.max(0, targetFrameTime - actualFrameTime);
      
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(updateClock);
      }, delay);
    }
  }, [config.updateRate, config.errorRecovery, clockState.isRunning]);
  
  // ===== CONTROL METHODS =====
  
  const start = useCallback(() => {
    if (clockState.isRunning) return;
    
    setClockState(prev => ({ ...prev, isRunning: true }));
    frameCountRef.current = 0;
    lastFrameTimeRef.current = Date.now();
    
    animationRef.current = requestAnimationFrame(updateClock);
  }, [clockState.isRunning, updateClock]);
  
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    setClockState(prev => ({ ...prev, isRunning: false }));
  }, []);
  
  const reset = useCallback(() => {
    stop();
    setClockState({
      hourAngle: 0,
      minuteAngle: 0,
      secondAngle: 0,
      timestamp: Date.now(),
      isRunning: false,
      frameId: 0,
      lastUpdate: Date.now(),
      frameRate: 0,
      errors: [],
    });
    setLayerStates(new Map());
  }, [stop]);
  
  const pause = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);
  
  const resume = useCallback(() => {
    if (clockState.isRunning && !animationRef.current) {
      animationRef.current = requestAnimationFrame(updateClock);
    }
  }, [clockState.isRunning, updateClock]);
  
  // ===== LAYER MANAGEMENT =====
  
  const addLayer = useCallback((layerId: number, config: RotateItemConfig) => {
    if (layerId < 1 || layerId > VALIDATION_LIMITS.LAYER_COUNT.MAX) {
      console.warn(`Layer ID ${layerId} is out of valid range (1-${VALIDATION_LIMITS.LAYER_COUNT.MAX})`);
      return;
    }
    
    const layerState: LayerClockState = {
      layerId,
      clockState: {
        hourAngle: 0,
        minuteAngle: 0,
        secondAngle: 0,
        timestamp: Date.now(),
      },
      isActive: config.handType !== null && config.handType !== undefined,
      lastUpdate: Date.now(),
      timezone: config.timezone || undefined,
    };
    
    setLayerStates(prev => new Map(prev).set(layerId, layerState));
  }, []);
  
  const removeLayer = useCallback((layerId: number) => {
    setLayerStates(prev => {
      const updated = new Map(prev);
      updated.delete(layerId);
      return updated;
    });
  }, []);
  
  const updateLayerConfig = useCallback((layerId: number, config: RotateItemConfig) => {
    setLayerStates(prev => {
      const updated = new Map(prev);
      const existing = updated.get(layerId);
      
      if (existing) {
        updated.set(layerId, {
          ...existing,
          isActive: config.handType !== null && config.handType !== undefined,
          timezone: config.timezone || undefined,
        });
      }
      
      return updated;
    });
  }, []);
  
  const getLayerClockState = useCallback((layerId: number): ClockState | null => {
    const layerState = layerStates.get(layerId);
    return layerState ? layerState.clockState : null;
  }, [layerStates]);
  
  // ===== STATUS AND CONFIGURATION =====
  
  const updateConfig = useCallback((newConfig: Partial<ClockOrchestratorConfig>) => {
    // Configuration updates would require restart for some properties
    console.warn('Dynamic config updates not yet implemented');
  }, []);
  
  const getStatus = useCallback(() => ({
    isRunning: clockState.isRunning,
    frameRate: clockState.frameRate,
    activeLayerCount: Array.from(layerStates.values()).filter(l => l.isActive).length,
    errors: clockState.errors,
  }), [clockState, layerStates]);
  
  // ===== CLEANUP =====
  
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        clearTimeout(animationRef.current);
      }
    };
  }, []);
  
  // ===== AUTO-START =====
  
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);
  
  // ===== RETURN INTERFACE =====
  
  return {
    clockState,
    layerStates,
    start,
    stop,
    reset,
    pause,
    resume,
    addLayer,
    removeLayer,
    updateLayerConfig,
    getLayerClockState,
    updateConfig,
    getStatus,
  };
};