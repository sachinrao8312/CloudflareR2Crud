// src/components/file-manager/components/BulkActions.tsx

import React from 'react'
import { Trash2, CheckCircle, Download, Share2, Archive, Star, X } from 'lucide-react'

interface EnhancedBulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onDeleteSelected: () => void
  darkMode: boolean
}

export const EnhancedBulkActions: React.FC<EnhancedBulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  darkMode
}) => {
  // Enhanced theme classes
  const bgClass = darkMode 
    ? 'bg-gradient-to-r from-orange-900/40 via-red-900/40 to-orange-800/40' 
    : 'bg-gradient-to-r from-orange-50/90 via-red-50/90 to-orange-100/90'
  const borderClass = darkMode ? 'border-orange-700/50' : 'border-orange-200/50'
  const textClass = darkMode ? 'text-orange-200' : 'text-orange-800'
  const secondaryTextClass = darkMode ? 'text-orange-300' : 'text-orange-600'
  const iconBgClass = darkMode ? 'bg-orange-800/60' : 'bg-orange-100/80'
  const surfaceClass = darkMode ? 'bg-gray-800/80' : 'bg-white/90'

  return (
    <div className="relative">
      {/* Enhanced Background with Animation */}
      <div className={`${bgClass} border-2 ${borderClass} rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden relative`}>
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-orange-400/10 animate-gradient-x" />
        
        {/* Floating Particles */}
        <div className="absolute top-4 left-8 w-2 h-2 bg-orange-400/60 rounded-full animate-bounce" />
        <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-red-400/60 rounded-full animate-pulse" />
        <div className="absolute bottom-6 left-16 w-1 h-1 bg-orange-500/60 rounded-full animate-ping" />

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Enhanced Selection Icon */}
              <div className={`relative w-16 h-16 ${iconBgClass} rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-white/20`}>
                <CheckCircle className="w-8 h-8 text-orange-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">{selectedCount}</span>
                </div>
              </div>
              
              {/* Enhanced Text Content */}
              <div>
                <h3 className={`text-2xl font-bold ${textClass} mb-2`}>
                  {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                </h3>
                <p className={`text-lg ${secondaryTextClass}`}>
                  Choose an action to perform on selected items
                </p>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Additional Action Buttons */}
              <button
                className={`group p-4 ${surfaceClass} backdrop-blur-sm border-2 ${borderClass} rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700/90' : 'hover:bg-white'
                }`}
                title="Download Selected"
              >
                <Download className={`w-6 h-6 ${darkMode ? 'text-gray-300 group-hover:text-green-400' : 'text-gray-600 group-hover:text-green-600'} transition-colors`} />
              </button>
              
              <button
                className={`group p-4 ${surfaceClass} backdrop-blur-sm border-2 ${borderClass} rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700/90' : 'hover:bg-white'
                }`}
                title="Archive Selected"
              >
                <Archive className={`w-6 h-6 ${darkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`} />
              </button>
              
              <button
                className={`group p-4 ${surfaceClass} backdrop-blur-sm border-2 ${borderClass} rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700/90' : 'hover:bg-white'
                }`}
                title="Star Selected"
              >
                <Star className={`w-6 h-6 ${darkMode ? 'text-gray-300 group-hover:text-yellow-400' : 'text-gray-600 group-hover:text-yellow-600'} transition-colors`} />
              </button>

              {/* Clear Selection Button */}
              <button
                onClick={onClearSelection}
                className={`group px-6 py-4 ${surfaceClass} backdrop-blur-sm border-2 ${borderClass} rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                  darkMode 
                    ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700/90' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Clear Selection</span>
                </div>
              </button>
              
              {/* Enhanced Delete Button */}
              <button
                onClick={onDeleteSelected}
                className="group px-8 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-bold text-lg rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-red-500/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Trash2 className="w-6 h-6 group-hover:animate-bounce" />
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </div>
                  <span>Delete {selectedCount} Item{selectedCount !== 1 ? 's' : ''}</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Enhanced Progress Indicator */}
          <div className="mt-6 flex items-center justify-between">
            <div className={`text-sm ${secondaryTextClass}`}>
              💡 <strong>Tip:</strong> Use Shift+Click to select multiple items quickly
            </div>
            
            {/* Selection Progress Bar */}
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${secondaryTextClass}`}>
                Selection Progress
              </span>
              <div className={`w-32 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min((selectedCount / 10) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-xs ${secondaryTextClass}`}>
                {selectedCount}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className={`px-4 py-2 ${darkMode ? 'bg-gray-800/90 text-gray-200' : 'bg-white/90 text-gray-700'} rounded-full text-sm font-medium shadow-lg border ${borderClass} backdrop-blur-sm`}>
          ⚡ Quick Actions Available
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(0%); }
          50% { transform: translateX(100%); }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default EnhancedBulkActions