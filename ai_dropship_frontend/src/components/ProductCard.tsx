import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ProductPublic } from '@/types'; // Use the shared ProductPublic type
import ProductImage from './ProductImage'; // Import the optimized image component
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button is installed

interface ProductCardProps {
  product: ProductPublic;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Ensure the product object passed to addToCart matches the CartItem structure
  // Assuming CartItem needs id, name, price, and potentially image
  const handleAddToCart = () => {
    addToCart({
      id: product.id, // Use the actual product ID
      name: product.name,
      price: product.price,
      image: product.image, // Pass image if needed by cart
      quantity: 1 // Default quantity to add
    });
  };

  return (
    <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <Link href={`/products/${product.slug}`} className="cursor-pointer">
        <ProductImage src={product.image} alt={product.name} />
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          <Link href={`/products/${product.slug}">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        {/* Optional: Add description if available */}
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">{product.description}</p> */}
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-semibold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
         <Button 
            onClick={handleAddToCart} 
            variant="outline" 
            className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </Button>
      </div>
    </div>
  );
}

