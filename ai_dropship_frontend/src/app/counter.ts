// src/app/counter.ts

// 1) Store a simple log in memory (reset on page reload)
const incrementLog: Array<{ value: number; at: string }> = [];

/**
 * Increment the persisted counter by 1.
 * @returns the new counter value
 */
export function incrementCounter(): number {
  const current = Number(localStorage.getItem('counter') || 0);
  const next = current + 1;
  localStorage.setItem('counter', String(next));
  return next;
}

/**
 * Return the current counter value and the history of increments.
 */
export function getStats() {
  const current = Number(localStorage.getItem('counter') || 0);
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
  const newValue = incrementCounter();
  incrementLog.push({
    value: newValue,
    at: new Date().toISOString(),
  });
  return newValue;
}
