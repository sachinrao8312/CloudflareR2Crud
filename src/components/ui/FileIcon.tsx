// src/components/ui/FileIcon.tsx

import React from 'react'

interface FileIconProps {
  type: string
  className?: string
}

export const FileIcon: React.FC<FileIconProps> = ({ type, className = "w-6 h-6" }) => {
  const getIconStyles = () => {
    switch (type) {
      case 'folder':
        return 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25'
      case 'image':
        return 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25'
      case 'video':
        return 'bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-500/25'
      case 'audio':
        return 'bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg shadow-purple-500/25'
      case 'document':
        return 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25'
      case 'code':
        return 'bg-gradient-to-br from-gray-600 to-slate-700 shadow-lg shadow-gray-500/25'
      case 'archive':
        return 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/25'
      case 'spreadsheet':
        return 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/25'
      case 'presentation':
        return 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/25'
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-400/25'
    }
  }

  const getIconSymbol = () => {
    switch (type) {
      case 'folder': return '📁'
      case 'image': return '🖼️'
      case 'video': return '🎥'
      case 'audio': return '🎵'
      case 'document': return '📄'
      case 'code': return '💻'
      case 'archive': return '📦'
      case 'spreadsheet': return '📊'
      case 'presentation': return '📋'
      default: return '📄'
    }
  }

  return (
    <div className={`${className} rounded-xl flex items-center justify-center text-white font-medium ${getIconStyles()} transform transition-transform hover:scale-105`}>
      <span className="text-xs">{getIconSymbol()}</span>
    </div>
  )
}