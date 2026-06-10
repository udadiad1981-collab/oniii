"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";

  return (
    <footer className="bg-[var(--primary)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 tracking-wider">
              on<span className="text-[var(--accent)]">iii</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("footer.aboutDesc")}
            </p>
            <div className="flex gap-3 mt-4">
              {/* Social icons */}
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44.09c1.44.1 2.83.35 3.97 1.08 1.36.88 2.23 2.16 2.62 3.76.26 1.05.29 2.13.29 3.21v7.72c0 1.08-.03 2.16-.29 3.21-.39 1.6-1.26 2.88-2.62 3.76-1.14.73-2.53.98-3.97 1.08-1.3.08-2.6.09-3.91.09s-2.61-.01-3.91-.09c-1.44-.1-2.83-.35-3.97-1.08-1.36-.88-2.23-2.16-2.62-3.76-.26-1.05-.29-2.13-.29-3.21V8.14c0-1.08.03-2.16.29-3.21.39-1.6 1.26-2.88 2.62-3.76C4.68.45 6.07.2 7.51.1 8.81.01 10.11 0 11.41 0h1.12v.02zm5.01 1.73c-1.15-.18-2.38-.23-3.63-.24-1.24-.03-2.58-.03-3.82 0-1.25.01-2.48.06-3.63.24-1.26.17-2.3.6-3.1 1.53-.75.86-1.04 1.89-1.12 3.12-.1 1.3-.1 2.6-.1 3.9v7.4c0 1.3 0 2.6.1 3.9.08 1.23.37 2.26 1.12 3.12.8.93 1.84 1.36 3.1 1.53 1.15.18 2.38.23 3.63.24 1.24.03 2.58.03 3.82 0 1.25-.01 2.48-.06 3.63-.24 1.26-.17 2.3-.6 3.1-1.53.75-.86 1.04-1.89 1.12-3.12.1-1.3.1-2.6.1-3.9v-7.4c0-1.3 0-2.6-.1-3.9-.08-1.23-.37-2.26-1.12-3.12-.8-.93-1.84-1.36-3.1-1.53zM7.5 16.89c1.79 2.68 4.69 4.08 8.01 3.52 2.55-.43 4.56-2.02 5.46-4.55.56-1.57.51-3.16.17-4.78-.34-1.61-1.15-2.95-2.33-4.01-1.59-1.43-3.54-2.09-5.68-1.9-2.15.19-3.9 1.26-5.09 2.89-.95 1.3-1.32 2.79-1.15 4.4.15 1.43.7 2.66 1.66 3.69 1.41 1.52 3.27 2.21 5.38 2.01 1.53-.14 2.82-.79 3.8-1.95.63-.74.99-1.62 1.12-2.62h-4.97v-1.87h6.99c.04.2.08.43.11.68.18 1.21.03 2.39-.42 3.51-.63 1.58-1.72 2.7-3.22 3.35-2.07.89-4.22.64-6.11-.69-1.73-1.21-2.76-2.95-2.97-5.12-.13-1.33.08-2.59.66-3.76.74-1.51 1.86-2.6 3.34-3.27 2.27-1.03 4.6-.79 6.57.72 1.3 1 2.17 2.34 2.64 3.96l-1.95.4c-.37-1.24-1.01-2.24-1.94-3.03-1.53-1.3-3.39-1.68-5.38-1.09-1.66.49-2.98 1.51-3.79 3.03-.6 1.14-.81 2.37-.59 3.64.28 1.62 1.06 2.93 2.29 3.89 1.34 1.05 2.93 1.43 4.66 1.14 1.72-.29 3.08-1.17 3.98-2.6.43-.69.68-1.43.76-2.22h-2.2v.01H14.5c-.14.42-.33.8-.56 1.13-.72 1.02-1.8 1.57-3.17 1.67-1.43.12-2.71-.29-3.7-1.2-.78-.72-1.28-1.63-1.44-2.72-.17-1.18.03-2.29.56-3.33.55-1.09 1.39-1.89 2.48-2.4 1.17-.54 2.41-.6 3.66-.18.96.33 1.73.92 2.27 1.79.35.56.56 1.18.62 1.85h1.94V12.7h2.19c-.09-.73-.3-1.43-.62-2.09-.91-1.91-2.44-3.06-4.57-3.47-2.13-.41-4.13.01-5.85 1.21-1.2.84-2.07 1.97-2.55 3.38-.35 1.05-.43 2.13-.27 3.22.21 1.42.75 2.68 1.64 3.74l.01.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.customerService")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t("footer.contactUs")}</Link></li>
              <li><Link href={`/${locale}/orders`} className="hover:text-white transition-colors">{locale === "zh" ? "订单追踪" : "Order Tracking"}</Link></li>
              <li><Link href={`/${locale}/returns`} className="hover:text-white transition-colors">{t("footer.returns")}</Link></li>
              <li><Link href={`/${locale}/returns-request`} className="hover:text-white transition-colors">{locale === "zh" ? "申请退换" : "Request Return"}</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4">{locale === "zh" ? "政策" : "Policies"}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href={`/${locale}/returns`} className="hover:text-white transition-colors">{t("footer.returns")}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.newsletter")}</h4>
            <p className="text-sm text-gray-400 mb-3">{t("footer.newsletterDesc")}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={locale === "zh" ? "您的邮箱" : "Your email"}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent)]"
              />
              <button className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded text-sm font-medium transition-colors">
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">{t("footer.copyright")}</p>
          <div className="flex gap-3 text-gray-400 text-xs">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>🅿️ PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
