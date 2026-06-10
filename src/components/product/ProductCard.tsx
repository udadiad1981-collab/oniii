"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCartStore, type CartProduct } from "@/store/cart";

interface ProductCardProps {
  product: {
    id: string;
    nameEn: string;
    slug: string;
    priceUsd: number;
    compareAt: number | null;
    images: { url: string; alt?: string | null }[];
    category?: { nameEn: string };
    stock: number;
    weight: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const image = product.images?.[0]?.url || "/placeholder.png";
  const hasDiscount = product.compareAt && product.compareAt > product.priceUsd;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAt! - product.priceUsd) / product.compareAt!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartProduct: CartProduct = {
      id: product.id,
      nameEn: product.nameEn,
      priceUsd: product.priceUsd,
      image,
      weight: product.weight,
    };
    addItem(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            {product.images?.[0] ? (
              <img
                src={image}
                alt={product.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="text-6xl">📦</div>
            )}
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-0.5 rounded">
                -{discountPercent}%
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                {locale === "zh" ? `仅剩${product.stock}件` : `Only ${product.stock} left`}
              </span>
            )}
          </div>
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className={`absolute bottom-2 right-2 p-2 rounded-full shadow-md transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-[var(--accent)] hover:text-white"
              }`}
              aria-label="Add to cart"
            >
              {added ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              )}
            </button>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.category?.nameEn || ""}
          </p>
          <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-[var(--accent)] transition-colors">
            {product.nameEn}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[var(--primary)]">
              ${product.priceUsd.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.compareAt!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
