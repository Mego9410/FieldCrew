import { ReactNode } from "react";
import { DocsSidebar, type DocsNavGroup } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";

interface DocsLayoutProps {
  title: string;
  description: string;
  navGroups: DocsNavGroup[];
  currentPath: string;
  toc?: Array<{ id: string; label: string }>;
  children: ReactNode;
}

export function DocsLayout({
  title,
  description,
  navGroups,
  currentPath,
  toc = [],
  children,
}: DocsLayoutProps) {
  return (
    <main id="main" className="min-h-screen border-b border-fc-border bg-white">
      <section className="border-b border-fc-border bg-fc-surface-muted/50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-fc-brand sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-fc-muted">{description}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_220px] lg:gap-12 lg:px-8">
        <div>
          <DocsSidebar groups={navGroups} currentPath={currentPath} />
        </div>
        <article className="min-w-0">{children}</article>
        <div className="hidden lg:block">
          <DocsToc items={toc} />
        </div>
      </div>
    </main>
  );
}
