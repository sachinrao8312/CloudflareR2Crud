// src/components/file-manager/components/CreateFolderModal.tsx

import React, { useState, useEffect } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { isValidFileName, sanitizeFileName } from '../../../utils/fileUtils'

interface CreateFolderModalProps {
  isOpen: boolean
  currentPath: string
  onClose: () => void
  onCreateFolder: (folderName: string) => Promise<void>
  folderName: string
  onFolderNameChange: (name: string) => void
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  currentPath,
  onClose,
  onCreateFolder,
  folderName,
  onFolderNameChange
}) => {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setError('')
      setIsCreating(false)
    }
  }, [isOpen])

  const handleCreateFolder = async () => {
    const trimmedName = folderName.trim()
    
    if (!trimmedName) {
      setError('Folder name cannot be empty')
      return
    }

    if (!isValidFileName(trimmedName)) {
      setError('Folder name contains invalid characters')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      await onCreateFolder(trimmedName)
    } catch (error) {
      setError('Failed to create folder')
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating && folderName.trim()) {
      handleCreateFolder()
    }
  }

  const suggestValidName = () => {
    if (folderName && !isValidFileName(folderName)) {
      return sanitizeFileName(folderName)
    }
    return ''
  }

  const validName = suggestValidName()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
    >
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => {
              onFolderNameChange(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter folder name"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg transition-colors ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            autoFocus
          />
          
          {currentPath && (
            <p className="text-sm text-gray-500 mt-2">
              Will be created in: <span className="font-medium">{currentPath}</span>
            </p>
          )}
          
          {error && (
            <p className="text-sm text-red-600 mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          
          {validName && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Suggestion:</strong> "{validName}"
              </p>
              <button
                onClick={() => onFolderNameChange(validName)}
                className="text-sm text-blue-600 underline hover:text-blue-800 mt-1"
              >
                Use this name
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateFolder}
            loading={isCreating}
            disabled={!folderName.trim() || !!error}
          >
            {isCreating ? 'Creating...' : 'Create Folder'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}