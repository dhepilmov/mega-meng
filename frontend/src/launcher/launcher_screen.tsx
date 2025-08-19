import React, { useState, useRef, useEffect, useCallback } from 'react';
import RotateConfigUI from './launcher_config';
import './launcher_effect.css';

//==============================================
// CLOCK LOGIC SECTION
//==============================================
//DETAILED DESCRIPTION:
//This section handles all clock-related calculations including timezone support, real-time angle updates,
//and smooth animation frame management. Provides essential clock state for hour/minute/second hands.
//Related to rotate_logic.tsx for clock hand positioning and rotate_config.tsx for timezone settings.
//TWEAK:
//Adjust updateAngles requestAnimationFrame frequency for performance (currently real-time).
//Change normalize360 function for different angle ranges if needed.
//Modify timezone offset calculations by changing utcOffset multiplier (3600000 = 1 hour).

interface TimezoneConfig {
  enabled: 'yes' | 'no';
  utcOffset: number; // UTC offset in hours (e.g., +9, -5, +0)
  use24Hour: 'yes' | 'no'; // 1 rotation per 24 hours or 2 rotations per 24 hours
}

/** Essential clock state - just the angles we need */
interface ClockState {
  /** 24-hour hand angle (noon = 0°, clockwise) */
  hourAngle: number;
  /** Minute hand angle (0-360°) */
  minuteAngle: number;  
  /** Second hand angle (0-360°) */
  secondAngle: number;
}

/** Essential hook - smooth real-time clock angles */
function useClock(): ClockState {
  const [angles, setAngles] = useState<ClockState>(() => calculateAngles());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateAngles = () => {
      setAngles(calculateAngles());
      rafRef.current = requestAnimationFrame(updateAngles);
    };
    
    rafRef.current = requestAnimationFrame(updateAngles);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return angles;
}

/** Calculate current time as rotation angles (device system time) */
function calculateAngles(): ClockState {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();  
  const seconds = now.getSeconds();
  const millis = now.getMilliseconds();

  // Smooth fractional calculations
  const secondFraction = (seconds * 1000 + millis) / 60000;
  const minuteFraction = (minutes + secondFraction) / 60;
  
  // 24-hour angle (noon = 0°, clockwise)
  const totalMinutes = hours * 60 + minutes + (seconds + millis/1000) / 60;
  const noonShiftMinutes = totalMinutes - 12 * 60; // Shift so 12:00 = 0°
  const hourAngle = normalize360((noonShiftMinutes / (24 * 60)) * 360);
  
  // Standard minute and second angles
  const minuteAngle = minuteFraction * 360;
  const secondAngle = ((seconds + millis/1000) / 60) * 360;

  return { hourAngle, minuteAngle, secondAngle };
}

/** Calculate timezone-aware angles for specific timezone configuration */
function calculateTimezoneAngles(timezoneConfig?: TimezoneConfig): ClockState {
  // If timezone is not enabled, use device time
  if (!timezoneConfig || timezoneConfig.enabled !== 'yes') {
    return calculateAngles();
  }

  // Calculate timezone-adjusted time
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const timezoneTime = new Date(utc + (timezoneConfig.utcOffset * 3600000));
  
  const hours = timezoneTime.getHours();
  const minutes = timezoneTime.getMinutes();  
  const seconds = timezoneTime.getSeconds();
  const millis = timezoneTime.getMilliseconds();

  // Smooth fractional calculations
  const secondFraction = (seconds * 1000 + millis) / 60000;
  const minuteFraction = (minutes + secondFraction) / 60;
  
  // Hour angle calculation based on 24h or 12h mode
  let hourAngle: number;
  
  if (timezoneConfig.use24Hour === 'yes') {
    // 24-hour mode: 1 rotation per 24 hours (noon = 0°, clockwise)
    const totalMinutes = hours * 60 + minutes + (seconds + millis/1000) / 60;
    const noonShiftMinutes = totalMinutes - 12 * 60; // Shift so 12:00 = 0°
    hourAngle = normalize360((noonShiftMinutes / (24 * 60)) * 360);
  } else {
    // 12-hour mode: 2 rotations per 24 hours (traditional clock)
    const totalMinutes = (hours % 12) * 60 + minutes + (seconds + millis/1000) / 60;
    hourAngle = normalize360((totalMinutes / (12 * 60)) * 360);
  }
  
  // Standard minute and second angles (same worldwide)
  const minuteAngle = minuteFraction * 360;
  const secondAngle = ((seconds + millis/1000) / 60) * 360;

  return { hourAngle, minuteAngle, secondAngle };
}

/** Get hour angle for specific timezone (for individual hands) */
function getTimezoneHourAngle(timezoneConfig?: TimezoneConfig): number {
  const timezoneAngles = calculateTimezoneAngles(timezoneConfig);
  return timezoneAngles.hourAngle;
}

/** Normalize angle to 0-360 range */
function normalize360(angle: number): number {
  const result = angle % 360;
  return result < 0 ? result + 360 : result;
}

//==============================================
// DOT MARK COMPONENT SECTION  
//==============================================
//DETAILED DESCRIPTION:
//This component renders the central reference dot that serves as the center point for all rotating items.
//Positioned at screen center with highest z-index, hidden visually but used for positioning calculations.
//Related to rotate_logic.tsx calculateBasePosition and calculateItemTransform functions.
//TWEAK:
//Change width/height (8px) to make reference point larger/smaller for development.
//Adjust backgroundColor color (#666666) for visibility during debugging.
//Modify opacity (0) to make visible - set to 1 for development, 0 for production.
//Change zIndex (1000) if layering conflicts occur with other elements.

interface DotMarkProps {}

const DotMark: React.FC<DotMarkProps> = () => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#666666',
        zIndex: 1000,
        opacity: 0, // Hide the dot mark visually
        pointerEvents: 'none', // Ensure it doesn't interfere with touch events
      }}
      className="dot-mark"
    />
  );
};

//==============================================
// MARKER COMPONENTS SECTION
//==============================================
//DETAILED DESCRIPTION:
//This section provides adjustable button components with visual development aids for sizing and positioning.
//Includes stroke styles for visual adjustment, size constants, and marker button components with hover effects.
//Used throughout the launcher for configuration access, modal controls, and development tweaking.
//TWEAK:
//Adjust buttonSizes object values to change button dimensions globally.
//Modify strokeStyles colors and opacity for better development visibility.
//Change showStroke prop to false in production to hide development markers.
//Adjust spacing.gap and marginFromEdge for different button layouts.

// Button stroke styles for size adjustment during development
const buttonStrokeStyles = {
  // Default stroke for buttons - adjust strokeWidth to change visibility
  defaultStroke: {
    stroke: '#ff0000', // Red stroke for visibility - change color as needed
    strokeWidth: 2, // ADJUST THIS VALUE to change stroke thickness (1-5 recommended)
    strokeDasharray: '4,2', // Dashed line pattern - remove for solid line
    strokeOpacity: 0.8 // ADJUST THIS VALUE for stroke transparency (0-1)
  },
  
  // Close button specific stroke
  closeButtonStroke: {
    stroke: '#ff4444', // Light red for close button
    strokeWidth: 2, // ADJUST CLOSE BUTTON STROKE WIDTH HERE
    strokeDasharray: '2,2',
    strokeOpacity: 0.7
  },
  
  // New button (left of close) specific stroke
  newButtonStroke: {
    stroke: '#44ff44', // Green for new button
    strokeWidth: 2, // ADJUST NEW BUTTON STROKE WIDTH HERE
    strokeDasharray: '3,1',
    strokeOpacity: 0.7
  },
  
  // Hover state stroke
  hoverStroke: {
    stroke: '#ffff44', // Yellow for hover state
    strokeWidth: 3, // ADJUST HOVER STROKE WIDTH HERE
    strokeOpacity: 1
  }
};

// Button size adjustment constants
const buttonSizes = {
  // Close button dimensions - ADJUST THESE VALUES TO CHANGE CLOSE BUTTON SIZE
  closeButton: {
    width: 48, // ADJUST WIDTH HERE (pixels)
    height: 48, // ADJUST HEIGHT HERE (pixels) 
    padding: 12, // ADJUST INTERNAL PADDING HERE
    fontSize: 24 // ADJUST ICON/TEXT SIZE HERE
  },
  
  // New button dimensions - ADJUST THESE VALUES TO CHANGE NEW BUTTON SIZE
  newButton: {
    width: 48, // ADJUST WIDTH HERE (pixels)
    height: 48, // ADJUST HEIGHT HERE (pixels)
    padding: 12, // ADJUST INTERNAL PADDING HERE
    fontSize: 20 // ADJUST ICON/TEXT SIZE HERE
  },
  
  // Button spacing - ADJUST SPACING BETWEEN BUTTONS
  spacing: {
    gap: 12, // ADJUST GAP BETWEEN BUTTONS HERE (pixels)
    marginFromEdge: 20 // ADJUST DISTANCE FROM SCREEN EDGE HERE (pixels)
  }
};

// Marker button component with adjustable stroke
interface MarkerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'close' | 'new' | 'default';
  showStroke?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MarkerButton: React.FC<MarkerButtonProps> = ({
  children,
  onClick,
  type = 'default',
  showStroke = true, // SET TO FALSE TO HIDE STROKE IN PRODUCTION
  className = '',
  style = {}
}) => {
  const sizeConfig = type === 'close' ? buttonSizes.closeButton : 
                    type === 'new' ? buttonSizes.newButton : 
                    buttonSizes.closeButton;
                    
  const strokeConfig = type === 'close' ? buttonStrokeStyles.closeButtonStroke :
                      type === 'new' ? buttonStrokeStyles.newButtonStroke :
                      buttonStrokeStyles.defaultStroke;

  const buttonStyle: React.CSSProperties = {
    // SIZE CONFIGURATION - ADJUST THESE IN buttonSizes OBJECT ABOVE
    width: sizeConfig.width,
    height: sizeConfig.height,
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    
    // BASE STYLING
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    
    // STROKE STYLING - TOGGLE WITH showStroke PROP
    ...(showStroke && {
      border: `${strokeConfig.strokeWidth}px ${strokeConfig.strokeDasharray ? 'dashed' : 'solid'} ${strokeConfig.stroke}`,
      opacity: strokeConfig.strokeOpacity
    }),
    
    // MERGE WITH PASSED STYLE
    ...style
  };

  return (
    <button
      onClick={onClick}
      className={`hover:bg-opacity-90 hover:scale-105 active:scale-95 ${className}`}
      style={buttonStyle}
    >
      {children}
      
      {/* SIZE INDICATOR OVERLAY - REMOVE IN PRODUCTION */}
      {showStroke && (
        <div 
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: strokeConfig.stroke,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '2px 4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {sizeConfig.width}×{sizeConfig.height}
        </div>
      )}
    </button>
  );
};

// Top button container component
interface TopButtonContainerProps {
  children: React.ReactNode;
  showStroke?: boolean;
}

const TopButtonContainer: React.FC<TopButtonContainerProps> = ({ 
  children, 
  showStroke = true 
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: buttonSizes.spacing.marginFromEdge, // ADJUST TOP MARGIN HERE
    right: buttonSizes.spacing.marginFromEdge, // ADJUST RIGHT MARGIN HERE
    display: 'flex',
    alignItems: 'center',
    gap: buttonSizes.spacing.gap, // ADJUST GAP BETWEEN BUTTONS HERE
    zIndex: 9999,
    
    // CONTAINER STROKE FOR VISUAL ADJUSTMENT
    ...(showStroke && {
      border: '1px dashed #888',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: 'rgba(128,128,128,0.2)'
    })
  };

  return (
    <div style={containerStyle}>
      {children}
      
      {/* CONTAINER SIZE INDICATOR */}
      {showStroke && (
        <div 
          style={{
            position: 'absolute',
            top: '-25px',
            left: '0',
            fontSize: '10px',
            color: '#888',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '2px 6px',
            borderRadius: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          Button Container
        </div>
      )}
    </div>
  );
};

//==============================================
// LAUNCHER HOOKS SECTION
//==============================================
//DETAILED DESCRIPTION:
//This section manages launcher state including settings, files, and localStorage persistence.
//Provides hooks for local storage management, offline detection, and state updates.
//Related to launcher_logic.tsx for core logic and launcher_effect.tsx for effect hooks.
//TWEAK:
//Modify defaultSettings in launcher_logic.tsx to change default behavior.
//Adjust STORAGE_KEYS to change localStorage key names.
//Change localStorage error handling by modifying console.error messages.
//Add additional state properties by extending LauncherState interface.

// Custom effect hooks for launcher
const useLocalStorageEffect = (key: string, value: any, dependencies: any[] = []) => {
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, dependencies);
};

const useOfflineEffect = (
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

// Launcher state management hook
const useLauncher = () => {
  const [state, setState] = useState<LauncherState>({
    isLoading: true,
    settings: defaultSettings,
    files: [],
  });

  // Initialize launcher from storage
  useEffect(() => {
    const loadedSettings = LauncherLogic.loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings);
    const loadedFiles = LauncherLogic.loadFromStorage(STORAGE_KEYS.FILES, []);
    
    setState(prev => ({
      ...prev,
      settings: loadedSettings,
      files: loadedFiles,
      isLoading: false,
    }));
  }, []);

  // Save settings to storage whenever they change
  useLocalStorageEffect(STORAGE_KEYS.SETTINGS, state.settings, [state.settings]);
  
  // Save files to storage whenever they change
  useLocalStorageEffect(STORAGE_KEYS.FILES, state.files, [state.files]);

  // Handle online/offline states
  useOfflineEffect(
    () => console.log('Launcher: Back online'),
    () => console.log('Launcher: Gone offline')
  );

  const updateSettings = useCallback((newSettings: Partial<LauncherSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const addFile = useCallback((file: any) => {
    setState(prev => ({
      ...prev,
      files: [...prev.files, file],
    }));
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter((file: any) => file.id !== fileId),
    }));
  }, []);

  const clearAllData = useCallback(() => {
    LauncherLogic.clearStorage();
    setState({
      isLoading: false,
      settings: defaultSettings,
      files: [],
    });
  }, []);

  return {
    ...state,
    updateSettings,
    addFile,
    removeFile,
    clearAllData,
  };
};

// Local storage hook
const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    return LauncherLogic.loadFromStorage(key, defaultValue);
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      
      LauncherLogic.saveToStorage(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  return [value, setStoredValue] as const;
};

//==============================================
// LAUNCHER LOGIC SECTION
//==============================================
//DETAILED DESCRIPTION:
//This section contains core launcher logic including settings management, localStorage operations,
//and data structures. Provides the foundation for launcher state and configuration persistence.
//Related to launcher_hook.tsx for state management and rotate_config.tsx for configuration data.
//TWEAK:
//Change defaultSettings properties to modify initial launcher behavior.
//Adjust STORAGE_KEYS values to use different localStorage key names.
//Modify LauncherLogic error handling for different error recovery strategies.
//Add new settings by extending LauncherSettings interface.

// Launcher Logic Types
interface LauncherSettings {
  theme: 'light' | 'dark';
  animations: boolean;
  autoSave: boolean;
  lastOpened: string | null;
}

interface LauncherState {
  isLoading: boolean;
  settings: LauncherSettings;
  files: any[];
}

// Default settings
const defaultSettings: LauncherSettings = {
  theme: 'light',
  animations: true,
  autoSave: true,
  lastOpened: null,
};

// Storage keys
const STORAGE_KEYS = {
  SETTINGS: 'launcher_settings',
  FILES: 'launcher_files',
  STATE: 'launcher_state',
} as const;

// Launcher logic functions
class LauncherLogic {
  static saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }

  static clearStorage(key?: string): void {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        // Clear all launcher-related storage
        Object.values(STORAGE_KEYS).forEach(storageKey => {
          localStorage.removeItem(storageKey);
        });
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

//==============================================
// GESTURE SYSTEM SECTION
//==============================================
//DETAILED DESCRIPTION:
//This section handles all touch and gesture interactions including pinch zoom, multi-tap detection,
//pan/rotation controls, and gesture callbacks. Provides comprehensive gesture recognition for launcher interaction.
//Related to launcher_screen.tsx main component for gesture integration and configuration UI triggering.
//TWEAK:
//Adjust defaultGestureConfig values to change gesture sensitivity and behavior.
//Modify multiTapWindow (500ms) to make tap detection easier/harder.
//Change scale limits (minScale/maxScale) for different zoom ranges.
//Adjust threshold values for gesture detection sensitivity.

// Combined Gesture Types
interface GestureState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

interface GestureConfig {
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
  
  // Callback for 6-tap gesture
  onSixTap?: () => void;
}

// Default configuration
const defaultGestureConfig: GestureConfig = {
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
const useGestures = (config: Partial<GestureConfig> = {}) => {
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
    console.log('6-tap gesture: Opening rotation configuration UI');
    // Trigger callback for opening config UI if provided
    if (fullConfig.onSixTap) {
      fullConfig.onSixTap();
    }
  }, [fullConfig.onSixTap]);

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
interface GestureControlsProps {
  controls: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
  };
  gestureState: GestureState;
  show?: boolean;
}

const GestureControls: React.FC<GestureControlsProps> = ({
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

//==============================================
// ROTATION LOGIC SECTION  
//==============================================
//DETAILED DESCRIPTION:
//This section handles rotation item management, image loading, position calculations, and clock hand integration.
//Manages safe property access, displayable item filtering, and transform calculations for all rotating elements.
//Related to rotate_config.tsx for item configuration and clock_logic.tsx for real-time clock angles.
//TWEAK:
//Modify safeString/safeNumber default values to change fallback behavior.
//Adjust image import path (`./res/${itemName}.png`) if image location changes.
//Change getDisplayableItems filtering logic to show/hide different item types.
//Modify calculateItemTransform positioning calculations for different layouts.

// SAFE PROPERTY ACCESS UTILITIES - Default to 'no'/null if undefined
const safeString = (value: any, defaultValue: string = 'no'): string => {
  return value !== undefined && value !== null ? String(value) : defaultValue;
};

const safeNumber = (value: any, defaultValue: number = 0): number => {
  return value !== undefined && value !== null && !isNaN(Number(value)) ? Number(value) : defaultValue;
};

const safeObject = <T>(value: any, defaultValue: T | null = null): T | null => {
  return value !== undefined && value !== null ? value : defaultValue;
};

interface RotateItem extends RotateItemConfig {
  exists: boolean;
  imageSrc?: string;
}

// Safe property normalizer for RotateItem
const normalizeRotateItem = (item: any): RotateItem => {
  return {
    // Basic properties with safe defaults
    itemCode: safeString(item.itemCode, ''),
    itemName: safeString(item.itemName, ''),
    itemPath: safeString(item.itemPath, ''),
    itemLayer: safeNumber(item.itemLayer, 1),
    itemSize: safeNumber(item.itemSize, 20),
    itemDisplay: safeString(item.itemDisplay, 'no') as 'yes' | 'no' | '',
    
    // Clock hand configuration with safe defaults
    handType: safeObject(item.handType, null) as 'hour' | 'minute' | 'second' | null,
    handRotation: safeObject(item.handRotation, null) as 'ROTATION1' | 'ROTATION2' | null,
    
    // Timezone with safe defaults
    timezone: safeObject(item.timezone, null),
    
    // Effect properties with safe defaults
    shadow: safeString(item.shadow, 'no') as 'yes' | 'no',
    glow: safeString(item.glow, 'no') as 'yes' | 'no',
    transparent: safeString(item.transparent, 'no') as 'yes' | 'no',
    pulse: safeString(item.pulse, 'no') as 'yes' | 'no',
    render: safeString(item.render, 'no') as 'yes' | 'no',
    
    // Rotation configurations with safe defaults
    rotation1: {
      enabled: safeString(item.rotation1?.enabled, 'no') as 'yes' | 'no' | null,
      itemTiltPosition: safeNumber(item.rotation1?.itemTiltPosition, 0),
      itemAxisX: safeNumber(item.rotation1?.itemAxisX, 50),
      itemAxisY: safeNumber(item.rotation1?.itemAxisY, 50),
      itemPositionX: safeNumber(item.rotation1?.itemPositionX, 0),
      itemPositionY: safeNumber(item.rotation1?.itemPositionY, 0),
      rotationSpeed: safeNumber(item.rotation1?.rotationSpeed, 0),
      rotationWay: safeString(item.rotation1?.rotationWay, 'no') as '+' | '-' | 'no' | '' | null,
    },
    rotation2: {
      enabled: safeString(item.rotation2?.enabled, 'no') as 'yes' | 'no' | null,
      itemTiltPosition: safeNumber(item.rotation2?.itemTiltPosition, 0),
      itemAxisX: safeNumber(item.rotation2?.itemAxisX, 50),
      itemAxisY: safeNumber(item.rotation2?.itemAxisY, 50),
      itemPositionX: safeNumber(item.rotation2?.itemPositionX, 0),
      itemPositionY: safeNumber(item.rotation2?.itemPositionY, 0),
      rotationSpeed: safeNumber(item.rotation2?.rotationSpeed, 0),
      rotationWay: safeString(item.rotation2?.rotationWay, 'no') as '+' | '-' | 'no' | '' | null,
    },
    
    // Extended properties
    exists: Boolean(item.exists),
    imageSrc: item.imageSrc || '',
  };
};

const useRotateLogic = () => {
  const [rotateItems, setRotateItems] = useState<RotateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const clockState = useClock(); // Get real-time clock angles

  // Check if image files exist and load them
  useEffect(() => {
    const checkAndLoadImages = async () => {
      const itemsWithImages: RotateItem[] = [];

      for (const config of rotateConfig) {
        // Normalize the config with safe defaults
        const normalizedConfig = normalizeRotateItem(config);
        
        let exists = false;
        let imageSrc = '';

        if (normalizedConfig.itemName) {
          try {
            // Try to import the image dynamically
            const imageModule = await import(`./res/${normalizedConfig.itemName}.png`);
            imageSrc = imageModule.default;
            exists = true;
          } catch (error) {
            console.warn(`Image not found: ${normalizedConfig.itemPath}${normalizedConfig.itemName}.png`);
            exists = false;
          }
        }

        itemsWithImages.push({
          ...normalizedConfig,
          exists,
          imageSrc,
        });
      }

      setRotateItems(itemsWithImages);
      setLoading(false);
    };

    checkAndLoadImages();
  }, []);

  // Get items filtered by existence and display setting
  const getDisplayableItems = (): RotateItem[] => {
    return rotateItems
      .filter(item => 
        item.exists && 
        safeString(item.itemName) && 
        safeString(item.itemDisplay, 'no') === 'yes' // Safe check for display
      )
      .sort((a, b) => safeNumber(a.itemLayer, 1) - safeNumber(b.itemLayer, 1)); // Safe layer sorting
  };

  // Get clock angle for hand type (with timezone support for hour hands)
  const getClockAngle = (handType: 'hour' | 'minute' | 'second', item: RotateItem): number => {
    switch (handType) {
      case 'hour': 
        // Use timezone-aware hour angle if configured
        return getTimezoneHourAngle(item.timezone);
      case 'minute': 
        // Minutes are the same worldwide
        return clockState.minuteAngle;
      case 'second': 
        // Seconds are the same worldwide
        return clockState.secondAngle;
      default: 
        return 0;
    }
  };

  // Check if item is a clock hand (with safe property access)
  const isClockHand = (item: RotateItem): boolean => {
    const handType = safeObject(item.handType, null);
    const handRotation = safeObject(item.handRotation, null);
    return handType !== null && handType !== undefined && handRotation !== null;
  };

  // Get active rotation config for hand items (with safe property access)
  const getActiveRotationConfig = (item: RotateItem): RotationConfig | null => {
    if (!isClockHand(item)) return null;
    
    const handRotation = safeString(item.handRotation, '');
    return handRotation === 'ROTATION1' ? item.rotation1 : 
           handRotation === 'ROTATION2' ? item.rotation2 : null;
  };

  const getItemByCode = (code: string): RotateItem | undefined => {
    return rotateItems.find(item => item.itemCode === code);
  };

  // Calculate base position based on center reference (dot mark position) with safe values
  const calculateBasePosition = (item: RotateItem) => {
    return {
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      width: `${safeNumber(item.itemSize, 20)}%`,
      height: 'auto',
      zIndex: safeNumber(item.itemLayer, 1),
    };
  };

  // Calculate transform for a single rotation (with safe property access)
  const calculateRotationTransform = (
    rotation: RotationConfig, 
    rotationIndex: number,
    baseTransform: string = ''
  ): string => {
    const enabled = safeString(rotation?.enabled, 'no');
    const rotationWay = safeString(rotation?.rotationWay, 'no');
    
    if (enabled !== 'yes' || !rotationWay || rotationWay === 'no') {
      return baseTransform;
    }

    // Position offset from center (safe defaults)
    const translateX = safeNumber(rotation?.itemPositionX, 0);
    const translateY = safeNumber(rotation?.itemPositionY, 0);
    
    // Initial tilt position (safe default)
    const tiltPosition = safeNumber(rotation?.itemTiltPosition, 0);

    // Combine transforms
    const transforms = [
      `translate(-50%, -50%)`, // Center the element
      `translate(${translateX}%, ${translateY}%)`, // Move to position
      `rotate(${tiltPosition}deg)`, // Initial tilt
    ];

    return transforms.join(' ');
  };

  // Calculate combined transform for item (with enhanced clock integration and safe property access)
  const calculateItemTransform = (item: RotateItem): string => {
    let transform = 'translate(-50%, -50%)';
    
    // For clock hands, use clock angles (with timezone support for hour hands)
    if (isClockHand(item) && safeObject(item.handType, null)) {
      const activeRotation = getActiveRotationConfig(item);
      if (activeRotation) {
        const clockAngle = getClockAngle(item.handType!, item);
        // Apply position offset (safe defaults)
        const posX = safeNumber(activeRotation.itemPositionX, 0);
        const posY = safeNumber(activeRotation.itemPositionY, 0);
        const tilt = safeNumber(activeRotation.itemTiltPosition, 0);
        
        transform += ` translate(${posX}%, ${posY}%)`;
        // Apply clock rotation with initial tilt
        transform += ` rotate(${tilt + clockAngle}deg)`;
        return transform;
      }
    }

    // For non-hand items, use original logic with safe property access
    // Apply rotation 1 positioning
    if (safeString(item.rotation1?.enabled, 'no') === 'yes') {
      const posX1 = safeNumber(item.rotation1?.itemPositionX, 0);
      const posY1 = safeNumber(item.rotation1?.itemPositionY, 0);
      transform += ` translate(${posX1}%, ${posY1}%)`;
    }
    
    // Apply rotation 2 positioning if enabled
    if (safeString(item.rotation2?.enabled, 'no') === 'yes') {
      const posX2 = safeNumber(item.rotation2?.itemPositionX, 0);
      const posY2 = safeNumber(item.rotation2?.itemPositionY, 0);
      transform += ` translate(${posX2}%, ${posY2}%)`;
    }

    return transform;
  };

  // Calculate transform origin for rotations (with enhanced clock integration and safe property access)
  const calculateTransformOrigin = (item: RotateItem): string => {
    // For clock hands, use the active rotation's origin
    if (isClockHand(item)) {
      const activeRotation = getActiveRotationConfig(item);
      if (activeRotation) {
        const axisX = safeNumber(activeRotation.itemAxisX, 50);
        const axisY = safeNumber(activeRotation.itemAxisY, 50);
        return `${axisX}% ${axisY}%`;
      }
    }

    // For non-hand items, use original logic with safe property access
    // Use rotation1 axis as primary, fallback to rotation2, then center
    if (safeString(item.rotation1?.enabled, 'no') === 'yes') {
      const axisX1 = safeNumber(item.rotation1?.itemAxisX, 50);
      const axisY1 = safeNumber(item.rotation1?.itemAxisY, 50);
      return `${axisX1}% ${axisY1}%`;
    } else if (safeString(item.rotation2?.enabled, 'no') === 'yes') {
      const axisX2 = safeNumber(item.rotation2?.itemAxisX, 50);
      const axisY2 = safeNumber(item.rotation2?.itemAxisY, 50);
      return `${axisX2}% ${axisY2}%`;
    }
    return '50% 50%';
  };

  return {
    rotateItems,
    loading,
    clockState, // Expose clock state for animation layer
    getDisplayableItems,
    getItemByCode,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
    isClockHand, // Expose for animation layer
    getClockAngle, // Enhanced with timezone support
    getActiveRotationConfig, // Expose for animation layer
  };
};

// Component to render a single rotate item
interface RotateItemProps {
  item: RotateItem;
  calculateBasePosition: (item: RotateItem) => any;
  calculateItemTransform: (item: RotateItem) => string;
  calculateTransformOrigin: (item: RotateItem) => string;
}

const RotateItemComponent: React.FC<RotateItemProps> = ({
  item,
  calculateBasePosition,
  calculateItemTransform,
  calculateTransformOrigin,
}) => {
  if (!item.exists || !safeString(item.imageSrc)) return null;

  const baseStyle = calculateBasePosition(item);
  const transform = calculateItemTransform(item);
  const transformOrigin = calculateTransformOrigin(item);

  // Apply EFFECT properties with safe defaults
  const applyEffects = (style: React.CSSProperties): React.CSSProperties => {
    const effectsEnabled = safeString(item.render, 'no') === 'yes';
    
    if (!effectsEnabled) return style;

    const effects = { ...style };

    // Shadow effect
    if (safeString(item.shadow, 'no') === 'yes') {
      effects.filter = `${effects.filter || ''} drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`.trim();
    }

    // Glow effect  
    if (safeString(item.glow, 'no') === 'yes') {
      effects.filter = `${effects.filter || ''} drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))`.trim();
    }

    // Transparency effect
    if (safeString(item.transparent, 'no') === 'yes') {
      effects.opacity = 0.7;
    }

    // Pulse effect (CSS animation will be added separately)
    if (safeString(item.pulse, 'no') === 'yes') {
      effects.animation = `${effects.animation || ''} pulse 2s ease-in-out infinite`.trim();
    }

    return effects;
  };

  const finalStyle = applyEffects({
    ...baseStyle,
    transform,
    transformOrigin,
  });

  return (
    <div
      className={`rotate-item rotate-item-${safeString(item.itemCode, '')}`}
      style={finalStyle}
    >
      <img
        src={item.imageSrc}
        alt={safeString(item.itemName, '')}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
        draggable={false}
      />
    </div>
  );
};

//==============================================
// ROTATION ANIMATION COMPONENT
//==============================================

interface RotateAnimProps {
  items: RotateItem[];
  clockState?: {
    hourAngle: number;
    minuteAngle: number;
    secondAngle: number;
  };
}

const RotateAnim: React.FC<RotateAnimProps> = ({ items, clockState }) => {
  useEffect(() => {
    // Create and inject CSS animations for each item
    const styleElement = document.createElement('style');
    styleElement.id = 'rotate-animations';
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('rotate-animations');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Helper function to check if item is a clock hand (with safe property access)
    const isClockHand = (item: RotateItem): boolean => {
      const handType = safeObject(item.handType, null);
      const handRotation = safeObject(item.handRotation, null);
      return handType !== null && handType !== undefined && handRotation !== null;
    };

    // Generate CSS keyframes for all items
    let cssContent = '';
    
    items.forEach(item => {
      const itemExists = Boolean(item.exists);
      const itemName = safeString(item.itemName, '');
      const itemCode = safeString(item.itemCode, '');
      
      if (itemExists && itemName) {
        
        // Skip CSS animations for clock hands - they're controlled by real-time transforms
        if (isClockHand(item)) {
          // Clock hands get smooth real-time updates via transform in rotate_logic
          // No CSS animation needed - requestAnimationFrame handles it
          cssContent += `
            .rotate-item-${itemCode} {
              /* Clock hand - no CSS animation, controlled by real-time transforms */
              transition: none;
            }
          `;
          return;
        }

        // Generate animation for non-hand items (decorative elements)
        // Generate animation for rotation1 with safe property access
        const rotation1Enabled = safeString(item.rotation1?.enabled, 'no');
        const rotation1Way = safeString(item.rotation1?.rotationWay, 'no');
        
        if (rotation1Enabled === 'yes' && rotation1Way && rotation1Way !== 'no') {
          const direction1 = rotation1Way === '+' ? '360deg' : '-360deg';
          const animationName1 = `rotate1-${itemCode}`;
          const posX1 = safeNumber(item.rotation1?.itemPositionX, 0);
          const posY1 = safeNumber(item.rotation1?.itemPositionY, 0);
          const tilt1 = safeNumber(item.rotation1?.itemTiltPosition, 0);
          
          cssContent += `
            @keyframes ${animationName1} {
              from {
                transform: translate(-50%, -50%) 
                          translate(${posX1}%, ${posY1}%) 
                          rotate(${tilt1}deg);
              }
              to {
                transform: translate(-50%, -50%) 
                          translate(${posX1}%, ${posY1}%) 
                          rotate(calc(${tilt1}deg + ${direction1}));
              }
            }
          `;
        }

        // Generate animation for rotation2 with safe property access
        const rotation2Enabled = safeString(item.rotation2?.enabled, 'no');
        const rotation2Way = safeString(item.rotation2?.rotationWay, 'no');
        
        if (rotation2Enabled === 'yes' && rotation2Way && rotation2Way !== 'no') {
          const direction2 = rotation2Way === '+' ? '360deg' : '-360deg';
          const animationName2 = `rotate2-${itemCode}`;
          const posX2 = safeNumber(item.rotation2?.itemPositionX, 0);
          const posY2 = safeNumber(item.rotation2?.itemPositionY, 0);
          const tilt2 = safeNumber(item.rotation2?.itemTiltPosition, 0);
          
          cssContent += `
            @keyframes ${animationName2} {
              from {
                transform: translate(-50%, -50%) 
                          translate(${posX2}%, ${posY2}%) 
                          rotate(${tilt2}deg);
              }
              to {
                transform: translate(-50%, -50%) 
                          translate(${posX2}%, ${posY2}%) 
                          rotate(calc(${tilt2}deg + ${direction2}));
              }
            }
          `;
        }

        // Apply animations to the element (only for non-hand items)
        let animations: string[] = [];
        
        if (rotation1Enabled === 'yes' && rotation1Way && rotation1Way !== 'no') {
          const speed1 = safeNumber(item.rotation1?.rotationSpeed, 1);
          animations.push(`rotate1-${itemCode} ${speed1}s linear infinite`);
        }
        
        if (rotation2Enabled === 'yes' && rotation2Way && rotation2Way !== 'no') {
          const speed2 = safeNumber(item.rotation2?.rotationSpeed, 1);
          animations.push(`rotate2-${itemCode} ${speed2}s linear infinite`);
        }

        if (animations.length > 0) {
          const axisX = rotation1Enabled === 'yes' ? 
            safeNumber(item.rotation1?.itemAxisX, 50) : 
            safeNumber(item.rotation2?.itemAxisX, 50);
          const axisY = rotation1Enabled === 'yes' ? 
            safeNumber(item.rotation1?.itemAxisY, 50) : 
            safeNumber(item.rotation2?.itemAxisY, 50);
            
          cssContent += `
            .rotate-item-${itemCode} {
              animation: ${animations.join(', ')};
              transform-origin: ${axisX}% ${axisY}%;
            }
          `;
        }
      }
    });

    // Add global styles for rotate items with EFFECT support
    cssContent += `
      .rotate-item {
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      
      .rotate-item img {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        pointer-events: none;
      }
      
      /* Smooth transitions for better performance */
      .rotate-item {
        will-change: transform;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      
      /* EFFECT animations */
      @keyframes pulse {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1); 
        }
        50% { 
          opacity: 0.7; 
          transform: scale(1.05); 
        }
      }
      
      /* Apply EFFECT styles to items that have render: 'yes' */
      ${items.map(item => {
        const itemCode = safeString(item.itemCode, '');
        const renderEnabled = safeString(item.render, 'no') === 'yes';
        
        if (!renderEnabled) return '';
        
        let effectStyles = '';
        
        // Shadow effect
        if (safeString(item.shadow, 'no') === 'yes') {
          effectStyles += 'filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));';
        }
        
        // Glow effect
        if (safeString(item.glow, 'no') === 'yes') {
          effectStyles += effectStyles ? 
            'filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));' :
            'filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));';
        }
        
        // Transparency effect
        if (safeString(item.transparent, 'no') === 'yes') {
          effectStyles += 'opacity: 0.7;';
        }
        
        // Pulse effect
        if (safeString(item.pulse, 'no') === 'yes') {
          effectStyles += 'animation: pulse 2s ease-in-out infinite;';
        }
        
        return effectStyles ? `
          .rotate-item-${itemCode} {
            ${effectStyles}
          }
        ` : '';
      }).join('')}
    `;

    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById('rotate-animations');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [items, clockState]); // Include clockState in dependencies

  return null; // This component only manages CSS, doesn't render anything
};

//==============================================
// MAIN LAUNCHER SCREEN COMPONENT
//==============================================

interface LauncherScreenProps {}

const LauncherScreen: React.FC<LauncherScreenProps> = () => {
  
  //LAUNCHER SCREEN STATE MANAGEMENT
  const { settings, updateSettings } = useLauncher();
  const {
    loading,
    clockState,
    getDisplayableItems,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
  } = useRotateLogic();
  //DETAILED DESCRIPTION: 
  //This code manages the core launcher state using custom hooks from consolidated sections above. 
  //The useLauncher hook handles user settings, file management, and localStorage persistence.
  //The useRotateLogic hook manages rotation items, clock calculations, image loading, and transform calculations.
  //TWEAK: 
  //Adjust useLauncher settings in LAUNCHER LOGIC SECTION to change default theme, animations, autoSave behavior.
  //Modify useRotateLogic parameters in rotate_config.tsx to change item configurations and display settings.

  //CONFIGURATION UI MODAL STATE  
  const [showConfigUI, setShowConfigUI] = useState(false);
  //DETAILED DESCRIPTION:
  //This state controls the visibility of the configuration modal overlay that opens via 6-tap/6-click gesture.
  //The modal displays RotateConfigUI component for editing launcher item settings.
  //Related to launcher_config.tsx for the UI content.
  //TWEAK:
  //Change initial value to true for development to keep config UI always open.
  //Add animation states by expanding this to an object with { isOpen: boolean, isAnimating: boolean }.

  //BACKUP 6-CLICK SYSTEM (MOUSE SUPPORT)
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);
  const clickResetTimeout = useRef<NodeJS.Timeout | null>(null);
  //DETAILED DESCRIPTION:
  //This code provides mouse click detection as backup for touch gestures. It counts rapid clicks within time window.
  //Works alongside gesture system from GESTURE SYSTEM SECTION to provide configuration access on desktop.
  //Triggers same result as 6-tap gesture - opens configuration UI modal.
  //TWEAK:
  //Change clickCount comparison (>= 6) to different number for easier/harder access.
  //Adjust maxClickInterval (500ms) to make timing more/less strict.
  //Modify reset timeout (1000ms) to change how long sequence remembers clicks.

  const handleBackupSixClick = (event: React.MouseEvent) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;
    const maxClickInterval = 500; // 500ms between clicks
    
    // Clear existing reset timeout
    if (clickResetTimeout.current) {
      clearTimeout(clickResetTimeout.current);
    }

    // Check if click is within allowed interval
    if (timeSinceLastClick < maxClickInterval || clickCount === 0) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);
      lastClickTime.current = currentTime;

      console.log(`Click count: ${newClickCount}/6`);

      // Check if gesture is complete
      if (newClickCount >= 6) {
        console.log('6-click gesture detected! Opening config UI...');
        setShowConfigUI(true);
        setClickCount(0);
        return;
      }

      // Set timeout to reset if no more clicks
      clickResetTimeout.current = setTimeout(() => {
        console.log('Click sequence reset');
        setClickCount(0);
      }, 1000);
    } else {
      // Reset if too much time passed
      console.log('Click sequence reset due to timeout, starting new sequence');
      setClickCount(1);
      lastClickTime.current = currentTime;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickResetTimeout.current) {
        clearTimeout(clickResetTimeout.current);
      }
    };
  }, []);

  //MODAL OVERLAY COMPONENT
  const ModalOverlay: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
  }> = ({ isOpen, onClose, children }) => {
    // ESC key handler
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          opacity: isOpen ? 1 : 0,
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={(e) => {
          // Only close if clicking the backdrop, not the modal content
          if (e.target === e.currentTarget) {
            console.log('Backdrop clicked - closing modal');
            onClose();
          }
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '90vw',
            height: '90vh',
            transform: 'scale(0.9)',
            transformOrigin: 'center center',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {children}
          
          {/* Simple, Accessible Close Button */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10002,
              padding: '10px'
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Simple close button clicked');
                onClose();
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Close (ESC)"
            >
              ✕
            </button>
          </div>

          {/* Config Button - Left side */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '60px', // 40px width + 10px gap + 10px = 60px from right
              zIndex: 10002,
              padding: '10px'
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Simple config button clicked');
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Configuration"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
    );
  };

  //GESTURE SYSTEM INITIALIZATION
  const { gestureState, touchHandlers, controls, tapCount } = useGestures({
    minScale: 0.3,
    maxScale: 4.0,
    scaleStep: 0.2,
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: false, // Keep false to not interfere with launcher rotation
    enableRotation: false, // Keep false to not interfere with launcher rotation
    doubleTapZoomScale: 2.0,
    enableMultiTap: true,
    multiTapWindow: 600, // Increased window for easier detection
    onSixTap: () => {
      console.log('6-tap gesture detected! Opening config UI...');
      setShowConfigUI(true);
    },
  });

  // Debug: Log tap count changes
  useEffect(() => {
    if (tapCount > 0) {
      console.log(`Tap count: ${tapCount}/6`);
    }
  }, [tapCount]);

  //GET DISPLAYABLE ITEMS
  const displayableItems = getDisplayableItems();

  //LOADING STATE RENDERING
  if (loading) {
    return (
      <div className="launcher-container">
        <div className="launcher-content">
          <div className="loading-text">Loading launcher...</div>
        </div>
      </div>
    );
  }

  //MAIN LAUNCHER SCREEN RENDERING
  return (
    <>
      <div className="launcher-container">
        <div 
          className="launcher-content"
          style={{
            transform: `scale(${gestureState.scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
            touchAction: 'none',
          }}
          {...touchHandlers}
          onClick={handleBackupSixClick}
        >
          {/* Rotate Animation CSS Manager */}
          <RotateAnim items={displayableItems} clockState={clockState} />
          
          {/* Render all displayable rotate items */}
          {displayableItems.map((item) => (
            <RotateItemComponent
              key={item.itemCode}
              item={item}
              calculateBasePosition={calculateBasePosition}
              calculateItemTransform={calculateItemTransform}
              calculateTransformOrigin={calculateTransformOrigin}
            />
          ))}
          
          {/* Dot mark as center reference - highest z-index */}
          <DotMark />
        </div>
        
        {/* Simple Gesture Controls */}
        <GestureControls controls={controls} gestureState={gestureState} />
        
        {/* Tap Counter Indicator (for debugging) */}
        {(tapCount > 0 || clickCount > 0) && (
          <div 
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              zIndex: 1000,
              animation: 'pulse 0.5s ease-in-out'
            }}
          >
            Taps: {Math.max(tapCount, clickCount)}/6
          </div>
        )}
      </div>

      {/* Modal Overlay for Config UI */}
      <ModalOverlay isOpen={showConfigUI} onClose={() => setShowConfigUI(false)}>
        <RotateConfigUI />
      </ModalOverlay>
    </>
  );
};

export default LauncherScreen;