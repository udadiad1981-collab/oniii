"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ContactPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", orderNumber: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "", orderNumber: "" });
      } else {
        setError(data.error || "Failed");
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setError(locale === "zh" ? "提交失败，请稍后重试" : "Submission failed, please try again");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold mb-4">
          {locale === "zh" ? "留言已提交！" : "Message Sent!"}
        </h1>
        <p className="text-gray-500 mb-8">
          {locale === "zh" ? "我们会在24小时内回复您的邮箱。" : "We'll reply to your email within 24 hours."}
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
        {locale === "zh" ? "联系我们" : "Contact Us"}
      </h1>
      <p className="text-gray-500 mb-8">
        {locale === "zh" ? "有任何问题请留言，我们会在24小时内回复。" : "Leave us a message and we'll get back within 24 hours."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl border">
        {status === "error" && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "姓名 *" : "Name *"}
            </label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "邮箱 *" : "Email *"}
            </label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "订单号（可选）" : "Order Number (optional)"}
          </label>
          <input type="text" value={form.orderNumber} onChange={e => setForm({...form, orderNumber: e.target.value})}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "主题" : "Subject"}
          </label>
          <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "留言内容 *" : "Message *"}
          </label>
          <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        </div>
        <button type="submit" disabled={status === "loading"}
          className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50">
          {status === "loading" ? (locale === "zh" ? "提交中..." : "Sending...") : (locale === "zh" ? "提交留言" : "Send Message")}
        </button>
      </form>
    </div>
  );
}
