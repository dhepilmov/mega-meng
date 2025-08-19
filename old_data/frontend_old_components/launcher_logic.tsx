import React from 'react';

// Launcher Logic Types
export interface LauncherSettings {
  theme: 'light' | 'dark';
  animations: boolean;
  autoSave: boolean;
  lastOpened: string | null;
}

export interface LauncherState {
  isLoading: boolean;
  settings: LauncherSettings;
  files: any[];
}

// Default settings
export const defaultSettings: LauncherSettings = {
  theme: 'light',
  animations: true,
  autoSave: true,
  lastOpened: null,
};

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'launcher_settings',
  FILES: 'launcher_files',
  STATE: 'launcher_state',
} as const;

// Launcher logic functions
export class LauncherLogic {
  static saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }

  static clearStorage(key?: string): void {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        // Clear all launcher-related storage
        Object.values(STORAGE_KEYS).forEach(storageKey => {
          localStorage.removeItem(storageKey);
        });
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}