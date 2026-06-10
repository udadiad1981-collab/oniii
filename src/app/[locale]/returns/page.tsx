import { getTranslations } from "next-intl/server";

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">
        {isZh ? "退换货政策" : "Returns & Refunds Policy"}
      </h1>

      <div className="prose max-w-none text-gray-700 space-y-6">
        {isZh ? (
          <>
            <p>oniii 致力于为全球客户提供优质的中国商品和完善的售后服务。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">一、退换货条件</h2>
            <h3 className="font-semibold">可退换的情况：</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>商品质量问题：收到商品存在明显瑕疵、损坏或与描述严重不符</li>
              <li>错发商品：收到的商品与订单不符</li>
              <li>运输损坏：商品在运输过程中损坏（需提供开箱照片/视频）</li>
            </ul>

            <h3 className="font-semibold mt-4">不可退换的情况：</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>因个人原因（颜色不喜欢、尺寸不合适、改变主意等）</li>
              <li>商品已被使用、清洗或改动</li>
              <li>原始包装、标签、配件缺失</li>
              <li>食品类、内衣类等特殊商品（出于卫生安全考虑）</li>
              <li>购买后超过 14 天的订单</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">二、退换货流程</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>在收到商品后 14 天内，发送邮件至 support@oniii.com，注明订单号和退换原因</li>
              <li>客服在 1-2 个工作日内审核并回复</li>
              <li>审核通过后，将商品寄回指定地址</li>
              <li>质量问题/错发：我们承担退货运费，全额退款或重新发货</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4">三、退款</h2>
            <p>退款将在收到退回商品后 3-5 个工作日内处理，原路返回。</p>

            <h2 className="text-xl font-bold mt-8 mb-4">四、联系客服</h2>
            <p>邮箱：support@oniii.com | 响应时间：24 小时内</p>
          </>
        ) : (
          <>
            <p>oniii is committed to providing quality Chinese products and excellent after-sales service to customers worldwide.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Return/Exchange Conditions</h2>
            <h3 className="font-semibold">Eligible for return/exchange:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Quality issues: obvious defects, damage, or significant discrepancy from description</li>
              <li>Wrong item: received product differs from order</li>
              <li>Shipping damage: product damaged during transit (unboxing photo/video required)</li>
            </ul>

            <h3 className="font-semibold mt-4">Not eligible:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal reasons (color preference, size issues, change of mind)</li>
              <li>Products that have been used, washed, or altered</li>
              <li>Missing original packaging, tags, or accessories</li>
              <li>Food items, underwear, and other hygiene-sensitive products</li>
              <li>Orders beyond 14 days from delivery</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Return/Exchange Process</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Email support@oniii.com within 14 days of delivery with order number and reason</li>
              <li>Our team reviews and responds within 1-2 business days</li>
              <li>Once approved, ship the item to our designated return address</li>
              <li>For quality/wrong item issues: we cover return shipping, full refund or reship</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Refunds</h2>
            <p>Refunds are processed within 3-5 business days after receiving the returned item. Refunds go back to the original payment method.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">4. Contact</h2>
            <p>Email: support@oniii.com | Response time: within 24 hours</p>
          </>
        )}
      </div>
    </div>
  );
}
