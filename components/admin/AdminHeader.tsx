"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setOpen(false);
      router.push(routes.public.login);
      router.refresh();
    }
  }

  return (
    <header className="relative z-40 w-full shrink-0 border-b border-fc-border bg-fc-surface">
      <div className="relative mx-auto flex min-h-20 w-full max-w-[1400px] items-center justify-between gap-3 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Link
            href={routes.owner.home}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
        </div>

        <div className="flex items-center gap-2" ref={ref}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen((o) => !o)}
            className="h-9 gap-1.5 border-fc-border text-fc-brand"
            aria-expanded={open}
            aria-haspopup="true"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fc-accent/15 text-xs font-semibold text-fc-accent">
              FC
            </span>
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown
              className={`h-4 w-4 text-fc-muted transition-transform ${open ? "rotate-180" : ""}`}
            />
          </Button>

          {open && (
            <div
              className="absolute right-3 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-fc-border bg-fc-surface py-1 shadow-fc-md"
              role="menu"
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                role="menuitem"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

