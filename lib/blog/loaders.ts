import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostFrontmatter, PostSummary, Post } from "./types";
import { REQUIRED_FRONTMATTER_KEYS } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const WPM = 220;

function getContentDir(): string {
  if (!fs.existsSync(CONTENT_DIR)) {
    throw new Error(`Blog content directory not found: ${CONTENT_DIR}`);
  }
  return CONTENT_DIR;
}

function parseFrontmatter(data: Record<string, unknown>): PostFrontmatter {
  const frontmatter = data as unknown as PostFrontmatter;
  for (const key of REQUIRED_FRONTMATTER_KEYS) {
    if (frontmatter[key] === undefined || frontmatter[key] === null) {
      throw new Error(`Blog post missing required frontmatter: ${key}`);
    }
  }
  if (!Array.isArray(frontmatter.tags)) {
    throw new Error("Blog post frontmatter 'tags' must be an array");
  }
  if (frontmatter.description.length > 155) {
    throw new Error(
      `Blog post "${frontmatter.title}" description exceeds 155 chars (SEO)`
    );
  }
  return frontmatter;
}

function getReadingTimeMinutes(content: string): number {
  const stats = readingTime(content, { wordsPerMinute: WPM });
  return Math.max(1, Math.round(stats.minutes));
}

/**
 * Returns all blog posts sorted by publishDate desc, then slug.
 * Deterministic for static builds.
 */
export function getAllPosts(): PostSummary[] {
  const dir = getContentDir();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const posts: PostSummary[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = parseFrontmatter(data);
    const readingTimeMinutes = getReadingTimeMinutes(content);
    posts.push({
      frontmatter,
      slug: frontmatter.slug,
      readingTimeMinutes,
    });
  }

  posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.publishDate).getTime();
    const dateB = new Date(b.frontmatter.publishDate).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return a.slug.localeCompare(b.slug);
  });

  return posts;
}

/**
 * Returns one post by slug, or null if not found.
 * content is the markdown/MDX body only (frontmatter stripped).
 */
export function getPostBySlug(slug: string): Post | null {
  const dir = getContentDir();
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = parseFrontmatter(data);
    if (frontmatter.slug !== slug) continue;

    const readingTimeMinutes = getReadingTimeMinutes(content);
    return {
      frontmatter,
      content,
      readingTimeMinutes,
    };
  }
  return null;
}

/** All unique categories from posts */
export function getAllCategories(posts: PostSummary[]): string[] {
  const set = new Set(posts.map((p) => p.frontmatter.category));
  return Array.from(set).sort();
}
