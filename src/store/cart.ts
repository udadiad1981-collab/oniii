import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  nameEn: string;
  priceUsd: number;
  image: string;
  weight: number;
  variantName?: string;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
  getTotalWeight: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (sum, i) => sum + i.product.priceUsd * i.quantity,
          0
        );
      },
      getSubtotal: () => {
        return get().items.reduce(
          (sum, i) => sum + i.product.priceUsd * i.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      getTotalWeight: () => {
        return get().items.reduce(
          (sum, i) => sum + i.product.weight * i.quantity,
          0
        );
      },
    }),
    { name: "oniii-cart" }
  )
);
