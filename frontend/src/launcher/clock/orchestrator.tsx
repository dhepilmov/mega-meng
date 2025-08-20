//==============================================
// CLOCK ORCHESTRATOR
//==============================================
// DETAILED DESCRIPTION:
// Central coordinator for the 20-layer clock system. Manages clock state,
// distributes updates to all layers, and handles timezone-aware calculations.
// Serves as the main hub for clock functionality and layer synchronization.
// PHASE 6: Consolidated into unified launcher module structure.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RotateItemConfig, ClockState, TimezoneConfig } from '../types/launcher.types';
import { calculateClockAngles, calculateTimezoneClockAngles, normalize360 } from '../utils/mathUtils';
import { safeGet, safeNumber, safeString } from '../utils/safeAccessors';
import { ANIMATION_CONSTANTS, VALIDATION_LIMITS } from '../constants/launcher.constants';

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
  isActive: boolean;
  clockAngles: {
    hour: number;
    minute: number;
    second: number;
  };
  timezone: TimezoneConfig;
  lastUpdate: number;
  handType: 'hour' | 'minute' | 'second' | 'none';
}

// ===== PERFORMANCE MONITORING =====

interface PerformanceMetrics {
  averageFPS: number;
  frameTime: number;
  memoryUsage: number;
  activeLayerCount: number;
  totalUpdateTime: number;
}

// ===== MAIN CLOCK ORCHESTRATOR HOOK =====

export const useClockOrchestrator = (
  configs: RotateItemConfig[],
  customConfig?: Partial<ClockOrchestratorConfig>
) => {
  const config = useMemo(() => ({
    ...DEFAULT_CLOCK_CONFIG,
    ...customConfig,
  }), [customConfig]);

  // ===== STATE MANAGEMENT =====
  
  const [clockState, setClockState] = useState<ExtendedClockState>({
    currentTime: new Date(),
    isRunning: false,
    frameId: 0,
    lastUpdate: 0,
    frameRate: 0,
    errors: [],
  });
  
  const [layerStates, setLayerStates] = useState<Map<number, LayerClockState>>(new Map());
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    averageFPS: 0,
    frameTime: 0,
    memoryUsage: 0,
    activeLayerCount: 0,
    totalUpdateTime: 0,
  });
  
  // ===== REFS FOR PERFORMANCE =====
  
  const animationFrameId = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const fpsArray = useRef<number[]>([]);
  const performanceStartTime = useRef<number>(0);
  
  // ===== LAYER STATE MANAGEMENT =====
  
  const updateLayerStates = useCallback((newConfigs: RotateItemConfig[]) => {
    const newLayerStates = new Map<number, LayerClockState>();
    
    newConfigs.forEach((config) => {
      const layerId = safeNumber(config.itemLayer, 1);
      const handType = safeGet(config, 'handType', 'none') as 'hour' | 'minute' | 'second' | 'none';
      
      const layerState: LayerClockState = {
        layerId,
        isActive: safeGet(config, 'itemDisplay') === 'yes' && safeGet(config, 'render') === 'yes',
        clockAngles: { hour: 0, minute: 0, second: 0 },
        timezone: {
          enabled: safeGet(config, 'timezone.enabled', 'no') as 'yes' | 'no',
          utcOffset: safeNumber(config.timezone?.utcOffset, 0),
          use24Hour: safeGet(config, 'timezone.use24Hour', 'no') as 'yes' | 'no',
        },
        lastUpdate: Date.now(),
        handType,
      };
      
      newLayerStates.set(layerId, layerState);
    });
    
    setLayerStates(newLayerStates);
    
    // Update performance metrics
    setPerformance(prev => ({
      ...prev,
      activeLayerCount: Array.from(newLayerStates.values()).filter(layer => layer.isActive).length,
    }));
    
  }, []);
  
  // ===== CLOCK ANGLE CALCULATIONS =====
  
  const updateClockAngles = useCallback((currentTime: Date) => {
    const updateStartTime = performance.now();
    
    setLayerStates(prev => {
      const updated = new Map(prev);
      
      updated.forEach((layerState, layerId) => {
        if (!layerState.isActive) return;
        
        let angles: { hour: number; minute: number; second: number };
        
        if (layerState.timezone.enabled === 'yes' && config.enableTimezones) {
          angles = calculateTimezoneClockAngles(currentTime, {
            utcOffset: layerState.timezone.utcOffset,
            use24Hour: layerState.timezone.use24Hour === 'yes',
          });
        } else {
          angles = calculateClockAngles(currentTime);
        }
        
        // Apply smoothing if enabled
        if (config.enableSmoothing) {
          const prev = layerState.clockAngles;
          angles = {
            hour: smoothAngleTransition(prev.hour, angles.hour, 0.1),
            minute: smoothAngleTransition(prev.minute, angles.minute, 0.2),
            second: smoothAngleTransition(prev.second, angles.second, 0.5),
          };
        }
        
        updated.set(layerId, {
          ...layerState,
          clockAngles: angles,
          lastUpdate: Date.now(),
        });
      });
      
      return updated;
    });
    
    // Update performance metrics
    const updateTime = performance.now() - updateStartTime;
    setPerformance(prev => ({
      ...prev,
      totalUpdateTime: updateTime,
    }));
    
  }, [config.enableSmoothing, config.enableTimezones]);
  
  // ===== SMOOTH ANGLE TRANSITION =====
  
  const smoothAngleTransition = useCallback((currentAngle: number, targetAngle: number, factor: number): number => {
    const diff = normalize360(targetAngle - currentAngle);
    return normalize360(currentAngle + diff * factor);
  }, []);
  
  // ===== ANIMATION LOOP =====
  
  const animationLoop = useCallback((timestamp: number) => {
    if (!clockState.isRunning) return;
    
    const deltaTime = timestamp - lastFrameTime.current;
    const targetFrameTime = 1000 / config.updateRate;
    
    if (deltaTime >= targetFrameTime) {
      // Update clock state
      const currentTime = new Date();
      
      setClockState(prev => ({
        ...prev,
        currentTime,
        lastUpdate: timestamp,
        frameId: prev.frameId + 1,
      }));
      
      // Update clock angles
      updateClockAngles(currentTime);
      
      // Calculate FPS
      frameCount.current++;
      const fps = 1000 / deltaTime;
      fpsArray.current.push(fps);
      
      if (fpsArray.current.length > 60) {
        fpsArray.current.shift();
      }
      
      const averageFPS = fpsArray.current.reduce((a, b) => a + b, 0) / fpsArray.current.length;
      
      setClockState(prev => ({
        ...prev,
        frameRate: averageFPS,
      }));
      
      setPerformance(prev => ({
        ...prev,
        averageFPS,
        frameTime: deltaTime,
      }));
      
      lastFrameTime.current = timestamp;
    }
    
    animationFrameId.current = requestAnimationFrame(animationLoop);
  }, [clockState.isRunning, config.updateRate, updateClockAngles]);
  
  // ===== START/STOP CONTROLS =====
  
  const startClock = useCallback(() => {
    if (clockState.isRunning) return;
    
    setClockState(prev => ({ ...prev, isRunning: true }));
    lastFrameTime.current = performance.now();
    performanceStartTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(animationLoop);
    
    console.log('Clock orchestrator started');
  }, [clockState.isRunning, animationLoop]);
  
  const stopClock = useCallback(() => {
    if (!clockState.isRunning) return;
    
    setClockState(prev => ({ ...prev, isRunning: false }));
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = 0;
    }
    
    console.log('Clock orchestrator stopped');
  }, [clockState.isRunning]);
  
  // ===== ERROR HANDLING =====
  
  const addError = useCallback((error: string) => {
    console.error('Clock orchestrator error:', error);
    
    setClockState(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-4), error], // Keep last 5 errors
    }));
    
    if (config.errorRecovery) {
      // Attempt to recover by restarting the clock
      setTimeout(() => {
        if (clockState.isRunning) {
          stopClock();
          setTimeout(startClock, 100);
        }
      }, 1000);
    }
  }, [config.errorRecovery, clockState.isRunning, stopClock, startClock]);
  
  // ===== MEMORY MONITORING =====
  
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setPerformance(prev => ({
        ...prev,
        memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024, // MB
      }));
    }
  }, []);
  
  // ===== LAYER UTILITIES =====
  
  const getLayerClockState = useCallback((layerId: number): LayerClockState | null => {
    return layerStates.get(layerId) || null;
  }, [layerStates]);
  
  const isLayerActive = useCallback((layerId: number): boolean => {
    const layerState = layerStates.get(layerId);
    return layerState?.isActive || false;
  }, [layerStates]);
  
  const getActiveLayerIds = useCallback((): number[] => {
    return Array.from(layerStates.entries())
      .filter(([_, state]) => state.isActive)
      .map(([id, _]) => id);
  }, [layerStates]);
  
  // ===== LIFECYCLE MANAGEMENT =====
  
  useEffect(() => {
    updateLayerStates(configs);
  }, [configs, updateLayerStates]);
  
  useEffect(() => {
    startClock();
    
    return () => {
      stopClock();
    };
  }, [startClock, stopClock]);
  
  useEffect(() => {
    const memoryInterval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(memoryInterval);
  }, [updateMemoryUsage]);
  
  // ===== ERROR BOUNDARY =====
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error && event.error.message.includes('clock')) {
        addError(event.error.message);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [addError]);
  
  // ===== PUBLIC API =====
  
  return {
    // Clock state
    clockState,
    layerStates,
    performance,
    
    // Controls
    startClock,
    stopClock,
    
    // Layer management
    updateClockLayers: updateLayerStates,
    getLayerClockState,
    isLayerActive,
    getActiveLayerIds,
    
    // Utilities
    getCurrentTime: () => clockState.currentTime,
    getFrameRate: () => clockState.frameRate,
    getErrors: () => clockState.errors,
    
    // Performance
    getPerformanceMetrics: () => performance,
    resetPerformanceMetrics: () => {
      frameCount.current = 0;
      fpsArray.current = [];
      setPerformance({
        averageFPS: 0,
        frameTime: 0,
        memoryUsage: 0,
        activeLayerCount: layerStates.size,
        totalUpdateTime: 0,
      });
    },
  };
};

export default useClockOrchestrator;