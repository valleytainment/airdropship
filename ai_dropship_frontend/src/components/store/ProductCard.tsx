"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductPublic } from "@/types"; // Assuming types are defined
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: ProductPublic;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use a placeholder image if imageUrl is missing or invalid
  const imageUrl = product.images?.split(',')[0] || "/placeholder-image.jpg"; // Get first image or placeholder

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <Link href={`/products/${product.internal_id}`} legacyBehavior> 
        <a className="block relative w-full aspect-square">
          <Image
            src={imageUrl} 
            alt={product.title}
            layout="fill"
            objectFit="cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />
        </a>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1 truncate">
           <Link href={`/products/${product.internal_id}`} legacyBehavior>
             <a>{product.title}</a>
           </Link>
        </h3>
        <p className="text-gray-500 text-sm mb-2 flex-grow">{product.category || "Uncategorized"}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-xl">${product.current_retail_price?.toFixed(2) ?? 'N/A'}</span>
          {/* Pass the necessary product details for the cart */}
          <AddToCartButton product={{
             id: product.internal_id.toString(), // Ensure ID is string for cart hook
             name: product.title,
             price: product.current_retail_price ?? 0,
             imageUrl: imageUrl
          }} />
        </div>
      </div>
    </div>
  );
}

