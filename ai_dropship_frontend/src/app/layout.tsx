import type { Metadata } from "next";
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
  title: "AI Dropship Store",
  description: "Your AI-powered dropshipping solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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

