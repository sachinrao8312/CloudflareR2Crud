// src/components/file-manager/components/FileManagerHeader.tsx

import React from 'react'
import { Grid3X3, List, Moon, Sun } from 'lucide-react'

interface EnhancedFileManagerHeaderProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  darkMode: boolean
  onToggleTheme: () => void
}

export const EnhancedFileManagerHeader: React.FC<EnhancedFileManagerHeaderProps> = ({
  viewMode,
  onViewModeChange,
  darkMode,
  onToggleTheme
}) => {
  // Enhanced theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/95' : 'bg-white/95'
  const borderClass = darkMode ? 'border-gray-800/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className={`${surfaceClass} backdrop-blur-2xl border-b-2 ${borderClass} shadow-2xl sticky top-0 z-30 relative overflow-hidden`}>
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 animate-gradient-x" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Compact Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 transform rotate-3 cursor-pointer hover:scale-105 hover:rotate-6 transition-all duration-300">
                <span className="text-white font-bold text-lg transform -rotate-3">R2</span>
              </div>
            </div>
            
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r ${
                darkMode 
                  ? 'from-white via-orange-200 to-red-200' 
                  : 'from-gray-900 via-orange-800 to-red-900'
              } bg-clip-text text-transparent`}>
                File Manager
              </h1>
              <p className={`text-sm ${secondaryTextClass}`}>Cloudflare R2 Storage</p>
            </div>
          </div>
          
          {/* Compact Controls */}
          <div className="flex items-center space-x-3">
            {/* Compact Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Compact View Mode Toggle */}
            <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-800/80' : 'bg-gray-100/80'} backdrop-blur-sm rounded-lg p-1 shadow-md border ${borderClass}`}>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  viewMode === 'list' 
                    ? `${darkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'} transform scale-105` 
                    : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                }`}
                aria-label="Switch to list view"
              >
                <List className="w-4 h-4 mr-1 inline" />
                List
              </button>
              
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  viewMode === 'grid' 
                    ? `${darkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'} transform scale-105` 
                    : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                }`}
                aria-label="Switch to grid view"
              >
                <Grid3X3 className="w-4 h-4 mr-1 inline" />
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Compact Status Bar */}
        <div className={`border-t ${borderClass} py-2 flex items-center justify-between text-xs`}>
          <div className="flex items-center space-x-4">
            <span className={secondaryTextClass}>Storage: 2.3GB / 100GB</span>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className={secondaryTextClass}>Connected</span>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded text-xs ${
            darkMode 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-green-100 text-green-700'
          }`}>
            All systems operational
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default EnhancedFileManagerHeader