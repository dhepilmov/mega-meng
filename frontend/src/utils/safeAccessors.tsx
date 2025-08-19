//==============================================
// SAFE ACCESSORS UTILITY
//==============================================
// DETAILED DESCRIPTION:
// This module provides safe data access functions for the launcher system.
// Includes error-safe property access, type guards, and fallback mechanisms.
// Prevents crashes from undefined/null values and provides graceful degradation.
// TWEAK:
// Adjust default fallback values to change system behavior on errors.
// Modify type guard functions to add new validation logic.
// Change error handling by updating console logging or error reporting.

import { RotateItemConfig, RotationConfig, TimezoneConfig } from '../types/launcher.types';

/**
 * Safely access nested object properties with fallback
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.warn(`SafeGet error for path "${path}":`, error);
    return defaultValue;
  }
}

/**
 * Safely access array elements with bounds checking
 */
export function safeArrayGet<T>(arr: T[], index: number, defaultValue: T): T {
  try {
    if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
      return defaultValue;
    }
    return arr[index] !== undefined ? arr[index] : defaultValue;
  } catch (error) {
    console.warn(`SafeArrayGet error for index ${index}:`, error);
    return defaultValue;
  }
}

/**
 * Type guard for RotationConfig
 */
export function isValidRotationConfig(config: any): config is RotationConfig {
  return (
    config &&
    typeof config === 'object' &&
    (config.enabled === 'yes' || config.enabled === 'no' || config.enabled === null) &&
    typeof config.itemTiltPosition === 'number' &&
    typeof config.itemAxisX === 'number' &&
    typeof config.itemAxisY === 'number' &&
    typeof config.itemPositionX === 'number' &&
    typeof config.itemPositionY === 'number' &&
    typeof config.rotationSpeed === 'number'
  );
}

/**
 * Type guard for TimezoneConfig
 */
export function isValidTimezoneConfig(config: any): config is TimezoneConfig {
  return (
    config &&
    typeof config === 'object' &&
    (config.enabled === 'yes' || config.enabled === 'no') &&
    typeof config.utcOffset === 'number' &&
    (config.use24Hour === 'yes' || config.use24Hour === 'no')
  );
}

/**
 * Type guard for RotateItemConfig
 */
export function isValidRotateItemConfig(config: any): config is RotateItemConfig {
  return (
    config &&
    typeof config === 'object' &&
    typeof config.itemCode === 'string' &&
    typeof config.itemName === 'string' &&
    typeof config.itemPath === 'string' &&
    typeof config.itemLayer === 'number' &&
    typeof config.itemSize === 'number' &&
    isValidRotationConfig(config.rotation1) &&
    isValidRotationConfig(config.rotation2)
  );
}

/**
 * Safely get rotation config property with validation
 */
export function safeGetRotationProperty(
  config: RotationConfig | null | undefined, 
  property: keyof RotationConfig, 
  defaultValue: any
) {
  if (!isValidRotationConfig(config)) {
    return defaultValue;
  }
  
  const value = config[property];
  return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * Safely get item config property with validation
 */
export function safeGetItemProperty(
  config: RotateItemConfig | null | undefined,
  property: keyof RotateItemConfig,
  defaultValue: any
) {
  if (!isValidRotateItemConfig(config)) {
    return defaultValue;
  }
  
  const value = config[property];
  return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * Safe numeric conversion with range validation
 */
export function safeNumber(
  value: any, 
  min: number = Number.MIN_SAFE_INTEGER, 
  max: number = Number.MAX_SAFE_INTEGER, 
  defaultValue: number = 0
): number {
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(num)) {
    return defaultValue;
  }
  
  if (num < min) return min;
  if (num > max) return max;
  
  return num;
}

/**
 * Safe string conversion with validation
 */
export function safeString(value: any, defaultValue: string = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return defaultValue;
  
  try {
    return String(value);
  } catch (error) {
    console.warn('SafeString conversion error:', error);
    return defaultValue;
  }
}

/**
 * Safe boolean conversion
 */
export function safeBoolean(value: any, defaultValue: boolean = false): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'yes' || value === 'true' || value === '1' || value === 1) return true;
  if (value === 'no' || value === 'false' || value === '0' || value === 0) return false;
  
  return defaultValue;
}