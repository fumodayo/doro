import { Locale } from "@/lib/i18n-config";
import ClientPage from "./ClientPage";

export default function Page({ params }: { params: { lang: Locale } }) {
  const { lang } = params;

  return <ClientPage lang={lang} />;
}
