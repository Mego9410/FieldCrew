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
      { label: "Blog", href: "#" },
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
    <footer className="bg-fc-brand py-16 text-slate-400" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-lg font-bold text-white">
              FieldCrew
            </p>
            <p className="mt-4 text-sm text-slate-400">
              Job-based payroll intelligence for HVAC crews.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-sm font-semibold text-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-brand rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FieldCrew. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Facebook", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-slate-400 transition-colors hover:text-white"
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
