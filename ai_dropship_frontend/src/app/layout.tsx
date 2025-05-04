"use client"; // Add this because CartProvider uses useState

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext'; // Import CartProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

// Metadata might need adjustment if layout becomes client component, 
// but basic title/description should be fine.
export const metadata: Metadata = {
  title: 'AI Dropship Store',
  description: 'Your AI-powered dropshipping solution'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap the children with CartProvider */}
        <CartProvider>
          {/* TODO: Add Navbar component here later */}
          {children}
          {/* TODO: Add Footer component here later */}
        </CartProvider>
      </body>
    </html>
  );
}

