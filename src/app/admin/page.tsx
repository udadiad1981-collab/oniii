"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ products: 0, orders: 0, users: 0, revenue: 0 });
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div><div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin mx-auto mb-3"></div><p className="text-gray-600">Loading...</p></div></div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Side Navigation */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white flex-shrink-0 hidden md:block shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">ON</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">oniii</h2>
              <p className="text-xs text-blue-300">Management</p>
            </div>
          </div>
        </div>
<nav className="p-4">
          {[{label:"Dashboard",icon:"[D]",href:"/admin",active:true},
            {label:"Products",icon:"◇",href:"/admin/products"},
            {label:"Orders",icon:"◎",href:"/admin/orders"},
            {label:"Categories",icon:"≡",href:"/admin/categories"}].map((item,i)=>(
            <Link key={i} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-2 transition-all ${item.active?"bg-white/15 backdrop-blur font-semibold text-white":"text-blue-200 hover:bg-white/5"}`}>
              <span className="opacity-80 text-base min-w-[1.5rem]">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="border-t border-white/10 pt-4 mt-4">
            <Link href="/en" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all text-white font-medium shadow-md">
              <span className="opacity-80 text-base min-w-[1.5rem]">↗</span> Visit Store →
            </Link>
          </div>
        </nav>

        <div className="p-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-xs text-blue-200 mb-1 truncate">{user?.email || ""}</div>
            <button onClick={handleLogout} className="text-xs text-blue-300 hover:text-white transition-colors">Sign Out ←</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 pt-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome back, {user?.email?.split("@")[0]}! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700">
              Today: {new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[{label:"Total Products",value:stats.products,unit:"",color:"from-blue-500 to-indigo-600",shadow:"bg-blue-100"},
            {label:"Total Orders",value:stats.orders,unit:"",color:"from-emerald-500 to-teal-600",shadow:"bg-green-100"},
            {label:"Customers",value:stats.users,unit:"",color:"from-purple-500 to-pink-600",shadow:"bg-purple-100"},
            {label:"Revenue",value:"$"+stats.revenue.toFixed(2),unit:"",color:"from-amber-500 to-orange-600",shadow:"bg-amber-100"}].map((card,i)=>(
            <div key={i} className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${card.shadow} mb-4`}>
                  <span className="text-2xl">{i===0?"📦":i===1?"📋":i===2?"👥":"💵"}</span>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">{card.value}{card.unit}</div>
                </div>
                <p className={`text-sm font-medium ${card.shadow.split("-")[0]}-600`}>{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All →</Link>
            </div>
          </div>

          <div className="p-6">
            {recentOrders.length===0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                  <span className="text-3xl">🛒</span>
                </div>
                <p className="text-gray-500 font-medium mb-2">No orders yet</p>
                <p className="text-sm text-gray-400">Orders will appear here once customers start purchasing</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[680px]">
                <thead className="bg-gray-50/80">
                  <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                    <th className="pb-3 font-semibold whitespace-nowrap w-32">Order #</th>
                    <th className="pb-3 font-semibold whitespace-nowrap">Customer</th>
                    <th className="pb-3 font-semibold text-right whitespace-nowrap w-28">Amount</th>
                    <th className="pb-3 font-semibold whitespace-nowrap w-28">Status</th>
                    <th className="pb-3 font-semibold text-right whitespace-nowrap w-28">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((o:any)=>(
                    <tr key={o.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 font-mono text-xs text-gray-600">{o.orderNumber}</td>
                      <td className="py-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-xs shadow-md flex-shrink-0">
                            {o.email?.charAt(0)?.toUpperCase() || "C"}
                          </div>
                          <div className="text-sm font-medium text-gray-900 truncate" title={o.email}>{o.email}</div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-gray-900">${o.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          o.status==="pending"?"bg-amber-100 text-amber-700 border border-amber-200":
                          o.status==="shipped"?"bg-emerald-100 text-emerald-700 border border-emerald-200":
                          o.status==="completed"?"bg-blue-100 text-blue-700 border border-blue-200":
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/admin/products/new" className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all border border-blue-200/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold">+</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Add New Product</h3>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/products/batch-import" className="group bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl p-6 hover:shadow-lg transition-all border border-emerald-200/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold">⇄</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Batch Import</h3>
                <p className="text-sm text-gray-600">Bulk upload products from CSV</p>
              </div>
            </div>
          </Link>

          <a href="/en" className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-all border border-purple-200/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
                <span className="text-xl font-bold">→</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Visit Store</h3>
                <p className="text-sm text-gray-600">View your live website</p>
              </div>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
