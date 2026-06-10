"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  pending: "待付款", paid: "已付款", processing: "处理中", shipped: "已发货", delivered: "已签收", cancelled: "已取消", refunded: "已退款",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(d => { if (!d.authenticated) router.push("/admin/login"); else fetchOrders(); }).catch(() => router.push("/admin/login"));
  }, []);

  const fetchOrders = async () => {
    const r = await fetch("/api/admin/orders");
    const d = await r.json();
    setOrders(d.orders || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    fetchOrders();
  };

  if (loading) return <div className="p-8 text-gray-500">加载中...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">📋 订单管理</h1><p className="text-sm text-gray-500 mt-1">共 {orders.length} 个订单</p></div>
        <Link href="/admin" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">← 返回后台</Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-gray-500"><th className="p-4">订单号</th><th className="p-4">客户</th><th className="p-4">地址</th><th className="p-4">金额</th><th className="p-4">状态</th><th className="p-4">时间</th></tr></thead>
            <tbody>{orders.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">暂无订单</td></tr> : orders.map((o: any) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-4"><div className="font-medium">{o.shipToName}</div><div className="text-xs text-gray-400">{o.email}</div></td>
                <td className="p-4 text-xs text-gray-500 max-w-[200px] truncate">{o.shipToCountry}, {o.shipToCity}</td>
                <td className="p-4 font-medium">${o.total.toFixed(2)}</td>
                <td className="p-4"><select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="text-xs px-2 py-1 rounded border">{[["pending","待付款"],["paid","已付款"],["processing","处理中"],["shipped","已发货"],["delivered","已签收"],["cancelled","已取消"],["refunded","已退款"]].map(([v,l])=>(<option key={v} value={v}>{l}</option>))}</select></td>
                <td className="p-4 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400">💡 点击状态下拉框可直接修改订单状态。发货后请填写物流单号。</div>
    </div>
  );
}
