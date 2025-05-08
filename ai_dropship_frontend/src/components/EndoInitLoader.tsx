
'use client';

import { useEffect } from 'react';

/**
 * This component ensures that @endo/init (SES lockdown)
 * is loaded only on the client-side and after initial hydration,
 * to prevent potential conflicts with React's server-side rendering
 * or hydration process, as suggested by audits.
 */
export default function EndoInitLoader() {
  useEffect(() => {
    // Dynamically import @endo/init only on the client side.
    // The .catch(console.error) is to handle potential import errors gracefully.
    import('@endo/init').catch(error => {
      console.error('Failed to load @endo/init:', error);
    });
  }, []);

  // This component does not render any UI itself.
  return null;
}

