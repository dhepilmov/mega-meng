// Extended Gesture Utilities for Future Gesture Additions
import { useState, useCallback, useRef } from 'react';

// Additional Gesture Types
export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  duration: number;
}

export interface LongPressGesture {
  x: number;
  y: number;
  duration: number;
}

export interface MultiTouchGesture {
  fingerCount: number;
  centerPoint: { x: number; y: number };
  spread: number; // Distance between furthest points
}

// Advanced Gesture Configuration
export interface ExtendedGestureConfig {
  // Swipe settings
  swipe: {
    enabled: boolean;
    minDistance: number;
    minVelocity: number;
    maxTime: number;
  };
  
  // Long press settings
  longPress: {
    enabled: boolean;
    duration: number;
    maxMovement: number;
  };
  
  // Multi-touch settings
  multiTouch: {
    enabled: boolean;
    maxFingers: number;
    timeout: number;
  };
  
  // Edge gestures
  edge: {
    enabled: boolean;
    edgeSize: number; // Distance from edge in pixels
    directions: ('left' | 'right' | 'top' | 'bottom')[];
  };
}

export const defaultExtendedConfig: ExtendedGestureConfig = {
  swipe: {
    enabled: true,
    minDistance: 50,
    minVelocity: 0.5,
    maxTime: 500,
  },
  longPress: {
    enabled: true,
    duration: 500,
    maxMovement: 10,
  },
  multiTouch: {
    enabled: true,
    maxFingers: 5,
    timeout: 100,
  },
  edge: {
    enabled: false,
    edgeSize: 20,
    directions: ['left', 'right'],
  },
};

// Extended Gesture Hook
export const useExtendedGestures = (config: Partial<ExtendedGestureConfig> = {}) => {
  const fullConfig = { ...defaultExtendedConfig, ...config };
  
  // Swipe state
  const [swipeState, setSwipeState] = useState<SwipeGesture | null>(null);
  const [longPressState, setLongPressState] = useState<LongPressGesture | null>(null);
  const [multiTouchState, setMultiTouchState] = useState<MultiTouchGesture | null>(null);
  
  // Refs for tracking
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  
  // Swipe detection
  const handleSwipeStart = useCallback((x: number, y: number) => {
    if (!fullConfig.swipe.enabled) return;
    
    swipeStartRef.current = {
      x,
      y,
      time: Date.now(),
    };
    setSwipeState(null);
  }, [fullConfig.swipe.enabled]);
  
  const handleSwipeEnd = useCallback((x: number, y: number) => {
    if (!fullConfig.swipe.enabled || !swipeStartRef.current) return;
    
    const startPoint = swipeStartRef.current;
    const endTime = Date.now();
    const duration = endTime - startPoint.time;
    
    if (duration > fullConfig.swipe.maxTime) return;
    
    const deltaX = x - startPoint.x;
    const deltaY = y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / duration;
    
    if (distance < fullConfig.swipe.minDistance || velocity < fullConfig.swipe.minVelocity) {
      return;
    }
    
    // Determine direction
    let direction: SwipeGesture['direction'];
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }
    
    const swipeGesture: SwipeGesture = {
      direction,
      distance,
      velocity,
      startPoint: { x: startPoint.x, y: startPoint.y },
      endPoint: { x, y },
      duration,
    };
    
    setSwipeState(swipeGesture);
    swipeStartRef.current = null;
  }, [fullConfig.swipe]);
  
  // Long press detection
  const handleLongPressStart = useCallback((x: number, y: number) => {
    if (!fullConfig.longPress.enabled) return;
    
    longPressStartRef.current = { x, y, time: Date.now() };
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      if (longPressStartRef.current) {
        const longPress: LongPressGesture = {
          x: longPressStartRef.current.x,
          y: longPressStartRef.current.y,
          duration: fullConfig.longPress.duration,
        };
        setLongPressState(longPress);
      }
    }, fullConfig.longPress.duration);
  }, [fullConfig.longPress]);
  
  const handleLongPressMove = useCallback((x: number, y: number) => {
    if (!fullConfig.longPress.enabled || !longPressStartRef.current) return;
    
    const deltaX = x - longPressStartRef.current.x;
    const deltaY = y - longPressStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > fullConfig.longPress.maxMovement) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      longPressStartRef.current = null;
    }
  }, [fullConfig.longPress.maxMovement]);
  
  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressStartRef.current = null;
  }, []);
  
  // Multi-touch detection
  const handleMultiTouch = useCallback((touches: Touch[]) => {
    if (!fullConfig.multiTouch.enabled || touches.length < 2) return;
    
    const points = Array.from(touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
    }));
    
    // Calculate center point
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    // Calculate spread (distance between furthest points)
    let maxDistance = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        maxDistance = Math.max(maxDistance, distance);
      }
    }
    
    const multiTouch: MultiTouchGesture = {
      fingerCount: touches.length,
      centerPoint: { x: centerX, y: centerY },
      spread: maxDistance,
    };
    
    setMultiTouchState(multiTouch);
  }, [fullConfig.multiTouch.enabled]);
  
  // Edge gesture detection
  const isEdgeGesture = useCallback((x: number, y: number, containerWidth: number, containerHeight: number) => {
    if (!fullConfig.edge.enabled) return null;
    
    const { edgeSize, directions } = fullConfig.edge;
    
    for (const direction of directions) {
      switch (direction) {
        case 'left':
          if (x <= edgeSize) return 'left';
          break;
        case 'right':
          if (x >= containerWidth - edgeSize) return 'right';
          break;
        case 'top':
          if (y <= edgeSize) return 'top';
          break;
        case 'bottom':
          if (y >= containerHeight - edgeSize) return 'bottom';
          break;
      }
    }
    
    return null;
  }, [fullConfig.edge]);
  
  // Reset all gestures
  const resetGestures = useCallback(() => {
    setSwipeState(null);
    setLongPressState(null);
    setMultiTouchState(null);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    swipeStartRef.current = null;
    longPressStartRef.current = null;
  }, []);
  
  return {
    // States
    swipeState,
    longPressState,
    multiTouchState,
    
    // Handlers
    handleSwipeStart,
    handleSwipeEnd,
    handleLongPressStart,
    handleLongPressMove,
    handleLongPressEnd,
    handleMultiTouch,
    isEdgeGesture,
    resetGestures,
    
    // Config
    config: fullConfig,
  };
};

// Gesture Event Handlers Factory
export const createGestureHandlers = (
  basicGestures: ReturnType<typeof import('./launcher_gesture').useGestures>,
  extendedGestures: ReturnType<typeof useExtendedGestures>
) => {
  return {
    onTouchStart: (event: React.TouchEvent) => {
      const touch = event.touches[0];
      
      // Basic gesture handling
      basicGestures.touchHandlers.onTouchStart(event);
      
      // Extended gesture handling
      extendedGestures.handleSwipeStart(touch.clientX, touch.clientY);
      extendedGestures.handleLongPressStart(touch.clientX, touch.clientY);
      
      // Multi-touch
      if (event.touches.length > 1) {
        extendedGestures.handleMultiTouch(Array.from(event.touches));
      }
    },
    
    onTouchMove: (event: React.TouchEvent) => {
      const touch = event.touches[0];
      
      // Basic gesture handling
      basicGestures.touchHandlers.onTouchMove(event);
      
      // Extended gesture handling
      extendedGestures.handleLongPressMove(touch.clientX, touch.clientY);
      
      // Multi-touch
      if (event.touches.length > 1) {
        extendedGestures.handleMultiTouch(Array.from(event.touches));
      }
    },
    
    onTouchEnd: (event: React.TouchEvent) => {
      const touch = event.changedTouches[0];
      
      // Basic gesture handling
      basicGestures.touchHandlers.onTouchEnd(event);
      
      // Extended gesture handling
      if (touch) {
        extendedGestures.handleSwipeEnd(touch.clientX, touch.clientY);
      }
      extendedGestures.handleLongPressEnd();
      
      // Reset multi-touch if no more touches
      if (event.touches.length === 0) {
        extendedGestures.resetGestures();
      }
    },
  };
};

// Predefined Gesture Patterns
export const GesturePatterns = {
  // Common gesture combinations
  ZOOM_ONLY: {
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: false,
    enableRotation: false,
  },
  
  ZOOM_AND_PAN: {
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: true,
    enableRotation: false,
  },
  
  FULL_GESTURES: {
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: true,
    enableRotation: true,
  },
  
  MINIMAL: {
    enablePinchZoom: true,
    enableDoubleTapZoom: false,
    enablePan: false,
    enableRotation: false,
  },
};

export default useExtendedGestures;