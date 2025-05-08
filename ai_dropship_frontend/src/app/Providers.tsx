"use client";

// import { CartProvider } from '@/context/CartContext'; // Remove old context import

// This component can be used to wrap other client-side providers if needed in the future.
// For now, it just renders children as CartContext is replaced by zustand.
export function Providers({ children }: { children: React.ReactNode }) {
  // return <CartProvider>{children}</CartProvider>; // Remove CartProvider wrapper
  return <>{children}</>; // Render children directly
}

