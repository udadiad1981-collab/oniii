"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import { calculateShipping } from "@/lib/utils";

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const { items, getSubtotal, getTotalWeight, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
    paymentMethod: "card",
  });

  const subtotal = getSubtotal();
  const totalWeight = getTotalWeight();
  const shippingCost = calculateShipping(totalWeight, form.country);
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax estimate
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.priceUsd,
          })),
          subtotal,
          shippingCost,
          tax,
          total,
          currency: "USD",
          paymentMethod: form.paymentMethod,
          email: form.email,
          shipToName: `${form.firstName} ${form.lastName}`,
          shipToStreet: form.address,
          shipToStreet2: form.address2,
          shipToCity: form.city,
          shipToState: form.state,
          shipToZip: form.zip,
          shipToCountry: form.country,
          shipToPhone: form.phone,
        }),
      });

      const data = await res.json();
      if (data.orderNumber) {
        setOrderComplete(data.orderNumber);
        clearCart();
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold mb-3">{t("checkout.orderSuccess")}</h1>
        <p className="text-gray-500 mb-4">{t("checkout.orderSuccessDesc")}</p>
        <p className="text-lg font-mono bg-gray-100 inline-block px-4 py-2 rounded">
          {t("checkout.orderNumber")}: {orderComplete}
        </p>
        <br />
        <button
          onClick={() => router.push(`/${locale}`)}
          className="mt-8 inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)]"
        >
          {locale === "zh" ? "返回首页" : "Back to Home"}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-500">{t("cart.empty")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t("checkout.title")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping + Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-4">{t("checkout.shippingInfo")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.firstName")} *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.lastName")} *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.email")} *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.address")} *</label>
                  <input name="address" value={form.address} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.address2")}</label>
                  <input name="address2" value={form.address2} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.city")} *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.state")}</label>
                  <input name="state" value={form.state} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.zip")} *</label>
                  <input name="zip" value={form.zip} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.country")} *</label>
                  <select name="country" value={form.country} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.phone")}</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-4">{t("checkout.paymentMethod")}</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors">
                  <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={handleChange} />
                  <span className="text-sm font-medium">{t("checkout.cardPayment")}</span>
                  <span className="ml-auto text-lg">💳</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors">
                  <input type="radio" name="paymentMethod" value="paypal" checked={form.paymentMethod === "paypal"} onChange={handleChange} />
                  <span className="text-sm font-medium">{t("checkout.paypalPayment")}</span>
                  <span className="ml-auto text-lg">🅿️</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg mb-4">{t("checkout.orderSummary")}</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-2">
                      {item.product.nameEn} × {item.quantity}
                    </span>
                    <span className="font-medium">${(item.product.priceUsd * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.subtotal")}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.shipping")}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.tax")}</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span className="text-[var(--accent)]">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? t("common.loading") : t("checkout.placeOrder")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
