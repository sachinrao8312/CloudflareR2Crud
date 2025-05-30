// src/components/toast/ToastContainer.tsx

import React from 'react'
import { Toast } from '../../types/toast'
import { ToastItem } from './ToastItem'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onRemove 
}) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}