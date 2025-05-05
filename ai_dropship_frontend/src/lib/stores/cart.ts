import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { ProductPublic } from '@/types';

// Define a safe storage implementation that handles SSR
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        const value = localStorage.getItem(name);
        return value;
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${name}”:`, error);
    }
    // Return null if localStorage is not available or an error occurs
    return null;
  },
  setItem: (name, value) => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(name, value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${name}”:`, error);
    }
  },
  removeItem: (name) => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(name);
      }
    } catch (error) {
      console.error(`Error removing localStorage key “${name}”:`, error);
    }
  },
};

export interface CartItem extends ProductPublic {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: ProductPublic) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        } else {
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
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
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0), // Added fallback for price
    }),
    {
      name: 'cart-storage',
      // Use the safeLocalStorage implementation
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

