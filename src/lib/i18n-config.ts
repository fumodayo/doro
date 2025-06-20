export const i18n = {
  defaultLocale: "zh",
  locales: ["en", "vi", "zh"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
