// src/lib/hooks/useCart.tsx
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, ProductPublic as Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  _recalculateTotals: (items: CartItem[]) => void; // Add this line
}

// Helper function to safely access localStorage only on the client side
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Recalculate totals whenever items change
      _recalculateTotals: (items: CartItem[]) => {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ totalItems, totalPrice });
      },

      addItem: (product, quantity) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id
          );
          let newItems;
          if (existingItemIndex > -1) {
            // Update quantity if item exists
            newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            newItems = [
              ...state.items,
              { ...product, quantity }, // Add quantity field
            ];
          }
          get()._recalculateTotals(newItems); // Update totals
          return { items: newItems };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId);
          get()._recalculateTotals(newItems); // Update totals
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is zero or less
            const newItems = state.items.filter((item) => item.id !== productId);
            get()._recalculateTotals(newItems); // Update totals
            return { items: newItems };
          } else {
            // Update quantity
            const newItems = state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            );
            get()._recalculateTotals(newItems); // Update totals
            return { items: newItems };
          }
        });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => safeLocalStorage), // Use safeLocalStorage wrapper
      // Load totals after hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._recalculateTotals(state.items);
        }
      },
    }
  )
);
