/**
 * @fileoverview Glassmorphism card component
 *
 * A reusable card with frosted glass effect using backdrop-filter.
 * Supports multiple visual variants and optional hover glow effects.
 *
 * Features:
 * - Backdrop blur for true glassmorphism
 * - Configurable border glow color
 * - Hover state with subtle lift and glow
 * - Polymorphic: can render as any HTML element
 */

import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef, type ElementType } from "react";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

/** Visual style variants for the glass card */
type GlassVariant = "default" | "subtle" | "strong" | "colored";

/** Props for the GlassCard component */
interface GlassCardProps<T extends ElementType = "div"> {
  /** HTML element or component to render as */
  as?: T;
  /** Visual style variant */
  variant?: GlassVariant;
  /** Accent color for border glow (CSS color value) */
  glowColor?: string;
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Card content */
  children?: React.ReactNode;
}

/* ──────────────────────────────────────────────
   Variant styles
   ────────────────────────────────────────────── */

/** Base styles shared by all variants */
const baseStyles = cn(
  "relative rounded-2xl",
  "border border-(--glass-border)",
  "transition-all duration-(--transition-base) ease-(--easing-smooth)"
);

/** Variant-specific styles */
const variantStyles: Record<GlassVariant, string> = {
  default: cn(
    "bg-(--glass-background)",
    "backdrop-blur-xl",
    "shadow-lg shadow-(--glass-shadow)"
  ),
  subtle: cn(
    "bg-(--glass-background)/50",
    "backdrop-blur-md",
    "shadow-md shadow-(--glass-shadow)/50"
  ),
  strong: cn(
    "bg-(--glass-background)",
    "backdrop-blur-2xl",
    "shadow-xl shadow-(--glass-shadow)",
    "border-(--glass-border)/20"
  ),
  colored: cn(
    "bg-linear-to-br from-(--accent-primary)/10 to-(--accent-secondary)/10",
    "backdrop-blur-xl",
    "shadow-lg shadow-(--glass-shadow)"
  ),
};

/** Hover effect styles */
const hoverStyles = cn(
  "hover:-translate-y-1",
  "hover:shadow-xl",
  "hover:border-(--accent-primary)/30"
);

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

/**
 * Glassmorphism card with frosted glass effect
 *
 * @param props - Component props including variant and hover options
 * @returns A styled glass card element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GlassCard>Content here</GlassCard>
 *
 * // With variant and hover
 * <GlassCard variant="colored" hoverable>
 *   Hoverable colored card
 * </GlassCard>
 *
 * // As a different element
 * <GlassCard as="article" className="p-6">
 *   Article content
 * </GlassCard>
 * ```
 */
export function GlassCard<T extends ElementType = "div">({
  as,
  variant = "default",
  glowColor,
  hoverable = false,
  className,
  children,
  ...props
}: GlassCardProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GlassCardProps<T>>) {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverable && hoverStyles,
        className
      )}
      style={
        glowColor
          ? ({
              "--glow-color": glowColor,
              boxShadow: `0 0 20px 0 ${glowColor}20`,
            } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      {children}
    </Component>
  );
}
