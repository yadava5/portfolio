/**
 * @fileoverview About section component
 *
 * Displays personal bio, education, and awards/honors in a bento-grid layout.
 * Uses GlassCard and ScrollReveal for consistent styling and animations.
 */

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Award, MapPin, Calendar, BookOpen } from "lucide-react";

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
                  <div className="text-4xl font-bold text-purple-400">
                    1M+
                  </div>
                  <p className="mt-1 text-sm text-white/60">Data Rows Processed</p>
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
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20">
                    <GraduationCap className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Education
                  </h3>
                </div>

                {currentEducation && (
                  <div className="space-y-6">
                    {/* School info */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-white">
                          {currentEducation.school}
                        </h4>
                        <p className="mt-1 text-violet-400">
                          {currentEducation.degree} in {currentEducation.field}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(currentEducation.startDate)} —{" "}
                            {formatDate(currentEducation.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Relevant coursework - enhanced grid */}
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
                        <BookOpen className="h-4 w-4 text-violet-400" />
                        <span>Key Coursework</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {currentEducation.coursework.map((course, index) => {
                          const [code, ...rest] = course.split(" – ");
                          const description = rest.join(" – ");
                          const hasCode = description.length > 0;
                          const colors = [
                            "from-violet-500/20 to-purple-500/10 border-violet-500/30",
                            "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30",
                            "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
                            "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                            "from-amber-500/20 to-orange-500/10 border-amber-500/30",
                            "from-rose-500/20 to-red-500/10 border-rose-500/30",
                          ];
                          return (
                            <div
                              key={index}
                              className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colors[index % colors.length]}`}
                            >
                              {hasCode ? (
                                <>
                                  <p className="font-mono text-xs font-semibold text-white/90">
                                    {code}
                                  </p>
                                  <p className="mt-1 text-xs text-white/60 leading-relaxed">
                                    {description}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm text-white/80">{course}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
