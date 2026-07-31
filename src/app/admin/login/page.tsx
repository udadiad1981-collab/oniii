"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin登入Page() {
  const [email, setEmail] = useState("");
  const [password, set密碼] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch("/api/admin/me")
      .then(r => r.json())
      .then(d => { if (d.authenticated) router.push("/admin"); else setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "登入失敗");
      }
    } catch {
      setError("網絡錯誤，請重試");
    }
    setLoading(false);
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center"><div><div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin mx-auto mb-3"></div><p className="text-gray-600">檢查中...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-xl translate-y-10 -translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">ON</span>
              </div>
              <h1 className="text-2xl font-bold">oniii</h1>
            </div>
            <p className="text-blue-100 text-sm">管理後台登入</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <span className="text-xl">⚠</span>
              <div className="text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">電子郵箱</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="admin@example.com" required />
              </div>
            </div>

            {/* 密碼 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">密碼</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔐</span>
                <input type="password" value={password} onChange={e => set密碼(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focused:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Enter your password" required />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>

            {/* Helper text */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                Default credentials: 
                <span className="ml-2 font-mono bg-gray-100 px-2 py-0.5 rounded text-blue-600">admin@oniii.com</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-red-600">admin123</span>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-8 py-4">
          <p className="text-xs text-gray-500 text-center">By signing in, you agree to our Terms and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
