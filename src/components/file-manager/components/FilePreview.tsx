// src/components/file-manager/components/FilePreview.tsx

import React, { useState } from 'react'
import { X, Download, Maximize2 } from 'lucide-react'
import { FolderItem } from '../../../types/fileManager'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { EnhancedFileIcon } from '../../ui/FileIcon'
import { formatFileSize } from '../../../utils/fileUtils'

interface FilePreviewProps {
  previewFile: FolderItem | null
  onClose: () => void
  onDownload: (key: string) => void
  darkMode: boolean
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  previewFile,
  onClose,
  onDownload,
  darkMode
}) => {
  const [imageError, setImageError] = useState(false)
  
  if (!previewFile) return null

  const bgClass = darkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  const isImage = previewFile.fileType === 'image'
  const isVideo = previewFile.fileType === 'video'  
  const isAudio = previewFile.fileType === 'audio'

  // Get signed URL for preview
  const getPreviewUrl = async (key: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, action: 'download' })
      })
      const data = await response.json()
      return data.signedUrl
    } catch (error) {
      console.error('Error getting preview URL:', error)
      return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border ${borderClass}`}>
        <div className={`flex items-center justify-between p-6 border-b ${borderClass}`}>
          <h3 className={`text-xl font-semibold ${textClass}`}>
            Preview: {previewFile.name}
          </h3>
          <button
            onClick={onClose}
            className={`transition-colors p-1 rounded-full cursor-pointer hover:scale-110 ${
              darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Image Preview */}
          {isImage && (
            <ImagePreview 
              fileKey={previewFile.key} 
              fileName={previewFile.name}
              imageError={imageError}
              setImageError={setImageError}
            />
          )}

          {/* Video Preview */}
          {isVideo && (
            <VideoPreview 
              fileKey={previewFile.key} 
              fileName={previewFile.name}
            />
          )}

          {/* Audio Preview */}
          {isAudio && (
            <AudioPreview 
              fileKey={previewFile.key} 
              fileName={previewFile.name}
              darkMode={darkMode}
              borderClass={borderClass}
              textClass={textClass}
            />
          )}

          {/* Default File Preview */}
          {!isImage && !isVideo && !isAudio && (
            <div className="text-center py-12">
              <EnhancedFileIcon type={previewFile.fileType || 'file'} className="w-24 h-24 mx-auto mb-6" />
              <h3 className={`text-2xl font-semibold mb-2 ${textClass}`}>
                {previewFile.name}
              </h3>
              <p className={`mb-6 ${secondaryTextClass}`}>
                {formatFileSize(previewFile.size)} • {previewFile.fileType} file
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="secondary" 
                  onClick={onClose}
                  darkMode={darkMode}
                >
                  Close
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => onDownload(previewFile.key)}
                  darkMode={darkMode}
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Image Preview Component
const ImagePreview: React.FC<{
  fileKey: string
  fileName: string
  imageError: boolean
  setImageError: (error: boolean) => void
}> = ({ fileKey, fileName, imageError, setImageError }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  React.useEffect(() => {
    const loadPreview = async () => {
      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fileKey, action: 'download' })
        })
        const data = await response.json()
        setPreviewUrl(data.signedUrl)
      } catch (error) {
        console.error('Error loading preview:', error)
        setImageError(true)
      }
    }
    loadPreview()
  }, [fileKey, setImageError])

  if (imageError || !previewUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load image preview</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <img
          src={previewUrl}
          alt={fileName}
          className="max-w-full max-h-96 rounded-lg shadow-lg"
          onError={() => setImageError(true)}
        />
        <button className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Video Preview Component
const VideoPreview: React.FC<{
  fileKey: string
  fileName: string
}> = ({ fileKey, fileName }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  React.useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fileKey, action: 'download' })
        })
        const data = await response.json()
        setVideoUrl(data.signedUrl)
      } catch (error) {
        console.error('Error loading video:', error)
      }
    }
    loadVideo()
  }, [fileKey])

  if (!videoUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading video preview...</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <video
        controls
        className="max-w-full max-h-96 rounded-lg shadow-lg"
        preload="metadata"
      >
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

// Audio Preview Component
const AudioPreview: React.FC<{
  fileKey: string
  fileName: string
  darkMode: boolean
  borderClass: string
  textClass: string
}> = ({ fileKey, fileName, darkMode, borderClass, textClass }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  React.useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: fileKey, action: 'download' })
        })
        const data = await response.json()
        setAudioUrl(data.signedUrl)
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    }
    loadAudio()
  }, [fileKey])

  if (!audioUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading audio preview...</p>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <div className={`max-w-md mx-auto p-6 rounded-lg border ${borderClass} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
        <EnhancedFileIcon type="audio" className="w-16 h-16 mx-auto mb-4" />
        <h4 className={`text-lg font-semibold mb-4 ${textClass}`}>{fileName}</h4>
        <audio
          controls
          className="w-full"
          preload="metadata"
        >
          <source src={audioUrl} />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  )
}