// src/components/file-manager/components/FilePreview.tsx

import React from 'react'
import { FolderItem } from '../../../types/fileManager'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { FileIcon } from '../../ui/FileIcon'
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
  if (!previewFile) return null

  const handleDownload = () => {
    onDownload(previewFile.key)
    onClose()
  }

  const renderPreviewContent = () => {
    if (isImageFile(previewFile.name)) {
      return (
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mb-6">
            <FileIcon type="image" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Image preview</p>
            <p className="text-sm text-gray-500 mt-2">
              Click download to view the full image
            </p>
          </div>
          <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between">
              <span className="text-gray-600">File name:</span>
              <span className="font-medium">{previewFile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">File size:</span>
              <span className="font-medium">{formatFileSize(previewFile.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">File type:</span>
              <span className="font-medium">Image</span>
            </div>
            {previewFile.lastModified && (
              <div className="flex justify-between">
                <span className="text-gray-600">Last modified:</span>
                <span className="font-medium">{new Date(previewFile.lastModified).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (isVideoFile(previewFile.name)) {
      return (
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mb-6">
            <FileIcon type="video" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Video file</p>
            <p className="text-sm text-gray-500 mt-2">
              Click download to play the video
            </p>
          </div>
        </div>
      )
    }

    if (isAudioFile(previewFile.name)) {
      return (
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mb-6">
            <FileIcon type="audio" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Audio file</p>
            <p className="text-sm text-gray-500 mt-2">
              Click download to listen to the audio
            </p>
          </div>
        </div>
      )
    }

    // Default file preview
    return (
      <div className="text-center py-12">
        <FileIcon type={previewFile.fileType || 'file'} className="w-20 h-20 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          {previewFile.name}
        </h3>
        <p className="text-gray-600 mb-8 text-lg">
          {formatFileSize(previewFile.size)} • {previewFile.fileType} file
        </p>
        <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-gray-600">File name:</span>
            <span className="font-medium truncate ml-2">{previewFile.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">File size:</span>
            <span className="font-medium">{formatFileSize(previewFile.size)}</span>
          </div>
          {previewFile.lastModified && (
            <div className="flex justify-between">
              <span className="text-gray-600">Last modified:</span>
              <span className="font-medium">{new Date(previewFile.lastModified).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={!!previewFile}
      onClose={onClose}
      title={previewFile.name}
      size="lg"
    >
      <div className="p-6">
        {renderPreviewContent()}
        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            size="lg"
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



