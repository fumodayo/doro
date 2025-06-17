import { Nunito } from "next/font/google";
import "./globals.css";
import { i18n, Locale } from "@/lib/i18n-config";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700", "800"] });

export const metadata = {
  title: "A Question for You",
  description: "Made with love.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await paramsPromise;

  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
