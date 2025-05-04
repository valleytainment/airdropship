import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react'; // Assuming lucide-react is installed
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
// import { useCart } from '@/context/CartContext'; // Import if showing cart count

export default function Navbar() {
  // const { cart } = useCart(); // Get cart to display item count
  // const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Optional: Add a logo here */}
              {/* <img className="h-8 w-auto" src="/logo.png" alt="AI Dropship Store Logo" /> */}
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AI Dropship Store</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
            {/* Navigation Links */}
            <Link href="/products" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
              Products
            </Link>
            {/* Add other links as needed */}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <ShoppingCart className="h-6 w-6" />
                {/* Optional: Add item count badge */}
                {/* {itemCount > 0 && ( <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"> {itemCount} </span> )} */}
              </Button>
            </Link>
            <Link href="/account">{/* Link to account/login page */}
              <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="h-6 w-6" />
              </Button>
            </Link>
            {/* Add mobile menu button here if needed */}
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on state */}
      {/* <div className="sm:hidden" id="mobile-menu"> <div className="pt-2 pb-3 space-y-1"> ... </div> </div> */}
    </nav>
  );
}

