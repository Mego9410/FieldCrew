import Link from "next/link";
import { cn } from "@/lib/utils";

export type DocsNavGroup = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

interface DocsSidebarProps {
  groups: DocsNavGroup[];
  currentPath?: string;
}

export function DocsSidebar({ groups, currentPath }: DocsSidebarProps) {
  return (
    <nav aria-label="Documentation navigation" className="space-y-6">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fc-muted">{group.title}</h2>
          <ul className="mt-3 space-y-1.5">
            {group.links.map((link) => {
              const active = currentPath === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-fc-accent/10 font-semibold text-fc-brand"
                        : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
