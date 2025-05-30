// src/components/file-manager/components/FilePreview.tsx

import React, { useState, useEffect } from 'react'
import { FolderItem } from '../../../types/fileManager'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { FileIcon } from '../../ui/FileIcon'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { formatFileSize, isImageFile, isVideoFile, isAudioFile } from '../../../utils/fileUtils'

interface FilePreviewProps {
  previewFile: FolderItem | null
  onClose: () => void
  onDownload: (key: string) => void
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  previewFile,
  onClose,
  onDownload
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  useEffect(() => {
    if (previewFile && (isImageFile(previewFile.name) || isVideoFile(previewFile.name) || isAudioFile(previewFile.name))) {
      loadPreviewUrl()
    } else {
      setPreviewUrl(null)
      setPreviewError(null)
    }
  }, [previewFile])

  const loadPreviewUrl = async () => {
    if (!previewFile) return
    
    setIsLoadingPreview(true)
    setPreviewError(null)
    
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: previewFile.key })
      })
      
      if (!response.ok) throw new Error('Failed to get preview URL')
      const { signedUrl } = await response.json()
      setPreviewUrl(signedUrl)
    } catch (error) {
      console.error('Error loading preview:', error)
      setPreviewError('Failed to load preview')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  if (!previewFile) return null

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: previewFile.key })
      })
      
      if (!response.ok) throw new Error('Failed to get download URL')
      const { signedUrl } = await response.json()
      
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = signedUrl
      link.download = previewFile.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Error downloading file:', error)
      // Fallback to opening in new tab
      onDownload(previewFile.key)
    }
  }

  const renderPreviewContent = () => {
    // Image Preview
    if (isImageFile(previewFile.name)) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
            {isLoadingPreview ? (
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading preview...</p>
              </div>
            ) : previewError ? (
              <div className="text-center">
                <FileIcon type="image" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-red-600">{previewError}</p>
                <Button variant="ghost" onClick={loadPreviewUrl} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : previewUrl ? (
              <img 
                src={previewUrl} 
                alt={previewFile.name}
                className="max-w-full max-h-[400px] object-contain rounded-xl shadow-lg"
                onError={() => setPreviewError('Failed to load image')}
              />
            ) : (
              <div className="text-center">
                <FileIcon type="image" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-gray-600">Image preview unavailable</p>
              </div>
            )}
          </div>
          <FileMetadata file={previewFile} />
        </div>
      )
    }

    // Video Preview
    if (isVideoFile(previewFile.name)) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
            {isLoadingPreview ? (
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading preview...</p>
              </div>
            ) : previewError ? (
              <div className="text-center">
                <FileIcon type="video" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-red-600">{previewError}</p>
                <Button variant="ghost" onClick={loadPreviewUrl} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : previewUrl ? (
              <video 
                controls 
                className="max-w-full max-h-[400px] rounded-xl shadow-lg"
                onError={() => setPreviewError('Failed to load video')}
              >
                <source src={previewUrl} type={`video/${previewFile.name.split('.').pop()}`} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center">
                <FileIcon type="video" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-gray-600">Video preview unavailable</p>
              </div>
            )}
          </div>
          <FileMetadata file={previewFile} />
        </div>
      )
    }

    // Audio Preview
    if (isAudioFile(previewFile.name)) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center">
            <FileIcon type="audio" className="w-24 h-24 mb-6" />
            {isLoadingPreview ? (
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading preview...</p>
              </div>
            ) : previewError ? (
              <div className="text-center">
                <p className="text-red-600 mb-4">{previewError}</p>
                <Button variant="ghost" onClick={loadPreviewUrl}>
                  Try Again
                </Button>
              </div>
            ) : previewUrl ? (
              <audio 
                controls 
                className="w-full max-w-md"
                onError={() => setPreviewError('Failed to load audio')}
              >
                <source src={previewUrl} type={`audio/${previewFile.name.split('.').pop()}`} />
                Your browser does not support the audio tag.
              </audio>
            ) : (
              <p className="text-gray-600">Audio preview unavailable</p>
            )}
          </div>
          <FileMetadata file={previewFile} />
        </div>
      )
    }

    // Text/Code Preview for small files
    if (isTextFile(previewFile.name) && (previewFile.size || 0) < 1024 * 1024) { // < 1MB
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <div className="text-center mb-6">
              <FileIcon type={getFileType(previewFile.name)} className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">{previewFile.name}</h3>
              <p className="text-gray-600">Text file preview</p>
            </div>
            
            {isLoadingPreview ? (
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-4 border max-h-64 overflow-auto">
                <TextFilePreview fileKey={previewFile.key} />
              </div>
            )}
          </div>
          <FileMetadata file={previewFile} />
        </div>
      )
    }

    // Default file preview (non-previewable files)
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileIcon type={previewFile.fileType || 'file'} className="w-24 h-24 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {previewFile.name}
          </h3>
          <p className="text-gray-600 mb-6">
            Preview not available for this file type
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Download the file to view its contents
          </p>
        </div>
        <FileMetadata file={previewFile} />
      </div>
    )
  }

  return (
    <Modal
      isOpen={!!previewFile}
      onClose={onClose}
      title={`Preview: ${previewFile.name}`}
      size="xl"
    >
      <div className="p-6">
        {renderPreviewContent()}
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 8a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            Download File
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Helper component for file metadata
const FileMetadata: React.FC<{ file: FolderItem }> = ({ file }) => (
  <div className="bg-white rounded-xl p-4 border">
    <h4 className="font-semibold text-gray-900 mb-3">File Information</h4>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-gray-600">Name:</span>
        <p className="font-medium truncate">{file.name}</p>
      </div>
      <div>
        <span className="text-gray-600">Size:</span>
        <p className="font-medium">{formatFileSize(file.size)}</p>
      </div>
      <div>
        <span className="text-gray-600">Type:</span>
        <p className="font-medium capitalize">{file.fileType || 'Unknown'}</p>
      </div>
      {file.lastModified && (
        <div>
          <span className="text-gray-600">Modified:</span>
          <p className="font-medium">{new Date(file.lastModified).toLocaleString()}</p>
        </div>
      )}
    </div>
  </div>
)

// Helper component for text file preview
const TextFilePreview: React.FC<{ fileKey: string }> = ({ fileKey }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTextContent()
  }, [fileKey])

  const loadTextContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: fileKey })
      })
      
      if (!response.ok) throw new Error('Failed to load content')
      const { signedUrl } = await response.json()
      
      const textResponse = await fetch(signedUrl)
      if (!textResponse.ok) throw new Error('Failed to fetch file content')
      
      const text = await textResponse.text()
      setContent(text.slice(0, 5000)) // Limit to first 5000 characters
      
    } catch (err) {
      setError('Failed to load file content')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <p className="text-red-600">{error}</p>
  
  return (
    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
      {content}
      {content.length >= 5000 && (
        <p className="text-gray-500 mt-4">... (truncated, download full file to see more)</p>
      )}
    </pre>
  )
}

// Helper functions
const isTextFile = (fileName: string): boolean => {
  const textExtensions = ['txt', 'md', 'json', 'xml', 'csv', 'log', 'js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'yml', 'yaml']
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? textExtensions.includes(ext) : false
}

const getFileType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (!ext) return 'file'
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv', 'm4v']
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma']
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
  const codeTypes = ['js', 'ts', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift']
  
  if (imageTypes.includes(ext)) return 'image'
  if (videoTypes.includes(ext)) return 'video'
  if (audioTypes.includes(ext)) return 'audio'
  if (documentTypes.includes(ext)) return 'document'
  if (codeTypes.includes(ext)) return 'code'
  
  return 'file'
}