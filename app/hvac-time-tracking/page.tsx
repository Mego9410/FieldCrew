import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { MoneyPage } from "@/components/marketing/MoneyPage";
import { moneyPages } from "@/lib/marketing/money-pages";

const config = moneyPages.timeTracking;

export const metadata: Metadata = {
  title: config.metaTitle.replace(" | FieldCrew", ""),
  description: config.metaDescription,
  alternates: { canonical: config.path },
};

export default function HvacTimeTrackingPage() {
  return (
    <>
      <Nav />
      <MoneyPage config={config} />
      <Footer />
    </>
  );
}
