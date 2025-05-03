"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/store/AddToCartButton";
import { ProductPublic } from "@/types";

interface ProductDetailClientProps {
  product: ProductPublic;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Initialize selectedImage when product data is available
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.split(",")[0] || "/placeholder-image.jpg");
    }
  }, [product]);

  if (!product) {
    // This should ideally not happen if data is fetched server-side
    // but provides a fallback
    return <div className="container mx-auto px-4 py-8 text-center">Product data not available.</div>;
  }

  const productImages = product.images?.split(",") || ["/placeholder-image.jpg"];
  const currentImageUrl = selectedImage || productImages[0];

  // Basic parsing for variants
  let variants: { name: string; options: string[] }[] = [];
  if (product.variants) {
    try {
      variants = JSON.parse(product.variants);
    } catch (e) {
      console.error("Failed to parse product variants:", e);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div>
        {/* Main Image */}
        <div className="mb-4 relative aspect-square">
          <Image
            src={currentImageUrl}
            alt={product.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            priority // Prioritize loading the main image
            onError={(e) => { e.currentTarget.src = "/placeholder-image.jpg"; }}
          />
        </div>
        {/* Thumbnails */}
        {productImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((img, index) => (
              <div key={index} className={`relative w-20 h-20 flex-shrink-0 border-2 ${img === selectedImage ? 'border-blue-500' : 'border-transparent'} hover:border-gray-400`}>
                 <Image
                  src={img}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => { e.currentTarget.src = "/placeholder-image.jpg"; }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-2xl text-gray-800 mb-4">${product.current_retail_price?.toFixed(2) ?? 'N/A'}</p>
        <p className="text-gray-600 mb-6">{product.ai_description || product.description || "No description available."}</p>

        {/* Variants */}
        {variants && variants.length > 0 && variants.map((variant, vIndex) => (
          <div key={vIndex} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{variant.name}</label>
            <div className="flex flex-wrap gap-2">
              {variant.options.map(option => (
                <Button key={option} variant="outline" size="sm">{option}</Button>
                // TODO: Add state management to handle variant selection
              ))}
            </div>
          </div>
        ))}

        {/* Add to Cart Button */}
        <AddToCartButton product={{
           id: product.internal_id.toString(),
           name: product.title,
           price: product.current_retail_price ?? 0,
           imageUrl: currentImageUrl
        }} />

      </div>
    </div>
  );
}

