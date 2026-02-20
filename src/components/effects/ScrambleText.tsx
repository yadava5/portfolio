/**
 * @fileoverview Scramble text animation effect
 *
 * Creates a decryption/typewriter effect where characters appear scrambled
 * and then resolve to their final form from left to right.
 *
 * Features:
 * - Cryptographic-style character scrambling
 * - Smooth left-to-right reveal animation
 * - Configurable speed and character set
 * - Respects reduced motion preferences
 */

"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";

/** Characters used for the scramble effect */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&αβγδεζηθλμξπσφψω01";

/** Props for ScrambleText component */
interface ScrambleTextProps {
  /** The final text to display */
  text: string;
  /** Delay before starting animation (ms) */
  delay?: number;
  /** Speed of character resolution (ms per character) */
  speed?: number;
  /** Duration of scramble effect per character (ms) */
  scrambleDuration?: number;
  /** Additional className for styling */
  className?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * Get a random character from the scramble set
 */
function getRandomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/**
 * ScrambleText component
 *
 * Animates text with a decryption effect where characters appear scrambled
 * and resolve from left to right.
 */
export function ScrambleText({
  text,
  delay = 0,
  speed = 50,
  scrambleDuration = 800,
  className = "",
  onComplete,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef<number | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(() => {
    // If reduced motion, just show the text immediately
    if (prefersReducedMotion) {
      setDisplayText(text);
      onComplete?.();
      return;
    }

    // Delay before starting
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
      setIsAnimating(true);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      cleanup();
    };
  }, [delay, prefersReducedMotion, text, onComplete, cleanup]);

  useEffect(() => {
    if (!hasStarted || !isAnimating || prefersReducedMotion) return;

    let resolvedIndex = 0;
    const totalChars = text.length;
    const scrambleIterations = Math.ceil(scrambleDuration / 30); // ~30ms per frame
    let currentIteration = 0;

    // Generate scrambled text with resolved prefix
    const generateFrame = () => {
      const resolved = text.slice(0, resolvedIndex);
      const scrambled = Array.from({ length: totalChars - resolvedIndex })
        .map((_, i) => {
          // Characters closer to resolving scramble faster
          const distanceFromResolve = i;
          if (distanceFromResolve < 3 && Math.random() > 0.5) {
            return text[resolvedIndex + i];
          }
          return text[resolvedIndex + i] === " " ? " " : getRandomChar();
        })
        .join("");

      setDisplayText(resolved + scrambled);
    };

    // Initial scramble phase
    const scrambleInterval = setInterval(() => {
      currentIteration++;
      generateFrame();

      if (currentIteration >= scrambleIterations) {
        clearInterval(scrambleInterval);

        // Start resolving characters one by one
        const resolveInterval = setInterval(() => {
          if (resolvedIndex >= totalChars) {
            clearInterval(resolveInterval);
            setDisplayText(text);
            setIsAnimating(false);
            onComplete?.();
            return;
          }

          resolvedIndex++;
          generateFrame();
        }, speed);

        intervalRef.current = resolveInterval;
      }
    }, 30);

    return () => {
      clearInterval(scrambleInterval);
      cleanup();
    };
  }, [hasStarted, isAnimating, text, speed, scrambleDuration, prefersReducedMotion, onComplete, cleanup]);

  // Show nothing until animation starts (for delay)
  if (!hasStarted && !prefersReducedMotion) {
    return (
      <span className={className}>
        {/* Invisible placeholder to prevent layout shift */}
        <span className="invisible">{text}</span>
      </span>
    );
  }

  return (
    <span className={className}>
      {displayText.split("").map((char, i) => (
        <span
          key={i}
          className={
            i < text.length && displayText[i] === text[i]
              ? "opacity-100"
              : "opacity-70 text-violet-400"
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}
