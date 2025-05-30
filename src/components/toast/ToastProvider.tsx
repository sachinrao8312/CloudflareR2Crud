// src/componenets/toast/ToastProvider.tsx

'use client'

import React, { ReactNode } from 'react'
import { ToastContext, useToastState } from './useToast'
import { ToastConfig } from '../../types/toast'

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
    </ToastContext.Provider>
  )
}



