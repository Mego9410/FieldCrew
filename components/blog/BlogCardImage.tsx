import Image from "next/image";
import {
  FileText,
  DollarSign,
  Clock,
  Calculator,
  ClipboardList,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Payroll: DollarSign,
  Overtime: Clock,
  "Job Costing": Calculator,
  "Time Tracking": Clock,
  Estimating: ClipboardList,
};

const defaultIcon = FileText;

interface BlogCardImageProps {
  /** Optional path e.g. /blog/hero.jpg */
  src?: string | null;
  alt: string;
  category: string;
  /** Size variant for aspect ratio and layout */
  variant: "featured" | "card";
  /** When true, no aspect ratio/minHeight; use to fill a parent (e.g. post hero) */
  fill?: boolean;
  className?: string;
}

export function BlogCardImage({
  src,
  alt,
  category,
  variant,
  fill = false,
  className = "",
}: BlogCardImageProps) {
  const Icon = CATEGORY_ICONS[category] ?? defaultIcon;
  const isFeatured = variant === "featured";
  const sizeStyle = fill
    ? undefined
    : {
        aspectRatio: isFeatured ? "16/10" : "16/9" as const,
        minHeight: isFeatured ? 192 : 140,
      };

  if (src && src.startsWith("/")) {
    return (
      <div
        className={`relative overflow-hidden bg-fc-surface-muted ${fill ? "absolute inset-0" : ""} ${className}`}
        style={sizeStyle}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={isFeatured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-fc-brand/90 to-fc-muted-strong/80 ${fill ? "absolute inset-0" : ""} ${className}`}
      style={sizeStyle}
      aria-hidden
    >
      <Icon className="h-12 w-12 text-white/50 sm:h-14 sm:w-14" />
    </div>
  );
}
