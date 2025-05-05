import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductPublic } from '@/types';

// Define CartItem interface
export interface CartItem extends ProductPublic {
  quantity: number;
}

// Define CartState interface
interface CartState {
  items: CartItem[];
  addItem: (item: ProductPublic) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// Create the Zustand store with persist middleware
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], // Initial state
      // Action to add an item or increment quantity
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          // Increment quantity if item exists
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        } else {
          // Add new item with quantity 1
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }
      }),
      // Action to remove an item
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      // Action to update quantity (removes item if quantity <= 0)
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.id !== id) };
        } else {
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: quantity } : i
            ),
          };
        }
      }),
      // Action to clear the cart
      clearCart: () => set({ items: [] }),
      // Selector to get total number of items
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      // Selector to get total price
      totalPrice: () => get().items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
    }),
    {
      name: 'cart-storage', // Name of the item in storage
      // Explicitly use localStorage
      // Note: This assumes localStorage is available. Hydration errors might still occur
      // if this store is accessed server-side before client mount.
      // Using ClientOnly component around components that use this store is recommended.
      getStorage: () => typeof window !== 'undefined' ? localStorage : undefined,
      // Only persist the 'items' part of the state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

