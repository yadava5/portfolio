/**
 * @fileoverview 3D tilt card with GSAP-powered perspective effect
 *
 * Creates a card that tilts toward the mouse cursor, creating a
 * parallax-like 3D effect. Uses GSAP for smooth 60fps animations.
 *
 * Features:
 * - Mouse-tracking 3D tilt effect
 * - Configurable tilt intensity
 * - Glare/shine overlay that follows mouse
 * - GSAP spring animation on mouse leave
 * - Respects prefers-reduced-motion
 */

"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

/** Props for the TiltCard component */
interface TiltCardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Maximum tilt angle in degrees */
  maxTilt?: number;
  /** Enable glare/shine effect */
  enableGlare?: boolean;
  /** Perspective distance (higher = subtler effect) */
  perspective?: number;
  /** Scale factor on hover */
  hoverScale?: number;
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
 * Card with mouse-tracking 3D tilt effect
 *
 * The tilt is calculated based on mouse position relative to the
 * card center, then applied via CSS transform with GSAP smoothing.
 *
 * @param props - Component props
 * @returns A 3D tilt card element
 *
 * @example
 * ```tsx
 * <TiltCard maxTilt={15} enableGlare>
 *   <img src="/project.png" alt="Project" />
 *   <h3>Project Name</h3>
 * </TiltCard>
 * ```
 */
export function TiltCard({
  children,
  className,
  maxTilt = 10,
  enableGlare = true,
  perspective = 1000,
  hoverScale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const reduced = useRef(false);

  /* Check reduced motion preference on mount */
  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  /**
   * Handle mouse movement to update tilt
   */
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced.current || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    /* Calculate mouse position relative to card center (-1 to 1) */
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    /* Calculate rotation (inverted for natural feel) */
    const rotateX = -y * maxTilt * 2;
    const rotateY = x * maxTilt * 2;

    /* Apply tilt with GSAP */
    gsap.to(card, {
      rotateX,
      rotateY,
      scale: hoverScale,
      duration: 0.3,
      ease: "power2.out",
    });

    /* Update glare position */
    if (enableGlare && glareRef.current) {
      const glareX = (x + 0.5) * 100;
      const glareY = (y + 0.5) * 100;
      gsap.to(glareRef.current, {
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
        duration: 0.3,
      });
    }
  }

  /**
   * Reset tilt on mouse leave
   */
  function handleMouseLeave() {
    if (reduced.current || !cardRef.current) return;

    setIsHovering(false);

    /* Animate back to flat with spring effect */
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });

    /* Fade out glare */
    if (enableGlare && glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }

  /**
   * Handle mouse enter
   */
  function handleMouseEnter() {
    if (reduced.current) return;
    setIsHovering(true);

    if (enableGlare && glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 1,
        duration: 0.3,
      });
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl",
        "transition-shadow duration-300",
        isHovering && "shadow-2xl",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: `${perspective}px`,
      }}
    >
      {/* Content with slight Z transform for depth */}
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>

      {/* Glare overlay */}
      {enableGlare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
          style={{ mixBlendMode: "overlay" }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
