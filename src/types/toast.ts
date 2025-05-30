// src/types/toast.ts

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  timestamp: Date
}

// Input type for addToast - excludes id and timestamp (handled internally)
export type ToastInput = Omit<Toast, 'id' | 'timestamp'>

export interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: ToastInput) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

export interface ToastConfig {
  maxToasts?: number
  defaultDuration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}