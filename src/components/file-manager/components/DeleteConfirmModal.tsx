// src/components/file-manager/components/DeleteConfirmModal.tsx

import React, { useState } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'

interface DeleteConfirmModalProps {
  isOpen: boolean
  selectedCount: number
  onClose: () => void
  onConfirmDelete: () => Promise<void>
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onConfirmDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirmDelete()
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Selected Items"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Are you sure?
            </h3>
            <p className="text-gray-600">
              This will permanently delete <strong>{selectedCount}</strong> selected item{selectedCount !== 1 ? 's' : ''}. This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                Deleted files cannot be recovered. Make sure you have backups if needed.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : `Delete ${selectedCount} Item${selectedCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}