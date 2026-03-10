import Link from "next/link";

export function Footer() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
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

  return (
    <footer
      className="border-t border-zinc-800 bg-landing-surface py-14 sm:py-16 text-landing-muted"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-lg font-semibold text-landing-white">
              FieldCrew
            </p>
            <p className="mt-3 text-sm text-landing-muted leading-relaxed">
              Job-based payroll intelligence for HVAC crews.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-landing-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center text-sm transition-colors duration-200 hover:text-landing-white focus:outline-none focus:ring-2 focus:ring-landing-accent focus:ring-offset-2 focus:ring-offset-landing-surface rounded -m-2 p-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} FieldCrew. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Facebook", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-landing-muted transition-colors hover:text-landing-white focus:outline-none focus:ring-2 focus:ring-landing-accent focus:ring-offset-2 focus:ring-offset-landing-surface rounded"
                aria-label={social}
              >
                <span className="text-sm">{social}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
