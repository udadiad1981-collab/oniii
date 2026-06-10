"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function OrderTrackPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !orderNumber) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (orderNumber) params.set("orderNumber", orderNumber);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setSearched(true);
    } catch { }
    setLoading(false);
  };

  const statusLabels: Record<string, { en: string; zh: string; color: string }> = {
    pending: { en: "Pending Payment", zh: "待付款", color: "bg-yellow-100 text-yellow-700" },
    paid: { en: "Paid", zh: "已付款", color: "bg-blue-100 text-blue-700" },
    processing: { en: "Processing", zh: "处理中", color: "bg-purple-100 text-purple-700" },
    shipped: { en: "Shipped", zh: "已发货", color: "bg-green-100 text-green-700" },
    delivered: { en: "Delivered", zh: "已签收", color: "bg-green-200 text-green-800" },
    cancelled: { en: "Cancelled", zh: "已取消", color: "bg-red-100 text-red-700" },
    refunded: { en: "Refunded", zh: "已退款", color: "bg-gray-100 text-gray-600" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">
        {locale === "zh" ? "订单追踪" : "Order Tracking"}
      </h1>
      <p className="text-gray-500 mb-8">
        {locale === "zh" ? "输入订单号或邮箱查看订单状态" : "Enter your order number or email to check status"}
      </p>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl border mb-8 flex flex-col sm:flex-row gap-3">
        <input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
          placeholder={locale === "zh" ? "订单号 (e.g. EQ...)" : "Order Number (e.g. EQ...)"}
          className="flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder={locale === "zh" ? "下单邮箱" : "Order Email"}
          className="flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50">
          {loading ? "..." : (locale === "zh" ? "查询" : "Track")}
        </button>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-4">📭</div>
          <p>{locale === "zh" ? "未找到订单，请检查输入信息" : "No orders found. Please check your input."}</p>
        </div>
      )}

      {orders.map((order: any) => (
        <div key={order.id} className="bg-white rounded-xl border p-6 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs text-gray-400">{locale === "zh" ? "订单号" : "Order #"}</span>
              <p className="font-mono font-bold">{order.orderNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color || "bg-gray-100"}`}>
              {locale === "zh" ? statusLabels[order.status]?.zh : statusLabels[order.status]?.en || order.status}
            </span>
          </div>

          {/* Progress tracker */}
          <div className="flex items-center gap-0 mb-6">
            {["paid", "processing", "shipped", "delivered"].map((step, i) => {
              const stepIdx = ["pending", "paid", "processing", "shipped", "delivered"].indexOf(order.status);
              const done = stepIdx >= ["paid", "processing", "shipped", "delivered"].indexOf(step) + 1;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  {i < 3 && <div className={`flex-1 h-1 mx-1 ${done && stepIdx >= i + 2 ? "bg-green-500" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>{locale === "zh" ? "收货人" : "Ship to"}: {order.shipToName}, {order.shipToCity}, {order.shipToCountry}</p>
            <p>{locale === "zh" ? "金额" : "Total"}: ${order.total.toFixed(2)} {order.currency}</p>
            {order.trackingNumber && (
              <p>{locale === "zh" ? "物流单号" : "Tracking"}: {order.trackingNumber} ({order.trackingCarrier || "N/A"})</p>
            )}
            <p className="text-xs text-gray-400">
              {locale === "zh" ? "下单时间" : "Ordered"}: {new Date(order.createdAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
