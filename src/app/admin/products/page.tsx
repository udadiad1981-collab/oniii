"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(d => { if (!d.authenticated) router.push("/admin/login"); else fetchProducts(); }).catch(() => router.push("/admin/login"));
  }, []);

  const fetchProducts = async () => {
    const r = await fetch("/api/admin/products");
    const d = await r.json();
    setProducts(d.products || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    fetchProducts();
  };

  if (loading) return <div className="p-8 text-gray-500">加载中...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">📦 商品管理</h1><p className="text-sm text-gray-500 mt-1">共 {products.length} 件商品</p></div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors font-medium">+ 添加商品</Link>
          <Link href="/admin" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">← 返回后台</Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-gray-500"><th className="p-4">商品</th><th className="p-4">分类</th><th className="p-4">价格(¥)</th><th className="p-4">美元</th><th className="p-4">库存</th><th className="p-4">状态</th><th className="p-4">操作</th></tr></thead>
            <tbody>{products.map((p: any) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">{p.images?.[0] ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover rounded" /> : "📦"}</div><div><div className="font-medium text-gray-800">{p.name}</div><div className="text-xs text-gray-400">{p.nameEn}</div></div></div></td>
                <td className="p-4 text-gray-500">{p.category?.name || "-"}</td>
                <td className="p-4 font-mono">¥{p.price.toFixed(2)}</td>
                <td className="p-4 font-mono">${p.priceUsd?.toFixed(2) || "-"}</td>
                <td className="p-4"><span className={p.stock <= 5 ? "text-red-500 font-medium" : "text-gray-600"}>{p.stock}</span></td>
                <td className="p-4"><select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} className={`text-xs px-2 py-1 rounded border ${p.status === "published" ? "border-green-300 bg-green-50 text-green-700" : p.status === "draft" ? "border-gray-300 bg-gray-50 text-gray-600" : "border-red-300 bg-red-50 text-red-600"}`}><option value="draft">草稿</option><option value="published">已发布</option><option value="archived">已下架</option></select></td>
                <td className="p-4"><button className="text-blue-500 hover:underline text-xs">编辑</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
