import React from 'react';

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

export default DotMark;