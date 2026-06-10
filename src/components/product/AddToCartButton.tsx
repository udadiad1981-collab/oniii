"use client";

import { useState } from "react";
import { useCartStore, type CartProduct } from "@/store/cart";

interface AddToCartButtonProps {
  product: CartProduct;
  locale: string;
}

export default function AddToCartButton({ product, locale }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-4 py-2 font-medium min-w-[40px] text-center">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        disabled={added}
        className={`flex-1 py-3 px-8 rounded-lg font-semibold transition-all ${
          added
            ? "bg-green-500 text-white"
            : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
        }`}
      >
        {added
          ? (locale === "zh" ? "✅ 已加入购物车" : "✅ Added to Cart")
          : (locale === "zh" ? "加入购物车" : "Add to Cart")}
      </button>
    </div>
  );
}
