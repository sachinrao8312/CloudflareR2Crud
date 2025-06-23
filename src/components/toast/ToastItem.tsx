// src/components/toast/ToastItem.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { Toast } from '../../types/toast'

interface EnhancedToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
  darkMode?: boolean
}

export const EnhancedToastItem: React.FC<EnhancedToastItemProps> = ({ 
  toast, 
  onRemove, 
  darkMode = true 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgGradient: 'from-emerald-500 to-green-600',
          borderColor: 'border-emerald-400/50',
          iconBg: 'bg-emerald-400/20',
          iconColor: 'text-emerald-100',
          textColor: 'text-emerald-50',
          secondaryText: 'text-emerald-100/80'
        }
      case 'error':
        return {
          icon: XCircle,
          bgGradient: 'from-red-500 to-red-600',
          borderColor: 'border-red-400/50',
          iconBg: 'bg-red-400/20',
          iconColor: 'text-red-100',
          textColor: 'text-red-50',
          secondaryText: 'text-red-100/80'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          bgGradient: 'from-amber-500 to-orange-600',
          borderColor: 'border-amber-400/50',
          iconBg: 'bg-amber-400/20',
          iconColor: 'text-amber-100',
          textColor: 'text-amber-50',
          secondaryText: 'text-amber-100/80'
        }
      case 'info':
        return {
          icon: Info,
          bgGradient: 'from-blue-500 to-indigo-600',
          borderColor: 'border-blue-400/50',
          iconBg: 'bg-blue-400/20',
          iconColor: 'text-blue-100',
          textColor: 'text-blue-50',
          secondaryText: 'text-blue-100/80'
        }
      default:
        return {
          icon: Info,
          bgGradient: 'from-gray-500 to-gray-600',
          borderColor: 'border-gray-400/50',
          iconBg: 'bg-gray-400/20',
          iconColor: 'text-gray-100',
          textColor: 'text-gray-50',
          secondaryText: 'text-gray-100/80'
        }
    }
  }

  const config = getToastConfig()
  const IconComponent = config.icon

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        bg-gradient-to-r ${config.bgGradient} 
        rounded-2xl shadow-2xl border-2 ${config.borderColor}
        backdrop-blur-xl p-6 max-w-sm w-full
        hover:scale-105 hover:shadow-3xl cursor-pointer
        relative overflow-hidden
      `}
      onClick={handleClose}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Sparkle Effect */}
      <div className="absolute top-2 right-2">
        <Sparkles className="w-4 h-4 text-white/60 animate-pulse" />
      </div>

      <div className="relative flex items-start space-x-4">
        {/* Enhanced Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${config.iconBg} flex items-center justify-center backdrop-blur-sm border border-white/20`}>
          <IconComponent className={`w-7 h-7 ${config.iconColor}`} />
        </div>
        
        {/* Enhanced Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-lg ${config.textColor} mb-1`}>
                {toast.title}
              </h4>
              {toast.message && (
                <p className={`text-sm ${config.secondaryText} leading-relaxed`}>
                  {toast.message}
                </p>
              )}
              
              {/* Timestamp */}
              <p className={`text-xs mt-2 ${config.secondaryText} opacity-75`}>
                {new Date(toast.timestamp).toLocaleTimeString()}
              </p>
            </div>
            
            {/* Enhanced Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
              className="ml-4 p-2 text-white/70 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar for Auto-dismiss */}
      {toast.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
          <div 
            className="h-full bg-white/40 transition-all ease-linear"
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`,
              width: '100%'
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

export default EnhancedToastItem