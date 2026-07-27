import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "oniii terms of service. Read the terms and conditions governing your use of our website and services.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">
        {isZh ? "服务条款" : "Terms of Service"}
      </h1>

      <div className="prose max-w-none text-gray-700 space-y-6">
        {isZh ? (
          <>
            <p>最后更新日期：2026 年 6 月 11 日</p>

            <p>欢迎使用 oniii（以下简称"本网站"）。使用本网站即表示您同意以下服务条款。请仔细阅读。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">一、服务说明</h2>
            <p>oniii 是一家面向全球消费者的跨境电商平台，致力于将优质中国商品销往世界各地。通过本网站，您可以浏览、购买商品并享受国际物流配送服务。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">二、账户注册</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>您需要提供准确、完整的注册信息</li>
              <li>您有责任保管好账户密码，因账户泄露造成的损失由您自行承担</li>
              <li>每位用户仅可注册一个账户</li>
              <li>禁止转让、出售或出借账户</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">三、订单与价格</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>所有商品价格以美元（USD）标示，结算时以实际支付金额为准</li>
              <li>商品价格和库存可能随时变动，恕不另行通知</li>
              <li>下单后，我们将在确认库存后处理您的订单</li>
              <li>若商品缺货，我们将全额退款并通知您</li>
              <li>我们保留拒绝或取消任何订单的权利</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">四、支付</h2>
            <p>我们支持以下支付方式：Stripe（信用卡）、PayPal。所有支付均通过安全的第三方支付网关处理，我们不存储您的信用卡信息。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">五、物流配送</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>商品从中国发货，配送至全球大部分国家和地区</li>
              <li>预计配送时间为 7-21 个工作日（视目的地而定）</li>
              <li>关税和进口税由收件人承担（如适用）</li>
              <li>详细运费规则请参阅物流政策页面</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">六、知识产权</h2>
            <p>本网站所有内容（包括文字、图片、标志、设计）版权归 oniii 所有，未经授权不得复制、转载或用于商业用途。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">七、免责声明</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>本网站尽可能保证商品信息准确，但不保证完全无误</li>
              <li>因不可抗力（自然灾害、战争、疫情等）导致的延迟或损失，我们不承担责任</li>
              <li>您应遵守所在国家/地区的法律法规</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">八、条款变更</h2>
            <p>我们保留随时修改本服务条款的权利，修改后的条款自发布之日起生效。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">九、联系方式</h2>
            <p>邮箱：support@oniii.com</p>
          </>
        ) : (
          <>
            <p>Last updated: June 11, 2026</p>

            <p>Welcome to oniii (the "Site"). By using this Site, you agree to the following terms of service. Please read carefully.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Service Description</h2>
            <p>oniii is a cross-border e-commerce platform dedicated to bringing quality Chinese products to customers worldwide. Through this Site, you can browse, purchase products, and enjoy international shipping services.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for safeguarding your account password. Any losses due to account compromise are your responsibility</li>
              <li>Each user may only register one account</li>
              <li>Accounts may not be transferred, sold, or lent</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Orders & Pricing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are displayed in USD; the actual charge amount at checkout applies</li>
              <li>Product prices and availability are subject to change without notice</li>
              <li>After placing an order, we will process it upon confirming stock availability</li>
              <li>If a product is out of stock, we will issue a full refund and notify you</li>
              <li>We reserve the right to refuse or cancel any order</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">4. Payment</h2>
            <p>We support the following payment methods: Stripe (credit card) and PayPal. All payments are processed through secure third-party payment gateways. We do not store your credit card information.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">5. Shipping & Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Products ship from China to most countries and regions worldwide</li>
              <li>Estimated delivery time: 7-21 business days (depending on destination)</li>
              <li>Customs duties and import taxes are the responsibility of the recipient (if applicable)</li>
              <li>For detailed shipping rules, please refer to our Shipping Policy page</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">6. Intellectual Property</h2>
            <p>All content on this Site (including text, images, logos, and designs) is copyrighted by oniii. Unauthorized reproduction, redistribution, or commercial use is prohibited.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">7. Disclaimer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We strive to ensure product information is accurate but do not guarantee it is error-free</li>
              <li>We are not liable for delays or losses caused by force majeure (natural disasters, war, pandemics, etc.)</li>
              <li>You must comply with the laws and regulations of your country/region</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Modified terms take effect upon publication.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">9. Contact</h2>
            <p>Email: support@oniii.com</p>
          </>
        )}
      </div>
    </div>
  );
}
