import Link from "next/link";
import { prisma } from "@/lib/db";
import { cnyToUsd } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import ProductCard from "@/components/product/ProductCard";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale });

  const query = sp.q || "";
  const categorySlug = sp.category || "";
  const sort = sp.sort || "newest";

  const where: any = { status: "published" };
  if (query) {
    where.OR = [
      { nameEn: { contains: query } },
      { descriptionEn: { contains: query } },
      { name: { contains: query } },
    ];
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const orderBy: any =
    sort === "price_asc"
      ? { priceUsd: "asc" as const }
      : sort === "price_desc"
      ? { priceUsd: "desc" as const }
      : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy,
    take: 50,
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
  });

  const mappedProducts = products.map((p) => ({
    id: p.id,
    nameEn: p.nameEn || p.name,
    slug: p.slug,
    priceUsd: p.priceUsd || cnyToUsd(p.price),
    compareAt: p.compareAt ? (p.priceUsd ? cnyToUsd(p.compareAt) : null) : null,
    images: p.images,
    category: p.category,
    stock: p.stock,
    weight: p.weight,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Results for "${query}"` : t("products.title")}
        </h1>
        <p className="text-gray-500 text-sm">
          {products.length} {locale === "zh" ? "件商品" : "products found"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-3 text-gray-500 uppercase tracking-wide">
              {t("common.categories")}
            </h3>
            <div className="space-y-1">
              <Link
                href={`/${locale}/search`}
                className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                  !categorySlug
                    ? "bg-[var(--accent)] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t("common.all")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/search?category=${cat.slug}`}
                  className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                    categorySlug === cat.slug
                      ? "bg-[var(--accent)] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {locale === "zh" ? cat.name : cat.nameEn}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-end mb-6 gap-2">
            <span className="text-xs text-gray-400">{t("products.sortBy")}:</span>
            {[
              { value: "newest", label: t("products.sortNewest") },
              { value: "price_asc", label: t("products.sortPriceLow") },
              { value: "price_desc", label: t("products.sortPriceHigh") },
            ].map((opt) => {
              const href = `/${locale}/search?${new URLSearchParams({ ...sp, sort: opt.value } as any).toString()}`;
              return (
                <Link
                  key={opt.value}
                  href={href}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    sort === opt.value
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">{t("common.noResults")}</h3>
              <p className="text-gray-400 text-sm">
                {locale === "zh" ? "尝试其他关键词或浏览分类" : "Try different keywords or browse categories"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {mappedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
