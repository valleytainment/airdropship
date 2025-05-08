"use client"; // This MUST be the very first line

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
  // TODO: Add state for selected variant options if needed

  // Initialize selectedImage when product data is available
  useEffect(() => {
    if (product) {
      // Use product.image directly if it's the primary image URL
      // Or parse product.images if it's a comma-separated list
      const images = product.image?.split(",") || [];
      setSelectedImage(images[0] || "/placeholder-image.jpg");
    }
  }, [product]);

  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">Product data not available.</div>;
  }

  // Use product.image directly or parse if it's a list
  const productImages = product.image?.split(",") || ["/placeholder-image.jpg"];
  const currentImageUrl = selectedImage || productImages[0];

  // Basic parsing for variants - Consider a more robust parsing or data structure
  let variants: { name: string; options: string[] }[] = [];
  // Assuming variants might be stored differently, adjust parsing as needed
  // if (product.variants) { ... } 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div>
        {/* Main Image */}
        <div className="mb-4 relative aspect-square overflow-hidden rounded-lg border dark:border-gray-700">
          <Image
            src={currentImageUrl}
            alt={product.name} // Use product.name
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw" // Simplified sizes
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
            priority // Prioritize loading the main image
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; }}
          />
        </div>
        {/* Thumbnails */}
        {productImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((img, index) => (
              <div 
                key={index} 
                className={`relative w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden cursor-pointer 
                           ${img === selectedImage ? 'border-blue-500' : 'border-transparent hover:border-gray-400 dark:hover:border-gray-600'}`}
                onClick={() => setSelectedImage(img)}
              >
                 <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill={true}
                  sizes="5rem"
                  style={{ objectFit: "cover" }}
                  className="transition-opacity duration-200 hover:opacity-80"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>
        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">${product.price?.toFixed(2) ?? 'N/A'}</p>
        {/* Use a dedicated component for rendering description if it can contain HTML */}
        <div 
          className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-6"
          dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
        />

        {/* Variants - Placeholder for future implementation */}
        {/* {Array.isArray(variants) && variants.length > 0 && ... } */}

        {/* Add to Cart Button - Pass the full product object */}
        <div className="mt-auto pt-6">
          <AddToCartButton 
            product={product} // Pass the whole product object
            className="w-full"
            size="lg"
          />
        </div>

      </div>
    </div>
  );
}

