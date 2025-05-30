// src/components/toast/ToastItem.tsx

import React, { useState, useEffect } from 'react'
import { Toast } from '../../types/toast'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-500/10'
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-red-500/10'
      case 'warning':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-amber-500/10'
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-500/10'
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-gray-500/10'
    }
  }

  const getIconColor = () => {
    switch (toast.type) {
      case 'success': return 'text-emerald-500'
      case 'error': return 'text-red-500'
      case 'warning': return 'text-amber-500'
      case 'info': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getTextColor = () => {
    switch (toast.type) {
      case 'success': return 'text-emerald-800'
      case 'error': return 'text-red-800'
      case 'warning': return 'text-amber-800'
      case 'info': return 'text-blue-800'
      default: return 'text-gray-800'
    }
  }

  const getIcon = () => {
    const iconClass = `w-4 h-4 ${getIconColor()}`
    switch (toast.type) {
      case 'success':
        return (
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'info':
        return (
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        shadow-xl rounded-xl border backdrop-blur-sm p-4 ${getToastStyles()}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${getTextColor()}`}>
            {toast.title}
          </p>
          {toast.message && (
            <p className={`text-sm mt-1 opacity-80 ${getTextColor()}`}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}