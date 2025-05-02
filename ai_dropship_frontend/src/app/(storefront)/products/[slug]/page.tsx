// src/app/(storefront)/products/[slug]/page.tsx
"use client"; // Mark as client component for state/hooks

import { Suspense, useState } from "react"; // Added useState
import { notFound } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddToCartButton from "@/components/store/AddToCartButton"; // Import AddToCartButton
// import VariantSelector from "@/components/store/VariantSelector";
import { Input } from "@/components/ui/input"; // Keep Input for quantity

interface ProductPageProps {
  params: {
    slug: string; // Assuming slug is the product ID for simplicity
  };
}

// Keep getProduct as a server-side fetch function if possible, or move to client-side hook
// For simplicity here, assuming it's fetched server-side initially or via a hook
async function getProduct(productId: string): Promise<Product | null> {
  try {
    // NOTE: Calling apiClient directly in Server Component might not work as expected.
    // Consider fetching in a client component with useEffect or using Server Actions / Route Handlers.
    // This example assumes it works or is adapted.
    const response = await apiClient.get(`/products/storefront/${productId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // Product not found
    }
    console.error(`Failed to fetch product ${productId}:`, error);
    throw new Error(`Failed to load product ${productId}`);
  }
}

// Component to render the product details (needs to be client for state)
function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(1); // Or handle empty input differently
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div>
        <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-lg border bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Product Info & Actions */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.title}</h1>
        <div className="text-2xl font-semibold">{formatPrice(product.price)}</div>

        {/* Variant Selection Placeholder */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Options (Placeholder)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Option 1</Button>
            <Button variant="outline" size="sm">Option 2</Button>
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            className="w-20"
            aria-label="Quantity"
          />
          <AddToCartButton product={product} quantity={quantity} size="lg" />
        </div>

        {/* Description / Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {product.description || "No description available."}
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <p className="text-sm text-muted-foreground">Category: {product.category || 'N/A'}<br />Tags: {product.tags || 'N/A'}</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Main page component (can remain async if fetching data here)
export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.slug;
  // Fetch product data server-side or pass ID to client component
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Use Suspense if ProductDetails needs client-side fetching */}
      <Suspense fallback={<div>Loading product...</div>}>
         <ProductDetails product={product} />
      </Suspense>

      {/* Related Products Section Placeholder */}
      {/* <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">You Might Also Like</h2>
        <ProductGrid products={[]} /> // Fetch related products
      </section> */}
    </div>
  );
}

