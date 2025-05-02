// src/lib/hooks/useCart.ts
"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { Product, CartItem, CartItemCreate } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get cart from localStorage
const getInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const storedCart = localStorage.getItem("cart");
  try {
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product_id === product.id);
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          product_id: product.id,
          quantity,
          price_per_unit: product.price, // Store price at time of adding
          product: product, // Include full product details
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      );
      // Remove item if quantity is 0 or less
      return updatedItems.filter(item => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price_per_unit * item.quantity, 0);

  // Define the context value object separately
  // const contextValue = {
  //   cartItems,
  //   cartItemCount,
  //   cartTotal,
  //   addToCart,
  //   removeFromCart,
  //   updateQuantity,
  //   clearCart,
  // };

  // Try simplifying the value prop for debugging
  const simplifiedValue = { cartItems: [], cartItemCount: 0, cartTotal: 0, addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {} };

  return (
    // <CartContext.Provider value={{
    //     cartItems,
    //     cartItemCount,
    //     cartTotal,
    //     addToCart,
    //     removeFromCart,
    //     updateQuantity,
    //     clearCart,
    //   }}>
    <CartContext.Provider value={simplifiedValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

