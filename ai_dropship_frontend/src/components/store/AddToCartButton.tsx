// src/components/store/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { ProductPublic } from "@/types"; // Use the shared ProductPublic type
// import { useCart } from "@/lib/hooks/useCart"; // Remove old hook import
import { useCartStore } from "@/lib/stores/cart"; // Import the new zustand store
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast"; // Optional

interface AddToCartButtonProps {
  product: ProductPublic; // Use ProductPublic type
  quantity?: number; // Allow specifying quantity, default to 1
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const AddToCartButton = ({
  product,
  quantity = 1, // Default quantity is 1
  className,
  variant = "default",
  size = "default",
}: AddToCartButtonProps) => {
  // Use the addItem function from the zustand store
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  // const { toast } = useToast(); // Optional

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      // Add the item multiple times if quantity > 1
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      // Optional: Show success toast
      // toast({ title: "Added to cart", description: `${quantity} x ${product.title}` });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optional: Show error toast
      // toast({ variant: "destructive", title: "Error", description: "Failed to add item to cart." });
    } finally {
      // Add a slight delay to show loading state if desired
      setTimeout(() => setIsAdding(false), 300);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={className}
      variant={variant}
      size={size}
      aria-label={`Add ${product.name} to cart`}
    >
      {isAdding ? (
        <span className="animate-pulse">Adding...</span>
      ) : (
        <>
          {size !== "icon" && <ShoppingCart className="mr-2 h-4 w-4" />}
          {size === "icon" ? <ShoppingCart className="h-4 w-4" /> : "Add to Cart"}
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;

