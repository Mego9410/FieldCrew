import Link from "next/link";
import { footerLinkGroups, socialLinks } from "@/lib/site-links";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="bg-fc-brand text-slate-400" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Logo href="/" size="lg" onDark priority />
            <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-400/95">
              Job-based payroll intelligence for HVAC crews.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5 lg:gap-x-6">
            {Object.entries(footerLinkGroups).map(([category, links]) => (
              <nav key={category} aria-label={category}>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white">
                  {category}
                </h3>
                <ul className="mt-3 space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center rounded-sm text-sm leading-6 text-slate-400 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-800/80 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FieldCrew. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.external ? "_blank" : undefined}
                rel={social.external ? "noreferrer noopener" : undefined}
                className="inline-flex items-center justify-center rounded-sm text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand"
                aria-label={social.label}
              >
                <span className="text-sm">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
