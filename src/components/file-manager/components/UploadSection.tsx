// src/components/file-manager/components/UploadSection.tsx

import React, { useRef, DragEvent } from 'react'
import { Button } from '../../ui/Button'
import { FileIcon } from '../../ui/FileIcon'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { formatFileSize, getFileType } from '../../../utils/fileUtils'

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

export const UploadSection: React.FC<UploadSectionProps> = ({
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onSelectFiles(newFiles)
      // Reset input to allow selecting same files again
      e.target.value = ''
    }
  }

  return (
    <div className="mb-8">
      {/* Enhanced Drop Zone */}
      <div 
        className={`relative bg-white/60 backdrop-blur-sm border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 shadow-lg ${
          dragActive 
            ? 'border-orange-400 bg-orange-50/80 shadow-orange-500/20 shadow-2xl scale-105' 
            : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50/30 hover:shadow-xl'
        }`}
        {...dragHandlers}
      >
        <div className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center shadow-inner transform transition-transform hover:scale-110">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900 mb-2">
              {dragActive ? 'Drop files here!' : 'Drop files here to upload'}
            </p>
            <p className="text-gray-600 text-lg">
              or click below to browse from your device
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="px-8"
              disabled={isUploading}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Choose Files
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={onCreateFolder}
              className="px-8"
              disabled={isUploading}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Folder
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Selected Files for Upload */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Files Ready for Upload ({selectedFiles.length})
            </h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => onSelectFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                loading={isUploading}
                onClick={onUpload}
                disabled={selectedFiles.length === 0}
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </Button>
              {isUploading && (
                <Button
                  variant="secondary"
                  onClick={onCancelUpload}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <FileIcon type={getFileType(file.name)} className="w-10 h-10" />
                  <div>
                    <p className="font-semibold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {isUploading && uploadProgress[file.name] !== undefined ? (
                    <>
                      <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-[50px]">
                        {Math.round(uploadProgress[file.name])}%
                      </span>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(index)}
                      disabled={isUploading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

