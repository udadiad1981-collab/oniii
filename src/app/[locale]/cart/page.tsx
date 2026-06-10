"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-3">{t("cart.empty")}</h1>
        <p className="text-gray-500 mb-8">{t("cart.emptyDesc")}</p>
        <Link
          href={`/${locale}/search`}
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t("cart.title")} ({getItemCount()})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 hover:shadow-sm transition-shadow"
            >
              {/* Product image */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.nameEn} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">📦</span>
                )}
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.product.nameEn}</h3>
                {item.product.variantName && (
                  <p className="text-xs text-gray-400 mb-2">{item.product.variantName}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--primary)]">
                      ${(item.product.priceUsd * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg mb-4">{t("cart.subtotal")}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.subtotal")} ({getItemCount()} items)</span>
                <span className="font-medium">${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.shipping")}</span>
                <span className="text-gray-400">{t("cart.shippingNote")}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>{t("cart.total")}</span>
                <span className="text-[var(--accent)]">${getSubtotal().toFixed(2)}</span>
              </div>
            </div>
            <Link
              href={`/${locale}/checkout`}
              className="block w-full text-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {t("cart.proceedCheckout")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
