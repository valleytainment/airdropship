import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers'; // Import the client component for context
import Navbar from '@/components/Navbar'; // Import the Navbar component
import Footer from '@/components/Footer'; // Import the Footer component
// Import the ClientErrorBoundaryWrapper instead of ErrorBoundary directly - TEMP REMOVED
import ClientErrorBoundaryWrapper from '@/components/ClientErrorBoundaryWrapper'; 

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
        {/* Providers wrap everything that needs context */}
        <Providers>
          {/* Navbar and Footer are outside the main error boundary, assuming they are less likely to fail */}
          <Navbar /> 
          <main className="flex-grow container mx-auto px-4 py-8">
            {/* Wrap the main page content with the ClientErrorBoundaryWrapper */}
            <ClientErrorBoundaryWrapper>
              {children}
            </ClientErrorBoundaryWrapper>
          </main>
          <Footer /> 
        </Providers>
      </body>
    </html>
  );
}

