import { useEffect } from 'react';

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