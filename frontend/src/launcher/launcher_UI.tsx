import React from 'react';
import { useLauncher } from './launcher_hook';
import DotMark from './dot_mark';
import './launcher.css';

interface LauncherProps {}

const Launcher: React.FC<LauncherProps> = () => {
  const { settings, updateSettings } = useLauncher();

  return (
    <div className="launcher-container">
      <div className="launcher-content">
        {/* Empty container for future features */}
        <DotMark />
      </div>
    </div>
  );
};

export default Launcher;