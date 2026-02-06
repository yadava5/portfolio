/**
 * @fileoverview Projects section with holographic bento grid
 *
 * Displays portfolio projects in an interactive bento grid layout.
 * Featured projects are larger with holographic effects.
 *
 * Features:
 * - Bento grid layout with featured projects spanning multiple columns
 * - HoloCard effect for featured projects
 * - TiltCard 3D effect on hover
 * - Category filter tabs
 * - Project detail modal
 */

"use client";

import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  Github,
  Lock,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { GlassCard } from "@/components/ui/GlassCard";
import { HoloCard } from "@/components/ui/HoloCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { projects, type Project } from "@/lib/data/projects";
import { cn, formatDate } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Category filter options */
const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ai-ml", label: "AI/ML" },
  { id: "full-stack", label: "Full-Stack" },
  { id: "mobile", label: "Mobile" },
  { id: "data", label: "Data" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Props for project card */
interface ProjectCardProps {
  /** Project data */
  project: Project;
  /** Click handler to open modal */
  onSelect: (project: Project) => void;
  /** Animation delay index */
  index: number;
}

/**
 * Individual project card component
 */
function ProjectCard({ project, onSelect, index }: ProjectCardProps) {
  const handleClick = useCallback(() => {
    onSelect(project);
  }, [project, onSelect]);

  const CardWrapper = project.featured ? HoloCard : GlassCard;

  // Only the first featured project spans 2 columns for cleaner bento layout
  const shouldSpanTwo = project.featured && index === 0;

  return (
    <ScrollReveal
      variant="slide-up"
      delay={index * 0.1}
      className={cn(shouldSpanTwo && "md:col-span-2")}
    >
      <TiltCard
        className="h-full"
        maxTilt={shouldSpanTwo ? 5 : 8}
        perspective={1200}
        enableGlare={shouldSpanTwo}
      >
        <CardWrapper
          hoverable
          className="group h-full cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          {/* Project image placeholder */}
          <div
            className={cn(
              "relative overflow-hidden",
              shouldSpanTwo ? "h-48 md:h-64" : "h-40"
            )}
          >
            {/* Gradient placeholder for project image */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                project.category === "ai-ml" &&
                  "from-violet-600/30 to-purple-900/50",
                project.category === "full-stack" &&
                  "from-blue-600/30 to-cyan-900/50",
                project.category === "mobile" &&
                  "from-orange-600/30 to-red-900/50",
                project.category === "data" &&
                  "from-emerald-600/30 to-teal-900/50",
                project.category === "other" &&
                  "from-gray-600/30 to-slate-900/50"
              )}
            />

            {/* Category badge */}
            <div className="absolute top-4 left-4 z-10">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium capitalize backdrop-blur-sm",
                  project.category === "ai-ml" &&
                    "bg-violet-500/30 text-violet-200",
                  project.category === "full-stack" &&
                    "bg-blue-500/30 text-blue-200",
                  project.category === "mobile" &&
                    "bg-orange-500/30 text-orange-200",
                  project.category === "data" &&
                    "bg-emerald-500/30 text-emerald-200",
                  project.category === "other" && "bg-gray-500/30 text-gray-200"
                )}
              >
                {project.category.replace("-", "/")}
              </span>
            </div>

            {/* Private badge */}
            {project.isPrivate && (
              <div className="absolute top-4 right-4 z-10">
                <span className="flex items-center gap-1.5 rounded-full bg-amber-500/30 px-3 py-1 text-xs font-medium text-amber-200 backdrop-blur-sm">
                  <Lock className="h-3 w-3" />
                  Private
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                View Details
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3
              className={cn(
                "font-semibold text-white",
                shouldSpanTwo ? "text-xl md:text-2xl" : "text-lg"
              )}
            >
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-white/60">
              {project.shortDescription}
            </p>

            {/* Tech stack */}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, shouldSpanTwo ? 6 : 4).map((tech) => (
                <span
                  key={tech.name}
                  className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/70"
                  style={{
                    borderLeft: `2px solid ${tech.color || "#8b5cf6"}`,
                  }}
                >
                  {tech.name}
                </span>
              ))}
              {project.techStack.length > (shouldSpanTwo ? 6 : 4) && (
                <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/50">
                  +{project.techStack.length - (shouldSpanTwo ? 6 : 4)} more
                </span>
              )}
            </div>

            {/* Links */}
            <div className="mt-4 flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="h-4 w-4" />
                  Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </CardWrapper>
      </TiltCard>
    </ScrollReveal>
  );
}

/**
 * Project detail modal
 */
interface ProjectModalProps {
  /** Currently selected project */
  project: Project | null;
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2",
            "max-h-[90vh] overflow-y-auto rounded-2xl",
            "border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl",
            "shadow-2xl shadow-violet-500/10",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          {/* Header */}
          <div className="relative border-b border-white/10 p-6">
            <Dialog.Close
              className="absolute top-4 right-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      project.category === "ai-ml" &&
                        "bg-violet-500/30 text-violet-200",
                      project.category === "full-stack" &&
                        "bg-blue-500/30 text-blue-200",
                      project.category === "mobile" &&
                        "bg-orange-500/30 text-orange-200",
                      project.category === "data" &&
                        "bg-emerald-500/30 text-emerald-200",
                      project.category === "other" &&
                        "bg-gray-500/30 text-gray-200"
                    )}
                  >
                    {project.category.replace("-", "/")}
                  </span>
                  {project.isPrivate && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-500/30 px-3 py-1 text-xs font-medium text-amber-200">
                      <Lock className="h-3 w-3" />
                      Private
                    </span>
                  )}
                </div>

                <Dialog.Title className="text-2xl font-bold text-white md:text-3xl">
                  {project.title}
                </Dialog.Title>

                <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(project.startDate)} —{" "}
                    {project.endDate === "Present"
                      ? "Present"
                      : formatDate(project.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-white/80">
                About This Project
              </h4>
              <p className="leading-relaxed text-white/70">
                {project.fullDescription}
              </p>
            </div>

            {/* Highlights */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-white/80">
                Key Highlights
              </h4>
              <ul className="grid gap-2 md:grid-cols-2">
                {project.highlights.map((highlight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/60"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-white/80">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/70"
                    style={{
                      borderLeft: `3px solid ${tech.color || "#8b5cf6"}`,
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-6 py-2.5",
                    "bg-white/10 text-sm font-medium text-white",
                    "transition-colors hover:bg-white/20"
                  )}
                >
                  <Github className="h-4 w-4" />
                  View Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-6 py-2.5",
                    "bg-violet-600 text-sm font-medium text-white",
                    "transition-colors hover:bg-violet-500"
                  )}
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Projects section with filterable bento grid
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing project for animation
    setTimeout(() => setSelectedProject(null), 200);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen py-24 md:py-32"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
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
                onClick={() => setActiveCategory(category.id)}
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

        {/* Projects grid - bento layout with 2 columns */}
        <div className="grid gap-6 md:grid-cols-2">
          {sortedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={handleProjectSelect}
              index={index}
            />
          ))}
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

      {/* Project modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </section>
  );
}
