import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

export default function RevenuePerLabourHourPage() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Link
        href={routes.owner.home}
        className="mb-4 inline-flex items-center gap-2 text-sm text-fc-muted hover:text-fc-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <h1 className="font-display text-xl font-bold text-fc-brand">Revenue per Labour Hour</h1>
      <p className="mt-1 text-sm text-fc-muted">
        Track revenue productivity per hour worked to identify if crews are productive or just busy.
      </p>
      <div className="mt-6 rounded-lg border border-fc-border bg-white p-8 text-center">
        <p className="text-fc-muted">Detailed RPLH analysis coming soon...</p>
        <p className="mt-2 text-sm text-fc-muted">
          TODO: Wire to API endpoint for revenue per labour hour analytics
        </p>
      </div>
    </div>
  );
}
