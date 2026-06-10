"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me")
      .then(r => r.json())
      .then(d => { if (!d.authenticated) router.push("/admin/login"); else setUser(d.user); })
      .catch(() => router.push("/admin/login"));
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/admin/stats").then(r => r.json()).then(d => {
        setStats(d.stats || { products: 0, orders: 0, users: 0, revenue: 0 });
        setRecentOrders(d.recentOrders || []);
        setLoading(false);
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">加载中...</div></div>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-wider">EQ<span className="text-red-500">FRS</span></h2>
          <p className="text-xs text-gray-400 mt-1">管理后台</p>
        </div>
        <nav className="px-3 py-2">
          {[{label:"📊 数据看板",href:"/admin"},{label:"📦 商品管理",href:"/admin/products"},{label:"📋 订单管理",href:"/admin/orders"},{label:"🏠 返回网站",href:"/en"}].map(item=>(
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-60 p-4 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-2">{user?.email || ""}</div>
          <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">退出登录</button>
        </div>
      </aside>

      <main className="flex-1 p-6 pb-20 md:pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">📊 数据看板</h1>
        <p className="text-sm text-gray-500 mb-6">欢迎回来，管理员</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{label:"商品总数",value:stats.products,icon:"📦"},{label:"订单总数",value:stats.orders,icon:"📋"},{label:"用户总数",value:stats.users,icon:"👥"},{label:"总销售额",value:"$"+stats.revenue.toFixed(2),icon:"💰"}].map(card=>(
            <div key={card.label} className="bg-white rounded-xl p-6 border"><div className="flex items-center gap-3 mb-3"><span className="text-2xl">{card.icon}</span><span className="text-sm text-gray-500">{card.label}</span></div><div className="text-2xl font-bold">{card.value}</div></div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-lg mb-4">📋 最近订单</h2>
          {recentOrders.length===0 ? <p className="text-gray-400 text-sm py-8 text-center">暂无订单</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">订单号</th><th className="pb-3">客户</th><th className="pb-3">金额</th><th className="pb-3">状态</th><th className="pb-3">时间</th></tr></thead>
              <tbody>{recentOrders.map((o:any)=>(
                <tr key={o.id} className="border-b last:border-0"><td className="py-3 font-mono text-xs">{o.orderNumber}</td><td className="py-3">{o.email}</td><td className="py-3">${o.total.toFixed(2)}</td><td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${o.status==="pending"?"bg-yellow-100 text-yellow-700":o.status==="shipped"?"bg-green-100 text-green-700":"bg-gray-100"}`}>{o.status}</span></td><td className="py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
