import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientErrorBoundaryWrapper from "@/components/ClientErrorBoundaryWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Dropship Store - Your Premier AI-Powered Dropshipping Solution",
  description: "Discover unique products and seamless shopping with AI Dropship Store, your innovative partner for AI-curated dropshipping items. Shop smart, shop AI.",
  keywords: "AI dropshipping, e-commerce, online store, unique products, automated shopping, tech gadgets, fashion, home goods",
  authors: [{ name: "AI Dropship Team" }],
  // Add Open Graph tags for better social media sharing
  openGraph: {
    title: "AI Dropship Store - AI-Powered Shopping",
    description: "Explore a new era of online shopping with AI-curated products at AI Dropship Store.",
    type: "website",
    // images: [ // TODO: Add a relevant image URL once available
    //   {
    //     url: "/og-image.png", // Replace with actual image path
    //     width: 1200,
    //     height: 630,
    //     alt: "AI Dropship Store - Innovative Shopping",
    //   },
    // ],
  },
  // Add Twitter card tags for better Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "AI Dropship Store - AI-Powered Shopping",
    description: "Explore a new era of online shopping with AI-curated products at AI Dropship Store.",
    // images: ["/twitter-image.png"], // TODO: Replace with actual image path
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000", // Example theme color, can be adjusted
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <ClientErrorBoundaryWrapper>{children}</ClientErrorBoundaryWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

