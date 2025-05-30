// src/components/file-manager/components/FilePreview.tsx

import React from 'react'
import { X, Download } from 'lucide-react'
import { FolderItem } from '../../../types/fileManager'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { FileIcon } from '../../ui/FileIcon'
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
  if (!previewFile) return null

  const bgClass = darkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200'
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900'
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border ${borderClass}`}>
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
        
        <div className="p-6">
          <div className="text-center py-12">
            <FileIcon type={previewFile.fileType || 'file'} className="w-24 h-24 mx-auto mb-6" />
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
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => onDownload(previewFile.key)}
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}