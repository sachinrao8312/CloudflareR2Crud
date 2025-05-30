// src/components/file-manager/components/FileList.tsx

import React, { useRef } from 'react'
import { FolderItem } from '../../../types/fileManager'
import { FileIcon } from '../../ui/FileIcon'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { EmptyState } from '../../ui/EmptyState'
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
  onSelectFiles
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onSelectFiles(newFiles)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
      {/* List Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : currentPath ? `Files in ${currentPath}` : 'All Files'}
            </h2>
            {isLoading && <LoadingSpinner />}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentPath && !searchQuery && (
              <Button
                variant="ghost"
                onClick={onNavigateBack}
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
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading files...</p>
            </div>
          </div>
        ) : displayItems.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'No files found' : 'This folder is empty'}
            description={searchQuery 
              ? `No files match "${searchQuery}". Try a different search term.`
              : 'Upload files or create folders to get started with your cloud storage.'
            }
            action={
              <div className="space-x-3">
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {displayItems.map((item) => (
              <div
                key={item.key}
                className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                  selectedItems.has(item.key) 
                    ? 'border-orange-300 bg-orange-50 shadow-lg shadow-orange-500/20 scale-105' 
                    : 'border-gray-200 hover:border-gray-300 shadow-sm'
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
                    className="text-orange-600 focus:ring-orange-500 rounded"
                  />
                </div>
                
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <FileIcon type={item.fileType || 'file'} className="w-16 h-16" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm truncate mb-1" title={item.name}>
                    {item.name}
                  </p>
                  {!item.isFolder && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.size)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-6 hover:bg-gray-50/50 transition-all duration-200 ${
                  selectedItems.has(item.key) ? 'bg-orange-50/50' : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.key)}
                    onChange={() => onToggleSelection(item.key)}
                    className="text-orange-600 focus:ring-orange-500 rounded"
                  />
                  
                  <FileIcon type={item.fileType || 'file'} className="w-8 h-8" />
                  
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => item.isFolder ? onNavigateToFolder(item.key) : onPreviewFile(item)}
                      className="text-left w-full group"
                    >
                      <p className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors text-lg">
                        {item.name}
                      </p>
                      {searchQuery && item.fullPath && !item.isFolder && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          Path: {item.fullPath}
                        </p>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-right text-gray-500 text-sm min-w-[120px]">
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
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadFile(item.key)}
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