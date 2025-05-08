
'use client';

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-md">
      <h2 className="text-lg font-bold text-red-800 dark:text-red-200">Application Error</h2>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">Something went wrong with the application.</p>
      {error.message && (
        <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-800 p-2 rounded-md overflow-x-auto">
          {error.message}
        </pre>
      )}
      {error.digest && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-500">Error Digest: {error.digest}</p>
      )}
      <button 
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Try again
      </button>
    </div>
  );
}

