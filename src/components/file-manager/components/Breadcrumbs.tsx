// src/components/file-manager/components/Breadcrumbs.tsx

import React from 'react'
import { Home, ChevronRight, Folder, Star } from 'lucide-react'

interface EnhancedBreadcrumbsProps {
  currentPath: string
  onNavigate: (path: string) => void
  onGoHome: () => void
  darkMode: boolean
}

export const EnhancedBreadcrumbs: React.FC<EnhancedBreadcrumbsProps> = ({
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
  
  // Enhanced theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/90' : 'bg-white/90'
  const borderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-700'
  const hoverTextClass = darkMode ? 'hover:text-white' : 'hover:text-orange-600'
  const chevronClass = darkMode ? 'text-gray-500' : 'text-gray-400'

  return (
    <nav className="relative">
      {/* Enhanced Background */}
      <div className={`absolute inset-0 ${surfaceClass} backdrop-blur-lg rounded-2xl border ${borderClass} shadow-lg`} />
      
      <div className="relative flex items-center space-x-2 px-4 py-3 text-sm">
        {/* Enhanced Home Button */}
        <button
          onClick={onGoHome}
          className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer hover:scale-105 hover:shadow-md ${surfaceClass} backdrop-blur-sm border ${borderClass} ${textClass} ${hoverTextClass} ${
            darkMode ? 'hover:bg-gray-800/90 hover:border-gray-600/50' : 'hover:bg-white hover:border-orange-300/50'
          }`}
        >
          <div className="relative">
            <Home className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            <Star className="absolute -top-0.5 -right-0.5 w-2 h-2 text-orange-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
          </div>
          <span className="text-sm">Home</span>
        </button>

        {/* Enhanced Breadcrumb Trail */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {/* Enhanced Separator */}
            <div className={`p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-orange-50/50'}`}>
              <ChevronRight className={`w-4 h-4 ${chevronClass}`} />
            </div>
            
            {/* Enhanced Breadcrumb Item */}
            <button
              onClick={() => onNavigate(crumb.path)}
              className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer hover:scale-105 hover:shadow-md ${surfaceClass} backdrop-blur-sm border ${borderClass} ${textClass} ${hoverTextClass} ${
                darkMode ? 'hover:bg-gray-800/90 hover:border-gray-600/50' : 'hover:bg-white hover:border-orange-300/50'
              } ${index === breadcrumbs.length - 1 ? (darkMode ? 'bg-orange-900/30 border-orange-600/50' : 'bg-orange-50/80 border-orange-300/50') : ''}`}
            >
              <div className="relative">
                <Folder className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                {index === breadcrumbs.length - 1 && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-sm truncate max-w-[150px]" title={crumb.name}>
                {crumb.name}
              </span>
            </button>
          </React.Fragment>
        ))}

        {/* Current Location Indicator */}
        {breadcrumbs.length > 0 && (
          <div className={`ml-2 px-2 py-1 rounded-lg ${darkMode ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-100 text-orange-600'} text-xs font-medium border ${darkMode ? 'border-orange-800/50' : 'border-orange-200'}`}>
            📍 Current
          </div>
        )}
      </div>

      {/* Path Display */}
      {currentPath && (
        <div className={`mt-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-800/60' : 'bg-orange-50/60'} backdrop-blur-sm border ${borderClass}`}>
          <div className="flex items-center space-x-2 text-xs">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Path:
            </span>
            <code className={`px-2 py-0.5 rounded font-mono ${darkMode ? 'bg-gray-700/80 text-gray-200' : 'bg-white/80 text-gray-800'} border ${borderClass}`}>
              /{currentPath}
            </code>
          </div>
        </div>
      )}
    </nav>
  )
}

export default EnhancedBreadcrumbs