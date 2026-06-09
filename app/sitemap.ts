import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/loaders";
import { getSiteUrl } from "@/lib/site";
import { STATIC_SITEMAP_ROUTES } from "@/lib/seo/sitemap-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const posts = getAllPosts();
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = STATIC_SITEMAP_ROUTES.map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  const blogUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(
        p.frontmatter.updatedDate ?? p.frontmatter.publishDate,
      ),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticUrls, ...blogUrls];
}
