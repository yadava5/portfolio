/**
 * @fileoverview Theme context provider for dark/light mode toggling
 *
 * Manages the application's color theme state, persisting preference
 * to localStorage and respecting the user's system preference on first visit.
 *
 * Theme is applied by toggling the "light" class on the <html> element.
 * Dark mode is the default; light mode is opt-in.
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Available theme options */
type Theme = "dark" | "light";

/** Shape of the theme context value */
interface ThemeContextValue {
  /** Current active theme */
  theme: Theme;
  /** Toggle between dark and light themes */
  toggleTheme: () => void;
  /** Whether the theme has been loaded from storage */
  isLoaded: boolean;
}

const STORAGE_KEY = "portfolio-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Reads the saved theme from localStorage or falls back to system preference
 *
 * @returns The resolved theme value
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/**
 * Applies the theme to the document root element
 *
 * @param theme - Theme to apply
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}

/** Props for the ThemeProvider component */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provides theme state and toggle functionality to the app
 *
 * Wraps the component tree with a context provider that manages
 * dark/light mode. Persists user preference to localStorage.
 *
 * @param props - Component props
 * @returns Theme context provider wrapping children
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // In any component
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  /* Load theme from storage on mount (hydration-safe) */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initial = getInitialTheme();
    applyTheme(initial);

    /* Schedule state update to avoid synchronous cascading */
    requestAnimationFrame(() => {
      setTheme(initial);
      setIsLoaded(true);
    });
  }, []);

  /** Toggles the theme and persists the new value */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme and toggle function
 *
 * @returns Theme context value with current theme and toggle function
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
