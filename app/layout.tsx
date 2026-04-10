import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, IBM_Plex_Sans, Oswald, Share_Tech_Mono, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  metadataBase: new URL("https://fieldcrew.com"),
  title: {
    default: "FieldCrew — Recover hidden labor profit",
    template: "%s — FieldCrew",
  },
  description:
    "Most 10-tech HVAC companies lose $5,000–$15,000/month in hidden labor inefficiency. FieldCrew shows you where and how to recover it.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "FieldCrew",
    title: "FieldCrew — Recover hidden labor profit",
    description:
      "Most 10-tech HVAC companies lose $5,000–$15,000/month in hidden labor inefficiency. FieldCrew shows you where and how to recover it.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FieldCrew — Recover hidden labor profit",
    description:
      "Most 10-tech HVAC companies lose $5,000–$15,000/month in hidden labor inefficiency. FieldCrew shows you where and how to recover it.",
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
