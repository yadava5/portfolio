/**
 * @fileoverview Hero section with animated text and particles background
 *
 * The above-the-fold introduction section featuring:
 * - Animated text reveal using GSAP
 * - Floating particles background
 * - Scroll-triggered parallax fade-out
 * - Magnetic CTA buttons
 * - Social links
 *
 * Performance optimized with GPU-accelerated transforms.
 */

"use client";

import { cn } from "@/lib/utils";
import { personalInfo, socialLinks } from "@/lib/data/personal";
import { ParticlesBg } from "@/components/ui";
import { MagneticButton } from "@/components/effects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

/* Register GSAP plugin */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ──────────────────────────────────────────────
   Social icon SVG paths (24x24 viewBox)
   ────────────────────────────────────────────── */

const ICON_PATHS: Record<string, string> = {
  Github:
    "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
  Linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  Mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2-8 5-8-5v2l8 5 8-5V6z",
};

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
 * Hero section with animated intro
 *
 * Features staggered text animations, floating particles,
 * and a parallax fade-out effect on scroll.
 *
 * @returns The hero section element
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* Timeline for staggered entrance */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      /* Animate heading */
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 50 });
        tl.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        });
      }

      /* Animate tagline */
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 0, y: 30 });
        tl.to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        );
      }

      /* Animate subtitle */
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.3"
        );
      }

      /* Animate CTA buttons */
      if (ctaRef.current) {
        gsap.set(ctaRef.current.children, { opacity: 0, y: 20, scale: 0.9 });
        tl.to(
          ctaRef.current.children,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.2"
        );
      }

      /* Animate social icons */
      if (socialRef.current) {
        gsap.set(socialRef.current.children, { opacity: 0, y: 20 });
        tl.to(
          socialRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.2"
        );
      }

      /* Scroll-triggered fade out and parallax */
      if (contentRef.current && sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(contentRef.current, {
              opacity: 1 - progress * 1.5,
              y: progress * 100,
              scale: 1 - progress * 0.1,
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Particles background */}
      <ParticlesBg count={50} baseHue={270} interactive />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 -left-32 h-96 w-96 rounded-full opacity-30 blur-[120px]"
        style={{ background: "var(--accent-primary)" }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--accent-secondary)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full opacity-15 blur-[80px]"
        style={{ background: "var(--accent-tertiary)" }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-4xl text-center will-change-transform"
      >
        {/* Availability badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-background)] px-4 py-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-sm text-foreground-muted">
            {personalInfo.availability}
          </span>
        </div>

        {/* Name heading */}
        <h1
          ref={headingRef}
          className="mb-4 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          <span className="block">Hi, I&apos;m</span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--holo-gradient)" }}
          >
            {personalInfo.firstName}
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mb-4 text-lg font-medium tracking-wide text-accent-primary md:text-xl"
        >
          {personalInfo.tagline}
        </p>

        {/* Subtitle / short bio */}
        <p
          ref={subtitleRef}
          className="mx-auto mb-8 max-w-2xl text-base text-foreground-muted md:text-lg"
        >
          {personalInfo.bio[0]}
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="mb-10 flex flex-wrap justify-center gap-4">
          <MagneticButton
            className={cn(
              "rounded-full px-8 py-3 text-sm font-semibold text-white",
              "transition-all duration-[var(--transition-base)]",
              "hover:shadow-lg hover:shadow-accent-primary/30"
            )}
            strength={0.2}
          >
            <a
              href="#projects"
              className="block"
              style={{ background: "var(--accent-primary)" }}
            >
              View My Work
            </a>
          </MagneticButton>

          <MagneticButton
            className={cn(
              "rounded-full border border-[var(--glass-border)] px-8 py-3 text-sm font-semibold text-foreground",
              "transition-all duration-[var(--transition-base)]",
              "hover:border-accent-primary hover:text-accent-primary"
            )}
            strength={0.2}
          >
            <a href="#contact" className="block">
              Get in Touch
            </a>
          </MagneticButton>

          <MagneticButton
            className={cn(
              "rounded-full border border-[var(--glass-border)] px-8 py-3 text-sm font-semibold text-foreground",
              "transition-all duration-[var(--transition-base)]",
              "hover:border-accent-secondary hover:text-accent-secondary"
            )}
            strength={0.2}
          >
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              Download CV
            </a>
          </MagneticButton>
        </div>

        {/* Social links */}
        <div ref={socialRef} className="flex justify-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target={social.name !== "Email" ? "_blank" : undefined}
              rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                "border border-[var(--glass-border)] bg-[var(--glass-background)]",
                "text-foreground-muted backdrop-blur-sm",
                "transition-all duration-[var(--transition-base)]",
                "hover:border-accent-primary hover:text-accent-primary",
                "hover:shadow-lg hover:shadow-accent-primary/20"
              )}
              aria-label={`Visit ${social.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d={ICON_PATHS[social.icon] ?? ""} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-foreground-muted">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-12 w-6 rounded-full border-2 border-foreground-muted/30 p-1">
            <div className="h-2 w-full animate-bounce rounded-full bg-foreground-muted/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
