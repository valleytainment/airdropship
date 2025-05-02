// src/components/store/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  className?: string;
}

const CartItemComponent = ({ item, className }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(item.product_id, newQuantity);
    }
  };

  return (
    <div className={cn("flex items-start space-x-4 py-4", className)}>
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-muted">
        {item.product.image_url ? (
          <Image
            src={item.product.image_url}
            alt={item.product.title}
            fill
            sizes="(max-width: 768px) 20vw, 10vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/products/${item.product_id}`} className="line-clamp-1 font-medium hover:underline">
          {item.product.title}
        </Link>
        <span className="text-sm text-muted-foreground">
          {formatPrice(item.price_per_unit)}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="number"
            min="0" // Allow 0 to remove via input
            value={item.quantity}
            onChange={handleQuantityChange}
            className="h-8 w-16 text-center"
            aria-label={`Quantity for ${item.product.title}`}
          />
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
         <span className="font-medium">
            {formatPrice(item.price_per_unit * item.quantity)}
         </span>
         <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => removeFromCart(item.product_id)}
            aria-label={`Remove ${item.product.title} from cart`}
          >
            <X className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
};

export default CartItemComponent;

