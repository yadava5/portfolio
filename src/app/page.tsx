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

import {
  Hero,
  About,
  Experience,
  Projects,
  Skills,
  Testimonials,
  Contact,
} from "@/components/sections";

/**
 * Home page component
 *
 * Renders all portfolio sections in order.
 * Each section has an `id` attribute that the Header nav links scroll to.
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

      {/* Testimonials section */}
      <Testimonials />

      {/* Contact section */}
      <Contact />
    </>
  );
}
