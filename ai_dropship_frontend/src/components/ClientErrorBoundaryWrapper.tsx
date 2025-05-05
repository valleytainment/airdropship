"'use client';

import ErrorBoundary from './ErrorBoundary';
import React from 'react';

// This component acts as a client-side wrapper for the ErrorBoundary
// It can be safely imported into Server Components like the RootLayout
export default function ClientErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

