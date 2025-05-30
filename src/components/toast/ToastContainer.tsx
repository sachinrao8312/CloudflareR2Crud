// src/components/toast/ToastContainer.tsx

import React from 'react'
import { Toast } from '../../types/toast'
import { EnhancedToastItem } from './ToastItem'

interface EnhancedToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
  darkMode?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export const EnhancedToastContainer: React.FC<EnhancedToastContainerProps> = ({ 
  toasts, 
  onRemove,
  darkMode = true,
  position = 'top-right'
}) => {
  if (toasts.length === 0) return null

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6'
      case 'top-center':
        return 'top-6 left-1/2 transform -translate-x-1/2'
      case 'top-right':
        return 'top-6 right-6'
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2'
      case 'bottom-right':
        return 'bottom-6 right-6'
      default:
        return 'top-6 right-6'
    }
  }

  const getStackDirection = () => {
    return position.includes('bottom') ? 'flex-col-reverse' : 'flex-col'
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full pointer-events-none`}>
      <div className={`flex ${getStackDirection()} space-y-4`}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * 4}px) scale(${1 - index * 0.05})`,
              zIndex: toasts.length - index,
              opacity: Math.max(1 - index * 0.1, 0.3)
            }}
          >
            <EnhancedToastItem 
              toast={toast} 
              onRemove={onRemove} 
              darkMode={darkMode} 
            />
          </div>
        ))}
      </div>
      
      {/* Toast Count Indicator */}
      {toasts.length > 1 && (
        <div className={`
          mt-4 text-center pointer-events-none
          ${darkMode ? 'text-gray-400' : 'text-gray-600'}
        `}>
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
            ${darkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-600'}
            backdrop-blur-sm border
            ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}
          `}>
            {toasts.length} notification{toasts.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedToastContainer