/**
 * @fileoverview Projects section with Spotlight Showcase design
 *
 * Displays one featured project at a time with rich details,
 * and a sidebar list to select between projects.
 *
 * Features:
 * - Spotlight layout: one large showcase + selector list
 * - Animated transitions between projects
 * - Category filtering
 * - Rich project details with tech stack and links
 * - GSAP-powered entrance and switch animations
 */

"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  Github,
  Lock,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { projects, type Project } from "@/lib/data/projects";
import { cn, formatDate } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Category filter options */
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "ai-ml", label: "AI/ML" },
  { id: "full-stack", label: "Full-Stack" },
  { id: "mobile", label: "Mobile" },
  { id: "data", label: "Data" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Category colors */
const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; glow: string }
> = {
  "ai-ml": { bg: "bg-violet-500/20", text: "text-violet-300", glow: "#8b5cf6" },
  "full-stack": {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    glow: "#3b82f6",
  },
  mobile: { bg: "bg-orange-500/20", text: "text-orange-300", glow: "#f97316" },
  data: { bg: "bg-emerald-500/20", text: "text-emerald-300", glow: "#10b981" },
  other: { bg: "bg-gray-500/20", text: "text-gray-300", glow: "#6b7280" },
};

/**
 * Spotlight showcase for the active project
 */
function ProjectSpotlight({ project }: { project: Project }) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const colors = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other;

  useEffect(() => {
    if (!spotlightRef.current) return;

    // Animate in when project changes
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spotlightRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [project.id]);

  return (
    <div ref={spotlightRef} className="relative">
      {/* Background glow */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl"
        style={{ background: colors.glow }}
      />

      <GlassCard variant="strong" className="relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f]" />

          {/* Floating orbs */}
          <div
            className="absolute -top-1/4 -left-1/4 h-96 w-96 animate-[float_8s_ease-in-out_infinite] rounded-full opacity-30 blur-3xl"
            style={{ background: colors.glow }}
          />
          <div
            className="absolute -right-1/4 -bottom-1/4 h-80 w-80 animate-[float_10s_ease-in-out_infinite_reverse] rounded-full opacity-20 blur-3xl"
            style={{ background: colors.glow }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium capitalize",
                    colors.bg,
                    colors.text
                  )}
                >
                  {project.category.replace("-", "/")}
                </span>
                {project.isPrivate && (
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-300">
                    <Lock className="h-3.5 w-3.5" />
                    Private
                  </span>
                )}
                {project.featured && (
                  <span className="flex items-center gap-1.5 rounded-full bg-fuchsia-500/20 px-3 py-1.5 text-sm font-medium text-fuchsia-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-3xl font-bold text-white md:text-4xl">
                {project.title}
              </h3>

              <p className="mt-2 text-sm text-white/50">
                {formatDate(project.startDate)} —{" "}
                {project.endDate === "Present"
                  ? "Present"
                  : formatDate(project.endDate)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2.5",
                    "bg-white/5 text-sm font-medium text-white",
                    "border border-white/10 transition-all",
                    "hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2.5",
                    "text-sm font-medium text-white",
                    "transition-all hover:opacity-80"
                  )}
                  style={{ background: colors.glow }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-white/70">
            {project.fullDescription}
          </p>

          {/* Highlights */}
          <div className="mb-8">
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white/50 uppercase">
              Key Highlights
            </h4>
            <ul className="grid gap-3 md:grid-cols-2">
              {project.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60">
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: colors.glow }}
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white/50 uppercase">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech.name}
                  className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm text-white/70"
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: tech.color || colors.glow,
                  }}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Project list item in the sidebar
 */
function ProjectListItem({
  project,
  isActive,
  onClick,
  index,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const colors = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left transition-all duration-300",
        "rounded-xl border p-4",
        isActive
          ? "border-white/10 bg-white/5"
          : "border-transparent bg-transparent hover:border-white/5 hover:bg-white/2"
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full"
          style={{ background: colors.glow }}
        />
      )}

      <div className="flex items-center gap-4">
        {/* Number */}
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm",
            isActive ? colors.bg : "bg-white/5",
            isActive ? colors.text : "text-white/40"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4
            className={cn(
              "truncate font-medium transition-colors",
              isActive
                ? "text-white"
                : "text-white/60 group-hover:text-white/80"
            )}
          >
            {project.title}
          </h4>
          <p className="mt-0.5 truncate text-xs text-white/40">
            {project.shortDescription.slice(0, 50)}...
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight
          className={cn(
            "h-4 w-4 shrink-0 transition-all",
            isActive
              ? "translate-x-0 opacity-100"
              : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
          )}
          style={{ color: isActive ? colors.glow : undefined }}
        />
      </div>
    </button>
  );
}

/**
 * Projects section with Spotlight Showcase design
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [activeProjectId, setActiveProjectId] = useState<string>(
    projects[0]?.id
  );

  // Filter projects by category
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // Sort: featured first, then by date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // Get active project with fallback
  const activeProject = useMemo(() => {
    const found = sortedProjects.find((p) => p.id === activeProjectId);
    return found || sortedProjects[0] || null;
  }, [sortedProjects, activeProjectId]);

  const handleCategoryChange = useCallback((category: CategoryId) => {
    setActiveCategory(category);
    // Reset to first project of new category
    const newFiltered =
      category === "all"
        ? projects
        : projects.filter((p) => p.category === category);
    if (newFiltered.length > 0) {
      const sorted = [...newFiltered].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });
      setActiveProjectId(sorted[0].id);
    }
  }, []);

  const handleProjectSelect = useCallback((project: Project) => {
    setActiveProjectId(project.id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen py-24 md:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Featured{" "}
            <span className="bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            A selection of projects I&apos;ve built, from AI/ML platforms to
            full-stack applications
          </p>
        </ScrollReveal>

        {/* Category filters */}
        <ScrollReveal variant="slide-up" delay={0.1} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                  activeCategory === category.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Spotlight layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Main spotlight */}
          <ScrollReveal variant="slide-up" delay={0.2}>
            {activeProject && <ProjectSpotlight project={activeProject} />}
          </ScrollReveal>

          {/* Project list sidebar */}
          <ScrollReveal variant="slide-left" delay={0.3}>
            <GlassCard
              variant="subtle"
              className="flex max-h-125 flex-col p-4 lg:sticky lg:top-24"
            >
              <h3 className="mb-4 shrink-0 px-4 text-sm font-semibold tracking-wider text-white/50 uppercase">
                All Projects ({sortedProjects.length})
              </h3>
              <div
                data-lenis-prevent
                className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 min-h-0 flex-1 space-y-1 overflow-y-auto"
              >
                {sortedProjects.map((project, index) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isActive={project.id === activeProjectId}
                    onClick={() => handleProjectSelect(project)}
                    index={index}
                  />
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* Empty state */}
        {sortedProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-white/60">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
