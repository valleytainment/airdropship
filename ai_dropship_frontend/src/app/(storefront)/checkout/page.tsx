// Add this import at the top
import Link from 'next/link';

// Replace the problematic JSX
// Change this:
<a href="/products/">Continue Shopping</a>

// To this:
<Link href="/products/" className="text-blue-600 hover:underline">
  Continue Shopping
</Link>

// Update the payment intent function
interface PaymentIntentData {
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  customerEmail: string;
}

async function createPaymentIntent(data: PaymentIntentData) {
  // ... existing implementation
}