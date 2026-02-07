/**
 * @fileoverview Testimonials section with animated carousel
 *
 * Displays professional recommendations in an interactive carousel
 * with glassmorphism cards and smooth transitions.
 *
 * Features:
 * - Auto-rotating carousel
 * - Manual navigation controls
 * - Relationship badges (manager, colleague, mentor)
 * - Quote formatting with proper attribution
 * - GSAP scroll animations
 *
 * @module components/sections/Testimonials
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  User,
  Briefcase,
  Users,
  GraduationCap,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { testimonials, type Testimonial } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Relationship display config */
const RELATIONSHIP_CONFIG: Record<
  Testimonial["relationship"],
  { label: string; icon: React.ReactNode; color: string }
> = {
  manager: {
    label: "Manager",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    color: "from-violet-500/20 to-fuchsia-500/20 text-violet-300",
  },
  colleague: {
    label: "Colleague",
    icon: <Users className="h-3.5 w-3.5" />,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-300",
  },
  mentor: {
    label: "Mentor",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-300",
  },
  client: {
    label: "Client",
    icon: <User className="h-3.5 w-3.5" />,
    color: "from-amber-500/20 to-orange-500/20 text-amber-300",
  },
};

/** Auto-rotate interval in milliseconds */
const AUTO_ROTATE_INTERVAL = 8000;

/**
 * Individual testimonial card
 */
interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const relationshipConfig = RELATIONSHIP_CONFIG[testimonial.relationship];

  useEffect(() => {
    if (!cardRef.current) return;

    if (isActive) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div ref={cardRef} className="w-full">
      <GlassCard className="relative overflow-hidden p-8 md:p-10">
        {/* Quote icon */}
        <div className="absolute -top-4 -right-4 opacity-5">
          <Quote className="h-32 w-32" />
        </div>

        {/* Relationship badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r px-3 py-1.5 text-xs font-medium">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full bg-linear-to-r px-3 py-1",
              relationshipConfig.color
            )}
          >
            {relationshipConfig.icon}
            {relationshipConfig.label}
          </span>
        </div>

        {/* Quote text */}
        <blockquote className="relative z-10 mb-8">
          <p className="text-lg leading-relaxed text-white/80 md:text-xl">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        {/* Attribution */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar placeholder */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-violet-500/20 to-fuchsia-500/20">
              <User className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-sm text-white/50">{testimonial.title}</p>
              <p className="text-xs text-white/40">{testimonial.company}</p>
            </div>
          </div>

          {/* LinkedIn link */}
          {testimonial.linkedInUrl && (
            <a
              href={testimonial.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                "bg-white/5 text-white/40 transition-all duration-300",
                "hover:bg-white/10 hover:text-white"
              )}
              aria-label={`View ${testimonial.name}'s LinkedIn profile`}
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Testimonials section component
 */
export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    const interval = setInterval(goToNext, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-24 md:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              What People Say
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Professional recommendations from colleagues and mentors
          </p>
        </ScrollReveal>

        {/* Testimonial carousel */}
        <ScrollReveal variant="fade" delay={0.1}>
          <div className="relative">
            {/* Cards */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={index === activeIndex}
              />
            ))}

            {/* Navigation controls */}
            {testimonials.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                {/* Previous button */}
                <button
                  onClick={goToPrev}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    "bg-white/5 text-white/60 transition-all duration-300",
                    "hover:bg-white/10 hover:text-white"
                  )}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        index === activeIndex
                          ? "w-8 bg-linear-to-r from-violet-500 to-fuchsia-500"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNext}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    "bg-white/5 text-white/60 transition-all duration-300",
                    "hover:bg-white/10 hover:text-white"
                  )}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default Testimonials;
