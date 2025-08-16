import { useEffect, useRef } from 'react';

// Custom effect hooks for launcher
export const useLocalStorageEffect = (key: string, value: any, dependencies: any[] = []) => {
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, dependencies);
};

export const useWindowFocusEffect = (callback: () => void) => {
  useEffect(() => {
    const handleFocus = () => callback();
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [callback]);
};

export const useAppLifecycleEffect = (
  onMount?: () => void,
  onUnmount?: () => void
) => {
  useEffect(() => {
    onMount?.();
    
    return () => {
      onUnmount?.();
    };
  }, []);
};

export const useOfflineEffect = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  useEffect(() => {
    const handleOnline = () => onOnline?.();
    const handleOffline = () => onOffline?.();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnline, onOffline]);
};

export const useKeyboardShortcutEffect = (
  shortcut: string,
  callback: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === shortcut || event.code === shortcut) {
        event.preventDefault();
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, callback, enabled]);
};