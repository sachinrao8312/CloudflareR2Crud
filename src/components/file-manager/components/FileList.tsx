// src/components/file-manager/components/FileList.tsx

import React, { useRef, useState, useEffect } from 'react'
import NextImage from 'next/image'
import { Search, Eye, Download, ArrowLeft, CheckCircle, Star, Clock, Zap, Play, Pause, Volume2, Trash2 } from 'lucide-react'
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
  onDeleteFile: (key: string) => void
  onSelectFiles: (files: File[]) => void
  darkMode: boolean
}

// Enhanced Image Preview Component
const InlineImagePreview: React.FC<{
  fileKey: string
  fileName: string
  darkMode: boolean
  onPreview?: () => void
}> = ({ fileKey, fileName, darkMode, onPreview }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fileKey })
        })
        const data = await response.json()
        setPreviewUrl(data.signedUrl)
      } catch (error) {
        console.error('Error loading preview:', error)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadPreview()
  }, [fileKey])

  if (isLoading) {
    return (
      <div className={`w-full h-40 rounded-lg flex items-center justify-center ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  if (error || !previewUrl) {
    return (
      <div className={`w-full h-40 rounded-lg flex items-center justify-center ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
      }`}>
        <p className="text-sm">Preview unavailable</p>
      </div>
    )
  }

  return (
    <div 
      className="w-full h-40 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-800 cursor-pointer group border border-gray-200 dark:border-gray-700 flex items-center justify-center"
      onClick={onPreview}
    >
      <div className="absolute inset-0 p-1">
        <NextImage
          src={previewUrl}
          alt={fileName}
          fill
          className="object-contain hover:scale-105 transition-transform duration-300"
          onError={() => setError(true)}
          sizes="(max-width: 768px) 300px, (max-width: 1200px) 300px, 300px"
        />
      </div>
      {onPreview && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-10">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 rounded-full p-2">
            <Eye className="w-5 h-5 text-gray-800" />
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced Audio Player Component
const InlineAudioPlayer: React.FC<{
  fileKey: string
  fileName: string
  darkMode: boolean
}> = ({ fileKey, fileName, darkMode }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fileKey })
        })
        const data = await response.json()
        setAudioUrl(data.signedUrl)
      } catch (error) {
        console.error('Error loading audio:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAudio()
  }, [fileKey])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className={`w-full p-3 rounded-lg flex items-center space-x-3 ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <LoadingSpinner size="sm" />
        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading audio...</span>
      </div>
    )
  }

  if (!audioUrl) {
    return (
      <div className={`w-full p-3 rounded-lg flex items-center justify-center ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
      }`}>
        <p className="text-sm">Audio unavailable</p>
      </div>
    )
  }

  return (
    <div className={`w-full p-3 rounded-lg border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 flex items-center space-x-2">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatTime(currentTime)}
          </span>
          <div className={`flex-1 h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatTime(duration)}
          </span>
        </div>
        
        <Volume2 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      
      <div className={`mt-2 text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {fileName}
      </div>
    </div>
  )
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
            🚀 Click &quot;Upload Files&quot; above to start adding files to your storage
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
  onDeleteFile: (key: string) => void
  darkMode: boolean
}> = ({ item, isSelected, onToggleSelection, onNavigateToFolder, onPreviewFile, onDownloadFile, onDeleteFile, darkMode }) => {
  
  const surfaceClass = darkMode ? 'bg-gray-900/90' : 'bg-white/90'
  const borderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div 
      className={`group relative ${surfaceClass} backdrop-blur-sm rounded-xl p-2.5 border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-102 ${
        isSelected 
          ? 'border-orange-500 bg-orange-50/20 shadow-md shadow-orange-500/20 scale-102' 
          : `${borderClass} hover:border-orange-300/50`
      }`}
      onClick={() => {
        // For images and audio, don't navigate on card click since they have inline previews
        if (item.fileType !== 'image' && item.fileType !== 'audio') {
          item.isFolder ? onNavigateToFolder(item.key) : onPreviewFile(item)
        }
      }}
    >
      {/* Enhanced Selection Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelection(item.key)
          }}
          className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center hover:scale-110 ${
            isSelected 
              ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30' 
              : `border-gray-300 bg-white hover:border-orange-400`
          }`}
        >
          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>

      {/* Enhanced File Icon/Preview */}
      <div className="mb-2.5 flex justify-center">
        {item.fileType === 'image' && !item.isFolder ? (
          <div className="w-full">
            <InlineImagePreview 
              fileKey={item.key} 
              fileName={item.name} 
              darkMode={darkMode}
              onPreview={() => onPreviewFile(item)}
            />
          </div>
        ) : item.fileType === 'audio' && !item.isFolder ? (
          <div className="w-full">
            <InlineAudioPlayer 
              fileKey={item.key} 
              fileName={item.name} 
              darkMode={darkMode}
            />
          </div>
        ) : (
          <div className="relative">
            <EnhancedFileIcon type={item.fileType || 'file'} size="md" className="w-12 h-12" />
            {item.isFolder && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">📁</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced File Info */}
      <div className="text-center space-y-1.5">
        <h3 className={`font-bold text-sm truncate group-hover:text-orange-500 transition-colors ${textClass}`} title={item.name}>
          {item.name}
        </h3>
        
        <div className="space-y-0.5">
          {!item.isFolder && (
            <p className={`text-xs font-medium ${secondaryTextClass}`}>
              {formatFileSize(item.size)}
            </p>
          )}
          {item.lastModified && (
            <p className={`text-xs ${secondaryTextClass} flex items-center justify-center space-x-1`}>
              <Clock className="w-2.5 h-2.5" />
              <span>{new Date(item.lastModified).toLocaleDateString()}</span>
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
        <div className={`${surfaceClass} backdrop-blur-xl border-t ${borderClass} rounded-b-xl p-1.5 flex justify-center space-x-1`}>
          {!item.isFolder && (
            <>
              {item.fileType !== 'audio' && (
                <button
                  onClick={(e) => { e.stopPropagation(); onPreviewFile(item); }}
                  className="p-1 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-all hover:scale-105 shadow-sm"
                  title="Preview"
                >
                  <Eye className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDownloadFile(item.key); }}
                className="p-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-all hover:scale-105 shadow-sm"
                title="Download"
              >
                <Download className="w-3 h-3" />
              </button>
            </>
          )}
          {item.isFolder && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigateToFolder(item.key); }}
              className="p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-all hover:scale-105 shadow-sm"
              title="Open Folder"
            >
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteFile(item.key); }}
            className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all hover:scale-105 shadow-sm"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced List Item Component  
const EnhancedListItem: React.FC<{
  item: FolderItem
  isSelected: boolean
  onToggleSelection: (key: string) => void
  onNavigateToFolder: (folderKey: string) => void
  onPreviewFile: (file: FolderItem) => void
  onDownloadFile: (key: string) => void
  onDeleteFile: (key: string) => void
  darkMode: boolean
}> = ({ item, isSelected, onToggleSelection, onNavigateToFolder, onPreviewFile, onDownloadFile, onDeleteFile, darkMode }) => {
  
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'
  const selectedBgClass = isSelected 
    ? (darkMode ? 'bg-orange-900/30 border-orange-600/50' : 'bg-orange-50/80 border-orange-300/50')
    : (darkMode ? 'hover:bg-gray-800/50 border-transparent' : 'hover:bg-orange-50/30 border-transparent')

  const isImage = item.fileType === 'image' && !item.isFolder
  const isAudio = item.fileType === 'audio' && !item.isFolder

  return (
    <div className={`transition-all duration-300 rounded-xl border ${selectedBgClass} ${isImage || isAudio ? 'p-2' : 'p-3'}`}>
      <div className={`flex items-center justify-between ${isImage || isAudio ? 'mb-3' : ''}`}>
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
          
          {!isImage && !isAudio && (
            <EnhancedFileIcon type={item.fileType || 'file'} size="md" className="w-12 h-12" />
          )}
          
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
            {item.fileType !== 'audio' && (
              <button
                onClick={() => onPreviewFile(item)}
                className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all hover:scale-110 shadow-lg"
                title="Preview"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => onDownloadFile(item.key)}
              className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all hover:scale-110 shadow-lg"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDeleteFile(item.key)}
              className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all hover:scale-110 shadow-lg"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
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
      
      {/* Inline previews for images and audio in list view */}
      {isImage && (
        <div className="w-full max-w-xs">
          <InlineImagePreview 
            fileKey={item.key} 
            fileName={item.name} 
            darkMode={darkMode}
            onPreview={() => onPreviewFile(item)}
          />
        </div>
      )}
      
      {isAudio && (
        <div className="w-full">
          <InlineAudioPlayer 
            fileKey={item.key} 
            fileName={item.name} 
            darkMode={darkMode}
          />
        </div>
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
  onDeleteFile,
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
      <div className={`px-4 py-3 bg-gradient-to-r ${headerBgClass} border-b ${borderClass}`}>
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
          
          <div className="flex items-center space-x-2">
            {isLoading && (
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span className={`text-xs ${secondaryTextClass}`}>Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced File List Content */}
      <div className={viewMode === 'grid' ? 'p-4' : 'p-3'}>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {displayItems.map((item) => (
              <EnhancedGridItem
                key={item.key}
                item={item}
                isSelected={selectedItems.has(item.key)}
                onToggleSelection={onToggleSelection}
                onNavigateToFolder={onNavigateToFolder}
                onPreviewFile={onPreviewFile}
                onDownloadFile={onDownloadFile}
                onDeleteFile={onDeleteFile}
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
                  onDeleteFile={onDeleteFile}
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