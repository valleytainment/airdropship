'use client';
import { useState, useEffect } from 'react';

export default function HydrationSafe({ children }: React.PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return <>{children}</>;
}

