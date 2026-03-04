import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, Oswald, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
  title: "FieldCrew — Recover Hidden Labour Profit | HVAC Payroll & Margin",
  description:
    "Most 10-tech HVAC companies lose $5,000–$15,000/month in hidden labour inefficiency. FieldCrew shows you exactly where. Built for 5–20 tech owners in Texas, Florida & Arizona.",
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
      className={`${bricolage.variable} ${ibmPlexSans.variable} ${oswald.variable} ${shareTechMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-fc-page font-body text-fc-brand">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
