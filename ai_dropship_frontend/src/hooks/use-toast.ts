import { toast } from "sonner"
import { useCallback } from "react"

export function useToast() {
  const notify = useCallback((message: string) => {
    toast(message)
  }, [])

  return { notify }
}
