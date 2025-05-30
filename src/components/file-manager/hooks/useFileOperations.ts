// src/components/file-manager/hooks/useFileOperations.ts

import { useCallback } from 'react'
import { FileManagerState } from '../../../types/fileManager'
import { ToastInput } from '../../../types/toast'

interface UseFileOperationsReturn {
  downloadFile: (key: string) => Promise<void>
  createFolder: (folderName: string) => Promise<void>
  bulkDelete: () => Promise<void>
}

export const useFileOperations = (
  state: any, // FileManagerState type
  addToast: (toast: ToastInput) => void
): UseFileOperationsReturn => {

  const downloadFile = useCallback(async (key: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      
      if (!response.ok) throw new Error('Failed to get download URL')
      const { signedUrl } = await response.json()
      
      // Open download in new tab
      window.open(signedUrl, '_blank')
      
      addToast({
        type: 'success',
        title: 'Download Started',
        message: 'File download has started'
      })
    } catch (error) {
      console.error('Error downloading file:', error)
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Error downloading file'
      })
    }
  }, [addToast])

  const createFolder = useCallback(async (folderName: string) => {
    if (!folderName.trim()) return

    try {
      const folderKey = state.currentPath + folderName.trim() + '/.keep'
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: folderKey, 
          fileType: 'text/plain' 
        })
      })
      
      if (!response.ok) throw new Error('Failed to create folder')
      const { signedUrl } = await response.json()

      await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: ''
      })

      addToast({
        type: 'success',
        title: 'Folder Created',
        message: `Folder "${folderName}" created successfully`
      })
      
      state.setNewFolderName('')
      state.setShowCreateFolder(false)
      state.fetchFiles()
    } catch (error) {
      console.error('Error creating folder:', error)
      addToast({
        type: 'error',
        title: 'Failed to Create Folder',
        message: 'Error creating folder'
      })
    }
  }, [state, addToast])

  const bulkDelete = useCallback(async () => {
    if (state.selectedItems.size === 0) return

    try {
      const deletePromises = Array.from(state.selectedItems).map(async (key) => {
        if (typeof key === 'string' && key.endsWith('/')) {
          // Handle folder deletion
          const folderFiles = state.files.filter((file: any) => 
            file.Key && typeof file.Key === 'string' && file.Key.startsWith(key)
          )
          return Promise.all(
            folderFiles.map((file: any) => 
              fetch('/api/files', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: file.Key })
              })
            )
          )
        } else {
          // Handle single file deletion
          return fetch('/api/files', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
          })
        }
      })

      await Promise.all(deletePromises)
      
      addToast({
        type: 'success',
        title: 'Items Deleted',
        message: `${state.selectedItems.size} item(s) deleted successfully`
      })
      
      state.setSelectedItems(new Set())
      state.setShowDeleteConfirm(false)
      state.fetchFiles()
    } catch (error) {
      console.error('Error in bulk delete:', error)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Some items could not be deleted'
      })
    }
  }, [state, addToast])

  return {
    downloadFile,
    createFolder,
    bulkDelete
  }
}

