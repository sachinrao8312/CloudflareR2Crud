// src/components/toast/useToast.ts
'use client'

import { useState, useCallback, useEffect, createContext, useContext } from 'react'
import { Toast, ToastInput, ToastContextType, ToastConfig } from '../../types/toast'

const defaultConfig: Required<ToastConfig> = {
  maxToasts: 5,
  defaultDuration: 5000,
  position: 'top-right'
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const useToastState = (config: ToastConfig = {}) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const mergedConfig = { ...defaultConfig, ...config }

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: ToastInput) => {
    const id = generateId()
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: new Date(),
      duration: toast.duration || mergedConfig.defaultDuration
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      // Limit the number of toasts
      return updated.slice(0, mergedConfig.maxToasts)
    })

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }, [generateId, mergedConfig.defaultDuration, mergedConfig.maxToasts, removeToast])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Cleanup toasts on unmount
  useEffect(() => {
    return () => {
      setToasts([])
    }
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    config: mergedConfig
  }
}

// Convenience functions for common toast types
export const useToastHelpers = () => {
  const { addToast } = useToast()

  const showSuccess = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const showError = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 7000 }) // Errors stay longer
  }, [addToast])

  const showWarning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }, [addToast])

  const showInfo = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export { ToastContext }