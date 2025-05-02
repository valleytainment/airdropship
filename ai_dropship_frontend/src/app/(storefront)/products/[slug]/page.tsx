// page.tsx  (no "use client" at the top)

import { notFound } from "next/navigation";
import ClientProductPage from "./ClientProductPage";
import { Product } from "@/types";
import apiClient from "@/lib/apiClient";

interface PageProps {
  params: { slug: string };
}

// 1) Tell Next.js which slugs to export at build time
export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`
  );
  const products: { slug: string }[] = await res.json();
  return products.map((p) => ({ slug: p.slug }));
}

// 2) Server component: fetch the data
export default async function ProductPage({ params }: PageProps) {
  const product = await apiClient
    .get<Product>(`/products/storefront/${params.slug}`)
    .then((r) => r.data)
    .catch((e) => {
      if (e.response?.status === 404) return null;
      throw e;
    });

  if (!product) return notFound();

  // 3) Render your client UI
  return (
    <div className="container mx-auto px-4 py-8">
      <ClientProductPage product={product} />
    </div>
  );
}
