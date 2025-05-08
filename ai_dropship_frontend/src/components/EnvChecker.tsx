
"use client";

import { useEffect } from "react";

export default function EnvChecker() {
  useEffect(() => {
    // Check for essential public environment variables
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("Configuration Error: Missing NEXT_PUBLIC_API_URL!");
      // Optionally alert the user or log to a monitoring service
      // alert("Configuration error - please contact support.");
    }
    // Add checks for other critical NEXT_PUBLIC_ variables if needed
    // if (!process.env.NEXT_PUBLIC_STRIPE_KEY) {
    //   console.error("Configuration Error: Missing NEXT_PUBLIC_STRIPE_KEY!");
    // }
  }, []);

  // This component does not render anything
  return null;
}

