import React, { useRef, DragEvent, useState, useEffect } from 'react'

interface UploadSectionProps {
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
    onDragEnter: (e: DragEvent) => void
    onDragLeave: (e: DragEvent) => void
    onDragOver: (e: DragEvent) => void
    onDrop: (e: DragEvent) => void
  }
}

const EnhancedUploadSection: React.FC<UploadSectionProps> = ({
  selectedFiles,
  uploadProgress,
  isUploading,
  dragActive,
  onSelectFiles,
  onUpload,
  onCancelUpload,
  onRemoveFile,
  onCreateFolder,
  dragHandlers
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [pasteActive, setPasteActive] = useState(false)

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onSelectFiles(newFiles)
      e.target.value = '' // Reset for re-selection
    }
  }

  // Handle folder input change
  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onSelectFiles(newFiles)
      e.target.value = ''
    }
  }

  // Handle paste functionality
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        e.preventDefault()
        const pastedFiles = Array.from(e.clipboardData.files)
        onSelectFiles(pastedFiles)
        setPasteActive(true)
        setTimeout(() => setPasteActive(false), 2000)
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [onSelectFiles])

  // Calculate upload statistics
  const totalFiles = selectedFiles.length
  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)
  const completedFiles = Object.values(uploadProgress).filter(progress => progress === 100).length
  const overallProgress = totalFiles > 0 
    ? Object.values(uploadProgress).reduce((acc, progress) => acc + progress, 0) / totalFiles 
    : 0

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('zip') || file.type.includes('archive')) return '📦'
    return '📄'
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Drop Zone */}
      <div 
        className={`relative overflow-hidden transition-all duration-500 ease-out ${
          dragActive 
            ? 'transform scale-105' 
            : 'transform scale-100'
        }`}
        {...dragHandlers}
      >
        <div className={`
          relative bg-gradient-to-br from-white/80 via-blue-50/30 to-indigo-50/40 
          backdrop-blur-xl border-2 border-dashed rounded-3xl p-12 text-center
          transition-all duration-500 ease-out shadow-xl
          ${dragActive 
            ? 'border-blue-500 bg-blue-50/60 shadow-blue-500/30 shadow-2xl' 
            : pasteActive
            ? 'border-green-500 bg-green-50/60 shadow-green-500/30'
            : 'border-gray-300/60 hover:border-blue-400/80 hover:bg-blue-50/20 hover:shadow-2xl'
          }
        `}>
          {/* Animated Background */}
          <div className={`
            absolute inset-0 opacity-20 transition-opacity duration-500
            ${dragActive ? 'opacity-40' : 'opacity-0'}
          `}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Icon and Animation */}
            <div className="relative mx-auto w-24 h-24">
              <div className={`
                w-24 h-24 mx-auto rounded-3xl flex items-center justify-center
                bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600
                shadow-2xl transition-all duration-500 ease-out
                ${dragActive 
                  ? 'shadow-blue-500/40 scale-110 rotate-6' 
                  : 'shadow-blue-500/20 hover:scale-105 hover:rotate-3'
                }
              `}>
                <svg 
                  className={`w-12 h-12 text-white transition-all duration-500 ${
                    dragActive ? 'scale-125' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              
              {/* Floating particles effect */}
              {dragActive && (
                <div className="absolute inset-0">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                  <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  <div className="absolute bottom-3 left-4 w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h3 className={`text-3xl font-bold transition-all duration-300 ${
                dragActive 
                  ? 'text-blue-700 scale-105' 
                  : pasteActive 
                  ? 'text-green-700'
                  : 'text-gray-800'
              }`}>
                {dragActive 
                  ? '🎯 Drop files here!' 
                  : pasteActive
                  ? '✨ Files pasted!'
                  : '📁 Upload your files'
                }
              </h3>
              
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                {dragActive 
                  ? 'Release to upload these files to your cloud storage'
                  : 'Drag & drop files here, paste from clipboard, or click to browse'
                }
              </p>
              
              {/* Supported formats */}
              <div className="text-sm text-gray-500">
                <p>Supports: Images, Videos, Documents, Archives • Max 100MB per file</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Choose Files</span>
                </div>
              </button>

              <button
                onClick={() => folderInputRef.current?.click()}
                disabled={isUploading}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Upload Folder</span>
                </div>
              </button>

              <button
                onClick={onCreateFolder}
                disabled={isUploading}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Folder</span>
                </div>
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>💡 <strong>Pro tip:</strong> Copy files and paste here (Ctrl+V)</p>
              <p>🎯 Or use the keyboard shortcut <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+U</kbd> to quick upload</p>
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
            // @ts-ignore
            webkitdirectory=""
            directory=""
            onChange={handleFolderInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Queue */}
      {selectedFiles.length > 0 && (
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Queue Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Upload Queue ({totalFiles} files)
                </h3>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span>📦 Total size: {formatFileSize(totalSize)}</span>
                  {isUploading && (
                    <span>⚡ Progress: {completedFiles}/{totalFiles} files</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {!isUploading && (
                  <button
                    onClick={() => onSelectFiles([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
                
                <button
                  onClick={isUploading ? onCancelUpload : onUpload}
                  disabled={selectedFiles.length === 0}
                  className={`px-8 py-3 font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                    isUploading
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Cancel Upload</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload All Files</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Overall Progress */}
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="text-2xl">{getFileIcon(file)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-lg">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {isUploading && uploadProgress[file.name] !== undefined ? (
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[50px]">
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
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        aria-label={`Remove ${file.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
  )
}

export default EnhancedUploadSection;