import { useState, useCallback, useEffect } from 'react';
import { getStoredUIState, setStoredUIState } from '../utils/storage';

interface UIState {
  sidebarOpen: boolean;
  settingsOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const DEFAULT_UI_STATE = { sidebarOpen: false, settingsOpen: false };

export function useUIState(): UIState {
  const stored = getStoredUIState(DEFAULT_UI_STATE);
  const [sidebarOpen, setSidebarOpen] = useState(stored.sidebarOpen);
  const [settingsOpen, setSettingsOpen] = useState(stored.settingsOpen);

  // Persist UI state to localStorage whenever it changes
  useEffect(() => {
    setStoredUIState({ sidebarOpen, settingsOpen });
  }, [sidebarOpen, settingsOpen]);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  return { sidebarOpen, settingsOpen, openSidebar, closeSidebar, openSettings, closeSettings };
}
