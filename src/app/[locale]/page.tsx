import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { cnyToUsd } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import OniiiLogo from "@/components/OniiiLogo";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const recent = await prisma.product.findMany({
    where: { status: "published" },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  // Get featured products; if not enough, fill with best-discount products
  const featuredProducts = await prisma.product.findMany({
    where: { status: "published", featured: true },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    take: 8,
  });

  let featured = featuredProducts;
  if (featured.length < 4) {
    // Fill with products that have the best discounts
    const fillCount = 8 - featured.length;
    const excludeIds = featured.map((p) => p.id);
    const discounted = await prisma.product.findMany({
      where: { status: "published", id: { notIn: excludeIds }, compareAt: { not: null } },
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
      take: fillCount,
    });
    featured = [...featured, ...discounted];
  }

  // Only show categories that have published products
  const allCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: { 
      products: {
        where: { status: "published" }
      }
    },
    take: 8,
  });
  
  // Filter to only show categories with at least one published product
  const categories = allCategories.filter(cat => cat.products.length > 0);

  const mappedProducts = (list: typeof recent) =>
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
          <div className="max-w-3xl">
            {/* Brand Logo */}
            <OniiiLogo size={40} showText={false} className="mb-8" />
            
            {/* Tagline */}
            <h1 className="text-sm font-medium text-white/80 uppercase tracking-[0.3em] mb-2">
              {t("home.heroTagline1")}
            </h1>
            <p className="text-sm font-medium text-white/70 uppercase tracking-[0.2em] mb-8">
              {t("home.heroTagline2")}
            </p>

            <Link
              href={`/${locale}/search`}
              className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              {t("home.heroCta")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Trust badges */}
            <div className="flex gap-8 mt-12 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {t("home.categories")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
                   cat.slug.includes("food") ? "🍵" :
                   cat.slug.includes("beauty") ? "💄" :
                   cat.slug.includes("sport") ? "⚽" : cat.slug.includes("cigar") ? "🚬" : "📦"}
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
          {mappedProducts(recent.slice(0, 8)).map((p) => (
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
