"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ReturnRequestPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const [form, setForm] = useState({ orderNumber: "", email: "", reason: "", description: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [returnData, setReturnData] = useState<any>(null);

  const reasons = [
    { en: "Quality issue / defect", zh: "质量问题/瑕疵" },
    { en: "Wrong item received", zh: "收到的商品不对" },
    { en: "Shipping damage", zh: "运输中损坏" },
    { en: "Size doesn't fit", zh: "尺寸不合适" },
    { en: "Changed my mind", zh: "不想要了" },
    { en: "Other", zh: "其他原因" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setReturnData(data.returnRequest);
      } else {
        setError(data.error || "Failed");
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setError(locale === "zh" ? "提交失败，请稍后重试" : "Submission failed, try again");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="text-2xl font-bold mb-4">
          {locale === "zh" ? "退换申请已提交！" : "Return Request Submitted!"}
        </h1>
        <p className="text-gray-500 mb-8">
          {locale === "zh"
            ? `您的退换申请已收到，状态：${returnData?.status === "pending" ? "待审核" : returnData?.status}。我们会邮件通知您审核结果。`
            : `Your return request has been received. Status: ${returnData?.status}. We'll notify you by email.`}
        </p>
        <Link href={`/${locale}`} className="text-[var(--accent)] hover:underline">
          {locale === "zh" ? "返回首页" : "Back to Home"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">
        {locale === "zh" ? "申请退换货" : "Request Return / Exchange"}
      </h1>
      <p className="text-gray-500 mb-8">
        {locale === "zh"
          ? "请填写以下信息申请退换货，我们会尽快处理。"
          : "Fill in the form below to request a return or exchange."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl border">
        {status === "error" && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "订单号 *" : "Order Number *"}
          </label>
          <input type="text" required value={form.orderNumber}
            onChange={e => setForm({...form, orderNumber: e.target.value})}
            placeholder="e.g. EQ2026060971MUR2"
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "下单邮箱 *" : "Order Email *"}
          </label>
          <input type="email" required value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "退换原因 *" : "Reason *"}
          </label>
          <select required value={form.reason}
            onChange={e => setForm({...form, reason: e.target.value})}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
            <option value="">{locale === "zh" ? "请选择原因" : "Select a reason"}</option>
            {reasons.map((r, i) => (
              <option key={i} value={r.en}>{locale === "zh" ? r.zh : r.en}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "详细描述" : "Description"}
          </label>
          <textarea rows={4} value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder={locale === "zh" ? "请描述具体问题..." : "Please describe the issue..."}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        </div>

        <button type="submit" disabled={status === "loading"}
          className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50">
          {status === "loading" ? (locale === "zh" ? "提交中..." : "Submitting...") : (locale === "zh" ? "提交退换申请" : "Submit Return Request")}
        </button>
      </form>

      <div className="mt-8 bg-gray-50 rounded-xl p-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">{locale === "zh" ? "退换政策摘要" : "Return Policy Summary"}</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>{locale === "zh" ? "收到商品后14天内可申请退换" : "Return within 14 days of delivery"}</li>
          <li>{locale === "zh" ? "质量问题/错发，我们承担退货运费" : "Quality/wrong item: we cover return shipping"}</li>
          <li>{locale === "zh" ? "个人原因退换，运费由您承担" : "Personal reasons: buyer pays return shipping"}</li>
        </ul>
      </div>
    </div>
  );
}
