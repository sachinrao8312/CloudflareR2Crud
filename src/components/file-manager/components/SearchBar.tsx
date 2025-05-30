import React, { ChangeEvent, useRef, useEffect, useState } from 'react'

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
  resultsCount
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

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 space-y-6">
      {/* Main Search Container */}
      <div className="relative">
        <div className={`
          flex items-center w-full bg-white/90 backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 shadow-lg
          ${isFocused ? 'border-blue-500 shadow-blue-500/20 shadow-xl' : 'border-gray-200/60 hover:border-gray-300/80'}
        `}>
          {/* Search Icon */}
          <div className="pl-6 pr-4">
            <svg 
              className={`w-6 h-6 transition-colors duration-200 ${
                isFocused ? 'text-blue-500' : 'text-gray-400'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search files and folders... (⌘K)"
            defaultValue={searchQuery}
            onChange={onSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 py-5 text-lg bg-transparent border-none outline-none placeholder-gray-500 text-gray-900"
            aria-label="Search files and folders"
            aria-describedby="search-results-count"
          />

          {/* Loading Spinner */}
          {isSearching && (
            <div className="px-4">
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            </div>
          )}

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="p-3 mx-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Keyboard Shortcut Hint */}
          {!isFocused && !searchQuery && (
            <div className="hidden sm:flex items-center px-4 py-2 mx-4 bg-gray-100/80 rounded-lg">
              <kbd className="text-xs font-medium text-gray-500">⌘K</kbd>
            </div>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div 
            id="search-results-count"
            className="mt-4 px-6 py-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-blue-800 font-medium">
                  {isSearching 
                    ? 'Searching...' 
                    : `${resultsCount || 0} result${(resultsCount || 0) !== 1 ? 's' : ''} for "${searchQuery}"`
                  }
                </span>
              </div>
              <button
                onClick={onClearSearch}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'name' | 'date' | 'size')}
              className="pl-4 pr-10 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-sm font-medium transition-all duration-200 appearance-none cursor-pointer"
              aria-label="Sort files by"
            >
              <option value="name">Name</option>
              <option value="date">Date Modified</option>
              <option value="size">File Size</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          aria-label={`Change sort order to ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
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