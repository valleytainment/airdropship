// src/app/polyfill.ts

// Make sure `window.matchMedia` exists in both Node (SSR) and browser:
declare global {
  var window: any;
}

// If running on server, create a fake window:
if (typeof window === "undefined") {
  ;(global as any).window = {}  
}

// Provide a no-op matchMedia:
if (typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    addListener: () => {},        // legacy
    removeListener: () => {},     // legacy
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })
}
