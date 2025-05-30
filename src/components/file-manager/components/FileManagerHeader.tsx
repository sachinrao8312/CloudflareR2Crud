// src/components/file-manager/components/FileManagerHeader.tsx

import React from 'react'
import { Grid3X3, List, Moon, Sun } from 'lucide-react'

interface FileManagerHeaderProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  darkMode: boolean
  onToggleTheme: () => void
}

export const FileManagerHeader: React.FC<FileManagerHeaderProps> = ({
  viewMode,
  onViewModeChange,
  darkMode,
  onToggleTheme
}) => {
  const surfaceClass = darkMode ? 'bg-gray-900/80' : 'bg-white/80';
  const borderClass = darkMode ? 'border-gray-800/50' : 'border-gray-200/50';
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${surfaceClass} backdrop-blur-xl border-b ${borderClass} shadow-lg sticky top-0 z-30`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 transform rotate-3 cursor-pointer hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-lg transform -rotate-3">R2</span>
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${darkMode ? 'from-white to-gray-300' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                  File Manager
                </h1>
                <p className={secondaryTextClass}>Cloudflare R2 Storage</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl transition-colors cursor-pointer hover:scale-105 ${
                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* View Mode Toggle */}
            <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-800/80' : 'bg-gray-100/80'} backdrop-blur-sm rounded-xl p-1 shadow-inner`}>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  viewMode === 'list' 
                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-sm transform scale-105` 
                    : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                }`}
                aria-label="Switch to list view"
              >
                <List className="w-4 h-4 mr-2 inline" />
                List
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  viewMode === 'grid' 
                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-sm transform scale-105` 
                    : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                }`}
                aria-label="Switch to grid view"
              >
                <Grid3X3 className="w-4 h-4 mr-2 inline" />
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}