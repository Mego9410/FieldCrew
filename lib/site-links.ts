import { routes } from "@/lib/routes";

export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const footerLinkGroups: Record<string, SiteLink[]> = {
  Product: [
    { label: "Calculator", href: "/#calculator" },
    { label: "How it works", href: "/#how-it-works" },
  ],
  Solutions: [
    { label: "For HVAC", href: routes.public.solutionsHvac },
    { label: "For Contractors", href: routes.public.solutionsContractors },
    { label: "For Small Teams", href: routes.public.solutionsSmallTeams },
  ],
  Company: [
    { label: "About", href: routes.public.about },
    { label: "Blog", href: routes.public.blog },
    { label: "Careers", href: routes.public.careers },
  ],
  Resources: [
    { label: "Documentation", href: routes.public.docs },
    { label: "Support", href: routes.public.support },
    { label: "Contact", href: routes.public.contact },
  ],
  Legal: [
    { label: "Privacy", href: routes.public.privacy },
    { label: "Terms", href: routes.public.terms },
    { label: "Security", href: routes.public.security },
  ],
};

export const socialLinks: SiteLink[] = [
  { label: "Twitter", href: "https://twitter.com", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com", external: true },
  { label: "Facebook", href: "https://www.facebook.com", external: true },
  { label: "YouTube", href: "https://www.youtube.com", external: true },
];
