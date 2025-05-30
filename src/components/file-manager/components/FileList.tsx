// src/components/file-manager/components/FileList.tsx

import React, { useRef } from 'react'
import { Search, Eye, Download, ArrowLeft, CheckCircle, Star, Clock, Zap } from 'lucide-react'
import { FolderItem } from '../../../types/fileManager'
import { EnhancedFileIcon } from '../../ui/FileIcon'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { formatFileSize } from '../../../utils/fileUtils'

interface EnhancedFileListProps {
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

// Enhanced Empty State Component
const EnhancedEmptyState = ({ 
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

  return (
    <div className="text-center py-20">
      <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-all duration-500 hover:scale-110 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-orange-100 to-orange-200'
      }`}>
        <Search className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-orange-400'}`} />
      </div>
      
      <h3 className={`text-2xl font-bold mb-3 ${textClass}`}>
        {title}
      </h3>
      <p className={`text-lg max-w-lg mx-auto mb-8 ${secondaryTextClass}`}>
        {description}
      </p>
      
      {!searchQuery && (
        <div className="space-y-5">
          <p className={`text-base mb-5 ${secondaryTextClass}`}>
            🚀 Click "Upload Files" above to start adding files to your storage
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            Choose Files to Upload
          </button>
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

// Enhanced Grid Item Component
const EnhancedGridItem: React.FC<{
  item: FolderItem
  isSelected: boolean
  onToggleSelection: (key: string) => void
  onNavigateToFolder: (folderKey: string) => void
  onPreviewFile: (file: FolderItem) => void
  onDownloadFile: (key: string) => void
  darkMode: boolean
}> = ({ item, isSelected, onToggleSelection, onNavigateToFolder, onPreviewFile, onDownloadFile, darkMode }) => {
  
  const surfaceClass = darkMode ? 'bg-gray-900/90' : 'bg-white/90'
  const borderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div 
      className={`group relative ${surfaceClass} backdrop-blur-sm rounded-3xl p-6 border-2 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-3 hover:scale-105 ${
        isSelected 
          ? 'border-orange-500 bg-orange-50/20 shadow-xl shadow-orange-500/20 scale-105 animate-pulse' 
          : `${borderClass} hover:border-orange-300/50`
      }`}
      onClick={() => item.isFolder ? onNavigateToFolder(item.key) : onPreviewFile(item)}
    >
      {/* Enhanced Selection Indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelection(item.key)
          }}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center hover:scale-110 ${
            isSelected 
              ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30' 
              : `border-gray-300 bg-white hover:border-orange-400`
          }`}
        >
          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Enhanced File Icon/Preview */}
      <div className="mb-4 flex justify-center">
        <div className="relative">
          <EnhancedFileIcon type={item.fileType || 'file'} size="xl" className="w-20 h-20" />
          {item.isFolder && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">📁</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced File Info */}
      <div className="text-center space-y-2">
        <h3 className={`font-bold text-base truncate group-hover:text-orange-500 transition-colors ${textClass}`} title={item.name}>
          {item.name}
        </h3>
        
        <div className="space-y-1">
          {!item.isFolder && (
            <p className={`text-sm font-medium ${secondaryTextClass}`}>
              {formatFileSize(item.size)}
            </p>
          )}
          {item.lastModified && (
            <p className={`text-xs ${secondaryTextClass} flex items-center justify-center space-x-1`}>
              <Clock className="w-3 h-3" />
              <span>{new Date(item.lastModified).toLocaleDateString()}</span>
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
        <div className={`${surfaceClass} backdrop-blur-xl border-t-2 ${borderClass} rounded-b-3xl p-3 flex justify-center space-x-2`}>
          {!item.isFolder && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPreviewFile(item); }}
                className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all hover:scale-110 shadow-lg"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDownloadFile(item.key); }}
                className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all hover:scale-110 shadow-lg"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          {item.isFolder && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigateToFolder(item.key); }}
              className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all hover:scale-110 shadow-lg"
              title="Open Folder"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced List Item Component  
const EnhancedListItem: React.FC<{
  item: FolderItem
  isSelected: boolean
  onToggleSelection: (key: string) => void
  onNavigateToFolder: (folderKey: string) => void
  onPreviewFile: (file: FolderItem) => void
  onDownloadFile: (key: string) => void
  darkMode: boolean
}> = ({ item, isSelected, onToggleSelection, onNavigateToFolder, onPreviewFile, onDownloadFile, darkMode }) => {
  
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'
  const selectedBgClass = isSelected 
    ? (darkMode ? 'bg-orange-900/30 border-orange-600/50' : 'bg-orange-50/80 border-orange-300/50')
    : (darkMode ? 'hover:bg-gray-800/50 border-transparent' : 'hover:bg-orange-50/30 border-transparent')

  return (
    <div className={`flex items-center justify-between p-4 transition-all duration-300 cursor-pointer rounded-2xl border-2 ${selectedBgClass}`}>
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <button
          onClick={() => onToggleSelection(item.key)}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center hover:scale-110 ${
            isSelected 
              ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30' 
              : 'border-gray-300 hover:border-orange-400'
          }`}
        >
          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
        </button>
        
        <EnhancedFileIcon type={item.fileType || 'file'} size="md" className="w-12 h-12" />
        
        <div className="flex-1 min-w-0">
          <button
            onClick={() => item.isFolder ? onNavigateToFolder(item.key) : onPreviewFile(item)}
            className="text-left w-full group cursor-pointer"
          >
            <p className={`font-bold truncate group-hover:text-orange-500 transition-colors text-lg ${textClass}`}>
              {item.name}
            </p>
            <div className={`flex items-center space-x-3 text-base ${secondaryTextClass} mt-1`}>
              {!item.isFolder && <span>{formatFileSize(item.size)}</span>}
              {item.lastModified && (
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(item.lastModified).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </button>
        </div>
        
        <div className={`text-right text-base min-w-[130px] ${secondaryTextClass}`}>
          {!item.isFolder && item.fileType && (
            <div className="space-y-1">
              <p className="font-semibold capitalize">{item.fileType}</p>
              <div className="flex items-center justify-end space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-sm">Recent</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!item.isFolder && (
        <div className="flex items-center space-x-2 ml-6">
          <button
            onClick={() => onPreviewFile(item)}
            className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all hover:scale-110 shadow-lg"
            title="Preview"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDownloadFile(item.key)}
            className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all hover:scale-110 shadow-lg"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {item.isFolder && (
        <button
          onClick={() => onNavigateToFolder(item.key)}
          className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all hover:scale-110 shadow-lg"
          title="Open Folder"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </button>
      )}
    </div>
  );
};

export const EnhancedFileList: React.FC<EnhancedFileListProps> = ({
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
  // Enhanced theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/90' : 'bg-white/90'
  const borderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  const headerBgClass = darkMode ? 'from-gray-800/90 to-gray-700/50' : 'from-orange-50/90 to-white'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'
  const dividerClass = darkMode ? 'divide-gray-700/50' : 'divide-gray-100/50'

  return (
    <div className={`${surfaceClass} backdrop-blur-xl rounded-3xl shadow-2xl border-2 ${borderClass} overflow-hidden`}>
      {/* Enhanced List Header */}
      <div className={`px-8 py-6 bg-gradient-to-r ${headerBgClass} border-b-2 ${borderClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <h2 className={`text-xl font-bold ${textClass}`}>
                {searchQuery ? `🔍 Search Results (${displayItems.length})` : '📁 All Files'}
              </h2>
              {isLoading && (
                <div className="absolute -top-2 -right-2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className={`text-base ${secondaryTextClass}`}>Loading...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentPath && !searchQuery && (
              <button
                onClick={onNavigateBack}
                className={`px-4 py-2 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Back
              </button>
            )}
            {displayItems.length > 0 && (
              <button
                onClick={onSelectAll}
                className={`px-4 py-2 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                  selectedItems.size === displayItems.length
                    ? (darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-500 text-white')
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-orange-100 hover:bg-orange-200 text-orange-700')
                }`}
              >
                {selectedItems.size === displayItems.length ? '✓ Deselect All' : '☐ Select All'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced File List Content */}
      <div className={viewMode === 'grid' ? 'p-8' : 'p-5'}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <div className="space-y-2">
                <p className={`text-xl font-bold ${textClass}`}>Loading your files...</p>
                <p className={`text-base ${secondaryTextClass}`}>This might take a moment</p>
              </div>
            </div>
          </div>
        ) : displayItems.length === 0 ? (
          <EnhancedEmptyState
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {displayItems.map((item) => (
              <EnhancedGridItem
                key={item.key}
                item={item}
                isSelected={selectedItems.has(item.key)}
                onToggleSelection={onToggleSelection}
                onNavigateToFolder={onNavigateToFolder}
                onPreviewFile={onPreviewFile}
                onDownloadFile={onDownloadFile}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <div className={`space-y-2 divide-y-2 ${dividerClass}`}>
            {displayItems.map((item) => (
              <div key={item.key} className="pt-2 first:pt-0">
                <EnhancedListItem
                  item={item}
                  isSelected={selectedItems.has(item.key)}
                  onToggleSelection={onToggleSelection}
                  onNavigateToFolder={onNavigateToFolder}
                  onPreviewFile={onPreviewFile}
                  onDownloadFile={onDownloadFile}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedFileList