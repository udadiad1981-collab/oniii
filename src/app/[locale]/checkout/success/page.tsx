"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const [orderNumber, setOrderNumber] = useState<string | null>(
    params.get("order") || null
  );
  const [loading, setLoading] = useState(!params.get("order"));

  useEffect(() => {
    // PayPal capture completes on client side via the order ID
    const paypalOrderId = params.get("token");
    if (paypalOrderId && !orderNumber) {
      fetch("/api/checkout/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "capture_order", paypalOrderId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.orderNumber) setOrderNumber(data.orderNumber);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params, orderNumber]);

  const t = (key: string) => {
    const zh: Record<string, string> = {
      "Payment Successful!": "支付成功！",
      "Thank you for your order. A confirmation email will be sent shortly.":
        "感谢您的订单。确认邮件将稍后发送。",
      "Order Number": "订单号",
      "Back to Home": "返回首页",
      "Processing...": "处理中...",
    };
    return locale === "zh" ? zh[key] || key : key;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">⏳</div>
        <p className="text-gray-500">{t("Processing...")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold mb-3">{t("Payment Successful!")}</h1>
      <p className="text-gray-500 mb-4">
        {t("Thank you for your order. A confirmation email will be sent shortly.")}
      </p>
      {orderNumber && (
        <p className="text-lg font-mono bg-gray-100 inline-block px-4 py-2 rounded mb-8">
          {t("Order Number")}: {orderNumber}
        </p>
      )}
      <br />
      <button
        onClick={() => router.push(`/${locale}`)}
        className="mt-8 inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)]"
      >
        {t("Back to Home")}
      </button>
    </div>
  );
}
