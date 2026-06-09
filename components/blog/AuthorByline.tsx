import Link from "next/link";
import { defaultBlogAuthor } from "@/lib/blog/authors";

export function AuthorByline() {
  return (
    <div className="mt-6 rounded-lg border border-fc-border bg-fc-surface-muted/50 p-4">
      <p className="text-sm text-fc-muted">
        By{" "}
        <Link href={defaultBlogAuthor.url} className="font-semibold text-fc-brand hover:text-fc-accent">
          {defaultBlogAuthor.name}
        </Link>
        <span className="text-fc-muted"> · {defaultBlogAuthor.role}</span>
      </p>
      <p className="mt-2 text-sm text-fc-muted">{defaultBlogAuthor.bio}</p>
    </div>
  );
}
