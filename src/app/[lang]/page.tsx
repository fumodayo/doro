import { Locale } from "@/lib/i18n-config";
import ClientPage from "./ClientPage";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return <ClientPage lang={lang} />;
}
