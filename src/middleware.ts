import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./lib/i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bỏ qua các đường dẫn không cần dịch
  if (["/images", "/audio"].some((path) => pathname.startsWith(path))) {
    return;
  }

  // Kiểm tra xem đường dẫn đã có tiền tố ngôn ngữ chưa
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Nếu thiếu, chuyển hướng đến đường dẫn có ngôn ngữ
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    // Bỏ qua các đường dẫn API, _next/static, _next/image, và các file trong public
    "/((?!api|_next/static|_next/image|favicon.ico|images|audio).*)",
  ],
};
