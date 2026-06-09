import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, IBM_Plex_Sans, Oswald, Share_Tech_Mono, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SupabaseConfigProvider } from "@/components/supabase/SupabaseConfigProvider";
import { getServerSupabasePublicConfig } from "@/lib/supabase/server-public-config";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-console-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-console-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getfieldcrew.com"),
  title: {
    default: "HVAC Field Service Software for Crews & Payroll",
    template: "%s — FieldCrew",
  },
  description:
    "Schedule crews, track tech hours by job, and run accurate payroll — and see exactly where labor profit leaks. Built for small US HVAC contractors. Start for $9.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "FieldCrew",
    title: "HVAC Field Service Software for Crews & Payroll | FieldCrew",
    description:
      "Schedule crews, track tech hours by job, and run accurate payroll — and see exactly where labor profit leaks. Built for small US HVAC contractors. Start for $9.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HVAC Field Service Software for Crews & Payroll | FieldCrew",
    description:
      "Schedule crews, track tech hours by job, and run accurate payroll — and see exactly where labor profit leaks. Built for small US HVAC contractors. Start for $9.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseConfig = getServerSupabasePublicConfig();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", bricolage.variable, ibmPlexSans.variable, oswald.variable, shareTechMono.variable, "font-sans", geist.variable)}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C1W6ME1LTW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-C1W6ME1LTW');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-fc-page font-body text-fc-brand">
        <SupabaseConfigProvider config={supabaseConfig}>
          {children}
        </SupabaseConfigProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
