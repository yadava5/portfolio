/**
 * @fileoverview Skills data organized by category
 *
 * Contains all technical and soft skills with proficiency levels
 * and visual metadata for display.
 */

/** Skill proficiency level */
export type SkillLevel = "expert" | "advanced" | "intermediate" | "learning";

/** Individual skill entry */
export interface Skill {
  /** Skill name */
  name: string;
  /** Lucide icon name (for lucide-react) */
  icon?: string;
  /** Proficiency level */
  level: SkillLevel;
  /** Years of experience */
  yearsOfExperience?: number;
  /** Endorsement count from LinkedIn */
  endorsements?: number;
}

/** Skill category */
export interface SkillCategory {
  /** Category identifier */
  id: string;
  /** Category display name */
  name: string;
  /** Category description */
  description: string;
  /** Skills in this category */
  skills: Skill[];
}

/**
 * Skills organized by category
 *
 * Based on LinkedIn endorsements and project usage
 */
export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    name: "Languages",
    description: "Programming languages I work with",
    skills: [
      { name: "TypeScript", level: "advanced", endorsements: 2 },
      { name: "Python", level: "advanced", endorsements: 2 },
      { name: "JavaScript", level: "advanced" },
      { name: "Swift", level: "intermediate", endorsements: 1 },
      { name: "C++", level: "intermediate", endorsements: 2 },
      { name: "SQL", level: "advanced", endorsements: 1 },
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "UI frameworks and tools",
    skills: [
      { name: "React", level: "advanced", endorsements: 2 },
      { name: "Next.js", level: "advanced" },
      { name: "Tailwind CSS", level: "advanced" },
      { name: "SwiftUI", level: "intermediate" },
      { name: "Framer Motion", level: "intermediate" },
      { name: "GSAP", level: "intermediate" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    description: "Server-side technologies",
    skills: [
      { name: "Node.js", level: "advanced", endorsements: 2 },
      { name: "NestJS", level: "intermediate", endorsements: 1 },
      { name: "PostgreSQL", level: "advanced", endorsements: 3 },
      { name: "Prisma", level: "intermediate", endorsements: 1 },
      { name: "REST APIs", level: "advanced" },
    ],
  },
  {
    id: "data",
    name: "Data & ML",
    description: "Data engineering and machine learning",
    skills: [
      { name: "Data Pipelines", level: "advanced", endorsements: 3 },
      { name: "ETL", level: "advanced", endorsements: 3 },
      { name: "Machine Learning", level: "intermediate", endorsements: 3 },
      { name: "Tableau", level: "advanced", endorsements: 1 },
      { name: "Snowflake", level: "intermediate" },
      { name: "pandas", level: "advanced" },
    ],
  },
  {
    id: "mobile",
    name: "Mobile & Native",
    description: "iOS and desktop development",
    skills: [
      { name: "ARKit", level: "intermediate", endorsements: 1 },
      { name: "Core ML", level: "intermediate", endorsements: 2 },
      { name: "Vision", level: "intermediate" },
      { name: "Tauri", level: "intermediate" },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Tools",
    description: "Development operations and tooling",
    skills: [
      { name: "Git", level: "advanced", endorsements: 2 },
      { name: "GitHub", level: "advanced", endorsements: 2 },
      { name: "Docker", level: "intermediate", endorsements: 2 },
      { name: "Kubernetes", level: "learning", endorsements: 2 },
      { name: "Vercel", level: "advanced" },
      { name: "CI/CD", level: "intermediate" },
    ],
  },
  {
    id: "specializations",
    name: "Specializations",
    description: "Specialized skills and domains",
    skills: [
      { name: "Parallel Computing", level: "intermediate", endorsements: 2 },
      { name: "OCR", level: "intermediate", endorsements: 2 },
      { name: "API Integration", level: "advanced", endorsements: 2 },
      { name: "Metadata Management", level: "advanced", endorsements: 3 },
      { name: "Accessibility", level: "intermediate" },
    ],
  },
];

/**
 * Get all skills flattened into a single array
 */
export function getAllSkills(): Skill[] {
  return skillCategories.flatMap((cat) => cat.skills);
}

/**
 * Get skills by proficiency level
 */
export function getSkillsByLevel(level: SkillLevel): Skill[] {
  return getAllSkills().filter((skill) => skill.level === level);
}

/**
 * Get top endorsed skills (sorted by endorsement count)
 */
export function getTopEndorsedSkills(limit: number = 10): Skill[] {
  return getAllSkills()
    .filter((skill) => skill.endorsements)
    .sort((a, b) => (b.endorsements || 0) - (a.endorsements || 0))
    .slice(0, limit);
}

/**
 * Get skill category by ID
 */
export function getSkillCategory(id: string): SkillCategory | undefined {
  return skillCategories.find((cat) => cat.id === id);
}
