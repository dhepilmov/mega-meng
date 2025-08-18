import { useEffect, useRef } from 'react';

// Custom effect hooks for launcher
export const useLocalStorageEffect = (key: string, value: any, dependencies: any[] = []) => {
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, dependencies);
};

export const useWindowFocusEffect = (callback: () => void) => {
  useEffect(() => {
    const handleFocus = () => callback();
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [callback]);
};

export const useAppLifecycleEffect = (
  onMount?: () => void,
  onUnmount?: () => void
) => {
  useEffect(() => {
    onMount?.();
    
    return () => {
      onUnmount?.();
    };
  }, []);
};

export const useOfflineEffect = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  useEffect(() => {
    const handleOnline = () => onOnline?.();
    const handleOffline = () => onOffline?.();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnline, onOffline]);
};

export const useKeyboardShortcutEffect = (
  shortcut: string,
  callback: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === shortcut || event.code === shortcut) {
        event.preventDefault();
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, callback, enabled]);
};

// ========================================
// 6-TAP GESTURE DETECTION EFFECT
// ========================================

import { useState } from 'react';

interface TapGestureConfig {
  maxTapInterval: number; // Maximum time between taps (ms)
  requiredTaps: number;   // Number of taps needed
  resetDelay: number;     // Time to reset counter after incomplete sequence (ms)
}

export const useTapGesture = (
  onGestureComplete: () => void,
  config: TapGestureConfig = {
    maxTapInterval: 500,
    requiredTaps: 6,
    resetDelay: 1000
  }
) => {
  const [tapCount, setTapCount] = useState(0);
  const lastTapTime = useRef<number>(0);
  const resetTimeout = useRef<NodeJS.Timeout>();

  const handleTap = () => {
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;

    // Clear existing reset timeout
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }

    // Check if tap is within allowed interval
    if (timeSinceLastTap < config.maxTapInterval || tapCount === 0) {
      const newTapCount = tapCount + 1;
      setTapCount(newTapCount);
      lastTapTime.current = currentTime;

      // Check if gesture is complete
      if (newTapCount >= config.requiredTaps) {
        onGestureComplete();
        setTapCount(0);
        return;
      }

      // Set timeout to reset if no more taps
      resetTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, config.resetDelay);
    } else {
      // Reset if too much time passed
      setTapCount(1);
      lastTapTime.current = currentTime;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
    };
  }, []);

  return { handleTap, tapCount };
};

// ========================================
// SCREEN SCALING EFFECT
// ========================================

interface ScaleConfig {
  screenPercentage: number; // Percentage of viewport to use (0.9 = 90%)
  minScale: number;         // Minimum scale factor
  maxScale: number;         // Maximum scale factor
}

export const useScreenScale = (
  config: ScaleConfig = {
    screenPercentage: 0.9,
    minScale: 0.5,
    maxScale: 2.0
  }
) => {
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Target dimensions (90% of viewport)
      const targetWidth = viewportWidth * config.screenPercentage;
      const targetHeight = viewportHeight * config.screenPercentage;
      
      // Calculate scale based on smaller dimension to maintain aspect ratio
      const scaleX = targetWidth / viewportWidth;
      const scaleY = targetHeight / viewportHeight;
      const newScale = Math.min(scaleX, scaleY);
      
      // Apply min/max constraints
      const constrainedScale = Math.min(Math.max(newScale, config.minScale), config.maxScale);
      
      setScale(constrainedScale);
      setDimensions({ 
        width: targetWidth, 
        height: targetHeight 
      });
    };

    // Calculate on mount and resize
    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, [config]);

  const getScaleStyle = (): React.CSSProperties => ({
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
    maxWidth: `${dimensions.width / scale}px`,
    maxHeight: `${dimensions.height / scale}px`,
    transition: 'transform 0.3s ease-in-out'
  });

  return { scale, dimensions, getScaleStyle };
};

// ========================================
// FADE IN/OUT TRANSITION EFFECT
// ========================================

export const useFadeTransition = (isVisible: boolean, duration: number = 300) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [opacity, setOpacity] = useState(isVisible ? 1 : 0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Small delay to ensure element is in DOM before fade in
      const timer = setTimeout(() => setOpacity(1), 10);
      return () => clearTimeout(timer);
    } else {
      setOpacity(0);
      // Wait for fade out to complete before removing from DOM
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const fadeStyle: React.CSSProperties = {
    opacity,
    transition: `opacity ${duration}ms ease-in-out`,
    pointerEvents: isVisible ? 'auto' : 'none'
  };

  return { shouldRender, fadeStyle };
};