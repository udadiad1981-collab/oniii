import { getTranslations } from "next-intl/server";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{isZh ? "隐私政策" : "Privacy Policy"}</h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        {isZh ? (
          <>
            <p>oniii 重视您的隐私。本政策说明我们如何收集、使用和保护您的个人信息。</p>
            <h2 className="text-xl font-bold mt-8">信息收集</h2>
            <p>我们收集的信息包括：您提供的姓名、邮箱、收货地址、电话号码等订单必需信息。</p>
            <h2 className="text-xl font-bold mt-8">信息使用</h2>
            <p>您的信息仅用于：处理订单、发货通知、客户服务、以及法律要求的用途。</p>
            <h2 className="text-xl font-bold mt-8">信息保护</h2>
            <p>我们采用业界标准的加密和安全措施保护您的数据。支付信息由 Stripe/PayPal 直接处理，我们不会存储您的信用卡信息。</p>
            <h2 className="text-xl font-bold mt-8">Cookie</h2>
            <p>我们使用必要的 Cookie 来维持购物车和登录状态。您可以在浏览器中管理 Cookie 设置。</p>
            <h2 className="text-xl font-bold mt-8">联系我们</h2>
            <p>如有隐私相关问题，请联系 support@oniii.com</p>
          </>
        ) : (
          <>
            <p>oniii values your privacy. This policy explains how we collect, use, and protect your personal information.</p>
            <h2 className="text-xl font-bold mt-8">Information Collection</h2>
            <p>We collect: your name, email, shipping address, phone number, and other information necessary for order fulfillment.</p>
            <h2 className="text-xl font-bold mt-8">Information Usage</h2>
            <p>Your information is used solely for: order processing, shipping notifications, customer service, and legal compliance.</p>
            <h2 className="text-xl font-bold mt-8">Data Protection</h2>
            <p>We use industry-standard encryption and security measures. Payment data is processed directly by Stripe/PayPal - we never store your credit card information.</p>
            <h2 className="text-xl font-bold mt-8">Cookies</h2>
            <p>We use essential cookies to maintain cart and login state. You can manage cookie settings in your browser.</p>
            <h2 className="text-xl font-bold mt-8">Contact</h2>
            <p>For privacy-related questions, contact support@oniii.com</p>
          </>
        )}
      </div>
    </div>
  );
}
