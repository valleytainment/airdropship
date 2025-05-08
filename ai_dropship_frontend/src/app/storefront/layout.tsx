// src/app/storefront/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import NavigationBar from "@/components/layout/NavigationBar"; // Changed from Header to NavigationBar
import Footer from "@/components/layout/Footer"
import { cn } from "@/lib/utils"

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
          <NavigationBar /> {/* Changed from <Header /> to <NavigationBar /> */}
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

