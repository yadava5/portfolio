/**
 * @fileoverview Skills section with interactive 3D hexagonal grid
 *
 * Displays skills organized by category with visual proficiency indicators.
 *
 * Features:
 * - Hexagonal skill cards with hover effects
 * - Category tabs with animated underline
 * - Proficiency visualization (bars + labels)
 * - GSAP stagger animations on scroll
 * - Floating particle background
 *
 * @module components/sections/Skills
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Database,
  Globe,
  Cpu,
  Box,
  Settings,
  Sparkles,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { skillCategories, type SkillLevel } from "@/lib/data/skills";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Icon mapping for categories */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  languages: <Code2 className="h-5 w-5" />,
  frontend: <Globe className="h-5 w-5" />,
  backend: <Database className="h-5 w-5" />,
  data: <Cpu className="h-5 w-5" />,
  mobile: <Box className="h-5 w-5" />,
  devops: <Settings className="h-5 w-5" />,
  specializations: <Sparkles className="h-5 w-5" />,
};

/** Proficiency level colors and percentages */
const LEVEL_CONFIG: Record<
  SkillLevel,
  { color: string; percent: number; label: string }
> = {
  expert: {
    color: "from-violet-500 to-fuchsia-500",
    percent: 95,
    label: "Expert",
  },
  advanced: {
    color: "from-cyan-500 to-blue-500",
    percent: 80,
    label: "Advanced",
  },
  intermediate: {
    color: "from-emerald-500 to-teal-500",
    percent: 60,
    label: "Intermediate",
  },
  learning: {
    color: "from-amber-500 to-orange-500",
    percent: 35,
    label: "Learning",
  },
};

/**
 * Individual skill card with proficiency bar
 */
interface SkillCardProps {
  name: string;
  level: SkillLevel;
  endorsements?: number;
  index: number;
}

function SkillCard({ name, level, endorsements, index }: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const config = LEVEL_CONFIG[level];

  useEffect(() => {
    if (!cardRef.current || !barRef.current) return;

    // Animate the proficiency bar on scroll
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { width: "0%" },
        {
          width: `${config.percent}%`,
          duration: 1,
          delay: index * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [config.percent, index]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-gradient-to-br from-white/5 to-white/[0.02]",
        "border border-white/10 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-white/20 hover:bg-white/[0.08]",
        "hover:shadow-lg hover:shadow-violet-500/10",
        "hover:-translate-y-1"
      )}
    >
      {/* Holographic shimmer on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100"
        )}
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite linear",
        }}
      />

      <div className="relative z-10 p-4">
        {/* Skill name and endorsements */}
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold text-white/90">{name}</h4>
          {endorsements && endorsements > 0 && (
            <span className="rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-2 py-0.5 text-xs text-violet-300">
              {endorsements}{" "}
              {endorsements === 1 ? "endorsement" : "endorsements"}
            </span>
          )}
        </div>

        {/* Proficiency bar */}
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            ref={barRef}
            className={cn("h-full rounded-full bg-gradient-to-r", config.color)}
            style={{ width: "0%" }}
          />
        </div>

        {/* Level label */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">{config.label}</span>
          <span className="text-white/60">{config.percent}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Skills section component
 */
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("languages");
  const gridRef = useRef<HTMLDivElement>(null);

  const activeSkillCategory = skillCategories.find(
    (cat) => cat.id === activeCategory
  );

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      if (categoryId === activeCategory) return;

      // Animate out current skills
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-skill-card]");
        gsap.to(cards, {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            setActiveCategory(categoryId);
          },
        });
      } else {
        setActiveCategory(categoryId);
      }
    },
    [activeCategory]
  );

  // Animate in new skills when category changes
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll("[data-skill-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen py-24 md:py-32"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 -left-32 h-96 w-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Technologies and tools I use to bring ideas to life
          </p>
        </ScrollReveal>

        {/* Category tabs */}
        <ScrollReveal variant="slide-up" delay={0.1} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {skillCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "transition-transform duration-300",
                    activeCategory === category.id
                      ? "scale-110"
                      : "group-hover:scale-110"
                  )}
                >
                  {CATEGORY_ICONS[category.id]}
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Category description */}
        {activeSkillCategory && (
          <ScrollReveal variant="fade" className="mb-8 text-center">
            <GlassCard className="mx-auto inline-block px-6 py-3">
              <p className="text-white/70">{activeSkillCategory.description}</p>
            </GlassCard>
          </ScrollReveal>
        )}

        {/* Skills grid */}
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeSkillCategory?.skills.map((skill, index) => (
            <div key={skill.name} data-skill-card>
              <SkillCard
                name={skill.name}
                level={skill.level}
                endorsements={skill.endorsements}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Stats summary */}
        <ScrollReveal variant="slide-up" delay={0.3} className="mt-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                label: "Skill Categories",
                value: skillCategories.length,
                icon: "📚",
              },
              {
                label: "Technologies",
                value: skillCategories.reduce(
                  (acc, cat) => acc + cat.skills.length,
                  0
                ),
                icon: "⚡",
              },
              {
                label: "Years Coding",
                value: "5+",
                icon: "🚀",
              },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-center">
                <div className="mb-2 text-3xl">{stat.icon}</div>
                <div className="mb-1 text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default Skills;
