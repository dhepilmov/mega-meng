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

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { RotateItemConfig, ClockState } from '../../../types/launcher.types';
import { 
  calculateRotationAngle, 
  calculateTransformMatrix, 
  normalize360,
  calculateDualRotationSystem,
  calculateAdvancedTransformOrigin,
  calculateLayerComplexity,
  DualRotationResult
} from '../../../utils/mathUtils';
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
  });
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  
  // ===== MEMOIZED CALCULATIONS =====
  
  // Check if this layer is configured as a clock hand
  const isClockHand = useMemo(() => {
    return config.handType && config.handType !== null && 
           config.handRotation && config.handRotation !== null;
  }, [config.handType, config.handRotation]);
  
  // Get the active rotation configuration
  const activeRotationConfig = useMemo(() => {
    if (isClockHand && config.handRotation === 'ROTATION1') {
      return config.rotation1;
    } else if (isClockHand && config.handRotation === 'ROTATION2') {
      return config.rotation2;
    }
    
    // For non-clock items, prefer rotation1 if enabled, otherwise rotation2
    if (safeString(config.rotation1?.enabled) === 'yes') {
      return config.rotation1;
    } else if (safeString(config.rotation2?.enabled) === 'yes') {
      return config.rotation2;
    }
    
    return null;
  }, [isClockHand, config.handRotation, config.rotation1, config.rotation2]);
  
  // Calculate visibility
  const isLayerVisible = useMemo(() => {
    return safeString(config.itemDisplay) === 'yes' && 
           safeString(config.render) === 'yes' &&
           config.itemPath && 
           config.itemPath.length > 0;
  }, [config.itemDisplay, config.render, config.itemPath]);
  
  // ===== ROTATION CALCULATIONS =====
  
  const calculateLayerRotation = useCallback((timestamp: number): number => {
    try {
      // Clock hands use real-time angles
      if (isClockHand && clockState) {
        switch (config.handType) {
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
      
      // Non-clock items use time-based rotation
      if (activeRotationConfig && safeString(activeRotationConfig.enabled) === 'yes') {
        const rotationSpeed = safeNumber(activeRotationConfig.rotationSpeed, 86400);
        const direction = safeString(activeRotationConfig.rotationWay, 'no');
        const initialAngle = safeNumber(activeRotationConfig.itemTiltPosition, 0);
        
        return calculateRotationAngle(
          startTimeRef.current,
          timestamp,
          rotationSpeed,
          direction as any,
          initialAngle
        );
      }
      
      return safeNumber(activeRotationConfig?.itemTiltPosition, 0);
    } catch (error) {
      const errorMsg = `Rotation calculation error for layer ${config.itemCode}: ${error}`;
      console.error(errorMsg);
      onError?.(errorMsg);
      return 0;
    }
  }, [isClockHand, clockState, config.handType, config.itemCode, activeRotationConfig, onError]);
  
  // ===== POSITION CALCULATIONS =====
  
  const calculateLayerPosition = useCallback(() => {
    try {
      let positionX = 0;
      let positionY = 0;
      
      // Apply rotation1 positioning if enabled
      if (safeString(config.rotation1?.enabled) === 'yes') {
        positionX += safeNumber(config.rotation1.itemPositionX, 0);
        positionY += safeNumber(config.rotation1.itemPositionY, 0);
      }
      
      // Apply rotation2 positioning if enabled (orbital positioning)
      if (safeString(config.rotation2?.enabled) === 'yes') {
        const orbitalX = safeNumber(config.rotation2.itemPositionX, 0);
        const orbitalY = safeNumber(config.rotation2.itemPositionY, 0);
        
        // TODO: Implement orbital mechanics here
        // For now, just add the position values
        positionX += orbitalX;
        positionY += orbitalY;
      }
      
      return { x: positionX, y: positionY };
    } catch (error) {
      const errorMsg = `Position calculation error for layer ${config.itemCode}: ${error}`;
      console.error(errorMsg);
      onError?.(errorMsg);
      return { x: 0, y: 0 };
    }
  }, [config.rotation1, config.rotation2, config.itemCode, onError]);
  
  // ===== TRANSFORM ORIGIN CALCULATION =====
  
  const calculateTransformOrigin = useCallback(() => {
    if (isClockHand && activeRotationConfig) {
      const axisX = safeNumber(activeRotationConfig.itemAxisX, 50);
      const axisY = safeNumber(activeRotationConfig.itemAxisY, 50);
      return `${axisX}% ${axisY}%`;
    }
    
    return '50% 50%'; // Default center
  }, [isClockHand, activeRotationConfig]);
  
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
    const rotation = calculateLayerRotation(now);
    const position = calculateLayerPosition();
    const size = safeNumber(config.itemSize, 100) / 100; // Convert percentage to scale
    
    // Create transform matrix
    const transform = calculateTransformMatrix(
      position.x,
      position.y,
      rotation,
      size
    );
    
    // Calculate effects
    const effects = calculateLayerEffects();
    
    setLayerState(prev => ({
      ...prev,
      currentTransform: transform,
      currentEffects: effects,
      lastUpdateTime: now,
      isVisible: isLayerVisible,
    }));
    
    // Schedule next update for non-clock items (clock hands update via clockState changes)
    if (!isClockHand && !isPaused) {
      animationRef.current = requestAnimationFrame(updateLayerState);
    }
  }, [
    isPaused, 
    isLayerVisible, 
    calculateLayerRotation, 
    calculateLayerPosition, 
    calculateLayerEffects,
    config.itemSize,
    isClockHand
  ]);
  
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
    transformOrigin: calculateTransformOrigin(),
    zIndex: Z_INDEX.CLOCK_LAYERS_START + config.itemLayer,
    pointerEvents: 'none',
    ...layerState.currentEffects,
    
    // Debug styles
    ...(debugMode && {
      border: '1px dashed rgba(255, 0, 0, 0.5)',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
    }),
  }), [layerState.currentTransform, layerState.currentEffects, calculateTransformOrigin, config.itemLayer, debugMode]);
  
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
          }}
        >
          {config.itemCode} | Layer {config.itemLayer}
          {isClockHand && ` | ${config.handType}`}
        </div>
      )}
    </div>
  );
};

// ===== DEFAULT EXPORT =====

export default ClockLayer01;