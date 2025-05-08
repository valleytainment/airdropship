
// app/components/Tracking.tsx
// Implements Vercel Analytics and Facebook Pixel tracking as per the launch package.

"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react"; // For Vercel Analytics

// Placeholder for Facebook Pixel ID and Google Analytics ID
// These should be configured via environment variables for security and flexibility.
const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export default function Tracking() {
  useEffect(() => {
    // Facebook Pixel Initialization
    if (FACEBOOK_PIXEL_ID) {
      import("react-facebook-pixel")
        .then((module) => {
          const ReactPixel = module.default; // Access default export
          ReactPixel.init(FACEBOOK_PIXEL_ID, undefined, { // Pass undefined for advancedMatching, options as 3rd arg
            autoConfig: true,
            debug: process.env.NODE_ENV !== "production", // Enable debug mode in development
          });
          ReactPixel.pageView(); // Track page view on component mount
        })
        .catch((err) => console.error("Failed to load Facebook Pixel:", err));
    }

    // Google Analytics (gtag.js) Initialization
    // The launch package mentions window.gtag, implying gtag.js is loaded elsewhere (e.g., via a script tag in _document or layout)
    // or needs to be loaded dynamically here if not.
    // For a self-contained component, we should ensure gtag is available or load the script.
    // However, the provided snippet just calls window.gtag directly.
    // We will assume gtag.js is loaded globally as per the snippet.
    if (GOOGLE_ANALYTICS_ID && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", GOOGLE_ANALYTICS_ID, {
        page_path: window.location.pathname,
      });
    } else if (GOOGLE_ANALYTICS_ID) {
      console.warn("Google Analytics gtag function not found, or G_ANALYTICS_ID not set. GA will not be initialized by Tracking.tsx.");
      // To make it self-contained, you might load the GA script here:
      // const script = document.createElement('script');
      // script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
      // script.async = true;
      // document.head.appendChild(script);
      // script.onload = () => {
      //   window.dataLayer = window.dataLayer || [];
      //   function gtag(){dataLayer.push(arguments);}
      //   gtag('js', new Date());
      //   gtag('config', GOOGLE_ANALYTICS_ID);
      // };
    }

  }, []); // Empty dependency array ensures this runs once on mount

  // Vercel Analytics component is straightforward
  return <Analytics />;
}

// Remember to install react-facebook-pixel and @vercel/analytics
// pnpm add react-facebook-pixel @vercel/analytics

// Also, ensure NEXT_PUBLIC_FACEBOOK_PIXEL_ID and NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
// are set in your .env.local and Netlify environment variables.

