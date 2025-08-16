import { useState, useEffect, useCallback } from 'react';
import { LauncherLogic, LauncherSettings, LauncherState, defaultSettings, STORAGE_KEYS } from './launcher_logic';
import { useLocalStorageEffect, useOfflineEffect } from './launcher_effect';

export const useLauncher = () => {
  const [state, setState] = useState<LauncherState>({
    isLoading: true,
    settings: defaultSettings,
    files: [],
  });

  // Initialize launcher from storage
  useEffect(() => {
    const loadedSettings = LauncherLogic.loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings);
    const loadedFiles = LauncherLogic.loadFromStorage(STORAGE_KEYS.FILES, []);
    
    setState(prev => ({
      ...prev,
      settings: loadedSettings,
      files: loadedFiles,
      isLoading: false,
    }));
  }, []);

  // Save settings to storage whenever they change
  useLocalStorageEffect(STORAGE_KEYS.SETTINGS, state.settings, [state.settings]);
  
  // Save files to storage whenever they change
  useLocalStorageEffect(STORAGE_KEYS.FILES, state.files, [state.files]);

  // Handle online/offline states
  useOfflineEffect(
    () => console.log('Launcher: Back online'),
    () => console.log('Launcher: Gone offline')
  );

  const updateSettings = useCallback((newSettings: Partial<LauncherSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const addFile = useCallback((file: any) => {
    setState(prev => ({
      ...prev,
      files: [...prev.files, file],
    }));
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter((file: any) => file.id !== fileId),
    }));
  }, []);

  const clearAllData = useCallback(() => {
    LauncherLogic.clearStorage();
    setState({
      isLoading: false,
      settings: defaultSettings,
      files: [],
    });
  }, []);

  return {
    ...state,
    updateSettings,
    addFile,
    removeFile,
    clearAllData,
  };
};

export const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    return LauncherLogic.loadFromStorage(key, defaultValue);
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      
      LauncherLogic.saveToStorage(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  return [value, setStoredValue] as const;
};