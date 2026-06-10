"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    price: "",
    priceUsd: "",
    compareAt: "",
    sku: "",
    weight: "",
    stock: "",
    material: "",
    dimensions: "",
    categoryId: "",
    featured: false,
    status: "draft",
  });

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(d => {
      if (!d.authenticated) { router.push("/admin/login"); return; }
      setAuthChecked(true);
      fetchCategories();
    }).catch(() => router.push("/admin/login"));
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) { console.error(e); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        // Store image URL - we'll handle this in the save
        setMessage((prev) => prev + `\n图片上传成功: ${data.url}`);
      } else {
        setMessage((prev) => prev + `\n上传失败: ${data.error}`);
      }
    } catch (err) {
      setMessage((prev) => prev + "\n上传出错");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const body: any = {
        name: form.name,
        nameEn: form.nameEn || form.name,
        description: form.description,
        descriptionEn: form.descriptionEn || form.description,
        price: parseFloat(form.price) || 0,
        priceUsd: form.priceUsd ? parseFloat(form.priceUsd) : null,
        compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
        sku: form.sku || null,
        weight: parseFloat(form.weight) || 0,
        stock: parseInt(form.stock) || 0,
        material: form.material || null,
        dimensions: form.dimensions || null,
        categoryId: form.categoryId,
        featured: form.featured,
        status: form.status,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.product) {
        setMessage(`✅ 商品创建成功！ID: ${data.product.id}`);
        // Reset form
        setForm({
          name: "", nameEn: "", description: "", descriptionEn: "",
          price: "", priceUsd: "", compareAt: "", sku: "",
          weight: "", stock: "", material: "", dimensions: "",
          categoryId: "", featured: false, status: "draft",
        });
      } else {
        setMessage(`❌ 创建失败: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ 请求失败: ${err.message}`);
    }
    setSaving(false);
  };

  if (!authChecked) return <div className="p-8 text-gray-500">加载中...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">➕ 添加商品</h1>
          <p className="text-sm text-gray-500 mt-1">填写商品信息，中文用于后台管理，英文展示给顾客</p>
        </div>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">
          ← 返回列表
        </Link>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg whitespace-pre-wrap text-sm ${
          message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        {/* Basic info */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">📋 基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">商品名称（中文）*</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="例如：纯棉刺绣抱枕套" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">商品名称（英文）*</label>
              <input name="nameEn" value={form.nameEn} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="e.g. Cotton Embroidered Pillowcase" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">商品描述（中文）</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="详细描述商品特点、规格、用途等" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">商品描述（英文）</label>
              <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows={4}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="English product description" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">💰 价格库存</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">价格（人民币 ¥）*</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">价格（美元 $）</label>
              <input name="priceUsd" value={form.priceUsd} onChange={handleChange} type="number" step="0.01"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="留空自动换算" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">原价（划线价）</label>
              <input name="compareAt" value={form.compareAt} onChange={handleChange} type="number" step="0.01"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="用于促销显示" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">SKU / 货号</label>
              <input name="sku" value={form.sku} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">库存数量 *</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">重量（克）*</label>
              <input name="weight" value={form.weight} onChange={handleChange} type="number" required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="用于计算运费" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">材质</label>
              <input name="material" value={form.material} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">尺寸</label>
              <input name="dimensions" value={form.dimensions} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="例如：45x45cm" />
            </div>
          </div>
        </div>

        {/* Category & Status */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">📂 分类与设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">分类 *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option value="">请选择分类</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name} / {cat.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">状态</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option value="draft">草稿（暂不发布）</option>
                <option value="published">发布（顾客可见）</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400" />
                <span className="text-sm text-gray-600">在首页推荐显示</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">🖼️ 商品图片</h2>
          <p className="text-xs text-gray-400 mb-3">支持 JPG / PNG / WebP，单张不超过 10MB。上传后复制 URL 到下方输入框。</p>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
              {uploading ? "上传中..." : "选择图片上传"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
            <span className="text-xs text-gray-400">上传完成后会显示图片地址</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
            {saving ? "保存中..." : "💾 保存商品"}
          </button>
          <Link href="/admin/products" className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}

