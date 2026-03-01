"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/lib/blog/types";
import { FeaturedBlogCard } from "./FeaturedBlogCard";
import { BlogCard } from "./BlogCard";
import { CategoryPills } from "./CategoryPills";
import { BlogSearch } from "./BlogSearch";
import { HiddenProfitCta } from "@/components/HiddenProfitCta";

interface BlogIndexClientProps {
  posts: PostSummary[];
}

export function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.frontmatter.category));
    return Array.from(set).sort();
  }, [posts]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let list = posts;
    if (selectedCategory) {
      list = list.filter((p) => p.frontmatter.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.frontmatter.title.toLowerCase().includes(q) ||
          p.frontmatter.excerpt.toLowerCase().includes(q) ||
          p.frontmatter.category.toLowerCase().includes(q) ||
          p.frontmatter.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, selectedCategory, searchQuery]);

  const featured = filtered.find((p) => p.frontmatter.featured) ?? filtered[0];
  const latest = filtered.filter((p) => p.slug !== featured?.slug).slice(0, 11);
  const mostRead = posts.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryPills
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="w-full sm:w-64">
          <BlogSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
          {featured && <FeaturedBlogCard post={featured} />}

          <section aria-labelledby="latest-heading">
            <h2
              id="latest-heading"
              className="font-display text-xl font-bold text-fc-brand mb-6"
            >
              Latest posts
            </h2>
            {latest.length === 0 ? (
              <p className="text-fc-muted">No posts match your filters.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {latest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="most-read-heading">
            <h2
              id="most-read-heading"
              className="font-display text-lg font-bold text-fc-brand mb-4"
            >
              Most read
            </h2>
            <ul className="space-y-3">
              {mostRead.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-fc-brand hover:text-fc-accent transition-colors focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 rounded line-clamp-2"
                  >
                    {post.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="border border-fc-border bg-fc-brand p-6 rounded-lg"
            aria-labelledby="blog-cta-heading"
          >
            <h2
              id="blog-cta-heading"
              className="font-display text-lg font-bold text-white"
            >
              Recover 8–15% hidden labour profit
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              See where every hour goes. Get a sample report.
            </p>
            <div className="mt-4" data-cta="blog-sidebar">
              <HiddenProfitCta
                label="Show Me The Hidden Profit"
                auditUrl="/book"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-fc-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
