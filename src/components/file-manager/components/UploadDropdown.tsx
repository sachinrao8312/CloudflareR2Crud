// src/components/file-manager/components/UploadDropdown.tsx

import React, { useRef } from 'react'
import { Upload, FolderPlus, ChevronDown, ChevronUp, X } from 'lucide-react'
import { formatFileSize, getFileType } from '../../../utils/fileUtils'
import { FileIcon } from '../../ui/FileIcon'
import { Button } from '../../ui/Button'

interface UploadDropdownProps {
  isOpen: boolean
  onToggle: () => void
  selectedFiles: File[]
  uploadProgress: { [key: string]: number }
  isUploading: boolean
  dragActive: boolean
  onSelectFiles: (files: File[]) => void
  onUpload: () => Promise<void>
  onCancelUpload: () => void
  onRemoveFile: (index: number) => void
  onCreateFolder: () => void
  dragHandlers: {
    onDragEnter: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
  }
  darkMode: boolean
}

export const UploadDropdown: React.FC<UploadDropdownProps> = ({
  isOpen,
  onToggle,
  selectedFiles,
  uploadProgress,
  isUploading,
  dragActive,
  onSelectFiles,
  onUpload,
  onCancelUpload,
  onRemoveFile,
  onCreateFolder,
  dragHandlers,
  darkMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onSelectFiles(files)
      e.target.value = ''
    }
  }

  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onSelectFiles(files)
      e.target.value = ''
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('zip') || file.type.includes('archive')) return '📦'
    return '📄'
  }

  // Calculate upload statistics
  const totalFiles = selectedFiles.length
  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)
  const completedFiles = Object.values(uploadProgress).filter(progress => progress === 100).length
  const overallProgress = totalFiles > 0 
    ? Object.values(uploadProgress).reduce((acc, progress) => acc + progress, 0) / totalFiles 
    : 0

  const bgClass = darkMode ? 'bg-gray-900/80' : 'bg-gray-50/80'
  const borderClass = darkMode ? 'border-gray-800' : 'border-gray-200'
  const surfaceClass = darkMode ? 'bg-gray-800/80' : 'bg-white/80'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className="mb-8">
      {/* Upload Toggle Button */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-6 py-4 ${surfaceClass} backdrop-blur-sm border ${borderClass} rounded-2xl shadow-lg transition-all duration-200 cursor-pointer hover:scale-102 hover:shadow-xl ${
          darkMode ? 'hover:bg-gray-700/80 hover:border-gray-700' : 'hover:bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className={`font-semibold text-lg ${textClass}`}>Upload Files</p>
            <p className={`text-sm ${secondaryTextClass}`}>
              Click to expand upload options
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${secondaryTextClass}`}>
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? 
            <ChevronUp className={`w-5 h-5 ${secondaryTextClass}`} /> : 
            <ChevronDown className={`w-5 h-5 ${secondaryTextClass}`} />
          }
        </div>
      </button>

      {/* Upload Content - Slides Down */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <div 
          className={`relative ${bgClass} backdrop-blur-sm border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 shadow-xl cursor-pointer hover:shadow-2xl hover:shadow-orange-500/10 ${
            dragActive 
              ? 'border-orange-500 bg-orange-500/10 shadow-orange-500/30 shadow-2xl scale-105' 
              : `${darkMode ? 'border-gray-700 hover:border-orange-500/50 hover:bg-gray-800/60' : 'border-gray-300 hover:border-orange-500/50 hover:bg-gray-100/60'}`
          }`}
          {...dragHandlers}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Animated Background */}
          <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 rounded-3xl ${dragActive ? 'opacity-40' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse rounded-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Icon and Animation */}
            <div className="relative mx-auto w-24 h-24">
              <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 shadow-2xl transition-all duration-500 ease-out cursor-pointer hover:scale-110 active:scale-95 ${
                dragActive ? 'shadow-orange-500/40 scale-110 rotate-6' : 'shadow-orange-500/20 hover:rotate-3'
              }`}>
                <Upload className={`w-12 h-12 text-white transition-all duration-500 ${dragActive ? 'scale-125' : ''}`} />
              </div>
              
              {/* Floating particles effect */}
              {dragActive && (
                <div className="absolute inset-0">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
                  <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  <div className="absolute bottom-3 left-4 w-1 h-1 bg-orange-600 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h3 className={`text-3xl font-bold transition-all duration-300 ${
                dragActive ? 'text-orange-400 scale-105' : textClass
              }`}>
                {dragActive ? '🎯 Drop files here!' : '📁 Upload your files'}
              </h3>
              
              <p className={`text-lg max-w-md mx-auto leading-relaxed ${secondaryTextClass}`}>
                {dragActive 
                  ? 'Release to upload these files to your cloud storage'
                  : 'Drag & drop files here, paste from clipboard, or click to browse'
                }
              </p>
              
              {/* Supported formats */}
              <div className={`text-sm ${secondaryTextClass}`}>
                <p>Supports: Images, Videos, Documents, Archives • Max 100MB per file</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Choose Files</span>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  folderInputRef.current?.click()
                }}
                className="group px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-2xl shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FolderPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>Upload Folder</span>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateFolder()
                }}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FolderPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  <span>New Folder</span>
                </div>
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className={`text-xs space-y-1 ${secondaryTextClass}`}>
              <p>💡 <strong>Pro tip:</strong> Copy files and paste here (Ctrl+V)</p>
              <p className="flex items-center justify-center gap-2">
                🎯 Or use the keyboard shortcut 
                <kbd className={`px-2 py-1 rounded border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                  Ctrl+U
                </kbd> 
                to quick upload
              </p>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept="*/*"
          />
          
          <input
            ref={folderInputRef}
            type="file"
            multiple
            webkitdirectory=""
            directory=""
            onChange={handleFolderInputChange}
            className="hidden"
          />
        </div>

        {/* Upload Queue */}
        {selectedFiles.length > 0 && (
          <div className={`mt-4 ${surfaceClass} backdrop-blur-xl border ${borderClass} rounded-3xl shadow-2xl overflow-hidden`}>
            {/* Queue Header */}
            <div className={`px-8 py-6 bg-gradient-to-r ${darkMode ? 'from-gray-800/80 to-gray-700/50' : 'from-gray-50/80 to-white'} border-b ${borderClass}`}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold ${textClass}`}>
                    Upload Queue ({totalFiles} files)
                  </h3>
                  <div className={`flex items-center space-x-6 text-sm ${secondaryTextClass}`}>
                    <span>📦 Total size: {formatFileSize(totalSize)}</span>
                    {isUploading && (
                      <span>⚡ Progress: {completedFiles}/{totalFiles} files</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {!isUploading && (
                    <Button
                      variant="ghost"
                      onClick={() => onSelectFiles([])}
                    >
                      Clear All
                    </Button>
                  )}
                  
                  <Button
                    variant={isUploading ? "danger" : "primary"}
                    onClick={isUploading ? onCancelUpload : onUpload}
                    disabled={selectedFiles.length === 0}
                    loading={isUploading}
                  >
                    {isUploading ? 'Cancel Upload' : 'Upload All Files'}
                  </Button>
                </div>
              </div>

              {/* Overall Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className={`flex items-center justify-between text-sm ${secondaryTextClass} mb-2`}>
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 shadow-inner`}>
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* File List */}
            <div className="max-h-96 overflow-y-auto">
              <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {selectedFiles.map((file, index) => (
                  <div key={index} className={`flex items-center justify-between p-6 transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50/50'}`}>
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="text-2xl">{getFileIcon(file)}</div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate text-lg ${textClass}`}>
                          {file.name}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {isUploading && uploadProgress[file.name] !== undefined ? (
                        <div className="flex items-center space-x-4">
                          <div className={`w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 shadow-inner`}>
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium min-w-[50px] ${textClass}`}>
                            {Math.round(uploadProgress[file.name])}%
                          </span>
                          {uploadProgress[file.name] === 100 && (
                            <div className="text-green-500">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => onRemoveFile(index)}
                          disabled={isUploading}
                          className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 cursor-pointer hover:scale-110 ${
                            darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}