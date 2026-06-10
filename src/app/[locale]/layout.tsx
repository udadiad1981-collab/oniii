import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: "oniii - Quality Products from China | Worldwide Shipping",
  description:
    "Discover premium Chinese products at oniii. Electronics, clothing, home goods, handicrafts and more. Free worldwide shipping on orders over $99.",
  keywords: ["Chinese products", "online store", "worldwide shipping", "electronics", "clothing", "home goods", "handicrafts"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "oniii",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "oniii - Quality Products from China",
    description: "Premium Chinese products delivered worldwide",
    type: "website",
    siteName: "oniii",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#1a1a2e",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "oniii",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="oniii" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
