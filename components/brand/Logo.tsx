import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import fieldcrewLogo from "@/Assets/Gemini_Generated_Image_f32b2gf32b2gf32b-Firefly-Upscaler-2x-scale.png";

type LogoProps = {
  /**
   * Visual size is controlled via height; width auto-scales.
   * Defaults to a compact header size.
   */
  size?: "sm" | "md" | "lg";
  /**
   * When placed on dark surfaces, we add a subtle light backing so the navy
   * lettering remains legible.
   */
  onDark?: boolean;
  /**
   * Provide a custom label for screen readers (defaults to "FieldCrew").
   */
  label?: string;
  /**
   * If true, wraps the mark in a home link.
   */
  href?: string;
  className?: string;
  priority?: boolean;
};

export function Logo({
  size = "md",
  onDark = false,
  label = "FieldCrew",
  href,
  className,
  priority,
}: LogoProps) {
  const heightClass =
    size === "sm" ? "h-6" : size === "lg" ? "h-10" : "h-8";

  const img = (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        onDark && "drop-shadow-[0_12px_26px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <Image
        src={fieldcrewLogo}
        alt={label}
        className={cn(heightClass, "w-auto select-none")}
        priority={priority}
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
      >
        {img}
      </Link>
    );
  }

  return img;
}

