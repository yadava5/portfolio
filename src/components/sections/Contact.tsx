/**
 * @fileoverview Contact section with form and social links
 *
 * Features a glassmorphism contact form and social media links
 * with animated hover effects.
 *
 * Features:
 * - Contact form with validation
 * - Social media links with tooltips
 * - Floating gradient orbs background
 * - GSAP scroll animations
 * - Accessible form controls
 *
 * @module components/sections/Contact
 */

"use client";

import { useState, useRef, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { personalInfo, socialLinks } from "@/lib/data/personal";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Icon mapping for social platforms */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Github: <Github className="h-5 w-5" />,
  Linkedin: <Linkedin className="h-5 w-5" />,
  Mail: <Mail className="h-5 w-5" />,
};

/** Form field state */
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Initial form state */
const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

/**
 * Contact information card
 */
function ContactInfo() {
  const infoItems = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: personalInfo.location,
    },
  ];

  return (
    <GlassCard className="h-full p-8">
      <h3 className="mb-6 text-2xl font-bold text-white">Get in Touch</h3>
      <p className="mb-8 text-white/60">
        {personalInfo.availability}. Feel free to reach out for collaborations,
        opportunities, or just to say hello!
      </p>

      {/* Contact details */}
      <div className="mb-8 space-y-4">
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-400">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-white/40">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-white/90 transition-colors hover:text-violet-400"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-white/90">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div>
        <p className="mb-4 text-sm font-medium text-white/40">
          Connect with me
        </p>
        <div className="flex gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex h-12 w-12 items-center justify-center rounded-xl",
                "bg-white/5 text-white/60 transition-all duration-300",
                "hover:bg-linear-to-br hover:from-violet-500 hover:to-fuchsia-500",
                "hover:text-white hover:shadow-lg hover:shadow-violet-500/30"
              )}
              aria-label={link.name}
            >
              {SOCIAL_ICONS[link.icon] || <ExternalLink className="h-5 w-5" />}
            </a>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/**
 * Contact form component
 */
function ContactForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(
        formData.subject || "Contact from Portfolio"
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );

      // Open email client
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;

      // Success
      setIsSubmitted(true);
      setFormData(INITIAL_FORM);

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = cn(
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3",
    "text-white placeholder:text-white/30",
    "transition-all duration-300",
    "focus:border-violet-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
  );

  if (isSubmitted) {
    return (
      <GlassCard className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-500/20 to-teal-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">Email Ready!</h3>
        <p className="text-white/60">
          Your email client should have opened. Send the email to reach me!
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <h3 className="mb-6 text-2xl font-bold text-white">Send a Message</h3>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Name and Email row */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-white/60">
              Name <span className="text-fuchsia-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-white/60">
              Email <span className="text-fuchsia-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm text-white/60">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            className={inputClasses}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm text-white/60">
            Message <span className="text-fuchsia-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={5}
            className={cn(inputClasses, "resize-none")}
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Submit button */}
        <MagneticButton strength={0.2}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "group flex w-full items-center justify-center gap-2 rounded-xl py-4",
              "bg-linear-to-r from-violet-600 to-fuchsia-600",
              "font-semibold text-white",
              "transition-all duration-300",
              "hover:shadow-lg hover:shadow-violet-500/30",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </MagneticButton>
      </form>
    </GlassCard>
  );
}

/**
 * Contact section component
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen py-24 md:py-32"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 -right-32 h-125 w-125 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
            filter: "blur(100px)",
            animation: "float 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 -left-32 h-125 w-125 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)",
            filter: "blur(100px)",
            animation: "float 12s ease-in-out infinite reverse",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <ScrollReveal variant="slide-up" className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Have a project in mind or just want to chat? I&apos;d love to hear
            from you.
          </p>
        </ScrollReveal>

        {/* Contact grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal variant="slide-right" delay={0.1}>
            <ContactInfo />
          </ScrollReveal>
          <ScrollReveal variant="slide-left" delay={0.2}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export default Contact;
