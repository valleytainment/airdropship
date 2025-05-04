import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers'; // Import the new client component

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap the children with the Providers client component */}
        <Providers>
          {/* TODO: Add Navbar component here later */}
          {children}
          {/* TODO: Add Footer component here later */}
        </Providers>
      </body>
    </html>
  );
}

