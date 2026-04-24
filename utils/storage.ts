import { ChatSession, Theme } from '../types';

const STORAGE_KEYS = {
  CHATS: 'AURA_CHATS',
  THEME: 'AURA_THEME',
  UI_STATE: 'AURA_UI_STATE',
} as const;

interface UIState {
  sidebarOpen: boolean;
  settingsOpen: boolean;
  compactMode?: boolean;
  dataCollection?: boolean;
  chatHistory?: boolean;
}

/**
 * Get stored chats from localStorage, with fallback
 */
export function getStoredChats(fallback: ChatSession[]): ChatSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn('Stored chats is not an array, using fallback');
      return fallback;
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored chats:', error);
    return fallback;
  }
}

/**
 * Save chats to localStorage
 */
export function setStoredChats(chats: ChatSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  } catch (error) {
    console.warn('Failed to persist chats to localStorage:', error);
  }
}

/**
 * Get stored theme, with fallback
 */
export function getStoredTheme(fallback: Theme): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return fallback;
  } catch (error) {
    console.warn('Failed to get stored theme:', error);
    return fallback;
  }
}

/**
 * Save theme to localStorage
 */
export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.warn('Failed to persist theme to localStorage:', error);
  }
}

/**
 * Get stored UI state (sidebar/settings), with fallback
 */
export function getStoredUIState(fallback: UIState): UIState {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.UI_STATE);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    return {
      sidebarOpen: typeof parsed.sidebarOpen === 'boolean' ? parsed.sidebarOpen : fallback.sidebarOpen,
      settingsOpen: typeof parsed.settingsOpen === 'boolean' ? parsed.settingsOpen : fallback.settingsOpen,
    };
  } catch (error) {
    console.warn('Failed to parse stored UI state:', error);
    return fallback;
  }
}

/**
 * Save UI state to localStorage
 */
export function setStoredUIState(state: UIState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UI_STATE, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist UI state to localStorage:', error);
  }
}

/**
 * Clear all stored data
 */
export function clearAllStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.UI_STATE);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}
