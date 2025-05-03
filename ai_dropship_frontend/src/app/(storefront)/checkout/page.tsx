// src/app/(storefront)/checkout/page.tsx
import Link from 'next/link';                     // ➊
import { yourOtherImports } from '@/components';  // (whatever else you need)

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* … your checkout UI … */}

      {/* Proper Next.js Link for “Continue Shopping” ↓ */}
      <Link href="/products/" className="text-blue-600 hover:underline">
        Continue Shopping
      </Link>
    </div>
  )
}
