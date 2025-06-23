// src/components/file-manager/components/SearchBar.tsx

import React, { ChangeEvent, useRef, useEffect, useState } from 'react'
import { Search, X, SortAsc, SortDesc, Filter, ArrowLeft, CheckCircle, Zap } from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'

interface EnhancedSearchBarProps {
  searchQuery: string
  isSearching: boolean
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void
  onClearSearch: () => void
  sortBy: 'name' | 'date' | 'size'
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: 'name' | 'date' | 'size') => void
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void
  resultsCount?: number
  darkMode: boolean
  // File list header props
  displayItems?: any[]
  selectedItems?: Set<string>
  currentPath?: string
  onNavigateBack?: () => void
  onSelectAll?: () => void
  totalStorage?: string
  filesCount?: number
  isLoading?: boolean
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  searchQuery,
  isSearching,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  resultsCount,
  darkMode,
  // File list header props
  displayItems = [],
  selectedItems = new Set(),
  currentPath = '',
  onNavigateBack = () => {},
  onSelectAll = () => {},
  totalStorage = '0 B',
  filesCount = 0,
  isLoading = false
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'Escape' && searchQuery) {
        onClearSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery, onClearSearch])

  // Enhanced theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/90' : 'bg-white/90'
  const borderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'
  const focusBorderClass = isFocused 
    ? 'border-orange-500/50 shadow-orange-500/20 shadow-xl' 
    : `${borderClass} ${darkMode ? 'hover:border-gray-600/80' : 'hover:border-gray-300/80'}`

  return (
    <div className="w-full space-y-4">
      {/* Main Search Container with Enhanced Design */}
      <div className="relative">
        <div className={`
          flex items-center w-full ${surfaceClass} backdrop-blur-xl rounded-2xl border-2 transition-all duration-500 shadow-lg
          ${focusBorderClass}
          ${isFocused ? 'scale-[1.01] shadow-xl' : 'hover:shadow-xl'}
        `}>
          {/* Enhanced Search Icon */}
          <div className="pl-6 pr-3">
            <div className={`relative ${isFocused ? 'animate-pulse' : ''}`}>
              <Search 
                className={`h-5 w-5 transition-all duration-300 ${
                  isFocused ? 'text-orange-500 scale-110' : secondaryTextClass
                }`} 
              />
              {isFocused && (
                <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
              )}
            </div>
          </div>

          {/* Enhanced Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search files and folders... ⌘K for quick access"
            value={searchQuery}
            onChange={onSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`flex-1 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-500 ${textClass} font-medium`}
            aria-label="Search files and folders"
          />

          {/* Enhanced Loading Spinner */}
          {isSearching && (
            <div className="px-3">
              <div className="relative">
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
                <div className="absolute inset-0 w-5 h-5 animate-ping rounded-full bg-orange-500/20" />
              </div>
            </div>
          )}

          {/* Enhanced Clear Button */}
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className={`p-2 mx-2 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 hover:shadow-lg' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-orange-50 hover:shadow-lg'
              }`}
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Enhanced Keyboard Shortcut Hint */}
          {!isFocused && !searchQuery && (
            <div className={`hidden lg:flex items-center px-3 py-2 mx-3 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-orange-50/80 hover:bg-orange-100/80'
            }`}>
              <kbd className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-orange-600'}`}>⌘K</kbd>
            </div>
          )}
        </div>

        {/* Enhanced Search Results Info */}
        {searchQuery && (
          <div className={`mt-4 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-lg border transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800/80 border-gray-700/50' 
              : 'bg-orange-50/80 border-orange-200/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                  darkMode ? 'bg-gray-700/80' : 'bg-orange-100/80'
                }`}>
                  <Search className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-orange-600'}`} />
                </div>
                <div>
                  <p className={`font-bold ${textClass}`}>
                    {isSearching 
                      ? 'Searching...' 
                      : `${resultsCount || 0} result${(resultsCount || 0) !== 1 ? 's' : ''} found`
                    }
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    for &quot;{searchQuery}&quot;
                  </p>
                </div>
              </div>
              <button
                onClick={onClearSearch}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-lg'
                    : 'bg-white hover:bg-orange-50 text-orange-600 shadow-lg hover:shadow-xl'
                }`}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className={`w-4 h-4 ${secondaryTextClass}`} />
            <label htmlFor="sort-select" className={`font-semibold ${textClass}`}>
              Sort by:
            </label>
          </div>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'name' | 'date' | 'size')}
              className={`pl-4 pr-10 py-2 font-semibold rounded-xl shadow-lg border-2 transition-all duration-300 appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/20 hover:scale-105 ${
                darkMode 
                  ? `${surfaceClass} ${borderClass} text-gray-200 hover:bg-gray-800/90 hover:border-gray-600/50 focus:border-orange-500/50` 
                  : `${surfaceClass} ${borderClass} text-gray-900 hover:bg-white hover:border-orange-300/50 focus:border-orange-500/50`
              }`}
            >
              <option value="name">📝 Name</option>
              <option value="date">🕐 Date Modified</option>
              <option value="size">📊 File Size</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className={`w-4 h-4 ${secondaryTextClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className={`p-3 rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 focus:ring-4 focus:ring-orange-500/20 ${
            darkMode 
              ? `${surfaceClass} ${borderClass} hover:bg-gray-800/90 hover:border-gray-600/50` 
              : `${surfaceClass} ${borderClass} hover:bg-white hover:shadow-xl hover:border-orange-300/50`
          }`}
          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
        >
          {sortOrder === 'asc' ? (
            <SortAsc className={`w-5 h-5 ${secondaryTextClass} hover:text-orange-500 transition-colors`} />
          ) : (
            <SortDesc className={`w-5 h-5 ${secondaryTextClass} hover:text-orange-500 transition-colors`} />
          )}
        </button>
      </div>

      {/* Enhanced File List Header - Only show when in a folder */}
      {(currentPath || searchQuery) && (
        <div className={`${surfaceClass} backdrop-blur-xl rounded-2xl shadow-lg border-2 ${borderClass} overflow-hidden`}>
          <div className={`px-4 py-3 bg-gradient-to-r ${darkMode ? 'from-gray-800/90 to-gray-700/50' : 'from-orange-50/90 to-white'} border-b ${borderClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentPath && !searchQuery && (
                  <button
                    onClick={onNavigateBack}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-md ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5 inline" />
                    Back
                  </button>
                )}
                {displayItems.length > 0 && (
                  <button
                    onClick={onSelectAll}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-md ${
                      selectedItems.size === displayItems.length
                        ? (darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-500 text-white')
                        : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-orange-100 hover:bg-orange-200 text-orange-700')
                    }`}
                  >
                    {selectedItems.size === displayItems.length ? '✓ Deselect All' : '☐ Select All'}
                  </button>
                )}
                <div className="relative">
                  <h2 className={`text-base font-bold ${textClass}`}>
                    {searchQuery ? `🔍 Search Results (${displayItems.length})` : '📁 All Files'}
                  </h2>
                  {isLoading && (
                    <div className="absolute -top-1 -right-1">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isLoading && (
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                    <span className={`text-xs ${secondaryTextClass}`}>Loading...</span>
                  </div>
                )}
                <span className={`text-xs font-medium ${secondaryTextClass}`}>
                  {totalStorage} • {filesCount} files
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedSearchBar