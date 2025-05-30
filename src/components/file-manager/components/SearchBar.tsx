// src/components/file-manager/components/SearchBar.tsx

import React, { ChangeEvent, useRef, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '../../ui/Button'

interface SearchBarProps {
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
}

export const EnhancedSearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  isSearching,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  resultsCount,
  darkMode
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

  const surfaceClass = darkMode ? 'bg-gray-900/80' : 'bg-white/80'
  const borderClass = darkMode ? 'border-gray-800/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 space-y-6">
      {/* Main Search Container */}
      <div className="relative">
        <div className={`
          flex items-center w-full ${surfaceClass} backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 shadow-lg
          ${isFocused 
            ? 'border-orange-500/50 shadow-orange-500/20 shadow-xl' 
            : `${borderClass} ${darkMode ? 'hover:border-gray-700/80' : 'hover:border-gray-300/80'}`
          }
        `}>
          {/* Search Icon */}
          <div className="pl-6 pr-4">
            <Search 
              className={`h-6 w-6 transition-colors duration-200 ${
                isFocused ? 'text-orange-500' : secondaryTextClass
              }`} 
              aria-hidden="true"
            />
          </div>

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search files and folders... (⌘K)"
            value={searchQuery}
            onChange={onSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`flex-1 py-5 text-lg bg-transparent border-none outline-none placeholder-gray-500 ${textClass}`}
            aria-label="Search files and folders"
            aria-describedby="search-results-count"
          />

          {/* Loading Spinner */}
          {isSearching && (
            <div className="px-4">
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
            </div>
          )}

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className={`p-3 mx-2 rounded-xl transition-all duration-200 cursor-pointer hover:scale-110 ${
                darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Keyboard Shortcut Hint */}
          {!isFocused && !searchQuery && (
            <div className={`hidden sm:flex items-center px-4 py-2 mx-4 rounded-lg ${
              darkMode ? 'bg-gray-800/80' : 'bg-gray-100/80'
            }`}>
              <kbd className={`text-xs font-medium ${secondaryTextClass}`}>⌘K</kbd>
            </div>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div 
            id="search-results-count"
            className={`mt-4 px-6 py-4 ${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-gray-50/80 border-gray-200/50'} border rounded-2xl backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                  <Search className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className={`font-medium ${textClass}`}>
                  {isSearching 
                    ? 'Searching...' 
                    : `${resultsCount || 0} result${(resultsCount || 0) !== 1 ? 's' : ''} for "${searchQuery}"`
                  }
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSearch}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <label htmlFor="sort-select" className={`text-sm font-medium ${textClass}`}>
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'name' | 'date' | 'size')}
              className={`pl-4 pr-10 py-3 ${surfaceClass} backdrop-blur-sm border ${borderClass} rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 text-sm font-medium transition-all duration-200 appearance-none cursor-pointer ${
                darkMode 
                  ? 'text-gray-200 hover:bg-gray-800/80 hover:border-gray-700/50' 
                  : 'text-gray-900 hover:bg-white hover:border-gray-300/50'
              }`}
              aria-label="Sort files by"
            >
              <option value="name">Name</option>
              <option value="date">Date Modified</option>
              <option value="size">File Size</option>
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
          className={`p-3 ${surfaceClass} backdrop-blur-sm border ${borderClass} rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 cursor-pointer hover:scale-105 ${
            darkMode 
              ? 'hover:bg-gray-800 hover:border-gray-700/50' 
              : 'hover:bg-white hover:shadow-md hover:border-gray-300/50'
          }`}
          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          aria-label={`Change sort order to ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          <svg 
            className={`w-5 h-5 ${secondaryTextClass} transition-transform duration-200 ${
              sortOrder === 'desc' ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default EnhancedSearchBar