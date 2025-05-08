export const setupPolyfills = (global: Window & typeof globalThis) => {
  if (typeof global.matchMedia !== 'function') {
    global.matchMedia = () => ({
      matches: false,
      media: '',
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    });
  }
};