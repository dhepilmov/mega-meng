import React, { useState, useRef, useEffect, useCallback } from 'react';

// Gesture Types
export interface GestureState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

export interface GestureConfig {
  minScale: number;
  maxScale: number;
  scaleStep: number;
  enablePinchZoom: boolean;
  enableDoubleTapZoom: boolean;
  enablePan: boolean;
  enableRotation: boolean;
  doubleTapZoomScale: number;
  animationDuration: number;
  threshold: {
    pinch: number;
    pan: number;
    rotation: number;
  };
}

// Default gesture configuration
export const defaultGestureConfig: GestureConfig = {
  minScale: 0.5,
  maxScale: 3.0,
  scaleStep: 0.1,
  enablePinchZoom: true,
  enableDoubleTapZoom: true,
  enablePan: false, // Disabled by default to not interfere with launcher rotation
  enableRotation: false, // Disabled by default to not interfere with launcher rotation
  doubleTapZoomScale: 2.0,
  animationDuration: 300,
  threshold: {
    pinch: 10,
    pan: 5,
    rotation: 5,
  },
};

// Gesture Hook
export const useGestures = (config: Partial<GestureConfig> = {}) => {
  const fullConfig = { ...defaultGestureConfig, ...config };
  
  const [gestureState, setGestureState] = useState<GestureState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotation: 0,
  });

  const [isGesturing, setIsGesturing] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);
  
  const touchesRef = useRef<TouchPoint[]>([]);
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const initialCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  // Helper functions
  const getDistance = (touch1: TouchPoint, touch2: TouchPoint): number => {
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1: TouchPoint, touch2: TouchPoint): number => {
    return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);
  };

  const getCenter = (touch1: TouchPoint, touch2: TouchPoint): { x: number; y: number } => {
    return {
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2,
    };
  };

  const clampScale = (scale: number): number => {
    return Math.max(fullConfig.minScale, Math.min(fullConfig.maxScale, scale));
  };

  // Touch event handlers
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    setIsGesturing(true);

    const touches: TouchPoint[] = Array.from(event.touches).map((touch, index) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));

    touchesRef.current = touches;

    if (touches.length === 2) {
      // Two finger gestures (pinch, rotate)
      initialDistanceRef.current = getDistance(touches[0], touches[1]);
      initialAngleRef.current = getAngle(touches[0], touches[1]);
      initialCenterRef.current = getCenter(touches[0], touches[1]);
    }

    // Double tap detection
    if (touches.length === 1 && fullConfig.enableDoubleTapZoom) {
      const now = Date.now();
      const timeDiff = now - lastTap;
      if (timeDiff < 300) {
        handleDoubleTap(touches[0]);
      }
      setLastTap(now);
    }
  }, [lastTap, fullConfig.enableDoubleTapZoom]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    if (!isGesturing) return;

    const touches: TouchPoint[] = Array.from(event.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));

    if (touches.length === 2 && touchesRef.current.length === 2) {
      const currentDistance = getDistance(touches[0], touches[1]);
      const currentAngle = getAngle(touches[0], touches[1]);
      const currentCenter = getCenter(touches[0], touches[1]);

      // Pinch zoom
      if (fullConfig.enablePinchZoom && initialDistanceRef.current > 0) {
        const scaleChange = currentDistance / initialDistanceRef.current;
        const newScale = clampScale(gestureState.scale * scaleChange);
        
        if (Math.abs(currentDistance - initialDistanceRef.current) > fullConfig.threshold.pinch) {
          setGestureState(prev => ({
            ...prev,
            scale: newScale,
          }));
          initialDistanceRef.current = currentDistance;
        }
      }

      // Rotation
      if (fullConfig.enableRotation) {
        const angleDiff = currentAngle - initialAngleRef.current;
        if (Math.abs(angleDiff) > fullConfig.threshold.rotation * Math.PI / 180) {
          setGestureState(prev => ({
            ...prev,
            rotation: prev.rotation + (angleDiff * 180 / Math.PI),
          }));
          initialAngleRef.current = currentAngle;
        }
      }

      // Pan (with two fingers)
      if (fullConfig.enablePan) {
        const deltaX = currentCenter.x - initialCenterRef.current.x;
        const deltaY = currentCenter.y - initialCenterRef.current.y;
        
        if (Math.abs(deltaX) > fullConfig.threshold.pan || Math.abs(deltaY) > fullConfig.threshold.pan) {
          setGestureState(prev => ({
            ...prev,
            translateX: prev.translateX + deltaX,
            translateY: prev.translateY + deltaY,
          }));
          initialCenterRef.current = currentCenter;
        }
      }
    }

    touchesRef.current = touches;
  }, [isGesturing, gestureState.scale, fullConfig]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 0) {
      setIsGesturing(false);
      touchesRef.current = [];
      initialDistanceRef.current = 0;
      initialAngleRef.current = 0;
    }
  }, []);

  const handleDoubleTap = useCallback((touch: TouchPoint) => {
    const newScale = gestureState.scale === 1 ? fullConfig.doubleTapZoomScale : 1;
    animateScale(newScale);
  }, [gestureState.scale, fullConfig.doubleTapZoomScale]);

  const animateScale = useCallback((targetScale: number) => {
    const startScale = gestureState.scale;
    const startTime = performance.now();
    const duration = fullConfig.animationDuration;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScale = startScale + (targetScale - startScale) * easeOut;

      setGestureState(prev => ({
        ...prev,
        scale: clampScale(currentScale),
      }));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [gestureState.scale, fullConfig.animationDuration]);

  // Programmatic control functions
  const zoomIn = useCallback(() => {
    const newScale = clampScale(gestureState.scale + fullConfig.scaleStep);
    animateScale(newScale);
  }, [gestureState.scale, fullConfig.scaleStep]);

  const zoomOut = useCallback(() => {
    const newScale = clampScale(gestureState.scale - fullConfig.scaleStep);
    animateScale(newScale);
  }, [gestureState.scale, fullConfig.scaleStep]);

  const resetZoom = useCallback(() => {
    animateScale(1);
    setGestureState(prev => ({
      ...prev,
      translateX: 0,
      translateY: 0,
      rotation: 0,
    }));
  }, []);

  const setScale = useCallback((scale: number) => {
    animateScale(clampScale(scale));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    gestureState,
    isGesturing,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    controls: {
      zoomIn,
      zoomOut,
      resetZoom,
      setScale,
    },
    config: fullConfig,
  };
};

// Gesture Provider Component
export interface GestureProviderProps {
  children: React.ReactNode;
  config?: Partial<GestureConfig>;
  className?: string;
  style?: React.CSSProperties;
}

export const GestureProvider: React.FC<GestureProviderProps> = ({
  children,
  config = {},
  className = '',
  style = {},
}) => {
  const { gestureState, touchHandlers } = useGestures(config);

  const transformStyle: React.CSSProperties = {
    transform: `
      scale(${gestureState.scale})
      translate(${gestureState.translateX}px, ${gestureState.translateY}px)
      rotate(${gestureState.rotation}deg)
    `,
    transformOrigin: 'center center',
    transition: 'transform 0.1s ease-out',
    ...style,
  };

  return (
    <div
      className={className}
      style={transformStyle}
      {...touchHandlers}
    >
      {children}
    </div>
  );
};

// Gesture Controls Component (optional UI controls)
export interface GestureControlsProps {
  controls: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    setScale: (scale: number) => void;
  };
  gestureState: GestureState;
  className?: string;
}

export const GestureControls: React.FC<GestureControlsProps> = ({
  controls,
  gestureState,
  className = '',
}) => {
  return (
    <div className={`gesture-controls ${className}`}>
      <button 
        onClick={controls.zoomOut}
        className="gesture-btn zoom-out"
        aria-label="Zoom Out"
      >
        -
      </button>
      
      <div className="zoom-indicator">
        {Math.round(gestureState.scale * 100)}%
      </div>
      
      <button 
        onClick={controls.zoomIn}
        className="gesture-btn zoom-in"
        aria-label="Zoom In"
      >
        +
      </button>
      
      <button 
        onClick={controls.resetZoom}
        className="gesture-btn reset-zoom"
        aria-label="Reset Zoom"
      >
        ⌂
      </button>
    </div>
  );
};

export default useGestures;