import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPosts } from "@/lib/blog/loaders";
import { Badge } from "@/components/ui/Badge";
import { ReadingTime } from "@/components/blog/ReadingTime";
import { ShareRow } from "@/components/blog/ShareRow";
import { HiddenProfitCta } from "@/components/HiddenProfitCta";
import { StickyCTA } from "@/components/blog/StickyCTA";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { FAQ } from "@/components/blog/FAQ";
import { BlogCardImage } from "@/components/blog/BlogCardImage";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";
const baseUrl = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const { frontmatter } = post;
  const url = `${baseUrl}/blog/${slug}`;

  return {
    title: `${frontmatter.title} — FieldCrew`,
    description: frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      type: "article",
      publishedTime: frontmatter.publishDate,
      images: frontmatter.heroImage
        ? [{ url: `${baseUrl}${frontmatter.heroImage}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter } = post;
  const posts = getAllPosts();
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const related = posts
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.frontmatter.category === frontmatter.category ||
          p.frontmatter.tags.some((t) => tags.includes(t)))
    )
    .slice(0, 3);
  const relatedFallback = posts.filter((p) => p.slug !== slug).slice(0, 3);
  const relatedPosts = related.length >= 3 ? related : relatedFallback.slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishDate,
    author: { "@type": "Organization", name: "FieldCrew" },
    publisher: { "@type": "Organization", name: "FieldCrew" },
    url: `${baseUrl}/blog/${slug}`,
  };

  const faqItems = Array.isArray(frontmatter.faq) ? frontmatter.faq : [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  const postUrl = `${baseUrl}/blog/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <StickyCTA />
      <article className="border-b border-fc-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <header className="mb-10">
            <div className="relative z-10 -mt-2 mb-8 w-full">
              <div className="relative w-full min-h-[200px] aspect-[21/9] rounded-xl overflow-hidden border border-fc-border bg-fc-surface shadow-fc-lg">
                {frontmatter.heroImage && frontmatter.heroImage.startsWith("/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={frontmatter.heroImage}
                    alt={frontmatter.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    sizes="(min-width: 1024px) 896px, 100vw"
                  />
                ) : (
                  <BlogCardImage
                    src={frontmatter.heroImage}
                    alt={frontmatter.title}
                    category={frontmatter.category}
                    variant="card"
                    fill
                  />
                )}
              </div>
            </div>
            <Badge variant="neutral" className="mb-3">
              {frontmatter.category}
            </Badge>
            <h1 className="font-display text-3xl font-bold text-fc-brand sm:text-4xl lg:text-5xl">
              {frontmatter.title}
            </h1>
            <p className="mt-4 text-lg text-fc-muted">{frontmatter.excerpt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-fc-muted">
              <time dateTime={frontmatter.publishDate}>
                {new Date(frontmatter.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <ReadingTime minutes={post.readingTimeMinutes} />
              {Array.isArray(frontmatter.tags) &&
                frontmatter.tags.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="info" className="text-xs">
                    {tag}
                  </Badge>
                ))}
            </div>
            <ShareRow url={postUrl} title={frontmatter.title} />
          </header>

          <div className="blog-prose prose prose-slate max-w-none prose-headings:font-display prose-headings:text-fc-brand prose-a:text-fc-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-fc-brand">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => {
                  if (href?.startsWith("/")) {
                    return (
                      <Link href={href} className="text-fc-accent hover:underline">
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fc-accent hover:underline"
                    >
                      {children}
                    </a>
                  );
                },
                blockquote: ({ children }) => (
                  <aside className="my-6 border-l-4 border-fc-accent bg-fc-surface-muted/80 p-4 rounded-r-md">
                    {children}
                  </aside>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <section className="mt-12 pt-10 border-t border-fc-border">
            <h2 className="font-display text-xl font-bold text-fc-brand mb-4">
              What to do next
            </h2>
            <ul className="list-disc list-inside space-y-2 text-fc-muted">
              <li>Review labour cost per job in your last month</li>
              <li>Identify jobs that ran over estimate</li>
              <li>
                Try job-coded time tracking —{" "}
                <Link
                  href="/#pricing"
                  className="text-fc-accent font-medium hover:underline"
                >
                  get started with FieldCrew
                </Link>
              </li>
            </ul>
          </section>

          {faqItems.length > 0 && <FAQ items={faqItems} />}

          <RelatedPosts posts={relatedPosts} />

          <section
            className="mt-12 p-6 border border-fc-border bg-fc-brand rounded-lg text-center"
            aria-labelledby="post-cta-heading"
          >
            <h2
              id="post-cta-heading"
              className="font-display text-lg font-bold text-white"
            >
              Recover 8–15% hidden labour profit
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              See where every hour goes. Get a sample report.
            </p>
            <div className="mt-4" data-cta="blog-inline">
              <HiddenProfitCta
                label="Show Me The Hidden Profit"
                auditUrl="/book"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 text-sm font-semibold text-white hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
              />
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
