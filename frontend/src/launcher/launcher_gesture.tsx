import React, { useState, useRef, useCallback, useEffect } from 'react';

// Combined Gesture Types
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

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

export interface GestureConfig {
  // Zoom settings
  minScale: number;
  maxScale: number;
  scaleStep: number;
  enablePinchZoom: boolean;
  enableDoubleTapZoom: boolean;
  doubleTapZoomScale: number;
  
  // Pan/Rotation settings
  enablePan: boolean;
  enableRotation: boolean;
  
  // Extended gestures
  enableSwipe: boolean;
  enableLongPress: boolean;
  
  // Multi-tap settings
  enableMultiTap: boolean;
  multiTapWindow: number;
  
  // Timing
  animationDuration: number;
  longPressDuration: number;
  
  // Thresholds
  threshold: {
    pinch: number;
    pan: number;
    rotation: number;
    swipe: number;
  };
}

// Default configuration
export const defaultGestureConfig: GestureConfig = {
  minScale: 0.3,
  maxScale: 4.0,
  scaleStep: 0.2,
  enablePinchZoom: true,
  enableDoubleTapZoom: true,
  doubleTapZoomScale: 2.0,
  enablePan: false,
  enableRotation: false,
  enableSwipe: false,
  enableLongPress: false,
  enableMultiTap: true,
  multiTapWindow: 500, // 500ms window for multi-tap detection
  animationDuration: 300,
  longPressDuration: 500,
  threshold: {
    pinch: 10,
    pan: 5,
    rotation: 5,
    swipe: 50,
  },
};

// Main Gesture Hook
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
  const [tapCount, setTapCount] = useState<number>(0);
  const [swipeState, setSwipeState] = useState<SwipeGesture | null>(null);
  const [longPressActive, setLongPressActive] = useState(false);
  
  // Refs
  const touchesRef = useRef<TouchPoint[]>([]);
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const initialCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Animation helper
  const animateScale = useCallback((targetScale: number) => {
    const startScale = gestureState.scale;
    const startTime = performance.now();
    const duration = fullConfig.animationDuration;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

  // Multi-tap gesture functions
  const calibrateCenter = useCallback(() => {
    console.log('3-tap gesture: Calibrating center');
    setGestureState(prev => ({
      ...prev,
      translateX: 0,
      translateY: 0,
      // Keep scale and rotation unchanged
    }));
  }, []);

  const resetZoom = useCallback(() => {
    console.log('4-tap gesture: Resetting zoom');
    animateScale(1);
    // Keep translateX, translateY, and rotation unchanged
  }, []);

  const resetEverything = useCallback(() => {
    console.log('5-tap gesture: Resetting everything');
    animateScale(1);
    setGestureState(prev => ({
      ...prev,
      translateX: 0,
      translateY: 0,
      rotation: 0,
      // scale will be reset by animateScale
    }));
  }, []);

  const sixTapFunction = useCallback(() => {
    console.log('6-tap gesture: Function reserved for future use');
    // Placeholder for future functionality
  }, []);

  // Handle multi-tap detection
  const handleMultiTap = useCallback((newTapCount: number) => {
    if (!fullConfig.enableMultiTap) return;

    switch (newTapCount) {
      case 2:
        // Double tap zoom (existing functionality)
        const newScale = gestureState.scale === 1 ? fullConfig.doubleTapZoomScale : 1;
        animateScale(newScale);
        break;
      case 3:
        calibrateCenter();
        break;
      case 4:
        resetZoom();
        break;
      case 5:
        resetEverything();
        break;
      case 6:
        sixTapFunction();
        break;
      default:
        // Do nothing for other tap counts
        break;
    }
  }, [gestureState.scale, fullConfig, calibrateCenter, resetZoom, resetEverything, sixTapFunction]);

  // Touch event handlers
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    setIsGesturing(true);

    const touches: TouchPoint[] = Array.from(event.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));

    touchesRef.current = touches;

    if (touches.length === 2) {
      // Two finger gestures
      initialDistanceRef.current = getDistance(touches[0], touches[1]);
      initialAngleRef.current = getAngle(touches[0], touches[1]);
      initialCenterRef.current = getCenter(touches[0], touches[1]);
    }

    if (touches.length === 1) {
      const touch = touches[0];
      
      // Multi-tap detection
      if (fullConfig.enableMultiTap) {
        const now = Date.now();
        const timeDiff = now - lastTap;
        
        if (timeDiff < fullConfig.multiTapWindow) {
          const newTapCount = tapCount + 1;
          setTapCount(newTapCount);
          
          // Clear existing timer
          if (tapTimerRef.current) {
            clearTimeout(tapTimerRef.current);
          }
          
          // Set new timer to execute gesture after window expires
          tapTimerRef.current = setTimeout(() => {
            handleMultiTap(newTapCount);
            setTapCount(0);
          }, fullConfig.multiTapWindow);
          
        } else {
          // Reset tap count if too much time has passed
          setTapCount(1);
          
          // Clear existing timer
          if (tapTimerRef.current) {
            clearTimeout(tapTimerRef.current);
          }
          
          // Set timer for single tap
          tapTimerRef.current = setTimeout(() => {
            handleMultiTap(1);
            setTapCount(0);
          }, fullConfig.multiTapWindow);
        }
        
        setLastTap(now);
      }
      
      // Legacy double tap detection (fallback)
      else if (fullConfig.enableDoubleTapZoom) {
        const now = Date.now();
        const timeDiff = now - lastTap;
        if (timeDiff < 300) {
          const newScale = gestureState.scale === 1 ? fullConfig.doubleTapZoomScale : 1;
          animateScale(newScale);
        }
        setLastTap(now);
      }

      // Swipe start
      if (fullConfig.enableSwipe) {
        swipeStartRef.current = { x: touch.x, y: touch.y, time: Date.now() };
        setSwipeState(null);
      }

      // Long press start
      if (fullConfig.enableLongPress) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
        }
        longPressTimerRef.current = setTimeout(() => {
          setLongPressActive(true);
        }, fullConfig.longPressDuration);
      }
    }
  }, [lastTap, tapCount, gestureState.scale, fullConfig, handleMultiTap]);

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
          setGestureState(prev => ({ ...prev, scale: newScale }));
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

      // Pan
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

    // Cancel long press on move
    if (fullConfig.enableLongPress && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
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

      // Handle swipe end
      if (fullConfig.enableSwipe && swipeStartRef.current) {
        const touch = event.changedTouches[0];
        if (touch) {
          const endTime = Date.now();
          const duration = endTime - swipeStartRef.current.time;
          const deltaX = touch.clientX - swipeStartRef.current.x;
          const deltaY = touch.clientY - swipeStartRef.current.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const velocity = distance / duration;

          if (distance > fullConfig.threshold.swipe && velocity > 0.5) {
            let direction: SwipeGesture['direction'];
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              direction = deltaX > 0 ? 'right' : 'left';
            } else {
              direction = deltaY > 0 ? 'down' : 'up';
            }

            setSwipeState({ direction, distance, velocity });
          }
        }
        swipeStartRef.current = null;
      }

      // Clear long press
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setLongPressActive(false);
    }
  }, [fullConfig]);

  // Control functions
  const zoomIn = useCallback(() => {
    const newScale = clampScale(gestureState.scale + fullConfig.scaleStep);
    animateScale(newScale);
  }, [gestureState.scale, fullConfig.scaleStep]);

  const zoomOut = useCallback(() => {
    const newScale = clampScale(gestureState.scale - fullConfig.scaleStep);
    animateScale(newScale);
  }, [gestureState.scale, fullConfig.scaleStep]);

  const resetZoomControl = useCallback(() => {
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
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  return {
    gestureState,
    isGesturing,
    swipeState,
    longPressActive,
    tapCount, // Expose current tap count for debugging
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    controls: {
      zoomIn,
      zoomOut,
      resetZoom: resetZoomControl,
      setScale,
      calibrateCenter,
      resetEverything,
      sixTapFunction,
    },
    config: fullConfig,
  };
};

// Simple Gesture Controls Component
export interface GestureControlsProps {
  controls: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
  };
  gestureState: GestureState;
  show?: boolean;
}

export const GestureControls: React.FC<GestureControlsProps> = ({
  controls,
  gestureState,
  show = true,
}) => {
  if (!show) return null;

  const controlsStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '20px',
    padding: '8px 12px',
    zIndex: 1002,
    userSelect: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const indicatorStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '11px',
    minWidth: '35px',
    textAlign: 'center',
    padding: '0 6px',
  };

  return (
    <div style={controlsStyle}>
      <button style={buttonStyle} onClick={controls.zoomOut}>
        -
      </button>
      <div style={indicatorStyle}>
        {Math.round(gestureState.scale * 100)}%
      </div>
      <button style={buttonStyle} onClick={controls.zoomIn}>
        +
      </button>
      <button style={buttonStyle} onClick={controls.resetZoom}>
        ⌂
      </button>
    </div>
  );
};

export default useGestures;