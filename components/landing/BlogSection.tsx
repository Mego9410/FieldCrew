import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import type { PostSummary } from "@/lib/blog/types";

interface BlogSectionProps {
  posts: PostSummary[];
}

const BLOG_LIMIT = 3;

export function BlogSection({ posts }: BlogSectionProps) {
  const latest = posts.slice(0, BLOG_LIMIT);
  if (latest.length === 0) return null;

  return (
    <section
      id="blog"
      className="border-b border-fc-border bg-fc-surface-muted/50 py-12 sm:py-24 lg:py-32"
      aria-labelledby="blog-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="fc-accent-stripe block mb-3 w-12" aria-hidden />
            <h2
              id="blog-heading"
              className="font-display text-2xl font-bold text-fc-brand sm:text-3xl lg:text-4xl"
            >
              From the blog
            </h2>
            <p className="mt-2 text-fc-muted max-w-xl">
              Labour cost, job costing, and payroll tips for HVAC owners.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-semibold text-fc-accent hover:text-fc-accent-dark transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded px-3 py-2"
          >
            View all posts →
          </Link>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {latest.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
