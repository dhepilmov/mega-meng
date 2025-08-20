// 🏠 Hero Section Component
// Following meng_component_* naming convention
// Displays cafe name, tagline, and welcoming message

import React from 'react';
import { CafeInfo, LayoutConfig } from './meng_types_interfaces';
import { LayoutManager } from './meng_layout_LayoutConfig';

interface HeroProps {
  cafeInfo: CafeInfo;
  layoutConfig: LayoutConfig;
}

export const Hero: React.FC<HeroProps> = ({ cafeInfo, layoutConfig }) => {
  const layoutManager = new LayoutManager(layoutConfig);

  if (!layoutManager.shouldShowSection('showHero')) {
    return null;
  }

  return (
    <section className={`warung-hero ${layoutManager.getHeroClasses()}`}>
      <div className={`text-center ${layoutManager.getContainerClasses()} px-4`}>
        <h1 className="warung-hero-title">
          {cafeInfo.name}
        </h1>
        <p className="warung-hero-tagline mb-4">
          {cafeInfo.tagline}
        </p>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          {cafeInfo.description}
        </p>
        {cafeInfo.established && (
          <p className="mt-4 text-sm opacity-75">
            Sejak {cafeInfo.established}
          </p>
        )}
        
        {/* Specialty highlights */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {cafeInfo.specialty.map((item, index) => (
            <span 
              key={index}
              className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
        
        {/* Scroll indicator for mobile */}
        <div className="mt-8 animate-bounce">
          <svg 
            className="w-6 h-6 mx-auto text-white opacity-75" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>
    </section>
  );
};