// src/components/ui/FileIcon.tsx

import React from 'react'
import { 
  Folder, 
  Image, 
  Film, 
  Music, 
  FileText, 
  Code, 
  Archive, 
  BarChart3,
  Presentation,
  File,
  Sparkles
} from 'lucide-react'

interface EnhancedFileIconProps {
  type: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  animated?: boolean
}

export const EnhancedFileIcon: React.FC<EnhancedFileIconProps> = ({ 
  type, 
  size = 'md', 
  className = '',
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-2',
    md: 'w-12 h-12 p-3',
    lg: 'w-16 h-16 p-4', 
    xl: 'w-20 h-20 p-5',
    '2xl': 'w-24 h-24 p-6'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10', 
    '2xl': 'w-12 h-12'
  }

  const getIconConfig = () => {
    switch (type) {
      case 'folder':
        return {
          icon: Folder,
          gradient: 'from-blue-500 via-blue-600 to-indigo-600',
          shadow: 'shadow-blue-500/25',
          hoverShadow: 'hover:shadow-blue-500/40',
          sparkleColor: 'text-blue-300',
          borderColor: 'border-blue-400/30'
        }
      case 'image':
        return {
          icon: Image,
          gradient: 'from-emerald-500 via-green-600 to-teal-600',
          shadow: 'shadow-emerald-500/25',
          hoverShadow: 'hover:shadow-emerald-500/40',
          sparkleColor: 'text-emerald-300',
          borderColor: 'border-emerald-400/30'
        }
      case 'video':
        return {
          icon: Film,
          gradient: 'from-red-500 via-pink-600 to-rose-600',
          shadow: 'shadow-red-500/25',
          hoverShadow: 'hover:shadow-red-500/40',
          sparkleColor: 'text-red-300',
          borderColor: 'border-red-400/30'
        }
      case 'audio':
        return {
          icon: Music,
          gradient: 'from-purple-500 via-violet-600 to-indigo-600',
          shadow: 'shadow-purple-500/25',
          hoverShadow: 'hover:shadow-purple-500/40',
          sparkleColor: 'text-purple-300',
          borderColor: 'border-purple-400/30'
        }
      case 'document':
        return {
          icon: FileText,
          gradient: 'from-orange-500 via-amber-600 to-yellow-600',
          shadow: 'shadow-orange-500/25',
          hoverShadow: 'hover:shadow-orange-500/40',
          sparkleColor: 'text-orange-300',
          borderColor: 'border-orange-400/30'
        }
      case 'code':
        return {
          icon: Code,
          gradient: 'from-gray-600 via-slate-700 to-gray-800',
          shadow: 'shadow-gray-500/25',
          hoverShadow: 'hover:shadow-gray-500/40',
          sparkleColor: 'text-gray-300',
          borderColor: 'border-gray-400/30'
        }
      case 'archive':
        return {
          icon: Archive,
          gradient: 'from-yellow-500 via-orange-600 to-red-600',
          shadow: 'shadow-yellow-500/25',
          hoverShadow: 'hover:shadow-yellow-500/40',
          sparkleColor: 'text-yellow-300',
          borderColor: 'border-yellow-400/30'
        }
      case 'spreadsheet':
        return {
          icon: BarChart3,
          gradient: 'from-green-500 via-emerald-600 to-teal-600',
          shadow: 'shadow-green-500/25',
          hoverShadow: 'hover:shadow-green-500/40',
          sparkleColor: 'text-green-300',
          borderColor: 'border-green-400/30'
        }
      case 'presentation':
        return {
          icon: Presentation,
          gradient: 'from-orange-500 via-red-600 to-pink-600',
          shadow: 'shadow-orange-500/25',
          hoverShadow: 'hover:shadow-orange-500/40',
          sparkleColor: 'text-orange-300',
          borderColor: 'border-orange-400/30'
        }
      default:
        return {
          icon: File,
          gradient: 'from-gray-500 via-gray-600 to-slate-600',
          shadow: 'shadow-gray-500/25',
          hoverShadow: 'hover:shadow-gray-500/40',
          sparkleColor: 'text-gray-300',
          borderColor: 'border-gray-400/30'
        }
    }
  }

  const config = getIconConfig()
  const IconComponent = config.icon

  return (
    <div className={`
      relative group
      ${sizeClasses[size]} 
      ${className}
      rounded-2xl 
      bg-gradient-to-br ${config.gradient}
      shadow-xl ${config.shadow} ${config.hoverShadow}
      border-2 ${config.borderColor}
      backdrop-blur-sm
      flex items-center justify-center
      transition-all duration-300
      ${animated ? 'hover:scale-110 hover:rotate-3 cursor-pointer' : ''}
      overflow-hidden
    `}>
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Sparkle Effect */}
      {animated && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Sparkles className={`w-3 h-3 ${config.sparkleColor} animate-pulse`} />
        </div>
      )}
      
      {/* Main Icon */}
      <IconComponent className={`${iconSizes[size]} text-white relative z-10 transition-all duration-300 ${animated ? 'group-hover:scale-110' : ''}`} />
      
      {/* File Type Badge for larger icons */}
      {(size === 'xl' || size === '2xl') && type !== 'folder' && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-xs font-bold text-gray-700 capitalize">
            {type.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      {/* Animated Border */}
      {animated && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-white/30 via-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  )
}

export default EnhancedFileIcon