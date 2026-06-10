import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { cnyToUsd } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
      reviews: {
        where: { status: "approved" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product || product.status !== "published") notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: "published" },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    take: 4,
  });

  const priceUsd = product.priceUsd || cnyToUsd(product.price);
  const compareAtUsd = product.compareAt ? cnyToUsd(product.compareAt) : null;
  const discountPercent = compareAtUsd ? Math.round(((compareAtUsd - priceUsd) / compareAtUsd) * 100) : 0;
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-[var(--accent)]">{t("common.home")}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/search`} className="hover:text-[var(--accent)]">{t("common.shop")}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/search?category=${product.category.slug}`} className="hover:text-[var(--accent)]">
          {locale === "zh" ? product.category.name : product.category.nameEn}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.nameEn || product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
            {product.images[0] ? (
              <img src={product.images[0].url} alt={product.nameEn} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img) => (
                <div key={img.id} className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img src={img.url} alt={img.alt || product.nameEn} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
            {locale === "zh" ? product.category.name : product.category.nameEn}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {locale === "zh" ? product.name : product.nameEn}
          </h1>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>{star <= Math.round(avgRating) ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[var(--accent)]">${priceUsd.toFixed(2)}</span>
            {compareAtUsd && (
              <span className="text-lg text-gray-400 line-through">${compareAtUsd.toFixed(2)}</span>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">-{discountPercent}%</span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-sm text-gray-600 mb-6 leading-relaxed">
            <p>{locale === "zh" ? product.description : product.descriptionEn}</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {product.material && (
              <div className="flex gap-2">
                <span className="text-gray-400">{t("products.material")}:</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex gap-2">
                <span className="text-gray-400">{t("products.dimensions")}:</span>
                <span className="font-medium">{product.dimensions}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-gray-400">{t("products.weight")}:</span>
              <span className="font-medium">{product.weight}g</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">{t("products.origin")}:</span>
              <span className="font-medium">China 🇨🇳</span>
            </div>
            {product.sku && (
              <div className="flex gap-2 col-span-2">
                <span className="text-gray-400">{t("products.sku")}:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-6">
            {product.stock > 10 ? (
              <span className="text-green-600 text-sm flex items-center gap-1">🟢 {t("common.inStock")}</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500 text-sm flex items-center gap-1">🟠 {locale === "zh" ? `仅剩 ${product.stock} 件` : `Only ${product.stock} left`}</span>
            ) : (
              <span className="text-red-500 text-sm flex items-center gap-1">🔴 {t("common.outOfStock")}</span>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton
            product={{
              id: product.id,
              nameEn: product.nameEn || product.name,
              priceUsd,
              image: product.images[0]?.url || "",
              weight: product.weight,
            }}
            locale={locale}
          />
        </div>
      </div>

      {/* Tabs: Description + Reviews */}
      <div className="mt-16">
        <div className="border-b mb-8">
          <h2 className="text-xl font-bold pb-3 border-b-2 border-[var(--accent)] inline-block">
            {t("products.description")}
          </h2>
        </div>
        <div className="prose max-w-3xl text-gray-600 leading-relaxed">
          <p>{locale === "zh" ? product.description : product.descriptionEn}</p>
        </div>

        {product.reviews.length > 0 && (
          <>
            <div className="border-b mt-12 mb-8">
              <h2 className="text-xl font-bold pb-3 border-b-2 border-[var(--accent)] inline-block">
                {t("products.reviews")} ({product.reviews.length})
              </h2>
            </div>
            <div className="space-y-6 max-w-3xl">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-white p-5 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.user?.name || "Anonymous"}</span>
                    <div className="text-yellow-400 text-sm">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                  {review.content && <p className="text-sm text-gray-600">{review.content}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">{t("products.relatedProducts")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCardWrapper key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCardWrapper({ product, locale }: { product: any; locale: string }) {
  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all">
        <div className="aspect-square bg-gray-50">
          {product.images[0] ? (
            <img src={product.images[0].url} alt={product.nameEn} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-1">{product.category?.nameEn}</p>
          <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-[var(--accent)]">{product.nameEn}</h3>
          <span className="font-bold text-[var(--primary)]">
            ${(product.priceUsd || cnyToUsd(product.price)).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
