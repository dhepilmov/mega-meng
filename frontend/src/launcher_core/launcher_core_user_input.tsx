//==============================================
// LAUNCHER CORE USER INPUT
//==============================================
// DETAILED DESCRIPTION:
// User input handling including gestures, touch events, and interaction management.
// Extracted from launcher_screen.tsx gesture system section for better modularity.
// TWEAK:
// Adjust gesture sensitivity by modifying threshold values.
// Change multi-tap detection timing with multiTapWindow.
// Modify zoom limits and behavior with scale parameters.

import { useState, useRef, useCallback, useEffect } from 'react';
import { ANIMATION_CONSTANTS } from '../constants/launcher.constants';

// ===== GESTURE INTERFACES =====

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
  
  // Callbacks
  onSixTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onSwipe?: (gesture: SwipeGesture) => void;
}

export interface GestureControls {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  resetAll: () => void;
}

// ===== DEFAULT GESTURE CONFIGURATION =====

const DEFAULT_GESTURE_CONFIG: GestureConfig = {
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
  multiTapWindow: 600,
  animationDuration: ANIMATION_CONSTANTS.SMOOTH_TRANSITION,
  longPressDuration: 500,
  threshold: {
    pinch: 10,
    pan: 5,
    rotation: 5,
    swipe: 50,
  },
};

// ===== GESTURE HOOK =====

export interface UseGesturesReturn {
  gestureState: GestureState;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
  controls: GestureControls;
  tapCount: number;
  isGesturing: boolean;
  swipeState: SwipeGesture | null;
  longPressActive: boolean;
}

export const useGestures = (config: Partial<GestureConfig> = {}): UseGesturesReturn => {
  const fullConfig = { ...DEFAULT_GESTURE_CONFIG, ...config };
  
  // ===== STATE =====
  
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
  
  // ===== REFS =====
  
  const touchesRef = useRef<TouchPoint[]>([]);
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  
  // ===== UTILITY FUNCTIONS =====
  
  const getTouchPoints = useCallback((e: React.TouchEvent): TouchPoint[] => {
    return Array.from(e.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
  }, []);
  
  const calculateDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);
  
  const calculateAngle = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  }, []);
  
  const calculateCenter = useCallback((touches: TouchPoint[]): { x: number; y: number } => {
    const sum = touches.reduce((acc, touch) => ({
      x: acc.x + touch.x,
      y: acc.y + touch.y,
    }), { x: 0, y: 0 });
    
    return {
      x: sum.x / touches.length,
      y: sum.y / touches.length,
    };
  }, []);
  
  // ===== GESTURE HANDLERS =====
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touches = getTouchPoints(e);
    touchesRef.current = touches;
    setIsGesturing(true);
    
    // Single tap handling
    if (touches.length === 1 && fullConfig.enableMultiTap) {
      const now = Date.now();
      const timeSinceLastTap = now - lastTap;
      
      if (timeSinceLastTap < fullConfig.multiTapWindow) {
        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);
        
        // Check for six-tap gesture
        if (newTapCount >= 6) {
          setTapCount(0);
          fullConfig.onSixTap?.();
        }
        
        // Reset timeout
        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
        }
      } else {
        setTapCount(1);
      }
      
      setLastTap(now);
      
      // Set timeout to reset tap count
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, fullConfig.multiTapWindow);
      
      // Long press detection
      if (fullConfig.enableLongPress) {
        longPressTimeoutRef.current = setTimeout(() => {
          setLongPressActive(true);
          fullConfig.onLongPress?.();
        }, fullConfig.longPressDuration);
      }
      
      // Swipe detection setup
      if (fullConfig.enableSwipe) {
        swipeStartRef.current = {
          x: touches[0].x,
          y: touches[0].y,
          time: now,
        };
      }
    }
    
    // Two-finger gesture setup
    if (touches.length === 2 && fullConfig.enablePinchZoom) {
      initialDistanceRef.current = calculateDistance(touches[0], touches[1]);
      
      if (fullConfig.enableRotation) {
        initialAngleRef.current = calculateAngle(touches[0], touches[1]);
      }
    }
    
    // Double tap zoom (check for second tap)
    if (touches.length === 1 && fullConfig.enableDoubleTapZoom && tapCount === 2) {
      const targetScale = gestureState.scale === 1 ? fullConfig.doubleTapZoomScale : 1;
      setGestureState(prev => ({ ...prev, scale: targetScale }));
      fullConfig.onDoubleTap?.();
    }
  }, [
    getTouchPoints, 
    fullConfig, 
    lastTap, 
    tapCount, 
    gestureState.scale, 
    calculateDistance, 
    calculateAngle
  ]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touches = getTouchPoints(e);
    
    // Clear long press if moving
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    setLongPressActive(false);
    
    // Swipe detection
    if (touches.length === 1 && fullConfig.enableSwipe && swipeStartRef.current) {
      const swipeStart = swipeStartRef.current;
      const deltaX = touches[0].x - swipeStart.x;
      const deltaY = touches[0].y - swipeStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > fullConfig.threshold.swipe) {
        const time = Date.now() - swipeStart.time;
        const velocity = distance / time;
        
        let direction: SwipeGesture['direction'];
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        const swipe: SwipeGesture = { direction, distance, velocity };
        setSwipeState(swipe);
        fullConfig.onSwipe?.(swipe);
        swipeStartRef.current = null;
      }
    }
    
    // Pinch zoom
    if (touches.length === 2 && fullConfig.enablePinchZoom && touchesRef.current.length === 2) {
      const currentDistance = calculateDistance(touches[0], touches[1]);
      const scaleChange = currentDistance / initialDistanceRef.current;
      
      const newScale = Math.min(
        Math.max(gestureState.scale * scaleChange, fullConfig.minScale),
        fullConfig.maxScale
      );
      
      setGestureState(prev => ({ ...prev, scale: newScale }));
      initialDistanceRef.current = currentDistance;
    }
    
    // Pan gesture
    if (touches.length === 1 && fullConfig.enablePan && touchesRef.current.length === 1) {
      const deltaX = touches[0].x - touchesRef.current[0].x;
      const deltaY = touches[0].y - touchesRef.current[0].y;
      
      if (Math.abs(deltaX) > fullConfig.threshold.pan || Math.abs(deltaY) > fullConfig.threshold.pan) {
        setGestureState(prev => ({
          ...prev,
          translateX: prev.translateX + deltaX,
          translateY: prev.translateY + deltaY,
        }));
      }
    }
    
    // Rotation
    if (touches.length === 2 && fullConfig.enableRotation) {
      const currentAngle = calculateAngle(touches[0], touches[1]);
      const angleDelta = currentAngle - initialAngleRef.current;
      
      setGestureState(prev => ({ ...prev, rotation: prev.rotation + angleDelta }));
      initialAngleRef.current = currentAngle;
    }
    
    touchesRef.current = touches;
  }, [
    getTouchPoints,
    fullConfig,
    gestureState.scale,
    calculateDistance,
    calculateAngle
  ]);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touches = getTouchPoints(e);
    touchesRef.current = touches;
    
    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    setLongPressActive(false);
    
    // Clear swipe state
    swipeStartRef.current = null;
    setSwipeState(null);
    
    if (touches.length === 0) {
      setIsGesturing(false);
    }
  }, [getTouchPoints]);
  
  const handleTouchCancel = useCallback((e: React.TouchEvent) => {
    touchesRef.current = [];
    setIsGesturing(false);
    setLongPressActive(false);
    swipeStartRef.current = null;
    setSwipeState(null);
    
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);
  
  // ===== GESTURE CONTROLS =====
  
  const controls: GestureControls = {
    zoomIn: useCallback(() => {
      setGestureState(prev => ({
        ...prev,
        scale: Math.min(prev.scale + fullConfig.scaleStep, fullConfig.maxScale),
      }));
    }, [fullConfig.scaleStep, fullConfig.maxScale]),
    
    zoomOut: useCallback(() => {
      setGestureState(prev => ({
        ...prev,
        scale: Math.max(prev.scale - fullConfig.scaleStep, fullConfig.minScale),
      }));
    }, [fullConfig.scaleStep, fullConfig.minScale]),
    
    resetZoom: useCallback(() => {
      setGestureState(prev => ({ ...prev, scale: 1 }));
    }, []),
    
    resetAll: useCallback(() => {
      setGestureState({
        scale: 1,
        translateX: 0,
        translateY: 0,
        rotation: 0,
      });
    }, []),
  };
  
  // ===== CLEANUP =====
  
  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);
  
  // ===== RETURN =====
  
  return {
    gestureState,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    controls,
    tapCount,
    isGesturing,
    swipeState,
    longPressActive,
  };
};

// ===== BACKUP CLICK SYSTEM =====

export interface UseBackupClickReturn {
  clickCount: number;
  handleClick: () => void;
  resetClickCount: () => void;
}

export const useBackupClick = (onSixClick?: () => void, timeWindow: number = 3000): UseBackupClickReturn => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClick;
    
    if (timeSinceLastClick < timeWindow) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount >= 6) {
        onSixClick?.();
        setClickCount(0);
        return;
      }
    } else {
      setClickCount(1);
    }
    
    setLastClick(now);
    
    // Reset counter after timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, timeWindow);
  }, [clickCount, lastClick, timeWindow, onSixClick]);
  
  const resetClickCount = useCallback(() => {
    setClickCount(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    clickCount,
    handleClick,
    resetClickCount,
  };
};