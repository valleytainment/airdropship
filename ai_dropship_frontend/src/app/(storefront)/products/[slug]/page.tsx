// This is now a Server Component - NO "use client" here!
import { notFound } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types";
import ProductDetailClient from "@/components/store/ProductDetailClient"; // Import the client component

// Fetch all product IDs for static generation
export async function generateStaticParams() {
  // Mock data for build process - Replace with API call when backend is live
  console.log("Using mock slugs for generateStaticParams during build.");
  return [
    { slug: "1" },
    { slug: "2" },
    { slug: "3" },
  ];
}

// Fetch data for a specific product (Server-side)
async function getProductData(slug: string): Promise<ProductPublic | null> {
  const isBuild = process.env.NODE_ENV === "production";

  if (isBuild && !process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn(
      `Build environment detected and no API URL set. Cannot fetch product data for slug: ${slug}. Returning mock data.`
    );
    if (["1", "2", "3"].includes(slug)) {
      return {
        id: slug,
        slug: slug,
        internal_id: parseInt(slug, 10),
        title: `Mock Product ${slug}`,
        name: `Mock Product ${slug}`,
        description: "This is mock data used during the build process.",
        ai_description: "AI description not available during build.",
        image: "/placeholder-product.jpg",
        images: "/placeholder-product.jpg",
        price: 9999,
        current_retail_price: 99.99,
        variants: "[]",
        stock_level: 10,
      };
    }
    return null;
  }

  try {
    const response = await apiClient.get(`/products/storefront/${slug}`);
    return response.data as ProductPublic;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    if ((error as any).response?.status === 404) {
      return null;
    }
    return null;
  }
}

// The Page component itself (Server Component)
// Reverting to standard async signature with explicit type for params
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const slug: string = params.slug;
  const product = await getProductData(slug);

  if (!product) {
    notFound(); // Trigger 404 page if product not found or fetch failed
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pass product data to the Client Component */}
      <ProductDetailClient product={product} />
    </div>
  );
}

