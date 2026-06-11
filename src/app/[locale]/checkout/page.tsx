"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");

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
  });

  const subtotal = getSubtotal();
  const totalWeight = getTotalWeight();
  const shippingCost = calculateShipping(totalWeight, form.country);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildOrderPayload = () => ({
    items: items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
    })),
    email: form.email,
    shipToName: `${form.firstName} ${form.lastName}`,
    shipToStreet: form.address,
    shipToStreet2: form.address2,
    shipToCity: form.city,
    shipToState: form.state,
    shipToZip: form.zip,
    shipToCountry: form.country,
    shipToPhone: form.phone,
    successUrl: `${window.location.origin}/${locale}/checkout/success`,
    cancelUrl: `${window.location.origin}/${locale}/checkout/cancel`,
  });

  // ---- Stripe Checkout ----
  const handleStripeCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildOrderPayload()),
      });
      const data = await res.json();

      if (data.url) {
        // Clear cart before redirect
        clearCart();
        window.location.href = data.url;
      } else if (res.status === 503) {
        setError(
          locale === "zh"
            ? "支付暂未配置，请稍后再试"
            : "Payment not yet configured. Please check back soon."
        );
      } else {
        setError(data.error || "Payment failed");
      }
    } catch {
      setError(locale === "zh" ? "网络错误" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  // ---- PayPal Checkout ----
  const handlePayPalCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Create PayPal order
      const createRes = await fetch("/api/checkout/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_order", ...buildOrderPayload() }),
      });
      const createData = await createRes.json();

      if (createRes.status === 503) {
        setError(
          locale === "zh"
            ? "支付暂未配置，请稍后再试"
            : "Payment not yet configured. Please check back soon."
        );
        setLoading(false);
        return;
      }
      if (!createData.id) {
        setError(createData.error || "Failed to create PayPal order");
        setLoading(false);
        return;
      }

      // 2. Open PayPal popup
      const popup = window.open(
        `https://www.sandbox.paypal.com/checkoutnow?token=${createData.id}`,
        "paypal",
        "width=500,height=600"
      );

      if (!popup) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${createData.id}`;
        return;
      }

      // 3. Poll for popup close
      const pollTimer = setInterval(async () => {
        if (popup.closed) {
          clearInterval(pollTimer);
          try {
            const captureRes = await fetch("/api/checkout/paypal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "capture_order",
                paypalOrderId: createData.id,
              }),
            });
            const captureData = await captureRes.json();
            if (captureData.status === "COMPLETED") {
              clearCart();
              router.push(`/${locale}/checkout/success?order=${captureData.orderNumber}`);
            } else {
              router.push(`/${locale}/checkout/cancel`);
            }
          } catch {
            router.push(`/${locale}/checkout/cancel`);
          }
        }
      }, 500);
    } catch {
      setError(locale === "zh" ? "网络错误" : "Network error");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-500">{t("cart.empty")}</p>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="mt-4 text-[var(--accent)] underline"
        >
          {locale === "zh" ? "返回首页" : "Continue Shopping"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t("checkout.title")}</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-lg mb-4">{t("checkout.shippingInfo")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["firstName", "firstName", "text"],
                ["lastName", "lastName", "text"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t(`checkout.${label}`)} *
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              ))}
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
              {[
                ["city", "city"],
                ["state", "state"],
                ["zip", "zip"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t(`checkout.${label}`)} {label === "state" ? "" : "*"}
                  </label>
                  <input name={name} value={(form as any)[name]} onChange={handleChange} required={label !== "state"} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>
              ))}
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
                  <option value="JP">Japan</option>
                  <option value="KR">South Korea</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("checkout.phone")}</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-lg mb-4">{t("checkout.paymentMethod")}</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  paymentMethod === "stripe"
                    ? "border-[var(--accent)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-3xl block mb-1">💳</span>
                <span className="text-sm font-medium">{t("checkout.cardPayment")}</span>
                <span className="block text-xs text-gray-400">Visa / Mastercard</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  paymentMethod === "paypal"
                    ? "border-[#0070ba] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-3xl block mb-1">🅿️</span>
                <span className="text-sm font-medium">{t("checkout.paypalPayment")}</span>
                <span className="block text-xs text-gray-400">PayPal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary + Pay Button */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg mb-4">{t("checkout.orderSummary")}</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.product.nameEn} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.product.priceUsd * item.quantity).toFixed(2)}
                  </span>
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

            {/* Pay Button */}
            {paymentMethod === "stripe" ? (
              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={loading}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {locale === "zh" ? "跳转支付..." : "Redirecting..."}
                  </>
                ) : (
                  <>
                    💳 {locale === "zh" ? "信用卡支付" : "Pay with Card"}
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePayPalCheckout}
                disabled={loading}
                className="w-full bg-[#0070ba] hover:bg-[#005ea6] disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {locale === "zh" ? "跳转支付..." : "Redirecting..."}
                  </>
                ) : (
                  <>
                    🅿️ {locale === "zh" ? "PayPal 支付" : "Pay with PayPal"}
                  </>
                )}
              </button>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 {locale === "zh" ? "支付安全加密" : "Secure encrypted payment"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
