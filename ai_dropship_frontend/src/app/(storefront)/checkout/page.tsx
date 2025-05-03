// src/app/(storefront)/checkout/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import apiClient from "@/lib/apiClient";
import type { CartItem } from "@/types";

export default async function CheckoutPage() {
  let items: CartItem[];

  try {
    const response = await apiClient.get<CartItem[]>("/cart");
    items = response.data;
  } catch {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>${(item.price / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link href="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
