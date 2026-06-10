"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

const languageLabels: Record<string, string> = {
  en: "EN", zh: "中文", es: "ES", fr: "FR", de: "DE", ja: "日本語", ko: "한국어",
};

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/zh") ? "zh"
    : pathname.startsWith("/es") ? "es"
    : pathname.startsWith("/fr") ? "fr"
    : pathname.startsWith("/de") ? "de"
    : pathname.startsWith("/ja") ? "ja"
    : pathname.startsWith("/ko") ? "ko"
    : "en";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${currentLocale}/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const langUrl = (code: string) => {
    if (code === "en") {
      return pathname.replace(/^\/(zh|es|fr|de|ja|ko)/, "") || "/";
    }
    return `/${code}${pathname.replace(/^\/(en|zh|es|fr|de|ja|ko)/, "")}`;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-white/95"
      }`}
    >
      <div className="bg-[var(--primary)] text-white text-xs py-1.5 px-4 text-center">
        <span>🚀 {currentLocale === "zh" ? "满$99全球包邮 | 新用户享10%折扣" : "Free shipping over $99 | 10% off for new customers"}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${currentLocale}`} className="flex-shrink-0">
            <span className="text-2xl font-bold tracking-wider text-[var(--primary)]">
              on<span className="text-[var(--accent)]">iii</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href={`/${currentLocale}`} className="text-sm font-medium hover:text-[var(--accent)] transition-colors">{t("common.home")}</Link>
            <Link href={`/${currentLocale}/search`} className="text-sm font-medium hover:text-[var(--accent)] transition-colors">{t("common.shop")}</Link>
            <Link href={`/${currentLocale}/cart`} className="text-sm font-medium hover:text-[var(--accent)] transition-colors">{t("common.cart")}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language dropdown */}
            <div className="relative group">
              <button className="text-xs font-medium px-2 py-1 border rounded hover:bg-gray-50 transition-colors flex items-center gap-1 whitespace-nowrap">
                {languageLabels[currentLocale] || "EN"}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[130px]">
                {languages.map(({ code, label }) => (
                  <Link
                    key={code}
                    href={langUrl(code)}
                    className={`block px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${currentLocale === code ? "font-bold text-[var(--accent)] bg-gray-50" : "text-gray-700"}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href={`/${currentLocale}/cart`} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLocale === "zh" ? "搜索商品..." : "Search products..."}
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t animate-fade-in">
            <div className="flex flex-col gap-2 pt-3">
              <Link href={`/${currentLocale}`} className="px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium">{t("common.home")}</Link>
              <Link href={`/${currentLocale}/search`} className="px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium">{t("common.shop")}</Link>
              <Link href={`/${currentLocale}/cart`} className="px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium">{t("common.cart")}</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
