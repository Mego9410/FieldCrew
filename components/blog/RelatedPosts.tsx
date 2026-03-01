import Link from "next/link";
import type { PostSummary } from "@/lib/blog/types";

interface RelatedPostsProps {
  posts: PostSummary[];
  className?: string;
}

export function RelatedPosts({ posts, className = "" }: RelatedPostsProps) {
  if (posts.length === 0) return null;
  return (
    <section
      className={`border-t border-fc-border pt-10 mt-12 ${className}`}
      aria-labelledby="related-posts-heading"
    >
      <h2
        id="related-posts-heading"
        className="font-display text-xl font-bold text-fc-brand mb-6"
      >
        Related posts
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="block p-4 border border-fc-border rounded-md hover:border-fc-accent hover:shadow-fc-sm transition-all focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
            >
              <span className="font-medium text-fc-brand line-clamp-2">
                {p.frontmatter.title}
              </span>
              <time
                dateTime={p.frontmatter.publishDate}
                className="text-xs text-fc-muted mt-1 block"
              >
                {new Date(p.frontmatter.publishDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
