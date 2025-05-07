"use client";

// This component (src/components/ui/toaster.tsx) appears to be a shadcn/ui style Toaster.
// However, the project's useToast hook (src/hooks/use-toast.ts) is based on the 'sonner' library,
// which provides a 'notify' function and expects 'sonner's own <Toaster /> component for rendering.
// The 'sonner' useToast hook does NOT provide a 'toasts' array.
// To fix the build error (Property 'toasts' does not exist), this component is modified
// to not attempt to use a 'toasts' array from the incompatible hook.
// This means this specific Toaster component will not render individual toasts via its own mapping logic.
// Actual toast rendering should be handled by 'sonner's <Toaster /> component,
// typically placed in the root layout (e.g., layout.tsx or Providers.tsx).

import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";

// The useToast hook from "@/hooks/use-toast" is not imported here because
// its return value ({ notify }) is not directly used by this simplified Toaster structure,
// and attempting to use it as if it provided a 'toasts' array was the source of the error.

export function Toaster() {
  return (
    <ToastProvider>
      {/* The original mapping logic over a 'toasts' array has been removed 
          as 'toasts' is not provided by the project's current useToast hook from "@/hooks/use-toast.ts". 
          This component will now render the ToastProvider and ToastViewport only. */}
      <ToastViewport />
    </ToastProvider>
  );
}

