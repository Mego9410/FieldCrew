/**
 * Blog post frontmatter and summary types.
 * All posts in content/blog/*.mdx must have these fields.
 */

export interface FAQItem {
  q: string;
  a: string;
}

export interface PostFrontmatter {
  title: string;
  /** Meta description, ≤155 chars for SEO */
  description: string;
  excerpt: string;
  publishDate: string; // ISO date
  category: string;
  tags: string[];
  slug: string;
  featured?: boolean;
  heroImage?: string;
  /** Optional FAQ for JSON-LD and FAQ section */
  faq?: FAQItem[];
}

export interface PostSummary {
  frontmatter: PostFrontmatter;
  slug: string;
  readingTimeMinutes: number;
}

export interface Post {
  frontmatter: PostFrontmatter;
  /** Raw MDX body (for compileMDX in page) or compiled content */
  content: string;
  readingTimeMinutes: number;
}

export const REQUIRED_FRONTMATTER_KEYS: (keyof PostFrontmatter)[] = [
  "title",
  "description",
  "excerpt",
  "publishDate",
  "category",
  "tags",
  "slug",
];

export const BLOG_CATEGORIES = [
  "Payroll",
  "Overtime",
  "Job Costing",
  "Time Tracking",
  "Estimating",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
