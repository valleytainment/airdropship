"'use client';

import { Component, ReactNode } from 'react';

interface ErrorState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

