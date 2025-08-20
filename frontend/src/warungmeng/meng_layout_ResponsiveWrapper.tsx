// 🎨 Responsive Layout Wrapper
// Following meng_layout_* naming convention
// Handles responsive design for all screen sizes including old devices

import React from 'react';
import { LayoutManager } from './meng_layout_LayoutConfig';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  layoutManager: LayoutManager;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  layoutManager,
  className = ''
}) => {
  const responsive = layoutManager.getResponsiveConfig();

  return (
    <div className={`
      w-full
      ${responsive.maxWidth}
      mx-auto
      ${responsive.mobile}
      ${responsive.tablet}
      ${responsive.desktop}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Section wrapper for consistent spacing
interface SectionWrapperProps {
  children: React.ReactNode;
  layoutManager: LayoutManager;
  id?: string;
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  layoutManager,
  id,
  className = ''
}) => {
  const spacing = layoutManager.getOptimizedSpacing();

  return (
    <section 
      id={id}
      className={`
        ${spacing.section}
        ${className}
      `}
    >
      <ResponsiveWrapper layoutManager={layoutManager}>
        {children}
      </ResponsiveWrapper>
    </section>
  );
};