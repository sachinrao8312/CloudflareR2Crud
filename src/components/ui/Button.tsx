// src/components/ui/Button.tsx

import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ComponentType<{ className?: string }>
  darkMode?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  children, 
  onClick, 
  className = '',
  type = 'button',
  icon: Icon,
  darkMode = true
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 focus:ring-orange-500",
    secondary: darkMode 
      ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-600 focus:ring-gray-500 focus:ring-offset-black" 
      : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:border-gray-400 focus:ring-gray-500 focus:ring-offset-gray-50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 focus:ring-red-500",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:ring-emerald-500",
    ghost: darkMode 
      ? "text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-500 hover:shadow-lg focus:ring-offset-black" 
      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500 hover:shadow-lg focus:ring-offset-gray-50"
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  // Set ring offset based on theme
  const ringOffsetClass = darkMode 
    ? (variant === 'secondary' || variant === 'ghost' ? 'focus:ring-offset-black' : 'focus:ring-offset-black')
    : (variant === 'secondary' || variant === 'ghost' ? 'focus:ring-offset-gray-50' : 'focus:ring-offset-white')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${ringOffsetClass} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {Icon && !loading && <Icon className="w-4 h-4 mr-2" />}
      <span className={loading && !Icon ? 'ml-2' : ''}>{children}</span>
    </button>
  )
}