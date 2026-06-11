"use client";

import { useRouter, usePathname } from "next/navigation";

export default function CheckoutCancel() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";

  const t = (key: string) => {
    const zh: Record<string, string> = {
      "Payment Cancelled": "支付已取消",
      "Your payment was not completed. No charges have been made.":
        "您的支付未完成，未产生任何费用。",
      "Try Again": "重试",
      "Back to Cart": "返回购物车",
    };
    return locale === "zh" ? zh[key] || key : key;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-2xl font-bold mb-3">{t("Payment Cancelled")}</h1>
      <p className="text-gray-500 mb-8">
        {t("Your payment was not completed. No charges have been made.")}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => router.push(`/${locale}/checkout`)}
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)]"
        >
          {t("Try Again")}
        </button>
        <button
          onClick={() => router.push(`/${locale}/cart`)}
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          {t("Back to Cart")}
        </button>
      </div>
    </div>
  );
}
