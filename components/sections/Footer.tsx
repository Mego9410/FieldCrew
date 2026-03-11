"use client";

import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "How it works", href: "#how-it-works" },
  ],
  Solutions: [
    { label: "For HVAC", href: "#" },
    { label: "For Contractors", href: "#" },
    { label: "For Small Teams", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Support", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t border-[rgba(255,255,255,0.06)] bg-[#111111] py-14 text-[#a1a1aa] sm:py-16"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-legend-display text-lg font-semibold text-white">
              FieldCrew
            </p>
            <p className="mt-3 font-legend-body text-sm leading-relaxed">
              Job-based payroll intelligence for HVAC crews.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-legend-display text-sm font-semibold uppercase tracking-wider text-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center font-legend-body text-sm text-[#a1a1aa] transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#5b7cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded -m-2 p-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.08)] pt-8 sm:flex-row">
          <p className="font-legend-body text-sm text-[#71717a]">
            © {new Date().getFullYear()} FieldCrew. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Facebook", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center font-legend-body text-sm text-[#a1a1aa] transition-colors hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#5b7cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded"
                aria-label={social}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
