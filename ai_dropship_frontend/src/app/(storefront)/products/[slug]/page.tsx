// This is now a Server Component by default (no 'use client')

import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types";
import ProductDetailClient from "@/components/store/ProductDetailClient"; // Import the new client component
import { notFound } from 'next/navigation';

// Helper function to fetch product data (can run on server)
async function getProductData(productId: string): Promise<ProductPublic | null> {
  try {
    // Use absolute URL if running during build time and apiClient uses relative path
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${baseUrl}/products/storefront/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache', // Cache data during build if possible
        next: { revalidate: 3600 } // Optional: Revalidate data periodically (e.g., every hour)
    });
    if (!response.ok) {
        if (response.status === 404) {
            return null; // Product not found
        }
        throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    const data: ProductPublic = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    // Decide how to handle fetch errors during build/render
    // Returning null will lead to a 404 page via notFound()
    return null;
  }
}

// generateStaticParams remains here for static generation
export async function generateStaticParams() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/products/storefront?limit=50`, { cache: 'force-cache' });
      if (!response.ok) {
          throw new Error(`Failed to fetch product list: ${response.statusText}`);
      }
      const data: { products: ProductPublic[] } = await response.json();
      const products = data.products || [];
      return products.map((product) => ({
        slug: product.internal_id.toString(),
      }));
    } catch (error) {
      console.error("Failed to fetch product slugs for static generation:", error);
      return [{ slug: "1" }]; // Example fallback
    }
}

// The main page component now fetches data on the server
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  if (!params.slug) {
    notFound(); // Use Next.js notFound for invalid params
  }

  const product = await getProductData(params.slug);

  if (!product) {
    notFound(); // Trigger 404 page if product data is null (fetch failed or product not found)
  }

  // Render the Client Component, passing the fetched data as props
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailClient product={product} />
    </div>
  );
}

// Optional: Add metadata generation
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: product.title,
    description: product.ai_description || product.description,
    // Add other metadata like openGraph images
    openGraph: {
        title: product.title,
        description: product.ai_description || product.description,
        images: product.images?.split(',')[0] ? [{ url: product.images.split(',')[0] }] : [],
    },
  };
}

