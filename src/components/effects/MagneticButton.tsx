/**
 * @fileoverview Magnetic button that pulls toward cursor
 *
 * Creates a button with a magnetic effect where the button
 * visually pulls toward the cursor when hovering nearby.
 *
 * Features:
 * - GSAP-powered smooth magnetic pull
 * - Configurable pull strength and range
 * - Works with any button content
 * - Spring animation on mouse leave
 * - Respects prefers-reduced-motion
 */

"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

/** Props for the MagneticButton component */
interface MagneticButtonProps {
  /** Button content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Pull strength (0-1, higher = stronger pull) */
  strength?: number;
  /** Range of the magnetic effect in pixels */
  range?: number;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

/* ──────────────────────────────────────────────
   Utility
   ────────────────────────────────────────────── */

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

/**
 * Button with magnetic pull effect toward cursor
 *
 * When the cursor approaches the button, it visually pulls
 * toward the cursor, creating an engaging hover effect.
 *
 * @param props - Component props
 * @returns A magnetic button element
 *
 * @example
 * ```tsx
 * <MagneticButton strength={0.4} onClick={handleClick}>
 *   Get in Touch
 * </MagneticButton>
 * ```
 */
export function MagneticButton({
  children,
  className,
  strength = 0.3,
  range = 100,
  type = "button",
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();

    if (reduced.current || !buttonRef.current) return;

    const button = buttonRef.current;

    function handleMouseMove(e: MouseEvent) {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      /* Only apply effect within range */
      if (distance < range) {
        const pullX = distX * strength;
        const pullY = distY * strength;

        gsap.to(button, {
          x: pullX,
          y: pullY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    function handleMouseLeave() {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    }

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, range]);

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "will-change-transform",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}
