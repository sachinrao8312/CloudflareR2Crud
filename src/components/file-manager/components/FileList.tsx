// src/components/file-manager/components/FileList.tsx

import React, { useRef } from 'react'
import { Search, Eye, Download } from 'lucide-react'
import { FolderItem } from '../../../types/fileManager'
import { FileIcon } from '../../ui/FileIcon'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { formatFileSize } from '../../../utils/fileUtils'

interface FileListProps {
  displayItems: FolderItem[]
  selectedItems: Set<string>
  viewMode: 'grid' | 'list'
  isLoading: boolean
  searchQuery: string
  currentPath: string
  onToggleSelection: (key: string) => void
  onSelectAll: () => void
  onNavigateToFolder: (folderKey: string) => void
  onNavigateBack: () => void
  onPreviewFile: (file: FolderItem) => void
  onDownloadFile: (key: string) => void
  onSelectFiles: (files: File[]) => void
  darkMode: boolean
}

// Empty State Component
const EmptyState = ({ 
  title, 
  description, 
  searchQuery,
  onSelectFiles,
  darkMode 
}: { 
  title: string
  description: string
  searchQuery: string
  onSelectFiles: (files: File[]) => void
  darkMode: boolean
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onSelectFiles(newFiles)
    }
  }

  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'
  const iconBgClass = darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-gray-200'

  return (
    <div className="text-center py-20">
      <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${iconBgClass} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
        <Search className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
        {title}
      </h3>
      <p className={`max-w-md mx-auto mb-6 ${secondaryTextClass}`}>
        {description}
      </p>
      {!searchQuery && (
        <div className="text-center">
          <p className={`text-sm mb-4 ${secondaryTextClass}`}>
            👆 Click "Upload Files" above to start adding files to your storage
          </p>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            darkMode={darkMode}
          >
            Choose Files to Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

export const FileList: React.FC<FileListProps> = ({
  displayItems,
  selectedItems,
  viewMode,
  isLoading,
  searchQuery,
  currentPath,
  onToggleSelection,
  onSelectAll,
  onNavigateToFolder,
  onNavigateBack,
  onPreviewFile,
  onDownloadFile,
  onSelectFiles,
  darkMode
}) => {
  // Theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/80' : 'bg-white/80'
  const borderClass = darkMode ? 'border-gray-800/50' : 'border-gray-200/50'
  const headerBgClass = darkMode ? 'from-gray-800/80 to-gray-700/50' : 'from-gray-50/80 to-white'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'
  const hoverClass = darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50/50'
  const selectedBgClass = darkMode ? 'bg-orange-900/20' : 'bg-orange-50/50'
  const dividerClass = darkMode ? 'divide-gray-700' : 'divide-gray-100'

  return (
    <div className={`${surfaceClass} backdrop-blur-sm rounded-3xl shadow-xl border ${borderClass} overflow-hidden`}>
      {/* List Header */}
      <div className={`px-8 py-6 bg-gradient-to-r ${headerBgClass} border-b ${borderClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className={`text-2xl font-bold ${textClass}`}>
              {searchQuery ? `Search Results (${displayItems.length})` : 'All Files'}
            </h2>
            {isLoading && <LoadingSpinner darkMode={darkMode} />}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentPath && !searchQuery && (
              <Button
                variant="ghost"
                onClick={onNavigateBack}
                darkMode={darkMode}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            )}
            {displayItems.length > 0 && (
              <Button
                variant="ghost"
                onClick={onSelectAll}
                darkMode={darkMode}
              >
                {selectedItems.size === displayItems.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* File List Content */}
      <div className={viewMode === 'grid' ? 'p-8' : ''}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <LoadingSpinner size="lg" darkMode={darkMode} />
              <p className={`mt-4 ${secondaryTextClass}`}>Loading files...</p>
            </div>
          </div>
        ) : displayItems.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'No files found' : 'No files yet'}
            description={searchQuery 
              ? `No files match "${searchQuery}". Try a different search term.`
              : 'Upload files to get started with your cloud storage.'
            }
            searchQuery={searchQuery}
            onSelectFiles={onSelectFiles}
            darkMode={darkMode}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {displayItems.map((item) => (
              <div
                key={item.key}
                className={`group relative ${surfaceClass} rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-105 ${
                  selectedItems.has(item.key) 
                    ? `border-orange-400 ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'} shadow-lg shadow-orange-500/20 scale-105` 
                    : `${borderClass} ${darkMode ? 'hover:border-gray-600 hover:bg-gray-800/80' : 'hover:border-gray-300 hover:bg-white'} shadow-sm`
                }`}
                onClick={() => item.isFolder ? onNavigateToFolder(item.key) : onPreviewFile(item)}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.key)}
                    onChange={(e) => {
                      e.stopPropagation()
                      onToggleSelection(item.key)
                    }}
                    className="text-orange-600 focus:ring-orange-500 rounded cursor-pointer"
                  />
                </div>
                
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <FileIcon type={item.fileType || 'file'} className="w-16 h-16" />
                  </div>
                  <p className={`font-semibold text-sm truncate mb-1 ${textClass}`} title={item.name}>
                    {item.name}
                  </p>
                  {!item.isFolder && (
                    <p className={`text-xs ${secondaryTextClass}`}>
                      {formatFileSize(item.size)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`divide-y ${dividerClass}`}>
            {displayItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-6 transition-all duration-200 cursor-pointer ${
                  selectedItems.has(item.key) ? selectedBgClass : hoverClass
                }`}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.key)}
                    onChange={() => onToggleSelection(item.key)}
                    className="text-orange-600 focus:ring-orange-500 rounded cursor-pointer"
                  />
                  
                  <FileIcon type={item.fileType || 'file'} className="w-8 h-8" />
                  
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => item.isFolder ? onNavigateToFolder(item.key) : onPreviewFile(item)}
                      className="text-left w-full group cursor-pointer"
                    >
                      <p className={`font-semibold truncate group-hover:text-orange-400 transition-colors text-lg ${textClass}`}>
                        {item.name}
                      </p>
                      {searchQuery && item.fullPath && !item.isFolder && (
                        <p className={`text-sm truncate mt-1 ${secondaryTextClass}`}>
                          Path: {item.fullPath}
                        </p>
                      )}
                    </button>
                  </div>
                  
                  <div className={`text-right text-sm min-w-[120px] ${secondaryTextClass}`}>
                    {!item.isFolder && (
                      <div className="space-y-1">
                        <p className="font-medium">{formatFileSize(item.size)}</p>
                        {item.lastModified && (
                          <p className="text-xs">{new Date(item.lastModified).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {!item.isFolder && (
                  <div className="flex items-center space-x-2 ml-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewFile(item)}
                      icon={Eye}
                      darkMode={darkMode}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadFile(item.key)}
                      icon={Download}
                      darkMode={darkMode}
                    >
                      Download
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}