// src/app/(storefront)/products/[slug]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import apiClient from "@/lib/apiClient";
import type { Metadata } from "next";
import type { Product } from "@/types";

// 1️⃣ Pre-render all product slugs
export async function generateStaticParams(): Promise<
  { slug: string }[]
> {
  // For static export, we cannot pre-render dynamic product slugs without knowing them at build time.
  // Return a dummy param to satisfy Next.js export requirements.
  // The page component should handle cases where the dummy ID doesn't fetch real data (e.g., show notFound).
  if (process.env.CI === 'true' || process.env.NODE_ENV === 'production') {
    return [{ slug: 'dummy-product' }]; // Provide a dummy param for static export
  }

  // In development or other environments, try fetching products (may still fail if backend isn't running)
  try {
    const { data: products } = await apiClient.get<Product[]>("/products");
    // Ensure products is an array before mapping
    if (Array.isArray(products)) {
        return products.map((p) => ({ slug: p.id }));
    } else {
        console.warn("Fetched products is not an array:", products);
        return [{ slug: 'dummy-product' }]; // Fallback if API response is unexpected
    }
  } catch (error) {
    console.warn("Failed to fetch products for generateStaticParams:", error);
    return [{ slug: 'dummy-product' }]; // Fallback to dummy param on error
  }
}

// 2️⃣ Generate per-page metadata asynchronously
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Product ${slug}`,
    description: `Details for product ${slug}`,
  };
}

// 3️⃣ Async page component handling Promise<params>
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product;
  try {
    const res = await apiClient.get<Product>(`/products/${slug}`);
    product = res.data;
  } catch {
    return notFound();
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <Image
        src={product.image_url}
        alt={product.title}
        width={600}
        height={400}
        className="rounded-lg object-cover"
      />
      <p className="mt-4 text-lg">{product.description}</p>
      <p className="mt-2 text-xl font-semibold">
        ${(product.price / 100).toFixed(2)}
      </p>
    </div>
  );
}
