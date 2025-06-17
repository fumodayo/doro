import type { Metadata } from "next";
import { Locale, i18n } from "@/lib/i18n-config";
import { translations } from "@/lib/translations";
import ClientPage from "./ClientPage";

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang || i18n.defaultLocale;
  const t = translations[lang];

  return {
    title: t.metadata.title,
    description: t.metadata.description,
  };
}

export default function Page({ params }: Props) {
  const { lang } = params;

  return <ClientPage lang={lang} />;
}
