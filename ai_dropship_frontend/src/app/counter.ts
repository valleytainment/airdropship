// src/app/counter.ts

// IMPORTANT: This file uses localStorage and should only be imported
// and used within client components or useEffect hooks.

// 1) Store a simple log in memory (reset on page reload)
const incrementLog: Array<{ value: number; at: string }> = [];

/**
 * Increment the persisted counter by 1.
 * @returns the new counter value
 */
export function incrementCounter(): number {
  if (typeof window === 'undefined') {
    console.warn("localStorage is not available during SSR/SSG. Cannot increment counter.");
    return 0; // Return a default value or handle appropriately
  }
  const current = Number(localStorage.getItem('counter') || 0);
  const next = current + 1;
  localStorage.setItem('counter', String(next));
  return next;
}

/**
 * Return the current counter value and the history of increments.
 */
export function getStats() {
  let current = 0;
  if (typeof window !== 'undefined') {
    current = Number(localStorage.getItem('counter') || 0);
  }
  return {
    count: current,
    log: [...incrementLog],
  };
}

/**
 * Increment the counter and record the event in an in‑memory log.
 * @returns the new counter value
 */
export function incrementAndLog(): number {
  const newValue = incrementCounter(); // This now handles SSR check internally
  incrementLog.push({
    value: newValue,
    at: new Date().toISOString(),
  });
  return newValue;
}
