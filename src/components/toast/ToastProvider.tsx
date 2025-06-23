// src/components/toast/ToastProvider.tsx

'use client'

import React, { ReactNode } from 'react'
import { ToastContext, useToastState } from './useToast'
import { ToastConfig } from '../../types/toast'
import { EnhancedToastContainer } from './ToastContainer'

interface ToastProviderProps {
  children: ReactNode
  config?: ToastConfig
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const toastState = useToastState(config)

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <EnhancedToastContainer 
        toasts={toastState.toasts}
        onRemove={toastState.removeToast}
        darkMode={true}
      />
    </ToastContext.Provider>
  )
}



