import { getAllPosts } from "@/lib/blog/loaders";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";
const baseUrl = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export async function GET() {
  const posts = getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FieldCrew Field Notes</title>
    <link>${baseUrl}/blog</link>
    <description>HVAC field notes on profit recovery, job costing, time tracking, and operational control.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (p) => `
    <item>
      <title>${escapeXml(p.frontmatter.title)}</title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description>${escapeXml(p.frontmatter.description)}</description>
      <pubDate>${new Date(p.frontmatter.publishDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
