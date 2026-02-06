/**
 * @fileoverview Experience section with interactive timeline
 *
 * Displays work history in a vertical timeline layout with expandable
 * job cards. Uses GSAP ScrollTrigger for timeline animations.
 *
 * Features:
 * - Animated vertical timeline with glow effect
 * - Expandable job cards with detailed achievements
 * - Skill tags for each position
 * - Duration calculation and date formatting
 */

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Briefcase,
  MapPin,
  Calendar,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import {
  experiences,
  calculateDuration,
  formatDateRange,
  type Experience as ExperienceType,
} from "@/lib/data/experience";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Props for individual experience card */
interface ExperienceCardProps {
  /** Experience data */
  experience: ExperienceType;
  /** Card index for animation stagger */
  index: number;
  /** Whether this is the last item (no bottom connector) */
  isLast: boolean;
}

/**
 * Individual experience card component
 */
function ExperienceCard({ experience, index, isLast }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const contentRef = useRef<HTMLDivElement>(null);

  const duration = calculateDuration(experience.startDate, experience.endDate);
  const dateRange = formatDateRange(experience.startDate, experience.endDate);
  const isPresent = experience.endDate === "Present";

  return (
    <div className="relative pl-8 md:pl-12">
      {/* Timeline connector */}
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-px",
          "bg-gradient-to-b from-violet-500/50 via-purple-500/30 to-transparent",
          isLast && "h-8"
        )}
      />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute top-2 -left-2 h-4 w-4 rounded-full",
          "border-2 transition-colors duration-300",
          isPresent
            ? "border-violet-400 bg-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            : "border-white/30 bg-white/10"
        )}
      >
        {isPresent && (
          <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/50" />
        )}
      </div>

      {/* Card */}
      <ScrollReveal variant="slide-left" delay={index * 0.15}>
        <GlassCard
          hoverable
          className={cn(
            "mb-8 cursor-pointer overflow-hidden transition-all duration-300",
            isExpanded && "ring-1 ring-violet-500/30"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Header */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Title & Company */}
                <h3 className="text-lg font-semibold text-white md:text-xl">
                  {experience.title}
                </h3>
                <p className="mt-1 text-violet-400">{experience.company}</p>

                {/* Meta info */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {dateRange}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {experience.location}
                  </span>
                </div>

                {/* Employment type badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      experience.type === "internship" &&
                        "bg-violet-500/20 text-violet-300",
                      experience.type === "full-time" &&
                        "bg-emerald-500/20 text-emerald-300",
                      experience.type === "part-time" &&
                        "bg-amber-500/20 text-amber-300",
                      experience.type === "contract" &&
                        "bg-blue-500/20 text-blue-300"
                    )}
                  >
                    {experience.type.replace("-", " ")}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                    {experience.locationType}
                  </span>
                </div>
              </div>

              {/* Expand/collapse button */}
              <button
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  "bg-white/5 transition-all duration-300 hover:bg-white/10",
                  isExpanded && "rotate-180"
                )}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                <ChevronDown className="h-4 w-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Expandable content */}
          <div
            ref={contentRef}
            className={cn(
              "grid transition-all duration-300 ease-out",
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div className="border-t border-white/10 p-6 pt-4">
                {/* Description */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-medium text-white/80">
                    Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {experience.description.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/60">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                {experience.achievements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-medium text-white/80">
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-emerald-300/80"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-white/80">
                    Technologies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}

/**
 * Experience section with timeline
 */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Animate timeline glow on scroll
  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-screen py-24 md:py-32"
    >
      <div className="container mx-auto max-w-4xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Work{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Building data systems and software that teams actually use
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Animated timeline glow */}
          <div
            ref={timelineRef}
            className="absolute top-0 left-0 w-px overflow-hidden md:left-4"
            style={{ height: 0 }}
          >
            <div className="h-full w-full bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
          </div>

          {/* Experience cards */}
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
