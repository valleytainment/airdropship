// ai_dropship_frontend/src/app/(storefront)/order-confirmation/[orderId]/page.tsx

import { notFound } from 'next/navigation'
import { Order } from '@/types'

interface PageProps {
  params: { orderId: string }
}

// Pull in your API URL from env
const baseUrl = process.env.NEXT_PUBLIC_API_URL

// 1️⃣ Generate the list of pages to export
export async function generateStaticParams() {
  if (!baseUrl) return []  // no API URL → no pages

  const res = await fetch(`${baseUrl}/orders`)
  if (!res.ok) return []
  const orders: { orderId: string }[] = await res.json()
  return orders.map((o) => ({ orderId: o.orderId }))
}

export default async function OrderConfirmation({ params }: PageProps) {
  const { orderId } = params

  if (!baseUrl) {
    // If API URL is missing in local dev, fallback to 404
    return notFound()
  }

  // 2️⃣ Fetch the order data
  const res = await fetch(`${baseUrl}/orders/${orderId}`)
  if (!res.ok) {
    if (res.status === 404) return notFound()
    throw new Error('Failed to load order')
  }
  const order: Order = await res.json()

  // 3️⃣ Render the confirmation UI
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p>Your order number is <strong>{order.id}</strong>.</p>
      <p>Total: <strong>${order.total.toFixed(2)}</strong></p>
      {/* Add more details here as needed */}
    </div>
  )
}
