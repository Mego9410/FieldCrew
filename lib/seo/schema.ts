import type { FAQItem } from "@/components/blog/FAQ";
import { getSiteUrl } from "@/lib/site";

export function buildOrganizationRef() {
  return { "@id": `${getSiteUrl()}/#organization` };
}

export function buildSoftwareApplicationSchema(options: {
  name: string;
  description: string;
  path: string;
  price?: string;
}) {
  const baseUrl = getSiteUrl();

  return {
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}${options.path}#software`,
    name: options.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: options.description,
    url: `${baseUrl}${options.path}`,
    offers: {
      "@type": "Offer",
      price: options.price ?? "9.00",
      priceCurrency: "USD",
    },
    publisher: buildOrganizationRef(),
  };
}

export function buildFaqPageSchema(items: FAQItem[]) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export const homepageFaq: FAQItem[] = [
  {
    q: "What is FieldCrew?",
    a: "FieldCrew is workforce management and payroll software for US HVAC contractors. It ties technician hours to specific jobs, shows labor cost per job in real time, and exports QuickBooks-ready payroll.",
  },
  {
    q: "How much does FieldCrew cost?",
    a: "Plans start at $9/month. You can set up your crew and start tracking job-coded time without a long sales process.",
  },
  {
    q: "Do HVAC technicians need to install an app?",
    a: "No. FieldCrew is built for busy crews — techs clock in from a simple link without installing an app or remembering passwords.",
  },
  {
    q: "Does FieldCrew work with QuickBooks?",
    a: "Yes. FieldCrew exports payroll data that is ready for QuickBooks, so your books match what happened in the field.",
  },
];
