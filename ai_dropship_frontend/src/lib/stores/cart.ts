import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProductPublic } from '@/types'; // Assuming ProductPublic is the correct type

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
          // Increase quantity if item already exists
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
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
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
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

