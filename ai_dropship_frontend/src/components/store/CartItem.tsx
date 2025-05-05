// src/components/store/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/lib/stores/cart"; // Import CartItem type from zustand store
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
// import { useCart } from "@/lib/hooks/useCart"; // Remove old hook import
import { useCartStore } from "@/lib/stores/cart"; // Import the zustand store
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  className?: string;
}

const CartItemComponent = ({ item, className }: CartItemProps) => {
  // Use functions from the zustand store
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    // Update quantity using the item ID
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, newQuantity); // Use item.id (string)
    }
  };

  const handleRemove = () => {
    removeItem(item.id); // Use item.id (string)
  };

  return (
    <div className={cn("flex items-start space-x-4 py-4 border-b dark:border-gray-700", className)}>
      {/* Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border dark:border-gray-700 bg-muted dark:bg-gray-800">
        {item.image ? (
          <Image
            src={item.image.split(",")[0]} // Use the first image if multiple
            alt={item.name}
            fill
            sizes="4rem"
            className="object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-muted-foreground dark:text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/products/${item.slug}`} className="line-clamp-1 font-medium text-gray-900 dark:text-white hover:underline">
          {item.name}
        </Link>
        <span className="text-sm text-muted-foreground dark:text-gray-400">
          {formatPrice(item.price)}
        </span>
        {/* Quantity Input */}
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="number"
            min="0" // Allow 0 to remove via input
            value={item.quantity}
            onChange={handleQuantityChange}
            className="h-8 w-16 text-center border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded"
            aria-label={`Quantity for ${item.name}`}
          />
        </div>
      </div>

      {/* Price & Remove Button */}
      <div className="flex flex-col items-end space-y-1">
         <span className="font-medium text-gray-900 dark:text-white">
            {formatPrice(item.price * item.quantity)}
         </span>
         <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground dark:text-gray-400 hover:text-destructive dark:hover:text-red-500"
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
};

export default CartItemComponent;

