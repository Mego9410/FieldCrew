import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ReadingTime } from "./ReadingTime";
import { Button } from "@/components/ui/Button";
import { BlogCardImage } from "./BlogCardImage";
import type { PostSummary } from "@/lib/blog/types";

interface FeaturedBlogCardProps {
  post: PostSummary;
}

export function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  const { frontmatter, slug, readingTimeMinutes } = post;
  return (
    <article className="border border-fc-border bg-fc-surface overflow-hidden rounded-lg shadow-fc-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <BlogCardImage
          src={frontmatter.heroImage}
          alt=""
          category={frontmatter.category}
          variant="featured"
          className="h-48 lg:h-64 min-h-0"
        />
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <Badge variant="info" className="w-fit text-xs mb-2">
            {frontmatter.category}
          </Badge>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-fc-brand mb-2">
            <Link
              href={`/blog/${slug}`}
              className="hover:text-fc-accent transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded"
            >
              {frontmatter.title}
            </Link>
          </h2>
          <p className="text-fc-muted mb-4 line-clamp-3">{frontmatter.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-fc-muted mb-6">
            <time dateTime={frontmatter.publishDate}>
              {new Date(frontmatter.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <ReadingTime minutes={readingTimeMinutes} />
          </div>
          <Link href={`/blog/${slug}`}>
            <Button variant="primary">Read article</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
