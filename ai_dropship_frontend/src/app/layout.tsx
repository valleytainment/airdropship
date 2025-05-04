import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers'; // Import the client component for context
import Navbar from '@/components/Navbar'; // Import the Navbar component
import Footer from '@/components/Footer'; // Import the Footer component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

// Metadata can now be exported correctly as this is a Server Component
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <Providers>
          <Navbar /> {/* Add Navbar here */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer /> {/* Add Footer here */}
        </Providers>
      </body>
    </html>
  );
}

