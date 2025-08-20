//==============================================
// LAUNCHER USER INPUT HANDLER
//==============================================
// DETAILED DESCRIPTION:
// User input handling including gestures, touch events, and interaction management.
// Extracted from launcher_screen.tsx gesture system section for better modularity.
// PHASE 6: Consolidated into unified launcher module structure.

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
  swipeThreshold: number;
  swipeVelocityThreshold: number;
  
  // Multi-tap settings
  multiTapWindow: number;
  multiTapThreshold: number;
  maxTapCount: number;
  
  // Performance
  throttleMs: number;
  enableHapticFeedback: boolean;
}

// ===== DEFAULT GESTURE CONFIG =====

const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  // Zoom settings
  minScale: 0.5,
  maxScale: 3.0,
  scaleStep: 0.1,
  enablePinchZoom: true,
  enableDoubleTapZoom: true,
  doubleTapZoomScale: 2.0,
  
  // Pan/Rotation settings
  enablePan: true,
  enableRotation: false,
  
  // Extended gestures
  enableSwipe: true,
  swipeThreshold: 50,
  swipeVelocityThreshold: 0.5,
  
  // Multi-tap settings
  multiTapWindow: 500,
  multiTapThreshold: 20,
  maxTapCount: 6,
  
  // Performance
  throttleMs: 16, // ~60fps
  enableHapticFeedback: true,
};

// ===== GESTURE HOOK INTERFACES =====

export interface UseGesturesProps {
  onGestureDetected: (gestureType: string, data?: any) => void;
  tapCount: number;
  setTapCount: (count: number) => void;
  lastTapTime: number;
  setLastTapTime: (time: number) => void;
  config?: Partial<GestureConfig>;
}

export interface UseBackupClickProps {
  onGestureDetected: (gestureType: string, data?: any) => void;
  requiredClickCount: number;
  timeWindow?: number;
}

// ===== MAIN GESTURE HOOK =====

export const useGestures = ({
  onGestureDetected,
  tapCount,
  setTapCount,
  lastTapTime,
  setLastTapTime,
  config = {},
}: UseGesturesProps) => {
  const gestureConfig = { ...DEFAULT_GESTURE_CONFIG, ...config };
  
  const [gestureState, setGestureState] = useState<GestureState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotation: 0,
  });
  
  const touchPoints = useRef<TouchPoint[]>([]);
  const lastTouchTime = useRef<number>(0);
  const gestureStartTime = useRef<number>(0);
  const initialDistance = useRef<number>(0);
  const initialAngle = useRef<number>(0);
  
  // ===== TOUCH EVENT HANDLERS =====
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const touches = Array.from(e.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    
    touchPoints.current = touches;
    gestureStartTime.current = Date.now();
    
    if (touches.length === 2 && gestureConfig.enablePinchZoom) {
      initialDistance.current = calculateDistance(touches[0], touches[1]);
      if (gestureConfig.enableRotation) {
        initialAngle.current = calculateAngle(touches[0], touches[1]);
      }
    }
    
    // Single tap detection
    if (touches.length === 1) {
      handleSingleTap(touches[0]);
    }
    
  }, [gestureConfig, onGestureDetected]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const touches = Array.from(e.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    
    if (touches.length === 2 && gestureConfig.enablePinchZoom) {
      const currentDistance = calculateDistance(touches[0], touches[1]);
      const scaleChange = currentDistance / initialDistance.current;
      
      const newScale = Math.min(
        Math.max(gestureState.scale * scaleChange, gestureConfig.minScale),
        gestureConfig.maxScale
      );
      
      let rotationChange = 0;
      if (gestureConfig.enableRotation) {
        const currentAngle = calculateAngle(touches[0], touches[1]);
        rotationChange = currentAngle - initialAngle.current;
      }
      
      setGestureState(prev => ({
        ...prev,
        scale: newScale,
        rotation: prev.rotation + rotationChange,
      }));
      
      initialDistance.current = currentDistance;
      if (gestureConfig.enableRotation) {
        initialAngle.current = calculateAngle(touches[0], touches[1]);
      }
    }
    
    // Pan gesture for single touch
    if (touches.length === 1 && gestureConfig.enablePan) {
      const currentTouch = touches[0];
      const previousTouch = touchPoints.current[0];
      
      if (previousTouch) {
        const deltaX = currentTouch.x - previousTouch.x;
        const deltaY = currentTouch.y - previousTouch.y;
        
        setGestureState(prev => ({
          ...prev,
          translateX: prev.translateX + deltaX,
          translateY: prev.translateY + deltaY,
        }));
      }
    }
    
    touchPoints.current = touches;
    
  }, [gestureState, gestureConfig]);
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const gestureDuration = Date.now() - gestureStartTime.current;
    const remainingTouches = Array.from(e.touches);
    
    // Detect swipe gestures
    if (remainingTouches.length === 0 && touchPoints.current.length === 1 && gestureConfig.enableSwipe) {
      const swipe = detectSwipeGesture(touchPoints.current[0], gestureDuration);
      if (swipe) {
        onGestureDetected('swipe', swipe);
      }
    }
    
    touchPoints.current = remainingTouches.map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    
  }, [gestureConfig, onGestureDetected]);
  
  // ===== SINGLE TAP HANDLING =====
  
  const handleSingleTap = useCallback((touch: TouchPoint) => {
    const currentTime = Date.now();
    
    // Check if this tap is within the multi-tap window
    if (currentTime - lastTapTime < gestureConfig.multiTapWindow) {
      const newTapCount = tapCount + 1;
      setTapCount(newTapCount);
      
      // Check for specific gesture patterns
      if (newTapCount === 6) {
        onGestureDetected('6-tap');
        
        // Haptic feedback
        if (gestureConfig.enableHapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate([50, 50, 50]);
        }
        
        // Reset tap count
        setTapCount(0);
      } else if (newTapCount >= gestureConfig.maxTapCount) {
        // Reset if exceeded max
        setTapCount(0);
      }
    } else {
      // Start new tap sequence
      setTapCount(1);
    }
    
    setLastTapTime(currentTime);
    
  }, [tapCount, lastTapTime, gestureConfig, onGestureDetected, setTapCount, setLastTapTime]);
  
  // ===== SWIPE DETECTION =====
  
  const detectSwipeGesture = useCallback((startTouch: TouchPoint, duration: number): SwipeGesture | null => {
    if (!touchPoints.current.length || duration < 50) return null;
    
    const endTouch = touchPoints.current[touchPoints.current.length - 1];
    const deltaX = endTouch.x - startTouch.x;
    const deltaY = endTouch.y - startTouch.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / duration;
    
    if (distance < gestureConfig.swipeThreshold || velocity < gestureConfig.swipeVelocityThreshold) {
      return null;
    }
    
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    let direction: SwipeGesture['direction'];
    
    if (angle >= -45 && angle <= 45) {
      direction = 'right';
    } else if (angle >= 45 && angle <= 135) {
      direction = 'down';
    } else if (angle >= 135 || angle <= -135) {
      direction = 'left';
    } else {
      direction = 'up';
    }
    
    return { direction, distance, velocity };
    
  }, [gestureConfig]);
  
  // ===== UTILITY FUNCTIONS =====
  
  const calculateDistance = (touch1: TouchPoint, touch2: TouchPoint): number => {
    const dx = touch2.x - touch1.x;
    const dy = touch2.y - touch1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const calculateAngle = (touch1: TouchPoint, touch2: TouchPoint): number => {
    return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);
  };
  
  // ===== SETUP EVENT LISTENERS =====
  
  useEffect(() => {
    const element = document.getElementById('main-launcher-container');
    if (!element) return;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  // ===== TAP COUNT RESET =====
  
  useEffect(() => {
    if (tapCount > 0) {
      const timeout = setTimeout(() => {
        setTapCount(0);
      }, gestureConfig.multiTapWindow);
      
      return () => clearTimeout(timeout);
    }
  }, [tapCount, gestureConfig.multiTapWindow, setTapCount]);
  
  return {
    gestureState,
    resetGesture: () => setGestureState({
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotation: 0,
    }),
  };
};

// ===== BACKUP CLICK HANDLER (for desktop/mouse users) =====

export const useBackupClick = ({
  onGestureDetected,
  requiredClickCount,
  timeWindow = 2000,
}: UseBackupClickProps) => {
  const clickCount = useRef(0);
  const firstClickTime = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleClick = useCallback((e: MouseEvent) => {
    const currentTime = Date.now();
    
    // Start new sequence or continue existing
    if (clickCount.current === 0) {
      firstClickTime.current = currentTime;
      clickCount.current = 1;
      
      // Set timeout to reset
      clickTimeout.current = setTimeout(() => {
        clickCount.current = 0;
      }, timeWindow);
      
    } else if (currentTime - firstClickTime.current <= timeWindow) {
      clickCount.current += 1;
      
      // Check if we reached required count
      if (clickCount.current >= requiredClickCount) {
        onGestureDetected(`${requiredClickCount}-click`);
        
        // Reset
        clickCount.current = 0;
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
        }
      }
    } else {
      // Reset sequence
      clickCount.current = 1;
      firstClickTime.current = currentTime;
      
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
      
      clickTimeout.current = setTimeout(() => {
        clickCount.current = 0;
      }, timeWindow);
    }
    
  }, [onGestureDetected, requiredClickCount, timeWindow]);
  
  useEffect(() => {
    const element = document.getElementById('main-launcher-container');
    if (!element) return;
    
    element.addEventListener('click', handleClick);
    
    return () => {
      element.removeEventListener('click', handleClick);
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, [handleClick]);
  
  return {
    currentClickCount: clickCount.current,
    resetClickCount: () => {
      clickCount.current = 0;
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
      }
    },
  };
};

// ===== EXPORTS =====

export default {
  useGestures,
  useBackupClick,
  DEFAULT_GESTURE_CONFIG,
};