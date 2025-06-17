import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { i18n, Locale } from "@/lib/i18n-config";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700", "800"] });

export const metadata: Metadata = {
  title: "A question for you",
  description: "Will you be my valentine?",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
