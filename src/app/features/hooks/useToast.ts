import * as React from "react"
import type { ToastProps } from "../../components/ui/toast"

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback(({ description, ...props }: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    
    setToasts((prevToasts) => [...prevToasts, { id, description, ...props }])

    const timeout = setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      toastTimeouts.delete(id)
    }, 5000)

    toastTimeouts.set(id, timeout)

    return () => {
      clearTimeout(toastTimeouts.get(id))
      toastTimeouts.delete(id)
    }
  }, [])

  return { toast, toasts }
}
