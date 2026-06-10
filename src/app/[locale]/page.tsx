import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { cnyToUsd } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const products = await prisma.product.findMany({
    where: { status: "published" },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const recent = products.slice(0, 8);

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    take: 6,
  });

  const mappedProducts = (list: typeof products) =>
    list.map((p) => ({
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
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--accent)] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {t("home.heroSubtitle")}
            </p>
            <Link
              href={`/${locale}/search`}
              className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105"
            >
              {t("home.heroCta")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {t("home.categories")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/search?category=${cat.slug}`}
                className="group bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg hover:border-[var(--accent)] transition-all"
              >
                <div className="text-4xl mb-3">
                  {cat.slug.includes("electron") ? "📱" :
                   cat.slug.includes("cloth") ? "👕" :
                   cat.slug.includes("home") ? "🏠" :
                   cat.slug.includes("handicraft") ? "🎨" :
                   cat.slug.includes("food") ? "🍵" : "📦"}
                </div>
                <h3 className="font-medium text-sm text-gray-700 group-hover:text-[var(--accent)] transition-colors">
                  {locale === "zh" ? cat.name : cat.nameEn}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              {t("home.featuredTitle")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {mappedProducts(featured).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            {t("home.newArrivals")}
          </h2>
          <Link
            href={`/${locale}/search`}
            className="text-[var(--accent)] hover:underline font-medium text-sm"
          >
            {t("common.viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mappedProducts(recent).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t("home.whyUs")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "✅", title: t("home.whyUs1_title"), desc: t("home.whyUs1_desc") },
              { icon: "🌍", title: t("home.whyUs2_title"), desc: t("home.whyUs2_desc") },
              { icon: "🔒", title: t("home.whyUs3_title"), desc: t("home.whyUs3_desc") },
              { icon: "💬", title: t("home.whyUs4_title"), desc: t("home.whyUs4_desc") },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
