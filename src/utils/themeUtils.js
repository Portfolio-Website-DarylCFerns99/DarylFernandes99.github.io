// Theme mode constants
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Theme mode labels for UI
export const THEME_MODE_LABELS = {
  [THEME_MODES.LIGHT]: 'Light Mode',
  [THEME_MODES.DARK]: 'Dark Mode',
  [THEME_MODES.SYSTEM]: 'System Mode'
};

// Local storage key for theme preference
export const THEME_STORAGE_KEY = 'theme-mode';

/**
 * Get the theme mode from localStorage, defaulting to system
 */
export const getStoredThemeMode = () => {
  if (typeof window === 'undefined') return THEME_MODES.SYSTEM;
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return Object.values(THEME_MODES).includes(stored) ? stored : THEME_MODES.SYSTEM;
};

/**
 * Store the theme mode in localStorage
 */
export const setStoredThemeMode = (mode) => {
  if (typeof window === 'undefined') return;
  
  if (Object.values(THEME_MODES).includes(mode)) {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
};

/**
 * Get the system's preferred color scheme
 */
export const getSystemPreference = () => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Resolve the actual theme (light/dark) based on the current mode
 */
export const resolveTheme = (mode) => {
  switch (mode) {
    case THEME_MODES.LIGHT:
      return 'light';
    case THEME_MODES.DARK:
      return 'dark';
    case THEME_MODES.SYSTEM:
      return getSystemPreference();
    default:
      return getSystemPreference();
  }
};

/**
 * Get the next theme mode in the cycle: light -> dark -> system -> light
 */
export const getNextThemeMode = (currentMode) => {
  switch (currentMode) {
    case THEME_MODES.LIGHT:
      return THEME_MODES.DARK;
    case THEME_MODES.DARK:
      return THEME_MODES.SYSTEM;
    case THEME_MODES.SYSTEM:
      return THEME_MODES.LIGHT;
    default:
      return THEME_MODES.SYSTEM;
  }
};

/**
 * Create a media query listener for system theme changes
 */
export const createSystemThemeListener = (callback) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e) => {
    callback(e.matches ? 'dark' : 'light');
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}; 