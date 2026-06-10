import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "zh", "es", "fr", "de", "ja", "ko"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
