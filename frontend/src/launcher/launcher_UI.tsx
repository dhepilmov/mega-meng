import React from 'react';
import { useLauncher } from './launcher_hook';
import DotMark from './dot_mark';
import { useRotateLogic, RotateItemComponent } from './rotate_logic';
import { RotateAnim } from './rotate_anim';
import './launcher.css';

interface LauncherProps {}

const Launcher: React.FC<LauncherProps> = () => {
  const { settings, updateSettings } = useLauncher();
  const {
    loading,
    getDisplayableItems,
    calculatePosition,
    getAnimationStyle,
  } = useRotateLogic();

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
      <div className="launcher-content">
        {/* Rotate Animation CSS Manager */}
        <RotateAnim items={displayableItems} />
        
        {/* Render all displayable rotate items */}
        {displayableItems.map((item) => (
          <RotateItemComponent
            key={item.code}
            item={item}
            calculatePosition={calculatePosition}
            getAnimationStyle={getAnimationStyle}
          />
        ))}
        
        {/* Dot mark as center reference - highest z-index */}
        <DotMark />
      </div>
    </div>
  );
};

export default Launcher;