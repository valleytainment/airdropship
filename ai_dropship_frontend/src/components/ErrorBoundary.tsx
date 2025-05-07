
'use client';
import { Component, ReactNode } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any | null;
}

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorState
> {
  state: ErrorState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Also update state to include errorInfo for display
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render a more detailed fallback UI
      return (
        <div style={{ padding: '20px', border: '1px solid red', margin: '20px' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or contact support if the issue persists.</p>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary>Error Details</summary>
              <p><strong>Message:</strong> {this.state.error.toString()}</p>
              {this.state.error.stack && (
                <p><strong>Stack Trace:</strong><br />{this.state.error.stack}</p>
              )}
            </details>
          )}
          {this.state.errorInfo && this.state.errorInfo.componentStack && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary>Component Stack</summary>
              <p>{this.state.errorInfo.componentStack}</p>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

