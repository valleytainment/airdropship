// Simplified imports
'use client';
import { useState, useEffect } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { formatPrice } from '@/lib/utils';

export function ClientProductPage({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      <AddToCartButton 
        productId={product.id} 
        quantity={quantity}
        className="w-full"
      />
    </div>
  );
}