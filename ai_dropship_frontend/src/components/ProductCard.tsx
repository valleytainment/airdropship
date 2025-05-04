import { useCart } from '@/context/CartContext';

// Define the product type based on usage in the component
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  // Add other properties if needed, e.g., description
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="product-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Use a placeholder or actual image path */}
      <img 
        src={product.image || '/placeholder-product.jpg'} 
        alt={product.name} 
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
      {/* Ensure the product object passed to addToCart matches the expected type */}
      <button 
        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })} 
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}

