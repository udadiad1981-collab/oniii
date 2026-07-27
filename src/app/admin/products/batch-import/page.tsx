"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BatchImportPage() {
  const router = useRouter();

  interface ProductData {
    name: string;
    nameEn: string;
    category_name: string;
    description: string;
    descriptionEn: string;
    price: string;
    priceUsd?: string;
    compareAt?: string;
    sku: string;
    weight: string;
    stock: string;
    image_url?: string;
  }

  const [step, setStep] = useState(1);
  const [resetKey, setResetKey] = useState(0); // Key to reset file input
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{
    total: number;
    success: number;
    failed: string[];
  } | null>(null);

  const downloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      const res = await fetch("/api/admin/products/template");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product_import_template.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("模板已下载！请填写后重新上传。");
      } else {
        // Fallback: 生成 CSV 模板下载
        const csvContent = 
          "name,nameEn,category_name,description,descriptionEn,price,priceUsd,sku,weight,stock,image_url\n" +
          "产品名称，英文名称，分类名称，中文描述，英文描述，价格 CNY,价格 USD（可选）,SKU 编号,重量克数，库存数量，图片 URL";
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product_import_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("CSV 模板已下载！请填写后重新上传。");
      }
    } catch (error) {
      console.error("模板下载失败:", error);
      alert("无法下载模板，请创建新文件，格式参考 CSV 表头。");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setUploadingFile(file);

    try {
      // 显示文件格式说明
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        alert("检测到 Excel 文件，系统将自动解析。首次上传可能需要 1-2 分钟处理时间。");
      } else if (file.name.endsWith(".csv")) {
        alert("检测到 CSV 文件，请确保编码为 UTF-8。");
      } else {
        alert(`不支持的文件格式：${file.name}，请上传 .xlsx 或 .csv`);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      setStep(2); // 显示上传状态
      await new Promise(r => setTimeout(r, 1500));

      const response = await fetch("/api/admin/products/batch-import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStep(3); // 显示结果
        setImportResult({
          total: result.total,
          success: result.imported,
          failed: result.errors || [],
        });
      } else {
        alert(`导入失败：${result.error}`);
        setStep(1);
      }
    } catch (error) {
      console.error("上传失败:", error);
      alert("导入过程中发生错误，请确保文件未超过 2MB");
      setStep(1);
    } finally {
      // Reset file input by changing key
      setResetKey(prev => prev + 1);
    }
  };

  // Step 1: 下载模板 + 上传界面
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">批量导入商品</h1>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Info box */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">导入步骤</h3>
            <ol className="space-y-1 text-sm text-blue-700">
              <li>1. 下载 Excel/CSV 模板文件</li>
              <li>2. 在模板中填写商品信息（如需使用 Excel 高级功能）</li>
              <li>3. 上传填好的文件，系统将自动导入</li>
            </ol>
          </div>

          <button
            onClick={downloadTemplate}
            disabled={downloadingTemplate}
            className="w-full mb-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {downloadingTemplate ? "下载中..." : "📥 下载导入模板"}
          </button>

          <div className="border-t my-4" />

          {/* Upload section */}
          <h3 className="font-semibold text-lg mb-4">上传填好的文件</h3>
          <input
            key={resetKey}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer bg-gray-50"
          />

          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p className="font-medium">支持格式：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>.xlsx（Excel 97+）</li>
              <li>.xls（旧版 Excel, 最大支持 65K 行数据）</li>
              <li>.csv（UTF-8 编码，逗号分隔符）</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <p className="text-xs text-yellow-800">
                <strong>注意：</strong> 文件第一行必须包含表头（name, nameEn, category_name...），系统会忽略任意多余行为。
              </p>
            </div>
          </div>
        </div>

        <Link href="/admin/products" className="mt-6 inline-block text-blue-600 hover:underline">
          ← 返回商品列表
        </Link>
      </div>
    );
  }

  // Step 2: 上传状态
  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center pt-16 pb-16">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-800">正在处理文件...</h2>
          <p className="text-gray-600 mt-2">正在解析 {uploadingFile?.name || ""} ({(uploadingFile?.size || 0 / 1024).toFixed(2)} KB)</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>请勿关闭此页面</p>
          </div>
        </div>

        <Link href="/admin/products" className="mt-6 inline-block text-blue-600 hover:underline">
          后续可通过商品列表查看结果 ←
        </Link>
      </div>
    );
  }

  // Step 3: 结果汇总
  if (step === 3 && importResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">导入结果</h1>

        {/* Summary card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">汇总</h2>
            <span className={`px-4 py-2 rounded-lg font-bold ${importResult.success > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {importResult.success} / {importResult.total} 成功
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">{importResult.total}</div>
              <div className="text-sm text-gray-600">总导入</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{importResult.success}</div>
              <div className="text-sm text-gray-600">成功</div>
            </div>
            <div className="text-red-600">
              <div className="text-3xl font-bold">{importResult.total - importResult.success}</div>
              <div className="text-sm">失败</div>
            </div>
          </div>
        </div>

        {/* Failed products */}
        {importResult.failed.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="font-bold text-red-700 mb-4">失败记录（共 {importResult.failed.length} 条）</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              <ul className="space-y-2 text-sm text-red-800">
                {importResult.failed.map((error: string, idx: number) => (
                  <li key={idx} className="bg-white rounded p-2 border">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Link href="/admin/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
          查看商品列表
        </Link>

      <Link href="/admin/products/batch-import" className="ml-4 inline-block text-blue-600 hover:underline">
        继续导入其他商品
      </Link>
      </div>
    );
  }

  return null;
}
