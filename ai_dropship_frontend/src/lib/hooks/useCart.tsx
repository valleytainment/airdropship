// Simplified version keeping only used functionality
'use client';
import { create } from 'zustand';

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  addItem: (item) => 
    set((state) => ({ items: [...state.items, item] })),
}));