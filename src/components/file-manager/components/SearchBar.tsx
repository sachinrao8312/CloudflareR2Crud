// src/components/file-manager/components/SearchBar.tsx

import React, { ChangeEvent, useRef, useEffect } from 'react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
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
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  isSearching,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search bar with Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Enhanced Search Input */}
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search files and folders... (Ctrl+K)"
            onChange={onSearch}
            defaultValue={searchQuery}
            className="block w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all duration-200 text-lg placeholder-gray-400"
            aria-label="Search files and folders"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {isSearching && (
              <div className="pr-4">
                <LoadingSpinner size="sm" />
              </div>
            )}
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="mr-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'date' | 'size')}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 text-sm font-medium transition-all duration-200"
            aria-label="Sort files by"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            aria-label={`Change sort order to ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
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
                  : `Searching for "${searchQuery}"`
                }
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSearch}
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}