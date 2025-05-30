// src/components/toast/ToastItem.tsx

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Toast } from '../../types/toast'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
  darkMode?: boolean
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, darkMode = true }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastStyles = () => {
    if (darkMode) {
      switch (toast.type) {
        case 'success':
          return 'bg-gray-900/95 border-gray-700'
        case 'error':
          return 'bg-gray-900/95 border-gray-700'
        case 'warning':
          return 'bg-gray-900/95 border-gray-700'
        case 'info':
          return 'bg-gray-900/95 border-gray-700'
        default:
          return 'bg-gray-900/95 border-gray-700'
      }
    } else {
      switch (toast.type) {
        case 'success':
          return 'bg-white/95 border-gray-200'
        case 'error':
          return 'bg-white/95 border-gray-200'
        case 'warning':
          return 'bg-white/95 border-gray-200'
        case 'info':
          return 'bg-white/95 border-gray-200'
        default:
          return 'bg-white/95 border-gray-200'
      }
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
    if (darkMode) {
      return 'text-gray-200'
    } else {
      return 'text-gray-900'
    }
  }

  const getSecondaryTextColor = () => {
    if (darkMode) {
      return 'text-gray-400'
    } else {
      return 'text-gray-600'
    }
  }

  const getIconBgColor = () => {
    if (darkMode) {
      switch (toast.type) {
        case 'success': return 'bg-emerald-900/50'
        case 'error': return 'bg-red-900/50'
        case 'warning': return 'bg-amber-900/50'
        case 'info': return 'bg-blue-900/50'
        default: return 'bg-gray-800/50'
      }
    } else {
      switch (toast.type) {
        case 'success': return 'bg-emerald-100'
        case 'error': return 'bg-red-100'
        case 'warning': return 'bg-amber-100'
        case 'info': return 'bg-blue-100'
        default: return 'bg-gray-100'
      }
    }
  }

  const getIcon = () => {
    const iconClass = `w-4 h-4 ${getIconColor()}`
    const bgClass = getIconBgColor()
    
    switch (toast.type) {
      case 'success':
        return (
          <div className={`w-6 h-6 ${bgClass} rounded-full flex items-center justify-center`}>
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className={`w-6 h-6 ${bgClass} rounded-full flex items-center justify-center`}>
            <X className={iconClass} />
          </div>
        )
      case 'warning':
        return (
          <div className={`w-6 h-6 ${bgClass} rounded-full flex items-center justify-center`}>
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'info':
        return (
          <div className={`w-6 h-6 ${bgClass} rounded-full flex items-center justify-center`}>
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
            <p className={`text-sm mt-1 opacity-80 ${getSecondaryTextColor()}`}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 transition-colors cursor-pointer rounded p-1 hover:scale-110 ${
            darkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}