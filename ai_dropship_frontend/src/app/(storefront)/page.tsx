// This is a Server Component

import { ProductPublic } from "@/types";
import { mockProducts } from "@/data/products"; // Import mock products
// Remove direct import of next/image
import Link from "next/link"; // Import Link for basic navigation
import { formatPrice } from "@/lib/utils"; // Import formatPrice
import ProductImage from "@/components/ProductImage"; // Import the new client component

// Fetch data server-side (using mock data directly for static export)
async function getProducts(): Promise<ProductPublic[]> {
  console.log("Using mock products for minimal static homepage generation.");
  const mappedMockProducts = mockProducts.map(p => ({
    ...p,
    id: p.id,
    internal_id: parseInt(p.id, 10),
    slug: p.slug || p.id,
    category: "Mock Category",
    supplier_internal_id: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
  })) as ProductPublic[];
  return mappedMockProducts;
}

export default async function StoreHomePage() {
  const products = await getProducts();

  // Corrected return statement without extra parentheses
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Featured Products</h1>
      
      {/* Render products directly as basic HTML/Next components */}
      {products.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">No products to display.</div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
              <Link href={`/products/${product.slug}`} className="cursor-pointer">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  {/* Use the ProductImage client component */}
                  <ProductImage
                    src={product.image?.split(",")[0] || "/placeholder-image.jpg"}
                    alt={product.name}
                    width={300} // Provide explicit width
                    height={300} // Provide explicit height
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    unoptimized // Ensure image is not optimized
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {/* Corrected Link syntax */}
                  <Link href={`/products/${product.slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <div className="flex flex-1 flex-col justify-end">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
                </div>
              </div>
              {/* Remove Add to Cart button to eliminate client-side dependency */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

