// src/components/file-manager/components/FileManagerHeader.tsx

import React from 'react'
import { Grid3X3, List, Moon, Sun } from 'lucide-react'

interface EnhancedFileManagerHeaderProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  darkMode: boolean
  onToggleTheme: () => void
  totalStorage?: string
  filesCount?: number
}

export const EnhancedFileManagerHeader: React.FC<EnhancedFileManagerHeaderProps> = ({
  viewMode,
  onViewModeChange,
  darkMode,
  onToggleTheme,
  totalStorage = '0 B',
  filesCount = 0
}) => {
  // Enhanced theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/95' : 'bg-white/95'
  const borderClass = darkMode ? 'border-gray-800/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className={`${surfaceClass} backdrop-blur-xl border-b ${borderClass} shadow-lg sticky top-0 z-30 relative overflow-hidden`}>
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/3 via-red-500/3 to-orange-500/3 animate-gradient-x" />
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Compact Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 via-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/25 transform rotate-2 cursor-pointer hover:scale-105 hover:rotate-3 transition-all duration-300">
                <span className="text-white font-bold text-sm transform -rotate-2">R2</span>
              </div>
            </div>
            
            <div>
              <h1 className={`text-lg font-bold bg-gradient-to-r ${
                darkMode 
                  ? 'from-white via-orange-200 to-red-200' 
                  : 'from-gray-900 via-orange-800 to-red-900'
              } bg-clip-text text-transparent`}>
                File Manager
              </h1>
              <p className={`text-xs ${secondaryTextClass}`}>Cloudflare R2</p>
            </div>
          </div>
          
          {/* Compact Controls */}
          <div className="flex items-center space-x-2">
            {/* Compact Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-md transition-all duration-300 cursor-pointer hover:scale-105 ${
                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Compact View Mode Toggle */}
            <div className={`flex items-center space-x-0.5 ${darkMode ? 'bg-gray-800/80' : 'bg-gray-100/80'} backdrop-blur-sm rounded-md p-0.5 shadow-sm border ${borderClass}`}>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  viewMode === 'list' 
                    ? `${darkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'} transform scale-105` 
                    : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                }`}
                aria-label="Switch to list view"
              >
                <List className="w-3.5 h-3.5 mr-1 inline" />
                List
              </button>
              
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  viewMode === 'grid' 
                    ? `${darkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'} transform scale-105` 
                    : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                }`}
                aria-label="Switch to grid view"
              >
                <Grid3X3 className="w-3.5 h-3.5 mr-1 inline" />
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Compact Status Bar */}
        <div className={`border-t ${borderClass} py-1.5 flex items-center justify-between text-xs`}>
          <div className="flex items-center space-x-3">
            <span className={secondaryTextClass}>{totalStorage} • {filesCount} files</span>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full" />
              <span className={secondaryTextClass}>Connected</span>
            </div>
          </div>
          
          <span className={`px-2 py-0.5 rounded text-xs ${
            darkMode 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-green-100 text-green-700'
          }`}>
            Ready
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default EnhancedFileManagerHeader