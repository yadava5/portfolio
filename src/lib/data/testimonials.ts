/**
 * @fileoverview Testimonials/recommendations data
 *
 * Contains professional recommendations from LinkedIn and other sources,
 * attributed to specific people with their roles.
 */

/** Testimonial/recommendation entry */
export interface Testimonial {
  /** Unique identifier */
  id: string;
  /** Person's name */
  name: string;
  /** Person's title/role */
  title: string;
  /** Company/organization */
  company: string;
  /** Relationship to you */
  relationship: "manager" | "colleague" | "mentor" | "client";
  /** Profile photo path */
  photo?: string;
  /** The recommendation text */
  quote: string;
  /** Date received (YYYY-MM) */
  date: string;
  /** LinkedIn profile URL */
  linkedInUrl?: string;
}

/**
 * Professional testimonials
 *
 * Sourced from LinkedIn recommendations
 */
export const testimonials: Testimonial[] = [
  {
    id: "randall-vollen",
    name: "Randall Vollen",
    title: "Hands on Experienced Data, AI & Analytics Executive",
    company: "Miami University",
    relationship: "manager",
    quote:
      "I managed Ayush as part of Miami University's inaugural Data and Business Intelligence intern cohort. From the start, he operated above intern level. Ayush contributed to core delivery. He built data pipelines used to analyze Oracle Analytics Server usage, giving the team visibility into report adoption, demand patterns, and technical load. That work informed platform decisions and prioritization. He also built a policy support chatbot that helped users interpret and apply Miami's data policies in day to day work. It translated policy language into practical guidance and reduced ambiguity without adding process overhead. Ayush showed strong judgment, independence, and follow through. He understood intent, not just requirements. He took feedback, iterated quickly, and delivered usable outcomes. He is disciplined, thoughtful, and reliable. Ayush would add value to any data, analytics, or platform team that expects real contribution and accountability.",
    date: "2026-01",
    linkedInUrl: "https://www.linkedin.com/in/randall-v-30745a4/",
  },
  {
    id: "shree-chaturvedi",
    name: "Shree Chaturvedi",
    title: "Computer Science + Mathematics @ Miami University",
    company: "Miami University",
    relationship: "colleague",
    quote:
      "Ayush was my teammate for our senior design project (capstone). He always brought good energy in meetings and came up with his own ideas. He showed strong aptitude and willingness to learn and adapt to new problem domains. I was particularly impressed with his ability to work under pressure or strict deadlines and still deliver high quality work. I'm confident he would be a valuable member in any development team.",
    date: "2026-01",
    linkedInUrl: "https://www.linkedin.com/in/chaturs/",
  },
];

/**
 * Get testimonial from a manager
 */
export function getManagerTestimonial(): Testimonial | undefined {
  return testimonials.find((t) => t.relationship === "manager");
}

/**
 * Get testimonials by relationship type
 */
export function getTestimonialsByRelationship(
  relationship: Testimonial["relationship"]
): Testimonial[] {
  return testimonials.filter((t) => t.relationship === relationship);
}

/**
 * Get a random testimonial for display
 */
export function getRandomTestimonial(): Testimonial {
  return testimonials[Math.floor(Math.random() * testimonials.length)];
}
