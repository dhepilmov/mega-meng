//==============================================
// LAUNCHER DATA PROCESSOR
//==============================================
// DETAILED DESCRIPTION:
// Data transformation and processing utilities for the launcher system.
// Handles data conversion, image loading, and asset management.
// Extracted from launcher_screen.tsx for better organization.
// PHASE 6: Consolidated into unified launcher module structure.

import { RotateItemConfig } from '../types/launcher.types';
import { safeGet, safeString, safeNumber, safeBoolean } from '../utils/safeAccessors';
import { LAYER_PROPERTIES, ERROR_MESSAGES } from '../constants/launcher.constants';

// ===== DATA PROCESSING INTERFACES =====

export interface ProcessedRotateItem {
  // Original config
  config: RotateItemConfig;
  
  // Processed data
  exists: boolean;
  imageSrc: string;
  imageLoaded: boolean;
  imageError: string | null;
  
  // Computed properties
  isVisible: boolean;
  isClockHand: boolean;
  activeRotation: 'rotation1' | 'rotation2' | null;
  
  // Performance data
  lastUpdate: number;
  renderCount: number;
}

export interface DataProcessorOptions {
  baseImagePath: string;
  enableImagePreloading: boolean;
  imageLoadTimeout: number;
  cacheImages: boolean;
}

// ===== DATA PROCESSOR CLASS =====

export class LauncherDataProcessor {
  private static imageCache = new Map<string, HTMLImageElement>();
  private static loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  
  private options: DataProcessorOptions = {
    baseImagePath: './res/',
    enableImagePreloading: true,
    imageLoadTimeout: 5000,
    cacheImages: true,
  };

  constructor(options?: Partial<DataProcessorOptions>) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
  }

  /**
   * Process array of rotate item configurations
   */
  processRotateItems(configs: RotateItemConfig[]): ProcessedRotateItem[] {
    if (!Array.isArray(configs)) {
      console.warn('Invalid configs provided to processRotateItems');
      return [];
    }

    return configs.map((config, index) => {
      try {
        return this.processRotateItem(config, index);
      } catch (error) {
        console.error(`Error processing item ${index}:`, error);
        return this.createErrorItem(config, error);
      }
    });
  }

  /**
   * Process single rotate item configuration
   */
  processRotateItem(config: RotateItemConfig, index: number): ProcessedRotateItem {
    const imageSrc = this.resolveImagePath(config.itemPath);
    const isVisible = this.calculateVisibility(config);
    const isClockHand = this.isClockHandItem(config);
    const activeRotation = this.determineActiveRotation(config);

    const processed: ProcessedRotateItem = {
      config,
      exists: true,
      imageSrc,
      imageLoaded: false,
      imageError: null,
      isVisible,
      isClockHand,
      activeRotation,
      lastUpdate: Date.now(),
      renderCount: 0,
    };

    // Preload image if enabled
    if (this.options.enableImagePreloading && isVisible) {
      this.preloadImage(imageSrc).then(
        () => {
          processed.imageLoaded = true;
        },
        (error) => {
          processed.imageError = error.message;
        }
      );
    }

    return processed;
  }

  /**
   * Create error fallback item
   */
  private createErrorItem(config: RotateItemConfig, error: unknown): ProcessedRotateItem {
    return {
      config,
      exists: false,
      imageSrc: '',
      imageLoaded: false,
      imageError: error instanceof Error ? error.message : 'Unknown error',
      isVisible: false,
      isClockHand: false,
      activeRotation: null,
      lastUpdate: Date.now(),
      renderCount: 0,
    };
  }

  /**
   * Resolve image path with base path
   */
  private resolveImagePath(itemPath: string): string {
    if (!itemPath || typeof itemPath !== 'string') {
      return '';
    }

    // If already absolute or starts with protocol, return as-is
    if (itemPath.startsWith('http') || itemPath.startsWith('/') || itemPath.startsWith('./')) {
      return itemPath;
    }

    // Prepend base path
    return `${this.options.baseImagePath}${itemPath}`;
  }

  /**
   * Calculate item visibility
   */
  private calculateVisibility(config: RotateItemConfig): boolean {
    return (
      safeGet(config, 'itemDisplay') === 'yes' &&
      safeGet(config, 'render') === 'yes'
    );
  }

  /**
   * Check if item is a clock hand
   */
  private isClockHandItem(config: RotateItemConfig): boolean {
    const handType = safeGet(config, 'handType');
    return handType === 'hour' || handType === 'minute' || handType === 'second';
  }

  /**
   * Determine active rotation system
   */
  private determineActiveRotation(config: RotateItemConfig): 'rotation1' | 'rotation2' | null {
    const rotation1Enabled = safeGet(config, 'rotation1.enabled') === 'yes';
    const rotation2Enabled = safeGet(config, 'rotation2.enabled') === 'yes';

    if (rotation1Enabled && rotation2Enabled) {
      // Both enabled - prioritize rotation1 for main calculation
      return 'rotation1';
    } else if (rotation1Enabled) {
      return 'rotation1';
    } else if (rotation2Enabled) {
      return 'rotation2';
    }

    return null;
  }

  /**
   * Preload image with caching
   */
  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (!src) {
      throw new Error('No image source provided');
    }

    // Check cache first
    if (this.options.cacheImages && LauncherDataProcessor.imageCache.has(src)) {
      const cachedImage = LauncherDataProcessor.imageCache.get(src)!;
      return Promise.resolve(cachedImage);
    }

    // Check if already loading
    if (LauncherDataProcessor.loadingPromises.has(src)) {
      return LauncherDataProcessor.loadingPromises.get(src)!;
    }

    // Start loading
    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      const cleanup = () => {
        LauncherDataProcessor.loadingPromises.delete(src);
        clearTimeout(timeoutId);
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Image load timeout: ${src}`));
      }, this.options.imageLoadTimeout);

      img.onload = () => {
        cleanup();
        
        if (this.options.cacheImages) {
          LauncherDataProcessor.imageCache.set(src, img);
        }
        
        resolve(img);
      };

      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    LauncherDataProcessor.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }

  /**
   * Clear image cache
   */
  static clearImageCache(): void {
    LauncherDataProcessor.imageCache.clear();
    LauncherDataProcessor.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { cachedImages: number; loadingImages: number } {
    return {
      cachedImages: LauncherDataProcessor.imageCache.size,
      loadingImages: LauncherDataProcessor.loadingPromises.size,
    };
  }

  /**
   * Update processed item performance metrics
   */
  updateItemMetrics(item: ProcessedRotateItem): void {
    item.lastUpdate = Date.now();
    item.renderCount += 1;
  }

  /**
   * Filter items by visibility
   */
  getVisibleItems(items: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return items.filter(item => item.isVisible);
  }

  /**
   * Filter items by type
   */
  getClockHandItems(items: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return items.filter(item => item.isClockHand);
  }

  /**
   * Get items with active rotations
   */
  getRotatingItems(items: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return items.filter(item => item.activeRotation !== null);
  }

  /**
   * Sort items by layer order
   */
  sortItemsByLayer(items: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return [...items].sort((a, b) => {
      const layerA = safeNumber(a.config.itemLayer, 1);
      const layerB = safeNumber(b.config.itemLayer, 1);
      return layerA - layerB;
    });
  }

  /**
   * Validate item data integrity
   */
  validateItem(item: ProcessedRotateItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.config) {
      errors.push('Missing configuration');
    }

    if (!item.imageSrc && item.isVisible) {
      errors.push('Missing image source for visible item');
    }

    if (item.isClockHand && !item.activeRotation) {
      errors.push('Clock hand item has no active rotation');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create summary of processed items
   */
  createProcessingSummary(items: ProcessedRotateItem[]): object {
    const visible = items.filter(item => item.isVisible);
    const clockHands = items.filter(item => item.isClockHand);
    const rotating = items.filter(item => item.activeRotation !== null);
    const errors = items.filter(item => item.imageError !== null);

    return {
      totalItems: items.length,
      visibleItems: visible.length,
      clockHandItems: clockHands.length,
      rotatingItems: rotating.length,
      errorItems: errors.length,
      cacheStats: LauncherDataProcessor.getCacheStats(),
      lastProcessed: new Date().toISOString(),
    };
  }
}

export default LauncherDataProcessor;