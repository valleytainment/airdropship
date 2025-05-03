"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddToCartButton from "@/components/store/AddToCartButton";
import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types"; // Assuming types are defined

// Helper function to fetch product data
async function getProductData(productId: string): Promise<ProductPublic | null> {
  try {
    const response = await apiClient.get(`/products/storefront/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}

// 1	Pre-render product pages for static export
export async function generateStaticParams() {
    try {
      // Fetch a list of products to get their IDs for pre-rendering
      const response = await apiClient.get("/products/storefront", { params: { limit: 50 } }); // Fetch IDs for first 50 products
      const products: ProductPublic[] = response.data.products || [];
      return products.map((product) => ({
        slug: product.internal_id.toString(), // Use internal_id as the slug param
      }));
    } catch (error) {
      console.error("Failed to fetch product slugs for static generation:", error);
      // Fallback if API fails during build
      return [{ slug: "1" }]; // Example fallback
    }
}


export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<ProductPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.slug) return;
      try {
        setLoading(true);
        const data = await getProductData(params.slug);
        if (data) {
          setProduct(data);
          setSelectedImage(data.images?.split(",")[0] || "/placeholder-image.jpg"); // Set initial image
          setError(null);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading product...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  if (!product) {
    // This case should ideally be covered by the error state
    return <div className="container mx-auto px-4 py-8 text-center">Product not found.</div>;
  }

  const productImages = product.images?.split(",") || ["/placeholder-image.jpg"];
  const currentImageUrl = selectedImage || productImages[0];

  // Basic parsing for variants (assuming simple structure like [{ "name": "Color", "options": ["Red", "Blue"] }])
  let variants: { name: string; options: string[] }[] = [];
  if (product.variants) {
    try {
      variants = JSON.parse(product.variants);
    } catch (e) {
      console.error("Failed to parse product variants:", e);
      // Handle malformed JSON, maybe show an error or ignore variants
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          {/* Use ai_description if available, otherwise fallback to description */}
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
    </div>
  );
}

