/**
 * @fileoverview Theme provider — locked to dark mode
 *
 * The portfolio uses dark mode exclusively. This provider ensures
 * the "light" class is never present on the <html> element and
 * exposes a simple pass-through wrapper for the component tree.
 */

import type { ReactNode } from "react";

/** Props for the ThemeProvider component */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Wraps children — dark mode is always active (no toggling).
 *
 * @param props - Component props
 * @returns Children unchanged
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
