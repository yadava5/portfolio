/**
 * @fileoverview About section component
 *
 * Displays personal bio, education, and awards/honors in a bento-grid layout.
 * Uses GlassCard and ScrollReveal for consistent styling and animations.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GraduationCap,
  Award,
  MapPin,
  Calendar,
  BookOpen,
  ChevronDown,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { HoloCard } from "@/components/ui/HoloCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import {
  personalInfo,
  education,
  awards,
  getDeansListCount,
} from "@/lib/data/personal";
import { formatDate } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * About section with bio, education, and awards
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  // Animate stats counter on scroll
  useEffect(() => {
    if (!statsRef.current) return;

    const counters = statsRef.current.querySelectorAll("[data-count]");
    const ctx = gsap.context(() => {
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-count") || "0", 10);

        gsap.fromTo(
          counter,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentEducation = education[0];
  const deansListCount = getDeansListCount();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen py-24 md:py-32"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {personalInfo.tagline}
          </p>
        </ScrollReveal>

        {/* Bento grid layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Bio card - spans 2 columns */}
          <ScrollReveal
            variant="slide-up"
            delay={0.1}
            className="md:col-span-2"
          >
            <GlassCard variant="strong" className="h-full p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                  <MapPin className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {personalInfo.name}
                  </h3>
                  <p className="text-sm text-white/60">
                    {personalInfo.location}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {personalInfo.bio.map((paragraph, index) => (
                  <p
                    key={index}
                    className="leading-relaxed text-white/80"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Stats card */}
          <ScrollReveal variant="slide-left" delay={0.2}>
            <GlassCard
              variant="default"
              className="flex h-full flex-col justify-center p-6"
            >
              <div ref={statsRef} className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div
                    className="text-4xl font-bold text-violet-400"
                    data-count={deansListCount}
                  >
                    0
                  </div>
                  <p className="mt-1 text-sm text-white/60">
                    Dean&apos;s List Semesters
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className="text-4xl font-bold text-fuchsia-400"
                    data-count={8}
                  >
                    0
                  </div>
                  <p className="mt-1 text-sm text-white/60">Projects Built</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400">1M+</div>
                  <p className="mt-1 text-sm text-white/60">
                    Data Rows Processed
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className="text-4xl font-bold text-pink-400"
                    data-count={4}
                  >
                    0
                  </div>
                  <p className="mt-1 text-sm text-white/60">
                    Years of Learning
                  </p>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Education card */}
          <ScrollReveal
            variant="slide-up"
            delay={0.3}
            className="lg:col-span-2"
          >
            <HoloCard className="h-full">
              <div className="p-6 md:p-8">
                {/* Header row with school info inline */}
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20">
                      <GraduationCap className="h-5 w-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {currentEducation?.school}
                      </h3>
                      <p className="text-sm text-violet-400">
                        {currentEducation?.degree} in {currentEducation?.field}
                      </p>
                    </div>
                  </div>
                  {currentEducation && (
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(currentEducation.startDate)} —{" "}
                        {formatDate(currentEducation.endDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Coursework - grouped by category */}
                {currentEducation && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-white/40 uppercase">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Key Coursework</span>
                    </div>

                    {(() => {
                      const groups: {
                        label: string;
                        color: string;
                        badgeColor: string;
                        courses: {
                          code: string;
                          name: string;
                          desc: string;
                          idx: number;
                        }[];
                      }[] = [
                        {
                          label: "Computer Science",
                          color: "border-violet-500/20",
                          badgeColor: "bg-violet-500/20 text-violet-300",
                          courses: [],
                        },
                        {
                          label: "Mathematics",
                          color: "border-cyan-500/20",
                          badgeColor: "bg-cyan-500/20 text-cyan-300",
                          courses: [],
                        },
                        {
                          label: "Statistics",
                          color: "border-amber-500/20",
                          badgeColor: "bg-amber-500/20 text-amber-300",
                          courses: [],
                        },
                      ];

                      currentEducation.coursework.forEach((c, i) => {
                        const [code, ...rest] = c.split(" – ");
                        const fullDesc = rest.join(" – ");
                        const colonIdx = fullDesc.indexOf(":");
                        const name =
                          colonIdx > -1
                            ? fullDesc.slice(0, colonIdx)
                            : fullDesc;
                        const desc =
                          colonIdx > -1 ? fullDesc.slice(colonIdx + 2) : "";
                        const prefix = code.split(" ")[0];
                        const groupIdx =
                          prefix === "CSE" ? 0 : prefix === "MTH" ? 1 : 2;
                        groups[groupIdx].courses.push({
                          code,
                          name,
                          desc,
                          idx: i,
                        });
                      });

                      return (
                        <div className="grid gap-3 md:grid-cols-3">
                          {groups.map((group) => (
                            <div
                              key={group.label}
                              className={`rounded-xl border ${group.color} bg-white/[0.02] p-3`}
                            >
                              <span
                                className={`mb-2.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${group.badgeColor}`}
                              >
                                {group.label}
                              </span>
                              <div className="space-y-1">
                                {group.courses.map((course) => (
                                  <button
                                    key={course.idx}
                                    onClick={() =>
                                      setExpandedCourse(
                                        expandedCourse === course.idx
                                          ? null
                                          : course.idx
                                      )
                                    }
                                    className="group w-full text-left"
                                  >
                                    <div className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                                      <div className="flex min-w-0 items-center gap-2">
                                        <span className="shrink-0 font-mono text-[11px] font-semibold text-white/70">
                                          {course.code}
                                        </span>
                                        <span className="truncate text-xs text-white/50">
                                          {course.name}
                                        </span>
                                      </div>
                                      {course.desc && (
                                        <ChevronDown
                                          className={`h-3 w-3 shrink-0 text-white/30 transition-transform duration-200 ${
                                            expandedCourse === course.idx
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                      )}
                                    </div>
                                    {expandedCourse === course.idx &&
                                      course.desc && (
                                        <p className="mt-0.5 px-2 pb-1 text-[11px] leading-relaxed text-white/40">
                                          {course.desc}
                                        </p>
                                      )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </HoloCard>
          </ScrollReveal>

          {/* Awards card */}
          <ScrollReveal variant="slide-left" delay={0.4}>
            <GlassCard variant="subtle" className="h-full p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Honors & Awards
                </h3>
              </div>

              <ul className="space-y-4">
                {awards.map((award, index) => (
                  <li
                    key={index}
                    className="group relative pl-4 before:absolute before:top-2 before:left-0 before:h-2 before:w-2 before:rounded-full before:bg-amber-400/60 before:transition-colors group-hover:before:bg-amber-400"
                  >
                    <p className="font-medium text-white">{award.name}</p>
                    <p className="text-sm text-white/60">
                      {award.issuer} • {formatDate(award.date)}
                    </p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
