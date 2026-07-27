import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "oniii shipping policy. Learn about our shipping methods, delivery times, and rates for worldwide delivery from China.",
};

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">
        {isZh ? "物流政策" : "Shipping Policy"}
      </h1>

      <div className="prose max-w-none text-gray-700 space-y-6">
        {isZh ? (
          <>
            <p>最后更新日期：2026 年 6 月 11 日</p>

            <p>oniii 从中国发货，为全球客户提供国际配送服务。以下是我们的物流政策详情。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">一、发货地</h2>
            <p>所有商品均从中国仓库发货。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">二、配送区域</h2>
            <p>我们配送至全球大部分国家和地区，包括但不限于：美国、加拿大、英国、欧盟、澳大利亚、新西兰、日本、韩国、东南亚等。</p>
            <p>如不确定您的地区是否可配送，请联系 support@oniii.com 确认。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">三、处理时间</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>订单确认后 1-3 个工作日内发货</li>
              <li>节假日或促销期间可能略有延迟</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">四、配送时间</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">地区</th>
                  <th className="text-left py-2 pr-4">预计时间</th>
                  <th className="text-left py-2">物流方式</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">美国 / 加拿大</td>
                  <td className="py-2 pr-4">7-15 个工作日</td>
                  <td className="py-2">ePacket / 标准快递</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">英国 / 欧盟</td>
                  <td className="py-2 pr-4">10-20 个工作日</td>
                  <td className="py-2">ePacket / 标准快递</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">澳大利亚 / 新西兰</td>
                  <td className="py-2 pr-4">10-21 个工作日</td>
                  <td className="py-2">ePacket / 标准快递</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">亚洲（日韩东南亚）</td>
                  <td className="py-2 pr-4">5-12 个工作日</td>
                  <td className="py-2">标准快递</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">其他地区</td>
                  <td className="py-2 pr-4">15-30 个工作日</td>
                  <td className="py-2">标准快递</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-500">注：以上为预计时间，实际可能因海关清关、节假日等因素有所延迟。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">五、运费</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>满 $99 美元免运费</li>
              <li>不满 $99 美元，运费根据目的地和重量计算，结算时显示</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">六、关税与进口税</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>关税和进口税（如适用）由收件人承担</li>
              <li>不同国家/地区的关税政策不同，建议提前了解当地规定</li>
              <li>因收件人未缴纳关税导致退运的，运费不予退还</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">七、物流追踪</h2>
            <p>发货后，我们将通过邮件发送物流追踪号。您也可以在订单页面查看物流状态。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">八、丢件与损坏</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>包裹丢失：我们将联系物流公司调查，确认丢件后全额退款或重新发货</li>
              <li>运输损坏：请在收到包裹后 48 小时内拍照并发送至 support@oniii.com，我们将协助处理</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">九、联系方式</h2>
            <p>邮箱：support@oniii.com | 响应时间：24 小时内</p>
          </>
        ) : (
          <>
            <p>Last updated: June 11, 2026</p>

            <p>oniii ships from China to customers worldwide. Below are the details of our shipping policy.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Origin</h2>
            <p>All products ship from our warehouse in China.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Shipping Destinations</h2>
            <p>We ship to most countries and regions worldwide, including but not limited to: United States, Canada, United Kingdom, EU, Australia, New Zealand, Japan, South Korea, Southeast Asia, and more.</p>
            <p>If you're unsure whether we ship to your location, please contact support@oniii.com to confirm.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Processing Time</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders are processed and shipped within 1-3 business days</li>
              <li>Slight delays may occur during holidays or promotional periods</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">4. Delivery Time</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Region</th>
                  <th className="text-left py-2 pr-4">Estimated Time</th>
                  <th className="text-left py-2">Method</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4">USA / Canada</td>
                  <td className="py-2 pr-4">7-15 business days</td>
                  <td className="py-2">ePacket / Standard Express</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">UK / EU</td>
                  <td className="py-2 pr-4">10-20 business days</td>
                  <td className="py-2">ePacket / Standard Express</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Australia / New Zealand</td>
                  <td className="py-2 pr-4">10-21 business days</td>
                  <td className="py-2">ePacket / Standard Express</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Asia (JP/KR/SEA)</td>
                  <td className="py-2 pr-4">5-12 business days</td>
                  <td className="py-2">Standard Express</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Other Regions</td>
                  <td className="py-2 pr-4">15-30 business days</td>
                  <td className="py-2">Standard Express</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-500">Note: The above are estimated times. Actual delivery may vary due to customs clearance, holidays, and other factors.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">5. Shipping Rates</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Free shipping on orders over $99 USD</li>
              <li>For orders under $99 USD, shipping is calculated based on destination and weight, shown at checkout</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">6. Customs & Import Taxes</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Customs duties and import taxes (if applicable) are the responsibility of the recipient</li>
              <li>Different countries have different customs policies; we recommend checking local regulations</li>
              <li>If a package is returned due to unpaid customs fees, shipping costs are non-refundable</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">7. Order Tracking</h2>
            <p>After shipping, we will send a tracking number via email. You can also check the tracking status on your order page.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">8. Lost or Damaged Packages</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lost packages: We will contact the shipping carrier to investigate. Once confirmed lost, we will issue a full refund or reship</li>
              <li>Damaged packages: Please take photos within 48 hours of receipt and email them to support@oniii.com. We will assist with the claim</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">9. Contact</h2>
            <p>Email: support@oniii.com | Response time: within 24 hours</p>
          </>
        )}
      </div>
    </div>
  );
}
