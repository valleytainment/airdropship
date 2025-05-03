// src/app/(storefront)/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { cn } from "@/lib/utils"
// Removed: import { CartProvider } from "@/lib/hooks/useCart"
// Removed: <CartProvider> wrapper
// import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Dropship Store",
  description: "Discover amazing products curated by AI",
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        {/* <Toaster /> */}
      </body>
    </html>
  )
}
