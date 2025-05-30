// src/components/file-manager/components/Breadcrumbs.tsx

import React from 'react'
import { Home, ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  currentPath: string
  onNavigate: (path: string) => void
  onGoHome: () => void
  darkMode: boolean
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPath,
  onNavigate,
  onGoHome,
  darkMode
}) => {
  const getBreadcrumbs = () => {
    if (!currentPath) return []
    const parts = currentPath.split('/').filter(part => part)
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/') + '/'
    }))
  }

  const breadcrumbs = getBreadcrumbs()
  const surfaceClass = darkMode ? 'bg-gray-900/80' : 'bg-white/80'
  const borderClass = darkMode ? 'border-gray-800/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-700'
  const hoverTextClass = darkMode ? 'hover:text-white' : 'hover:text-orange-600'
  const chevronClass = darkMode ? 'text-gray-500' : 'text-gray-300'

  return (
    <nav className="mb-8">
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={onGoHome}
          className={`flex items-center px-3 py-2 rounded-lg ${surfaceClass} backdrop-blur-sm border ${borderClass} transition-all duration-200 font-medium cursor-pointer hover:scale-105 hover:shadow-md ${textClass} ${hoverTextClass} ${
            darkMode ? 'hover:bg-gray-800 hover:border-gray-700' : 'hover:bg-white hover:border-gray-300'
          }`}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </button>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <ChevronRight className={`w-4 h-4 ${chevronClass}`} />
            <button
              onClick={() => onNavigate(crumb.path)}
              className={`px-3 py-2 rounded-lg ${surfaceClass} backdrop-blur-sm border ${borderClass} transition-all duration-200 font-medium cursor-pointer hover:scale-105 hover:shadow-md ${textClass} ${hoverTextClass} ${
                darkMode ? 'hover:bg-gray-800 hover:border-gray-700' : 'hover:bg-white hover:border-gray-300'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}