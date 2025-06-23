// src/components/file-manager/index.ts

// Main component
export { default as FileManager } from './FileManager'

// Hooks
export { useFileManagerState } from './hooks/useFileManagerState'
export { useFileUpload } from './hooks/useFileUpload'
export { useFileOperations } from './hooks/useFileOperations'
export { useNavigation } from './hooks/useNavigation'
export { useDragAndDrop } from './hooks/useDragAndDrop'

// Components
export { EnhancedFileManagerHeader, EnhancedFileManagerHeader as FileManagerHeader } from './components/FileManagerHeader'
export { EnhancedBreadcrumbs } from './components/Breadcrumbs'
export { EnhancedBulkActions } from './components/BulkActions'
export { EnhancedFileList } from './components/FileList'
export { FilePreview } from './components/FilePreview'
export { CreateFolderModal } from './components/CreateFolderModal'
export { DeleteConfirmModal } from './components/DeleteConfirmModal'
export { EnhancedUploadDropdown } from './components/UploadDropdown'
export { EnhancedSearchBar } from './components/SearchBar'

// Types
export type { FileObject, FolderItem, FileManagerState, BreadcrumbItem, FileType } from '../../types/fileManager'

// Constants and utilities
export const FILE_MANAGER_CONFIG = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFiles: 100,
  allowedFileTypes: [
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
    // Videos
    'mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv', 'm4v',
    // Audio
    'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma',
    // Documents
    'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
    // Code
    'js', 'ts', 'html', 'css', 'json', 'xml', 'py', 'java',
    'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift',
    // Archives
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
    // Spreadsheets
    'xlsx', 'xls', 'csv',
    // Presentations
    'ppt', 'pptx'
  ],
  chunkSize: 5 * 1024 * 1024, // 5MB chunks for large uploads
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  previewTimeout: 10000, // 10 seconds
  supportedPreviewTypes: ['image', 'video', 'audio', 'document']
}

// Validation utilities
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Failed to upload file',
  DOWNLOAD_FAILED: 'Failed to download file',
  DELETE_FAILED: 'Failed to delete file',
  CREATE_FOLDER_FAILED: 'Failed to create folder',
  FETCH_FILES_FAILED: 'Failed to load files',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  NETWORK_ERROR: 'Network connection error',
  INVALID_FILE_NAME: 'Invalid file name'
}

// Utility function to format file size
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Utility function to validate file
export const validateFile = (file: File) => {
  const errors: string[] = []
  
  // Check file size
  if (file.size > FILE_MANAGER_CONFIG.maxFileSize) {
    errors.push(ERROR_MESSAGES.FILE_TOO_LARGE)
  }
  
  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension && !FILE_MANAGER_CONFIG.allowedFileTypes.includes(extension)) {
    errors.push(ERROR_MESSAGES.INVALID_FILE_TYPE)
  }
  
  // Check file name
  if (file.name.length === 0 || /[<>:"/\\|?*]/.test(file.name)) {
    errors.push(ERROR_MESSAGES.INVALID_FILE_NAME)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Utility function to get file extension
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

// Utility function to estimate upload time
export const estimateUploadTime = (loaded: number, total: number, startTime: number): string => {
  const elapsed = Date.now() - startTime
  const rate = loaded / elapsed // bytes per ms
  const remaining = total - loaded
  const estimatedMs = remaining / rate
  
  if (estimatedMs < 60000) { // Less than 1 minute
    return `${Math.round(estimatedMs / 1000)}s remaining`
  } else if (estimatedMs < 3600000) { // Less than 1 hour
    return `${Math.round(estimatedMs / 60000)}m remaining`
  } else {
    return `${Math.round(estimatedMs / 3600000)}h remaining`
  }
}

// Default export for convenience
export default FILE_MANAGER_CONFIG