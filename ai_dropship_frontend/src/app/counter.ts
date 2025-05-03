// Remove unused headersList
export function incrementCounter() {
  const counter = Number(localStorage.getItem('counter') || 0);
  localStorage.setItem('counter', String(counter + 1));
  return counter + 1;
}