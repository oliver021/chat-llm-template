import { useState, useCallback } from 'react';

interface UIState {
  sidebarOpen: boolean;
  settingsOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export function useUIState(): UIState {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  return { sidebarOpen, settingsOpen, openSidebar, closeSidebar, openSettings, closeSettings };
}
