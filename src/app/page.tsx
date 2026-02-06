/**
 * @fileoverview Home page — assembles all portfolio sections
 *
 * Each section is rendered as a full-width block with an `id` attribute
 * that the Header nav links scroll to. Actual section components will
 * replace the placeholder cards in upcoming phases.
 *
 * Section order:
 *   1. Hero      — above the fold, animated intro
 *   2. About     — bio, education, awards
 *   3. Experience — work timeline
 *   4. Projects  — featured project cards
 *   5. Skills    — categorized skill grid
 *   6. Contact   — contact form / CTA
 */

import { cn } from "@/lib/utils";
import {
  Hero,
  About,
  Experience,
  Projects,
  Skills,
} from "@/components/sections";

/** Props for the placeholder section block */
interface SectionPlaceholderProps {
  /** HTML id for anchor navigation */
  id: string;
  /** Section heading */
  title: string;
  /** Short description */
  subtitle: string;
  /** Section index for staggered gradient */
  index: number;
}

/**
 * Temporary section placeholder with glassmorphism card
 *
 * Will be replaced by real section components in Phases 5–10.
 *
 * @param props - Section placeholder props
 * @returns A styled placeholder block
 */
function SectionPlaceholder({
  id,
  title,
  subtitle,
  index,
}: SectionPlaceholderProps) {
  /** Rotating accent color per section */
  const accents = [
    "var(--accent-primary)",
    "var(--accent-secondary)",
    "var(--accent-tertiary)",
  ];
  const accent = accents[index % accents.length];

  return (
    <section
      id={id}
      className="flex min-h-[60vh] items-center justify-center px-6 py-[var(--section-padding)]"
    >
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-2xl p-10 text-center",
          "border border-[var(--glass-border)] bg-[var(--glass-background)]",
          "backdrop-blur-xl"
        )}
      >
        {/* Accent glow */}
        <div
          className="absolute -inset-px -z-10 rounded-2xl opacity-20 blur-xl"
          style={{ background: accent }}
          aria-hidden="true"
        />

        <p
          className="mb-2 text-xs font-semibold tracking-[0.3em] uppercase"
          style={{ color: accent }}
        >
          Phase {5 + index}
        </p>
        <h2 className="text-foreground mb-3 text-3xl font-bold">{title}</h2>
        <p className="text-foreground-muted">{subtitle}</p>
      </div>
    </section>
  );
}

/** Section configuration for the home page */
const SECTIONS = [
  {
    id: "contact",
    title: "Contact",
    subtitle: "Reach out form with glassmorphism — coming in Phase 10",
  },
];

/**
 * Home page component
 *
 * Renders the hero section followed by all portfolio sections.
 * Each section is a placeholder that will be swapped for the real
 * component in its respective implementation phase.
 *
 * @returns The assembled home page
 */
export default function Home() {
  return (
    <>
      {/* Hero section */}
      <Hero />

      {/* About section */}
      <About />

      {/* Experience section */}
      <Experience />

      {/* Projects section */}
      <Projects />

      {/* Skills section */}
      <Skills />

      {/* Section placeholders */}
      {SECTIONS.map((section, i) => (
        <SectionPlaceholder key={section.id} index={i} {...section} />
      ))}
    </>
  );
}
