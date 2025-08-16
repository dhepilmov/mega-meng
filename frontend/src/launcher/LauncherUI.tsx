import React from 'react';
import { useLauncher } from './launcher_hook';
import DotMark from './DotMark';
import { useRotateLogic, RotateItemComponent } from './rotate_logic';
import { RotateAnim } from './rotate_anim';
import { useGestures, GestureControls } from './launcher_gesture';
import './launcher.css';

interface LauncherProps {}

const Launcher: React.FC<LauncherProps> = () => {
  const { settings, updateSettings } = useLauncher();
  const {
    loading,
    clockState,
    getDisplayableItems,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
  } = useRotateLogic();

  // Initialize gesture controls
  const { gestureState, touchHandlers, controls } = useGestures({
    minScale: 0.3,
    maxScale: 4.0,
    scaleStep: 0.2,
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: false, // Keep false to not interfere with launcher rotation
    enableRotation: false, // Keep false to not interfere with launcher rotation
    doubleTapZoomScale: 2.0,
  });

  const displayableItems = getDisplayableItems();

  if (loading) {
    return (
      <div className="launcher-container">
        <div className="launcher-content">
          <div className="loading-text">Loading launcher...</div>
        </div>
      </div>
    );
  }

  return (
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
    </div>
  );
};

export default Launcher;