//==============================================
// LAUNCHER CORE DATA PROCESSOR
//==============================================
// DETAILED DESCRIPTION:
// Data transformation and processing utilities for the launcher system.
// Handles data conversion, image loading, and asset management.
// Extracted from launcher_screen.tsx for better organization.
// TWEAK:
// Modify image loading behavior for different asset strategies.
// Adjust data transformation logic for custom data formats.
// Change error handling for better user feedback.

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
  private static options: DataProcessorOptions = {
    baseImagePath: '/launcher_core/clock/',
    enableImagePreloading: true,
    imageLoadTimeout: 5000,
    cacheImages: true,
  };

  /**
   * Process raw configuration into displayable items
   */
  static processRotateConfig(config: RotateItemConfig[]): ProcessedRotateItem[] {
    return config.map((itemConfig, index) => this.processRotateItem(itemConfig, index));
  }

  /**
   * Process individual rotate item
   */
  static processRotateItem(itemConfig: RotateItemConfig, index: number): ProcessedRotateItem {
    const processedItem: ProcessedRotateItem = {
      config: itemConfig,
      exists: this.itemExists(itemConfig),
      imageSrc: this.resolveImagePath(itemConfig.itemPath),
      imageLoaded: false,
      imageError: null,
      isVisible: this.isItemVisible(itemConfig),
      isClockHand: this.isClockHand(itemConfig),
      activeRotation: this.getActiveRotation(itemConfig),
      lastUpdate: Date.now(),
      renderCount: 0,
    };

    // Start image preloading if enabled
    if (this.options.enableImagePreloading && processedItem.exists && processedItem.imageSrc) {
      this.preloadImage(processedItem.imageSrc)
        .then(() => {
          processedItem.imageLoaded = true;
        })
        .catch((error) => {
          processedItem.imageError = error.message;
        });
    }

    return processedItem;
  }

  /**
   * Check if item exists and should be processed
   */
  private static itemExists(config: RotateItemConfig): boolean {
    return !!(
      config &&
      safeString(config.itemCode) &&
      safeString(config.itemName) &&
      safeString(config.itemPath)
    );
  }

  /**
   * Check if item should be visible
   */
  private static isItemVisible(config: RotateItemConfig): boolean {
    return (
      safeString(config.itemDisplay) === 'yes' &&
      safeString(config.render) === 'yes' &&
      this.itemExists(config)
    );
  }

  /**
   * Check if item is configured as a clock hand
   */
  private static isClockHand(config: RotateItemConfig): boolean {
    const handType = config.handType;
    const handRotation = config.handRotation;
    
    return !!(
      handType && 
      handType !== null && 
      handRotation && 
      handRotation !== null &&
      (handType === 'hour' || handType === 'minute' || handType === 'second')
    );
  }

  /**
   * Determine active rotation configuration
   */
  private static getActiveRotation(config: RotateItemConfig): 'rotation1' | 'rotation2' | null {
    // For clock hands, use the specified rotation
    if (this.isClockHand(config)) {
      return config.handRotation === 'ROTATION1' ? 'rotation1' : 
             config.handRotation === 'ROTATION2' ? 'rotation2' : null;
    }

    // For non-clock items, prefer rotation1 if enabled, otherwise rotation2
    if (safeString(config.rotation1?.enabled) === 'yes') {
      return 'rotation1';
    } else if (safeString(config.rotation2?.enabled) === 'yes') {
      return 'rotation2';
    }

    return null;
  }

  /**
   * Resolve image path with base path
   */
  private static resolveImagePath(itemPath: string): string {
    if (!itemPath) return '';
    
    // If already absolute, return as-is
    if (itemPath.startsWith('http') || itemPath.startsWith('/')) {
      return itemPath;
    }

    // Remove 'res/' prefix if present (it's handled by base path)
    const cleanPath = itemPath.replace(/^(res\/|launcher_core\/clock\/layers_res\/)/, '');
    
    return `${this.options.baseImagePath}layers_res/${cleanPath}`;
  }

  /**
   * Preload image with caching
   */
  static async preloadImage(imagePath: string): Promise<HTMLImageElement> {
    // Check cache first
    if (this.options.cacheImages && this.imageCache.has(imagePath)) {
      return this.imageCache.get(imagePath)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(imagePath)) {
      return this.loadingPromises.get(imagePath)!;
    }

    // Start loading
    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${imagePath}`));
      }, this.options.imageLoadTimeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        this.loadingPromises.delete(imagePath);
        
        if (this.options.cacheImages) {
          this.imageCache.set(imagePath, img);
        }
        
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        this.loadingPromises.delete(imagePath);
        reject(new Error(`Failed to load image: ${imagePath}`));
      };

      img.src = imagePath;
    });

    this.loadingPromises.set(imagePath, loadingPromise);
    return loadingPromise;
  }

  /**
   * Get displayable items (visible and existing)
   */
  static getDisplayableItems(processedItems: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return processedItems.filter(item => item.exists && item.isVisible);
  }

  /**
   * Find item by code
   */
  static findItemByCode(processedItems: ProcessedRotateItem[], itemCode: string): ProcessedRotateItem | null {
    return processedItems.find(item => item.config.itemCode === itemCode) || null;
  }

  /**
   * Find item by layer
   */
  static findItemByLayer(processedItems: ProcessedRotateItem[], layerNumber: number): ProcessedRotateItem | null {
    return processedItems.find(item => item.config.itemLayer === layerNumber) || null;
  }

  /**
   * Get clock hands only
   */
  static getClockHands(processedItems: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return processedItems.filter(item => item.isClockHand);
  }

  /**
   * Get decorative items only (non-clock hands)
   */
  static getDecorativeItems(processedItems: ProcessedRotateItem[]): ProcessedRotateItem[] {
    return processedItems.filter(item => !item.isClockHand);
  }

  /**
   * Update item processing status
   */
  static updateItemStatus(
    item: ProcessedRotateItem, 
    updates: Partial<Pick<ProcessedRotateItem, 'imageLoaded' | 'imageError' | 'renderCount' | 'lastUpdate'>>
  ): ProcessedRotateItem {
    return {
      ...item,
      ...updates,
      lastUpdate: Date.now(),
    };
  }

  /**
   * Validate image path
   */
  static validateImagePath(imagePath: string): { isValid: boolean; error?: string } {
    if (!imagePath) {
      return { isValid: false, error: 'Image path is empty' };
    }

    if (!imagePath.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
      return { isValid: false, error: 'Invalid image format' };
    }

    return { isValid: true };
  }

  /**
   * Clear image cache
   */
  static clearImageCache(): void {
    this.imageCache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { cachedImages: number; loadingImages: number } {
    return {
      cachedImages: this.imageCache.size,
      loadingImages: this.loadingPromises.size,
    };
  }

  /**
   * Update processor options
   */
  static updateOptions(newOptions: Partial<DataProcessorOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Process timezone data for clock hands
   */
  static processTimezoneData(config: RotateItemConfig): {
    hasTimezone: boolean;
    utcOffset: number;
    use24Hour: boolean;
  } {
    const timezone = config.timezone;
    
    return {
      hasTimezone: !!(timezone && timezone.enabled === 'yes'),
      utcOffset: timezone ? safeNumber(timezone.utcOffset, 0) : 0,
      use24Hour: timezone ? timezone.use24Hour === 'yes' : true,
    };
  }

  /**
   * Create item summary for debugging
   */
  static createItemSummary(item: ProcessedRotateItem): object {
    return {
      code: item.config.itemCode,
      layer: item.config.itemLayer,
      visible: item.isVisible,
      exists: item.exists,
      isClockHand: item.isClockHand,
      activeRotation: item.activeRotation,
      imageLoaded: item.imageLoaded,
      imageError: item.imageError,
      lastUpdate: new Date(item.lastUpdate).toISOString(),
      renderCount: item.renderCount,
    };
  }
}