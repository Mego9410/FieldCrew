import Link from "next/link";
import { FAQ } from "@/components/blog/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CTAButtons,
  FeatureGrid,
  PublicPageHero,
  PublicPageShell,
  PublicSection,
} from "@/components/landing/PublicPagePrimitives";
import { buildMoneyPageBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { buildFaqPageSchema, buildSoftwareApplicationSchema } from "@/lib/seo/schema";
import type { MoneyPageConfig } from "@/lib/marketing/money-pages";
import { routes } from "@/lib/routes";

type MoneyPageProps = {
  config: MoneyPageConfig;
};

export function MoneyPage({ config }: MoneyPageProps) {
  const breadcrumbSchema = buildMoneyPageBreadcrumbs(config.path, config.title);
  const softwareSchema = buildSoftwareApplicationSchema({
    name: `FieldCrew — ${config.title}`,
    description: config.softwareDescription,
    path: config.path,
  });
  const faqSchema = buildFaqPageSchema(config.faq);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...softwareSchema,
        }}
      />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <PublicPageShell>
        <PublicPageHero
          eyebrow={config.eyebrow}
          title={config.h1}
          description={config.description}
        />

        <section className="border-b border-fc-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-fc-border bg-fc-surface-muted/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fc-accent">
                Short answer
              </p>
              <p className="mt-3 text-lg leading-relaxed text-fc-brand">{config.directAnswer}</p>
            </div>
            <div className="mt-8">
              <CTAButtons
                primary={{ label: "Start for $9", href: routes.owner.subscribe }}
                secondary={{ label: "See a sample report", href: routes.public.sampleReport }}
              />
            </div>
          </div>
        </section>

        <PublicSection title={config.howItWorksTitle}>
          <ol className="grid gap-6 md:grid-cols-3">
            {config.howItWorksSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-fc-border bg-white p-6 shadow-fc-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-fc-orange-500">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold text-fc-brand">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fc-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </PublicSection>

        <PublicSection title={config.benefitsTitle}>
          <FeatureGrid items={config.benefits} />
        </PublicSection>

        <PublicSection title={config.costTitle} description={config.costBody}>
          <CTAButtons
            primary={{ label: "Start for $9", href: routes.owner.subscribe }}
            secondary={{ label: "Try the profit leak calculator", href: routes.public.profitLeak }}
          />
        </PublicSection>

        <section className="border-b border-fc-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <FAQ items={config.faq} className="mt-0 border-t-0 pt-0" />
            {config.relatedBlogSlugs && config.relatedBlogSlugs.length > 0 ? (
              <div className="mt-10 border-t border-fc-border pt-8">
                <h2 className="font-display text-xl font-bold text-fc-brand">Related guides</h2>
                <ul className="mt-4 space-y-2">
                  {config.relatedBlogSlugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/blog/${slug}`}
                        className="text-sm font-medium text-fc-accent hover:underline"
                      >
                        Read: {slug.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      </PublicPageShell>
    </>
  );
}
