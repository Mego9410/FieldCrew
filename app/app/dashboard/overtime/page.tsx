import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function OvertimePage() {
  return (
    <div className="px-6 py-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Overtime Analysis</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Track overtime costs, trends, and identify opportunities to reduce premium labour costs.
      </p>
      <div className="mt-6 rounded-lg border border-fc-border bg-white p-8 text-center">
        <p className="text-fc-muted">Detailed overtime analysis coming soon...</p>
        <p className="mt-2 text-sm text-fc-muted">
          TODO: Wire to API endpoint for overtime analytics
        </p>
      </div>
    </div>
  );
}
