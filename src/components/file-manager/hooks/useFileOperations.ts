// src/components/file-manager/hooks/useFileOperations.ts

import { useCallback } from 'react'
import { FileManagerState } from '../../../types/fileManager'
import { ToastInput } from '../../../types/toast'

interface UseFileOperationsReturn {
  downloadFile: (key: string, fileName?: string) => Promise<void>
  createFolder: (folderName: string) => Promise<void>
  bulkDelete: () => Promise<void>
}

export const useFileOperations = (
  state: any, // FileManagerState type
  addToast: (toast: ToastInput) => void
): UseFileOperationsReturn => {

  const downloadFile = useCallback(async (key: string, fileName?: string) => {
    try {
      addToast({
        type: 'info',
        title: 'Download Starting',
        message: 'Preparing file for download...'
      })

      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      
      if (!response.ok) throw new Error('Failed to get download URL')
      const { signedUrl } = await response.json()
      
      // Extract filename from key if not provided
      const downloadFileName = fileName || key.split('/').pop() || 'download'
      
      try {
        // Try to use fetch to download and trigger browser download
        const fileResponse = await fetch(signedUrl)
        if (!fileResponse.ok) throw new Error('Failed to fetch file')
        
        const blob = await fileResponse.blob()
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = downloadFileName
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        window.URL.revokeObjectURL(url)
        
        addToast({
          type: 'success',
          title: 'Download Started',
          message: `${downloadFileName} download has started`
        })
        
      } catch (fetchError) {
        // Fallback: open in new tab with download intent
        const link = document.createElement('a')
        link.href = signedUrl
        link.download = downloadFileName
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        addToast({
          type: 'success',
          title: 'Download Started',
          message: `${downloadFileName} opened in new tab`
        })
      }
      
    } catch (error) {
      console.error('Error downloading file:', error)
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: error instanceof Error ? error.message : 'Error downloading file'
      })
    }
  }, [addToast])

  const createFolder = useCallback(async (folderName: string) => {
    if (!folderName.trim()) return

    try {
      addToast({
        type: 'info',
        title: 'Creating Folder',
        message: `Creating folder "${folderName}"...`
      })

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
        message: error instanceof Error ? error.message : 'Error creating folder'
      })
    }
  }, [state, addToast])

  const bulkDelete = useCallback(async () => {
    if (state.selectedItems.size === 0) return

    try {
      addToast({
        type: 'info',
        title: 'Deleting Items',
        message: `Deleting ${state.selectedItems.size} item(s)...`
      })

      const deletePromises = Array.from(state.selectedItems).map(async (key) => {
        try {
          if (typeof key === 'string' && key.endsWith('/')) {
            // Handle folder deletion - delete all files in the folder
            const folderFiles = state.files.filter((file: any) => 
              file.Key && typeof file.Key === 'string' && file.Key.startsWith(key)
            )
            
            const folderDeletePromises = folderFiles.map((file: any) => 
              fetch('/api/files', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: file.Key })
              })
            )
            
            const results = await Promise.allSettled(folderDeletePromises)
            const failedDeletes = results.filter(r => r.status === 'rejected')
            
            if (failedDeletes.length > 0) {
              throw new Error(`Failed to delete ${failedDeletes.length} files in folder`)
            }
            
            return { key, success: true, type: 'folder' }
          } else {
            // Handle single file deletion
            const response = await fetch('/api/files', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key })
            })
            
            if (!response.ok) {
              throw new Error(`Failed to delete file: ${response.statusText}`)
            }
            
            return { key, success: true, type: 'file' }
          }
        } catch (error) {
          console.error(`Error deleting ${key}:`, error)
          return { 
            key, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            type: typeof key === 'string' && key.endsWith('/') ? 'folder' : 'file'
          }
        }
      })

      const results = await Promise.allSettled(deletePromises)
      
      const successful = results.filter(r => 
        r.status === 'fulfilled' && r.value.success
      ).length
      
      const failed = results.filter(r => 
        r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
      ).length

      if (successful > 0) {
        addToast({
          type: 'success',
          title: 'Items Deleted',
          message: `${successful} item(s) deleted successfully${failed > 0 ? `, ${failed} failed` : ''}`
        })
      }

      if (failed > 0) {
        addToast({
          type: 'error',
          title: 'Some Deletions Failed',
          message: `${failed} item(s) could not be deleted`
        })
      }
      
      state.setSelectedItems(new Set())
      state.setShowDeleteConfirm(false)
      state.fetchFiles()
      
    } catch (error) {
      console.error('Error in bulk delete:', error)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: error instanceof Error ? error.message : 'Unexpected error during deletion'
      })
    }
  }, [state, addToast])

  return {
    downloadFile,
    createFolder,
    bulkDelete
  }
}