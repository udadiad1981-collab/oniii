"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "en" | "zh";

const dict: Record<Locale, Record<string, string>> = {
  en: {
    // common nav
    management: "Management",
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    categories: "Categories",
    visitStore: "Visit Store",
    signOut: "Sign Out",
    backToAdmin: "Back to Admin",
    backToList: "Back to List",
    cancel: "Cancel",
    loading: "Loading...",
    // dashboard
    welcomeBack: "Welcome back",
    hereIsWhatsHappening: "Here's what's happening today.",
    today: "Today",
    totalProducts: "Total Products",
    totalOrders: "Total Orders",
    customers: "Customers",
    revenue: "Revenue",
    recentOrders: "Recent Orders",
    viewAll: "View All",
    noOrdersYet: "No orders yet",
    ordersWillAppear: "Orders will appear here once customers start purchasing",
    addNewProduct: "Add New Product",
    createListing: "Create a new product listing",
    batchImport: "Batch Import",
    bulkUpload: "Bulk upload products from CSV",
    visitStoreDesc: "View your live website",
    orderNumber: "Order #",
    customer: "Customer",
    amount: "Amount",
    status: "Status",
    date: "Date",
    // login
    signInToManagement: "Sign in to Management Dashboard",
    emailAddress: "Email Address",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    defaultCredentials: "Default credentials",
    agreeTerms: "By signing in, you agree to our Terms and Privacy Policy",
    checking: "Checking...",
    // products list
    productManagement: "Product Management",
    productsCount: "products",
    importBatch: "Batch Import",
    addProduct: "Add Product",
    product: "Product",
    category: "Category",
    priceCNY: "Price (¥)",
    priceUSD: "USD",
    stock: "Stock",
    actions: "Actions",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    edit: "Edit",
    // orders list
    orderManagement: "Order Management",
    ordersCount: "orders",
    orderNo: "Order #",
    customerName: "Customer",
    address: "Address",
    time: "Time",
    noOrders: "No orders yet",
    clickStatusHint: "Click the status dropdown to change order status. Fill in tracking number after shipping.",
    status_pending: "Pending",
    status_paid: "Paid",
    status_processing: "Processing",
    status_shipped: "Shipped",
    status_delivered: "Delivered",
    status_cancelled: "Cancelled",
    status_refunded: "Refunded",
    // new product form
    addProductTitle: "Add Product",
    addProductSub: "Fill in product info. Chinese for admin, English for customers",
    basicInfo: "Basic Info",
    nameZh: "Product Name (Chinese) *",
    nameZhPlaceholder: "e.g. Cotton Embroidered Pillowcase",
    nameEn: "Product Name (English) *",
    nameEnPlaceholder: "e.g. Cotton Embroidered Pillowcase",
    descZh: "Description (Chinese)",
    descZhPlaceholder: "Describe features, specs, usage...",
    descEn: "Description (English)",
    descEnPlaceholder: "English product description",
    pricingStock: "Pricing & Stock",
    priceCny: "Price (CNY ¥) *",
    priceUsdOptional: "Price (USD $)",
    priceUsdPlaceholder: "Auto-convert if empty",
    compareAtPrice: "Compare-at Price",
    compareAtPlaceholder: "For promotion display",
    sku: "SKU / Item No.",
    stockQty: "Stock Quantity *",
    weightG: "Weight (g) *",
    weightPlaceholder: "Used for shipping calc",
    material: "Material",
    dimensions: "Dimensions",
    dimensionsPlaceholder: "e.g. 45x45cm",
    categorySettings: "Category & Settings",
    categoryName: "Category *",
    selectCategory: "Select category",
    statusLabel: "Status",
    draftDesc: "Draft (not published)",
    publishedDesc: "Published (visible to customers)",
    featuredHome: "Show on homepage featured",
    images: "Product Images",
    imageHint: "Supports JPG / PNG / WebP, up to 10MB each. URL shown after upload.",
    chooseImage: "Choose Image",
    uploading: "Uploading...",
    saveProduct: "Save Product",
    saving: "Saving...",
    productCreated: "✅ Product created! ID: {id}",
    createFailed: "❌ Creation failed: {error}",
    requestFailed: "❌ Request failed: {msg}",
    // batch import
    batchImportTitle: "Batch Import Products",
    importSteps: "Import Steps",
    step1: "1. Download Excel/CSV template file",
    step2: "2. Fill in product info in the template",
    step3: "3. Upload the filled file, system will import automatically",
    downloadTemplate: "Download Import Template",
    downloading: "Downloading...",
    uploadFilled: "Upload filled file",
    supportedFormats: "Supported formats:",
    xlsxDesc: ".xlsx (Excel 97+)",
    xlsDesc: ".xls (old Excel, max 65k rows)",
    csvDesc: ".csv (UTF-8, comma separated)",
    headerNote: "Note: First row must contain headers (name, nameEn, category_name...). Extra rows ignored.",
    processing: "Processing file...",
    parsing: "Parsing {name} ({size} KB)",
    doNotClose: "Do not close this page",
    resultTitle: "Import Result",
    summary: "Summary",
    totalImport: "Total",
    success: "Success",
    failed: "Failed",
    failedRecords: "Failed records ({count} total)",
    viewProductList: "View Product List",
    continueImport: "Continue importing other products",
    templateDownloaded: "Template downloaded! Fill it and re-upload.",
    csvTemplateDownloaded: "CSV template downloaded! Fill it and re-upload.",
    templateDownloadFailed: "Cannot download template. Create a new file, see CSV header for format.",
    excelDetected: "Excel file detected, system will parse automatically. First upload may take 1-2 minutes.",
    csvDetected: "CSV file detected, please ensure UTF-8 encoding.",
    unsupportedFormat: "Unsupported format: {name}. Please upload .xlsx or .csv",
    importFailed: "Import failed: {error}",
    importError: "Error during import. Ensure file is under 2MB.",
  },
  zh: {
    // common nav
    management: "管理后台",
    dashboard: "数据看板",
    products: "商品管理",
    orders: "订单管理",
    categories: "分类管理",
    visitStore: "访问商城",
    signOut: "退出登录",
    backToAdmin: "← 返回后台",
    backToList: "← 返回列表",
    cancel: "取消",
    loading: "加载中...",
    // dashboard
    welcomeBack: "欢迎回来",
    hereIsWhatsHappening: "这是今天的概况。",
    today: "今天",
    totalProducts: "商品总数",
    totalOrders: "订单总数",
    customers: "客户总数",
    revenue: "总销售额",
    recentOrders: "最近订单",
    viewAll: "查看全部",
    noOrdersYet: "暂无订单",
    ordersWillAppear: "客户开始购买后，订单会显示在这里",
    addNewProduct: "添加新商品",
    createListing: "创建新的商品列表",
    batchImport: "批量导入",
    bulkUpload: "从 CSV 批量上传商品",
    visitStoreDesc: "查看你的线上商城",
    orderNumber: "订单号",
    customer: "客户",
    amount: "金额",
    status: "状态",
    date: "日期",
    // login
    signInToManagement: "登录管理后台",
    emailAddress: "邮箱地址",
    password: "密码",
    signIn: "登录",
    signingIn: "登录中...",
    defaultCredentials: "默认凭证",
    agreeTerms: "登录即表示你同意我们的服务条款和隐私政策",
    checking: "检查中...",
    // products list
    productManagement: "商品管理",
    productsCount: "件商品",
    importBatch: "批量导入",
    addProduct: "添加商品",
    product: "商品",
    category: "分类",
    priceCNY: "价格(¥)",
    priceUSD: "美元",
    stock: "库存",
    actions: "操作",
    draft: "草稿",
    published: "已发布",
    archived: "已下架",
    edit: "编辑",
    // orders list
    orderManagement: "订单管理",
    ordersCount: "个订单",
    orderNo: "订单号",
    customerName: "客户",
    address: "地址",
    time: "时间",
    noOrders: "暂无订单",
    clickStatusHint: "💡 点击状态下拉框可直接修改订单状态。发货后请填写物流单号。",
    status_pending: "待付款",
    status_paid: "已付款",
    status_processing: "处理中",
    status_shipped: "已发货",
    status_delivered: "已签收",
    status_cancelled: "已取消",
    status_refunded: "已退款",
    // new product form
    addProductTitle: "添加商品",
    addProductSub: "填写商品信息，中文用于后台管理，英文展示给顾客",
    basicInfo: "基本信息",
    nameZh: "商品名称（中文）*",
    nameZhPlaceholder: "例如：纯棉刺绣抱枕套",
    nameEn: "商品名称（英文）*",
    nameEnPlaceholder: "e.g. Cotton Embroidered Pillowcase",
    descZh: "商品描述（中文）",
    descZhPlaceholder: "详细描述商品特点、规格、用途等",
    descEn: "商品描述（英文）",
    descEnPlaceholder: "English product description",
    pricingStock: "价格库存",
    priceCny: "价格（人民币 ¥）*",
    priceUsdOptional: "价格（美元 $）",
    priceUsdPlaceholder: "留空自动换算",
    compareAtPrice: "原价（划线价）",
    compareAtPlaceholder: "用于促销显示",
    sku: "SKU / 货号",
    stockQty: "库存数量 *",
    weightG: "重量（克）*",
    weightPlaceholder: "用于计算运费",
    material: "材质",
    dimensions: "尺寸",
    dimensionsPlaceholder: "例如：45x45cm",
    categorySettings: "分类与设置",
    categoryName: "分类 *",
    selectCategory: "请选择分类",
    statusLabel: "状态",
    draftDesc: "草稿（暂不发布）",
    publishedDesc: "发布（顾客可见）",
    featuredHome: "在首页推荐显示",
    images: "商品图片",
    imageHint: "支持 JPG / PNG / WebP，单张不超过 10MB。上传后复制 URL 到下方输入框。",
    chooseImage: "选择图片上传",
    uploading: "上传中...",
    saveProduct: "保存商品",
    saving: "保存中...",
    productCreated: "✅ 商品创建成功！ID: {id}",
    createFailed: "❌ 创建失败: {error}",
    requestFailed: "❌ 请求失败: {msg}",
    // batch import
    batchImportTitle: "批量导入商品",
    importSteps: "导入步骤",
    step1: "1. 下载 Excel/CSV 模板文件",
    step2: "2. 在模板中填写商品信息",
    step3: "3. 上传填好的文件，系统将自动导入",
    downloadTemplate: "📥 下载导入模板",
    downloading: "下载中...",
    uploadFilled: "上传填好的文件",
    supportedFormats: "支持格式：",
    xlsxDesc: ".xlsx（Excel 97+）",
    xlsDesc: ".xls（旧版 Excel，最大支持 65K 行数据）",
    csvDesc: ".csv（UTF-8 编码，逗号分隔符）",
    headerNote: "注意：文件第一行必须包含表头（name, nameEn, category_name...），系统会忽略任意多余行为。",
    processing: "正在处理文件...",
    parsing: "正在解析 {name} ({(size)} KB)",
    doNotClose: "请勿关闭此页面",
    resultTitle: "导入结果",
    summary: "汇总",
    totalImport: "总导入",
    success: "成功",
    failed: "失败",
    failedRecords: "失败记录（共 {count} 条）",
    viewProductList: "查看商品列表",
    continueImport: "继续导入其他商品",
    templateDownloaded: "模板已下载！请填写后重新上传。",
    csvTemplateDownloaded: "CSV 模板已下载！请填写后重新上传。",
    templateDownloadFailed: "无法下载模板，请创建新文件，格式参考 CSV 表头。",
    excelDetected: "检测到 Excel 文件，系统将自动解析。首次上传可能需要 1-2 分钟处理时间。",
    csvDetected: "检测到 CSV 文件，请确保编码为 UTF-8。",
    unsupportedFormat: "不支持的文件格式：{name}，请上传 .xlsx 或 .csv",
    importFailed: "导入失败：{error}",
    importError: "导入过程中发生错误，请确保文件未超过 2MB",
  },
};

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LocaleCtx = createContext<Ctx | null>(null);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_locale");
      if (saved === "en" || saved === "zh") setLocaleState(saved);
    } catch {}
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("admin_locale", l);
    } catch {}
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let s = dict[locale][key] ?? dict.en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return s;
  };

  return <LocaleCtx.Provider value={{ locale, setLocale, t }}>{children}</LocaleCtx.Provider>;
}

export function useAdminLocale(): Ctx {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useAdminLocale must be used within AdminLocaleProvider");
  return ctx;
}

export function AdminLangSwitcher() {
  const { locale, setLocale } = useAdminLocale();
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-200 p-1 text-xs font-medium">
      <button
        onClick={() => setLocale("zh")}
        className={`px-3 py-1.5 rounded-full transition-colors ${locale === "zh" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
      >
        中文
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1.5 rounded-full transition-colors ${locale === "en" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
      >
        EN
      </button>
    </div>
  );
}
