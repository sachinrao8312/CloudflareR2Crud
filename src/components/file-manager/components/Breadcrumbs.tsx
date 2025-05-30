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
      <div className={`absolute inset-0 ${surfaceClass} backdrop-blur-xl rounded-3xl border-2 ${borderClass} shadow-xl`} />
      
      <div className="relative flex items-center space-x-3 px-8 py-6 text-lg">
        {/* Enhanced Home Button */}
        <button
          onClick={onGoHome}
          className={`group flex items-center px-6 py-4 rounded-2xl transition-all duration-300 font-bold cursor-pointer hover:scale-105 hover:shadow-xl ${surfaceClass} backdrop-blur-sm border-2 ${borderClass} ${textClass} ${hoverTextClass} ${
            darkMode ? 'hover:bg-gray-800/90 hover:border-gray-600/50' : 'hover:bg-white hover:border-orange-300/50'
          }`}
        >
          <div className="relative">
            <Home className="w-6 h-6 mr-3 group-hover:animate-bounce" />
            <Star className="absolute -top-1 -right-1 w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
          </div>
          <span className="text-xl">Home</span>
        </button>

        {/* Enhanced Breadcrumb Trail */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {/* Enhanced Separator */}
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-orange-50/50'}`}>
              <ChevronRight className={`w-6 h-6 ${chevronClass}`} />
            </div>
            
            {/* Enhanced Breadcrumb Item */}
            <button
              onClick={() => onNavigate(crumb.path)}
              className={`group flex items-center px-6 py-4 rounded-2xl transition-all duration-300 font-bold cursor-pointer hover:scale-105 hover:shadow-xl ${surfaceClass} backdrop-blur-sm border-2 ${borderClass} ${textClass} ${hoverTextClass} ${
                darkMode ? 'hover:bg-gray-800/90 hover:border-gray-600/50' : 'hover:bg-white hover:border-orange-300/50'
              } ${index === breadcrumbs.length - 1 ? (darkMode ? 'bg-orange-900/30 border-orange-600/50' : 'bg-orange-50/80 border-orange-300/50') : ''}`}
            >
              <div className="relative">
                <Folder className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                {index === breadcrumbs.length - 1 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-xl truncate max-w-[200px]" title={crumb.name}>
                {crumb.name}
              </span>
            </button>
          </React.Fragment>
        ))}

        {/* Current Location Indicator */}
        {breadcrumbs.length > 0 && (
          <div className={`ml-4 px-4 py-2 rounded-xl ${darkMode ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-100 text-orange-600'} text-sm font-medium border ${darkMode ? 'border-orange-800/50' : 'border-orange-200'}`}>
            📍 Current Location
          </div>
        )}
      </div>

      {/* Path Display */}
      {currentPath && (
        <div className={`mt-4 px-8 py-4 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-orange-50/60'} backdrop-blur-sm border ${borderClass}`}>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Path:
            </span>
            <code className={`px-3 py-1 rounded-lg font-mono ${darkMode ? 'bg-gray-700/80 text-gray-200' : 'bg-white/80 text-gray-800'} border ${borderClass}`}>
              /{currentPath}
            </code>
          </div>
        </div>
      )}
    </nav>
  )
}

export default EnhancedBreadcrumbs