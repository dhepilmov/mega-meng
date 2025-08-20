//==============================================
// CLOCK LAYER 01 COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// Template for individual clock layer components. Each layer is independent
// with its own configuration, effects, rotations, and clock functionality.
// This serves as the foundation for all 20 layers in the system.
// TWEAK:
// Modify rotation calculations for different movement patterns.
// Adjust effect applications for custom visual enhancements.
// Change position calculations for different layout behaviors.
// Update error handling for better layer resilience.

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { RotateItemConfig, ClockState } from '../../../types/launcher.types';
import { 
  calculateRotationAngle, 
  calculateTransformMatrix, 
  normalize360,
  calculateDualRotationSystem,
  calculateAdvancedTransformOrigin,
  calculateLayerComplexity
} from '../../../utils/mathUtils';
import type { DualRotationResult } from '../../../utils/mathUtils';
import { safeGet, safeNumber, safeString, safeBoolean } from '../../../utils/safeAccessors';
import { applyLayerEffects, layerImageStyles } from '../../../styles/layer.styles';
import { ANIMATION_CONSTANTS, VALIDATION_LIMITS, Z_INDEX } from '../../../constants/launcher.constants';

// ===== LAYER COMPONENT PROPS =====

export interface ClockLayerProps {
  // Configuration
  config: RotateItemConfig;
  clockState: ClockState;
  
  // Container information
  containerSize: { width: number; height: number };
  
  // Event handlers
  onConfigChange?: (config: RotateItemConfig) => void;
  onError?: (error: string) => void;
  
  // Control flags
  debugMode?: boolean;
  isPaused?: boolean;
  forceUpdate?: boolean;
}

// ===== LAYER STATE =====

interface LayerState {
  isVisible: boolean;
  currentTransform: string;
  currentEffects: React.CSSProperties;
  animationStartTime: number;
  lastUpdateTime: number;
  errors: string[];
  
  // Phase 3: Enhanced dual rotation state
  dualRotationResult: DualRotationResult | null;
  layerComplexity: {
    complexity: 'low' | 'medium' | 'high';
    score: number;
    recommendations: string[];
  };
  transformOrigin: string;
}

// ===== CLOCK LAYER COMPONENT =====

export const ClockLayer01: React.FC<ClockLayerProps> = ({
  config,
  clockState,
  containerSize,
  onConfigChange,
  onError,
  debugMode = false,
  isPaused = false,
  forceUpdate = false,
}) => {
  
  // ===== STATE MANAGEMENT =====
  
  const [layerState, setLayerState] = useState<LayerState>({
    isVisible: true,
    currentTransform: '',
    currentEffects: {},
    animationStartTime: Date.now(),
    lastUpdateTime: Date.now(),
    errors: [],
    
    // Phase 3: Enhanced dual rotation initialization
    dualRotationResult: null,
    layerComplexity: {
      complexity: 'low',
      score: 0,
      recommendations: []
    },
    transformOrigin: '50% 50%',
  });
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  
  // ===== MEMOIZED CALCULATIONS =====
  
  // Check if this layer is configured as a clock hand
  const isClockHand = useMemo(() => {
    return !!(config.handType && config.handType !== null && 
              config.handRotation && config.handRotation !== null);
  }, [config.handType, config.handRotation]);
  
  // Calculate visibility
  const isLayerVisible = useMemo(() => {
    return safeString(config.itemDisplay) === 'yes' && 
           safeString(config.render) === 'yes' &&
           config.itemPath && 
           config.itemPath.length > 0;
  }, [config.itemDisplay, config.render, config.itemPath]);
  
  // ===== PHASE 3: DUAL ROTATION CALCULATIONS =====
  
  const calculateLayerRotation = useCallback((timestamp: number): DualRotationResult => {
    try {
      // For clock hands, use real-time angles for rotation1
      if (isClockHand && clockState) {
        let clockAngle = 0;
        switch (config.handType) {
          case 'hour':
            clockAngle = clockState.hourAngle;
            break;
          case 'minute':
            clockAngle = clockState.minuteAngle;
            break;
          case 'second':
            clockAngle = clockState.secondAngle;
            break;
          default:
            clockAngle = 0;
        }
        
        // For clock hands, override rotation1 angle but keep positioning
        const dualConfig = {
          rotation1: {
            ...config.rotation1,
            enabled: 'yes' as const,
            rotationWay: '+' as const,
            rotationSpeed: 1, // Ignored for clock hands
            itemTiltPosition: clockAngle // Use real-time clock angle
          },
          rotation2: {
            ...config.rotation2,
            itemRotateAxisX: config.rotation2?.itemAxisX || 0,
            itemRotateAxisY: config.rotation2?.itemAxisY || 0,
            itemTiltPosition: config.rotation2?.itemTiltPosition || 0
          }
        };
        
        return calculateDualRotationSystem(dualConfig, timestamp, startTimeRef.current);
      }
      
      // For non-clock items, use time-based dual rotation system
      return calculateDualRotationSystem(
        {
          rotation1: config.rotation1,
          rotation2: config.rotation2
        },
        timestamp,
        startTimeRef.current
      );
      
    } catch (error) {
      const errorMsg = `Dual rotation calculation error for layer ${config.itemCode}: ${error}`;
      console.error(errorMsg);
      onError?.(errorMsg);
      
      // Return safe default
      return {
        finalPosition: { x: 0, y: 0 },
        rotation1Angle: 0,
        rotation2Angle: 0,
        rotation1Transform: 'rotate(0deg)',
        rotation2Transform: 'translate(0px, 0px)',
        combinedTransform: 'translate(0px, 0px) rotate(0deg) scale(1)'
      };
    }
  }, [isClockHand, clockState, config.handType, config.rotation1, config.rotation2, config.itemCode, onError]);

  // ===== TRANSFORM ORIGIN CALCULATION =====
  
  const calculateTransformOrigin = useCallback(() => {
    // Determine which rotation system is primary
    const useRotation1 = safeString(config.rotation1?.enabled) === 'yes';
    const useRotation2 = safeString(config.rotation2?.enabled) === 'yes';
    
    if (useRotation1 && !useRotation2) {
      // Pure spin system - use rotation1 axis
      return calculateAdvancedTransformOrigin(config.rotation1, false);
    } else if (useRotation2) {
      // Orbital system (with or without spin) - use center for orbital motion
      return calculateAdvancedTransformOrigin({}, true);
    } else {
      // No rotation - use center
      return '50% 50%';
    }
  }, [config.rotation1, config.rotation2]);
  
  // ===== EFFECTS APPLICATION =====
  
  const calculateLayerEffects = useCallback((): React.CSSProperties => {
    return applyLayerEffects({}, {
      shadow: safeBoolean(config.shadow === 'yes'),
      glow: safeBoolean(config.glow === 'yes'),
      transparent: safeBoolean(config.transparent === 'yes'),
      pulse: safeBoolean(config.pulse === 'yes'),
      render: safeBoolean(config.render === 'yes'),
    });
  }, [config.shadow, config.glow, config.transparent, config.pulse, config.render]);
  
  // ===== UPDATE LAYER STATE =====
  
  const updateLayerState = useCallback(() => {
    if (isPaused || !isLayerVisible) return;
    
    const now = Date.now();
    const size = safeNumber(config.itemSize, 100) / 100; // Convert percentage to scale
    
    // Phase 3: Calculate dual rotation system
    const dualRotationResult = calculateLayerRotation(now);
    
    // Calculate layer complexity for performance monitoring
    const layerComplexity = calculateLayerComplexity({
      rotation1: config.rotation1,
      rotation2: config.rotation2,
      hasEffects: config.shadow === 'yes' || config.glow === 'yes' || 
                  config.transparent === 'yes' || config.pulse === 'yes',
      isClockHand: isClockHand
    });
    
    // Calculate transform origin based on rotation system
    const transformOrigin = calculateTransformOrigin();
    
    // Create the final transform (dual rotation system handles everything)
    const finalTransform = dualRotationResult.combinedTransform.replace(
      'scale(1)',
      `scale(${size})`
    );
    
    // Calculate effects
    const effects = calculateLayerEffects();
    
    setLayerState(prev => ({
      ...prev,
      currentTransform: finalTransform,
      currentEffects: effects,
      lastUpdateTime: now,
      isVisible: isLayerVisible,
      
      // Phase 3: Enhanced state
      dualRotationResult,
      layerComplexity,
      transformOrigin,
    }));
    
  }, [
    isPaused, 
    isLayerVisible, 
    calculateLayerRotation,
    calculateTransformOrigin,
    calculateLayerEffects,
    config.itemSize,
    config.rotation1,
    config.rotation2,
    config.shadow,
    config.glow,
    config.transparent,
    config.pulse,
    isClockHand
  ]);
  
  // Separate animation loop for non-clock items
  const animationLoop = useCallback(() => {
    updateLayerState();
    if (!isClockHand && !isPaused && isLayerVisible) {
      animationRef.current = requestAnimationFrame(animationLoop);
    }
  }, [updateLayerState, isClockHand, isPaused, isLayerVisible]);

  // ===== EFFECTS =====
  
  // Update when clock state changes (for clock hands)
  useEffect(() => {
    if (isClockHand) {
      updateLayerState();
    }
  }, [clockState, isClockHand, updateLayerState]);
  
  // Update when configuration changes
  useEffect(() => {
    updateLayerState();
  }, [config, updateLayerState]);
  
  // Start animation for non-clock items
  useEffect(() => {
    if (!isClockHand && !isPaused && isLayerVisible) {
      startTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(updateLayerState);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClockHand, isPaused, isLayerVisible, updateLayerState]);
  
  // Force update when requested
  useEffect(() => {
    if (forceUpdate) {
      updateLayerState();
    }
  }, [forceUpdate, updateLayerState]);
  
  // ===== LAYER STYLES =====
  
  const layerBaseStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) ${layerState.currentTransform}`,
    transformOrigin: layerState.transformOrigin,
    zIndex: Z_INDEX.CLOCK_LAYERS_START + config.itemLayer,
    pointerEvents: 'none',
    ...layerState.currentEffects,
    
    // Debug styles
    ...(debugMode && {
      border: '1px dashed rgba(255, 0, 0, 0.5)',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
    }),
  }), [
    layerState.currentTransform, 
    layerState.currentEffects, 
    layerState.transformOrigin, 
    config.itemLayer, 
    debugMode
  ]);
  
  // ===== ERROR HANDLING =====
  
  if (layerState.errors.length > 0 && debugMode) {
    console.warn(`Layer ${config.itemCode} errors:`, layerState.errors);
  }
  
  // ===== RENDER =====
  
  if (!isLayerVisible) {
    return null;
  }
  
  return (
    <div
      className={`clock-layer clock-layer-${config.itemCode}`}
      style={layerBaseStyle}
      data-layer-id={config.itemLayer}
      data-layer-code={config.itemCode}
    >
      <img
        src={config.itemPath}
        alt={config.itemName}
        style={layerImageStyles}
        draggable={false}
        onError={(e) => {
          const errorMsg = `Failed to load image: ${config.itemPath}`;
          console.error(errorMsg);
          onError?.(errorMsg);
        }}
        onLoad={() => {
          if (debugMode) {
            console.log(`Layer ${config.itemCode} image loaded successfully`);
          }
        }}
      />
      
      {/* Debug Information */}
      {debugMode && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            fontSize: '10px',
            color: 'red',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '2px 4px',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            maxWidth: '200px',
            zIndex: 1000,
          }}
        >
          <div>{config.itemCode} | Layer {config.itemLayer}</div>
          {isClockHand && <div>{config.handType} hand</div>}
          <div>Complexity: {layerState.layerComplexity.complexity}</div>
          {layerState.dualRotationResult && (
            <>
              <div>R1: {layerState.dualRotationResult.rotation1Angle.toFixed(1)}°</div>
              <div>R2: {layerState.dualRotationResult.rotation2Angle.toFixed(1)}°</div>
              <div>Pos: {layerState.dualRotationResult.finalPosition.x.toFixed(1)}, {layerState.dualRotationResult.finalPosition.y.toFixed(1)}</div>
            </>
          )}
          {layerState.layerComplexity.recommendations.length > 0 && (
            <div style={{ color: 'yellow', fontSize: '9px' }}>
              ⚠ {layerState.layerComplexity.recommendations[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== DEFAULT EXPORT =====

export default ClockLayer01;