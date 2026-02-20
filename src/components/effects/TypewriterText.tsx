/**
 * @fileoverview Typewriter text animation effect
 *
 * Creates a classic typewriter effect where characters appear one by one
 * with a blinking cursor at the end.
 *
 * Features:
 * - Character-by-character typing animation
 * - Blinking cursor that disappears after completion
 * - Configurable speed and delay
 * - Respects reduced motion preferences
 */

"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

/** Props for TypewriterText component */
interface TypewriterTextProps {
  /** The text to type out */
  text: string;
  /** Delay before starting animation (ms) */
  delay?: number;
  /** Speed of typing (ms per character) */
  speed?: number;
  /** Whether to show the blinking cursor */
  showCursor?: boolean;
  /** Whether to hide cursor after typing completes */
  hideCursorOnComplete?: boolean;
  /** Additional className for styling */
  className?: string;
  /** Cursor className */
  cursorClassName?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * TypewriterText component
 *
 * Animates text with a classic typewriter effect, typing characters
 * one by one with an optional blinking cursor.
 */
export function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  showCursor = true,
  hideCursorOnComplete = true,
  className = "",
  cursorClassName = "",
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    // If reduced motion, show text immediately
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Start after delay
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
      setIsTyping(true);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [delay, prefersReducedMotion, text, onComplete]);

  useEffect(() => {
    if (!hasStarted || !isTyping || prefersReducedMotion) return;

    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasStarted, isTyping, text, speed, prefersReducedMotion, onComplete]);

  // Show placeholder to prevent layout shift before animation starts
  if (!hasStarted && !prefersReducedMotion) {
    return (
      <span className={className}>
        <span className="invisible">{text}</span>
        {showCursor && (
          <span
            className={cn(
              "animate-blink ml-0.5 inline-block h-[1.1em] w-0.5 bg-current align-middle",
              cursorClassName
            )}
          />
        )}
      </span>
    );
  }

  const shouldShowCursor = showCursor && (!isComplete || !hideCursorOnComplete);

  return (
    <span className={className}>
      {displayText}
      {shouldShowCursor && (
        <span
          className={cn(
            "ml-0.5 inline-block h-[1.1em] w-0.5 bg-current align-middle",
            isTyping ? "animate-blink" : "opacity-0",
            cursorClassName
          )}
        />
      )}
    </span>
  );
}
