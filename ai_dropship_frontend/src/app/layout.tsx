import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed from Geist/Geist_Mono to Inter
import "./globals.css";
import { Providers } from "./Providers"; // Import the client component for context
import Navbar from "@/components/Navbar"; // Import the Navbar component
import Footer from "@/components/Footer"; // Import the Footer component
import ClientErrorBoundaryWrapper from "@/components/ClientErrorBoundaryWrapper";

// Define Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define a CSS variable for Inter
});

// Metadata can now be exported correctly as this is a Server Component
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
      {/* Apply the Inter font variable to the body */}
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        {/* Providers wrap everything that needs context */}
        <Providers>
          {/* Navbar and Footer are outside the main error boundary */}
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {/* Wrap the main page content with the ClientErrorBoundaryWrapper */}
            <ClientErrorBoundaryWrapper>{children}</ClientErrorBoundaryWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

