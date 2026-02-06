/**
 * @fileoverview Holographic card with animated rainbow border
 *
 * A premium card effect with an animated holographic gradient that
 * shimmers around the border. Uses CSS animations for 60fps performance.
 *
 * Features:
 * - Animated rainbow gradient border
 * - Glow effect that follows the gradient
 * - Optional mouse-tracking shine overlay
 * - GPU-accelerated CSS animations
 */

"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, type ReactNode } from "react";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

/** Props for the HoloCard component */
interface HoloCardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes for the outer wrapper */
  className?: string;
  /** Additional CSS classes for the inner content area */
  contentClassName?: string;
  /** Enable mouse-tracking shine effect */
  enableShine?: boolean;
  /** Animation speed in seconds */
  animationSpeed?: number;
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

/**
 * Card with animated holographic rainbow border
 *
 * The holographic effect is achieved with:
 * 1. A rotating conic gradient for the border
 * 2. An inner card that masks the gradient
 * 3. Optional mouse-tracking radial gradient overlay
 *
 * @param props - Component props
 * @returns A holographic card element
 *
 * @example
 * ```tsx
 * <HoloCard>
 *   <h2>Featured Project</h2>
 *   <p>Description here</p>
 * </HoloCard>
 *
 * <HoloCard enableShine animationSpeed={4}>
 *   Interactive content
 * </HoloCard>
 * ```
 */
export function HoloCard({
  children,
  className,
  contentClassName,
  enableShine = false,
  animationSpeed = 3,
  hoverable = false,
  onClick,
}: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  /**
   * Track mouse position for shine effect
   */
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enableShine || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "holo-card group relative rounded-2xl p-[2px]",
        "transition-transform duration-[var(--transition-base)]",
        hoverable && "cursor-pointer hover:scale-[1.02]",
        !hoverable && "hover:scale-[1.02]",
        className
      )}
      style={
        {
          "--animation-speed": `${animationSpeed}s`,
        } as React.CSSProperties
      }
    >
      {/* Animated holographic border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-75 blur-sm transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from var(--holo-angle, 0deg), #ff0080, #ff8c00, #40e0d0, #8b5cf6, #ff0080)",
          animation: `holo-rotate var(--animation-speed) linear infinite`,
        }}
        aria-hidden="true"
      />

      {/* Border gradient (sharper) */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "conic-gradient(from var(--holo-angle, 0deg), #ff0080, #ff8c00, #40e0d0, #8b5cf6, #ff0080)",
          animation: `holo-rotate var(--animation-speed) linear infinite`,
        }}
        aria-hidden="true"
      />

      {/* Inner content card */}
      <div
        className={cn(
          "relative rounded-[14px]",
          "bg-[var(--background)]",
          "backdrop-blur-xl",
          contentClassName
        )}
      >
        {/* Mouse-tracking shine overlay */}
        {enableShine && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
            }}
            aria-hidden="true"
          />
        )}

        {children}
      </div>
    </div>
  );
}
