// src/components/file-manager/hooks/useFileUpload.ts

import { useState, useRef, useCallback } from 'react'
import { FileManagerState, UploadProgress } from '../../../types/fileManager'
import { ToastInput } from '../../../types/toast'

interface UseFileUploadReturn {
  selectedFiles: File[]
  uploadProgress: UploadProgress
  isUploading: boolean
  selectFiles: (files: File[]) => void
  addFiles: (files: File[]) => void
  removeFile: (index: number) => void
  uploadFiles: () => Promise<void>
  cancelUpload: () => void
  clearFiles: () => void
}

export const useFileUpload = (
  state: any, // State from useFileManagerState  
  addToast: (toast: ToastInput) => void
): UseFileUploadReturn => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [isUploading, setIsUploading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const selectFiles = useCallback((files: File[]) => {
    setSelectedFiles(files)
    addToast({
      type: 'success',
      title: 'Files Selected',
      message: `${files.length} file(s) ready for upload`
    })
  }, [addToast])

  const addFiles = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files])
    addToast({
      type: 'success',
      title: 'Files Added',
      message: `${files.length} file(s) added to upload queue`
    })
  }, [addToast])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setSelectedFiles([])
    setUploadProgress({})
  }, [])

  const uploadFileWithProgress = useCallback((
    file: File,
    signedUrl: string,
    signal: AbortSignal
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(prev => ({ ...prev, [file.name]: percentComplete }))
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Upload failed'))
      xhr.onabort = () => reject(new Error('Upload cancelled'))
      
      xhr.send(file)

      signal.addEventListener('abort', () => {
        xhr.abort()
      })
    })
  }, [])

  const uploadFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    const newProgress: UploadProgress = {}
    selectedFiles.forEach(file => {
      newProgress[file.name] = 0
    })
    setUploadProgress(newProgress)
    abortControllerRef.current = new AbortController()

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const fileName = state.currentPath + file.name
        
        // Get signed URL
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, fileType: file.type })
        })
        
        if (!response.ok) {
          throw new Error(`Failed to get upload URL for ${file.name}`)
        }
        
        const { signedUrl } = await response.json()

        // Upload file with progress tracking
        await uploadFileWithProgress(
          file,
          signedUrl,
          abortControllerRef.current!.signal
        )
        
        return { fileName: file.name, success: true }
      })

      const results = await Promise.allSettled(uploadPromises)
      
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      if (successful > 0) {
        addToast({
          type: 'success',
          title: 'Upload Complete',
          message: `${successful} file(s) uploaded successfully${failed > 0 ? `, ${failed} failed` : ''}`
        })
      }

      if (failed > 0) {
        addToast({
          type: 'error',
          title: 'Upload Errors',
          message: `${failed} file(s) failed to upload`
        })
      }
      
      clearFiles()
      // Refresh file list
      state.fetchFiles()
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('abort')) {
          addToast({
            type: 'info',
            title: 'Upload Cancelled',
            message: 'File upload was cancelled'
          })
        } else {
          addToast({
            type: 'error',
            title: 'Upload Failed',
            message: error.message || 'Some files could not be uploaded'
          })
        }
      }
    } finally {
      setIsUploading(false)
      setUploadProgress({})
      abortControllerRef.current = null
    }
  }, [selectedFiles, state.currentPath, state.fetchFiles, uploadFileWithProgress, addToast, clearFiles])

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    selectedFiles,
    uploadProgress,
    isUploading,
    selectFiles,
    addFiles,
    removeFile,
    uploadFiles,
    cancelUpload,
    clearFiles
  }
}