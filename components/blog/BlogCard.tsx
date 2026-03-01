import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReadingTime } from "./ReadingTime";
import { BlogCardImage } from "./BlogCardImage";
import type { PostSummary } from "@/lib/blog/types";

interface BlogCardProps {
  post: PostSummary;
}

export function BlogCard({ post }: BlogCardProps) {
  const { frontmatter, slug, readingTimeMinutes } = post;
  return (
    <Link href={`/blog/${slug}`} className="block group">
      <Card
        as="article"
        className="h-full overflow-hidden p-0 transition-shadow duration-fc group-hover:shadow-fc-md flex flex-col"
      >
        <BlogCardImage
          src={frontmatter.heroImage}
          alt=""
          category={frontmatter.category}
          variant="card"
          className="w-full shrink-0"
        />
        <div className="flex flex-col gap-3 p-4">
          <Badge variant="neutral" className="w-fit text-xs">
            {frontmatter.category}
          </Badge>
          <h2 className="font-display text-lg font-bold text-fc-brand group-hover:text-fc-accent transition-colors line-clamp-2">
            {frontmatter.title}
          </h2>
          <p className="text-sm text-fc-muted line-clamp-2 flex-1">
            {frontmatter.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-fc-muted mt-auto">
            <time dateTime={frontmatter.publishDate}>
              {new Date(frontmatter.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <ReadingTime minutes={readingTimeMinutes} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
