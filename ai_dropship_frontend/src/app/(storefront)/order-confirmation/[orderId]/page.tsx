// src/app/(storefront)/order-confirmation/[orderId]/page.tsx

import { notFound } from 'next/navigation'
import { Order } from '@/types'
import apiClient from '@/lib/apiClient'

interface PageProps {
  params: { orderId: string }
}

// Pull in your API URL, or undefined if not set
const baseUrl = process.env.NEXT_PUBLIC_API_URL

// 1️⃣ If there’s no API URL, we can’t build any static pages:
export async function generateStaticParams() {
  if (!baseUrl) return []  // ⇒ avoids fetch(undefined + '/orders')

  const res = await fetch(`${baseUrl}/orders`)
  if (!res.ok) {
    return []
  }
  const orders: { orderId: string }[] = await res.json()
  return orders.map((o) => ({ orderId: o.orderId }))
}

export default async function OrderConfirmation({ params }: PageProps) {
  const { orderId } = params

  // 2️⃣ Fetch the specific order
  let order: Order | null = null
  try {
    // You can still use apiClient if it’s pointed at baseUrl,
    // or you can fetch directly:
    const response = await fetch(`${baseUrl}/orders/${orderId}`)
    if (!response.ok) {
      if (response.status === 404) {
        return notFound()
      }
      throw new Error('Failed to load order')
    }
    order = await response.json()
  } catch (e) {
    return notFound()
  }

  // 3️⃣ Render your confirmation
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p>
        Your order number is <strong>{order.id}</strong>.
      </p>
      <p>
        Total: <strong>${order.total.toFixed(2)}</strong>
      </p>
    </div>
  )
}
