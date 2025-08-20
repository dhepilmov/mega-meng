// 🎛️ Layout Configuration Manager
// Following meng_layout_* naming convention
// Easy management of website layout and spacing

import { LayoutConfig } from './meng_types_interfaces';

export class LayoutManager {
  private config: LayoutConfig;

  constructor(config: LayoutConfig) {
    this.config = config;
  }

  // Get section visibility
  shouldShowSection(section: keyof Omit<LayoutConfig, 'heroHeight' | 'sectionSpacing' | 'containerMaxWidth'>): boolean {
    return this.config[section];
  }

  // Get CSS classes for sections
  getSectionClasses(): string {
    return `${this.config.sectionSpacing} px-4`;
  }

  getContainerClasses(): string {
    return `${this.config.containerMaxWidth} mx-auto`;
  }

  getHeroClasses(): string {
    return `min-h-[${this.config.heroHeight}] flex items-center justify-center`;
  }

  // Responsive breakpoints for old devices
  getResponsiveConfig() {
    return {
      mobile: 'sm:px-6',
      tablet: 'md:px-8', 
      desktop: 'lg:px-12',
      maxWidth: this.config.containerMaxWidth
    };
  }

  // Performance optimized spacing
  getOptimizedSpacing() {
    return {
      section: 'py-12 sm:py-16',
      component: 'mb-8 sm:mb-12',
      element: 'mb-4 sm:mb-6'
    };
  }
}

// Default layout for lightweight performance
export const defaultLayout: LayoutConfig = {
  showHero: true,
  showMenu: true,
  showAbout: true,
  showContact: true,
  heroHeight: '60vh',
  sectionSpacing: 'py-12 sm:py-16',
  containerMaxWidth: 'max-w-4xl'
};

// Mobile-optimized layout for old devices
export const mobileOptimizedLayout: LayoutConfig = {
  showHero: true,
  showMenu: true,
  showAbout: false, // Hide on mobile to reduce loading
  showContact: true,
  heroHeight: '50vh',
  sectionSpacing: 'py-8',
  containerMaxWidth: 'max-w-2xl'
};