// src/components/file-manager/components/UploadDropdown.tsx

import React, { useRef } from 'react'
import { Upload, FolderPlus, ChevronDown, ChevronUp, X, Sparkles, Zap } from 'lucide-react'
import { formatFileSize, getFileType } from '../../../utils/fileUtils'

interface EnhancedUploadDropdownProps {
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

export const EnhancedUploadDropdown: React.FC<EnhancedUploadDropdownProps> = ({
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

  // Enhanced theme classes
  const surfaceClass = darkMode ? 'bg-gray-900/90' : 'bg-white/90'
  const borderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className="space-y-6">
      {/* Enhanced Upload Toggle Button */}
      <button
        onClick={onToggle}
        className={`group w-full flex items-center justify-between px-8 py-6 ${surfaceClass} backdrop-blur-xl border-2 ${borderClass} rounded-3xl shadow-xl transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl ${
          darkMode ? 'hover:bg-gray-800/90 hover:border-gray-600/50' : 'hover:bg-white hover:border-orange-300/50'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25 group-hover:scale-110 transition-all duration-300">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
          </div>
          <div className="text-left">
            <p className={`font-bold text-2xl ${textClass} group-hover:text-orange-500 transition-colors`}>
              Upload Files
            </p>
            <p className={`text-lg ${secondaryTextClass}`}>
              Click to expand upload options
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`text-lg font-medium ${secondaryTextClass}`}>
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            darkMode ? 'bg-gray-800/50' : 'bg-orange-50/50'
          }`}>
            {isOpen ? 
              <ChevronUp className={`w-6 h-6 ${secondaryTextClass} group-hover:text-orange-500 transition-colors`} /> : 
              <ChevronDown className={`w-6 h-6 ${secondaryTextClass} group-hover:text-orange-500 transition-colors`} />
            }
          </div>
        </div>
      </button>

      {/* Enhanced Upload Content */}
      <div className={`overflow-hidden transition-all duration-700 ease-out ${
        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div 
          className={`relative ${darkMode ? 'bg-gray-800/50' : 'bg-orange-50/30'} backdrop-blur-xl border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-700 shadow-2xl cursor-pointer hover:shadow-3xl ${
            dragActive 
              ? 'border-orange-500 bg-orange-500/10 shadow-orange-500/30 shadow-3xl scale-[1.02] animate-pulse' 
              : `${darkMode ? 'border-gray-600 hover:border-orange-500/50 hover:bg-gray-700/60' : 'border-orange-300 hover:border-orange-500/50 hover:bg-orange-100/60'}`
          }`}
          {...dragHandlers}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Animated Background Effects */}
          <div className={`absolute inset-0 opacity-30 transition-opacity duration-500 rounded-3xl ${dragActive ? 'opacity-50' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 animate-gradient-x rounded-3xl" />
          </div>

          {/* Floating Particles */}
          {dragActive && (
            <>
              <div className="absolute top-8 left-8 w-3 h-3 bg-orange-400 rounded-full animate-bounce" />
              <div className="absolute top-12 right-12 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <div className="absolute bottom-12 left-16 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
              <div className="absolute bottom-8 right-8 w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            </>
          )}

          <div className="relative z-10 space-y-10">
            {/* Enhanced Icon with Animations */}
            <div className="relative mx-auto w-28 h-28">
              <div className={`w-28 h-28 mx-auto rounded-3xl flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-600 to-orange-600 shadow-3xl transition-all duration-700 cursor-pointer ${
                dragActive 
                  ? 'shadow-orange-500/50 scale-125 rotate-12 animate-bounce' 
                  : 'shadow-orange-500/30 hover:scale-110 hover:rotate-6'
              }`}>
                <Upload className={`w-14 h-14 text-white transition-all duration-500 ${dragActive ? 'scale-125 animate-pulse' : ''}`} />
              </div>
              
              {/* Magical sparkles */}
              <Sparkles className={`absolute top-0 right-0 w-6 h-6 text-yellow-400 transition-all duration-500 ${
                dragActive ? 'animate-spin scale-125' : 'animate-pulse'
              }`} />
              <Zap className={`absolute bottom-0 left-0 w-5 h-5 text-orange-400 transition-all duration-500 ${
                dragActive ? 'animate-bounce scale-110' : 'animate-pulse'
              }`} />
            </div>

            {/* Enhanced Text Content */}
            <div className="space-y-4">
              <h3 className={`text-4xl font-bold transition-all duration-500 ${
                dragActive ? 'text-orange-500 scale-110 animate-pulse' : textClass
              }`}>
                {dragActive ? '🎯 Drop files here!' : '📁 Upload your files'}
              </h3>
              
              <p className={`text-xl max-w-lg mx-auto leading-relaxed ${secondaryTextClass}`}>
                {dragActive 
                  ? 'Release to upload these files to your cloud storage'
                  : 'Drag & drop files here, paste from clipboard, or click to browse'
                }
              </p>
              
              {/* Enhanced supported formats */}
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-white/70'
              } backdrop-blur-sm`}>
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span className={`text-sm font-medium ${secondaryTextClass}`}>
                  Supports: Images, Videos, Documents, Archives • Max 100MB per file
                </span>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="group px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 group-hover:animate-bounce" />
                  <span className="text-lg">Choose Files</span>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  folderInputRef.current?.click()
                }}
                className="group px-10 py-5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-2xl shadow-xl shadow-gray-500/30 hover:shadow-gray-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FolderPlus className="w-6 h-6 group-hover:animate-pulse" />
                  <span className="text-lg">Upload Folder</span>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateFolder()
                }}
                className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FolderPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-lg">New Folder</span>
                </div>
              </button>
            </div>

            {/* Enhanced Tips */}
            <div className={`space-y-2 text-sm ${secondaryTextClass}`}>
              <p className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <strong>Pro tip:</strong> Copy files and paste here (Ctrl+V)
              </p>
              <p className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Or use the keyboard shortcut 
                <kbd className={`mx-2 px-3 py-1 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}>
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
            {...{ webkitdirectory: "" }}
            onChange={handleFolderInputChange}
            className="hidden"
          />
        </div>

        {/* Enhanced Upload Queue */}
        {selectedFiles.length > 0 && (
          <div className={`mt-8 ${surfaceClass} backdrop-blur-xl border-2 ${borderClass} rounded-3xl shadow-2xl overflow-hidden`}>
            {/* Enhanced Queue Header */}
            <div className={`px-10 py-8 bg-gradient-to-r ${darkMode ? 'from-gray-800/80 to-gray-700/50' : 'from-orange-50/80 to-white'} border-b-2 ${borderClass}`}>
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h3 className={`text-3xl font-bold ${textClass}`}>
                    🗂️ Upload Queue ({totalFiles} files)
                  </h3>
                  <div className={`flex items-center space-x-8 text-lg ${secondaryTextClass}`}>
                    <span className="flex items-center space-x-2">
                      <span>📦</span>
                      <span>Total size: {formatFileSize(totalSize)}</span>
                    </span>
                    {isUploading && (
                      <span className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <span>Progress: {completedFiles}/{totalFiles} files</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {!isUploading && (
                    <button
                      onClick={() => onSelectFiles([])}
                      className={`px-6 py-3 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 ${
                        darkMode 
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-orange-50'
                      }`}
                    >
                      Clear All
                    </button>
                  )}
                  
                  <button
                    onClick={isUploading ? onCancelUpload : onUpload}
                    disabled={selectedFiles.length === 0}
                    className={`px-8 py-4 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${
                      isUploading
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/30'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-orange-500/30'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-lg">Cancel Upload</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Upload className="w-6 h-6" />
                        <span className="text-lg">Upload All Files</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Enhanced Overall Progress */}
              {isUploading && (
                <div className="mt-6">
                  <div className={`flex items-center justify-between text-lg ${secondaryTextClass} mb-3`}>
                    <span className="font-semibold">Overall Progress</span>
                    <span className="font-bold text-orange-500">{Math.round(overallProgress)}%</span>
                  </div>
                  <div className={`w-full h-4 rounded-full shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                      style={{ width: `${overallProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced File List */}
            <div className="max-h-96 overflow-y-auto">
              <div className={`divide-y-2 ${darkMode ? 'divide-gray-700/50' : 'divide-gray-100/50'}`}>
                {selectedFiles.map((file, index) => (
                  <div key={index} className={`flex items-center justify-between p-8 transition-all duration-300 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-orange-50/50'}`}>
                    <div className="flex items-center space-x-6 flex-1 min-w-0">
                      <div className="text-3xl">{getFileIcon(file)}</div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold truncate text-xl ${textClass}`}>
                          {file.name}
                        </p>
                        <p className={`text-lg ${secondaryTextClass}`}>
                          {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      {isUploading && uploadProgress[file.name] !== undefined ? (
                        <div className="flex items-center space-x-6">
                          <div className={`w-40 h-4 rounded-full shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                          </div>
                          <span className={`text-lg font-bold min-w-[60px] ${textClass}`}>
                            {Math.round(uploadProgress[file.name])}%
                          </span>
                          {uploadProgress[file.name] === 100 && (
                            <div className="text-green-500 animate-bounce">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => onRemoveFile(index)}
                          disabled={isUploading}
                          className={`p-3 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-110 active:scale-95 ${
                            darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-6 h-6" />
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

export default EnhancedUploadDropdown