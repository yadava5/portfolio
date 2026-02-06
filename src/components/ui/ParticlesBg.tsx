/**
 * @fileoverview Ambient floating particles background
 *
 * Creates a canvas-based particle system for subtle ambient animation.
 * Optimized for performance with requestAnimationFrame and canvas.
 *
 * Features:
 * - Lightweight canvas-based rendering
 * - Configurable particle count, colors, and speed
 * - Subtle floating motion with sine wave
 * - Mouse interaction (particles drift away)
 * - Auto-disabled on reduced motion preference
 * - Responsive to viewport resize
 */

"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

/** Single particle state */
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

/** Props for the ParticlesBg component */
interface ParticlesBgProps {
  /** Number of particles */
  count?: number;
  /** Base color hue (0-360) */
  baseHue?: number;
  /** Hue variation range */
  hueRange?: number;
  /** Maximum particle size in pixels */
  maxSize?: number;
  /** Base movement speed */
  speed?: number;
  /** Enable mouse interaction */
  interactive?: boolean;
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
 * Ambient floating particles background
 *
 * Renders a full-viewport canvas with floating particles that
 * create a subtle, atmospheric effect. Particles have slight
 * sine-wave motion and can interact with the mouse cursor.
 *
 * @param props - Configuration options
 * @returns A fixed-position canvas element
 *
 * @example
 * ```tsx
 * // In layout.tsx or a page
 * <ParticlesBg count={50} baseHue={270} />
 * ```
 */
export function ParticlesBg({
  count = 40,
  baseHue = 270,
  hueRange = 60,
  maxSize = 3,
  speed = 0.3,
  interactive = true,
}: ParticlesBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Set canvas size to viewport */
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* Initialize particles */
    function initParticles() {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: Math.random() * (canvas?.height ?? window.innerHeight),
        size: Math.random() * maxSize + 1,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        opacity: Math.random() * 0.5 + 0.2,
        hue: baseHue + (Math.random() - 0.5) * hueRange,
      }));
    }
    initParticles();

    /* Track mouse position for interaction */
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    /* Animation loop */
    let time = 0;
    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      particlesRef.current.forEach((particle) => {
        /* Sine wave motion */
        const offsetX = Math.sin(time + particle.y * 0.01) * 0.5;
        const offsetY = Math.cos(time + particle.x * 0.01) * 0.5;

        /* Mouse repulsion */
        if (interactive) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            particle.x += (dx / dist) * force * 2;
            particle.y += (dy / dist) * force * 2;
          }
        }

        /* Update position */
        particle.x += particle.speedX + offsetX;
        particle.y += particle.speedY + offsetY;

        /* Wrap around edges */
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        /* Draw particle */
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    /* Cleanup */
    return () => {
      window.removeEventListener("resize", resize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, baseHue, hueRange, maxSize, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
