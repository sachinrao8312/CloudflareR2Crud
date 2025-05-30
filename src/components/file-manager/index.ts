// src/components/file-manager/index.ts


// Main component
export { default } from './FileManager'

// Hooks
export { useFileManagerState } from './hooks/useFileManagerState'
export { useFileUpload } from './hooks/useFileUpload'
export { useFileOperations } from './hooks/useFileOperations'
export { useNavigation } from './hooks/useNavigation'
export { useDragAndDrop } from './hooks/useDragAndDrop'

// Components
export { FileManagerHeader } from './components/FileManagerHeader'
export { Breadcrumbs } from './components/Breadcrumbs'
export { SearchBar } from './components/SearchBar'
export { BulkActions } from './components/BulkActions'
export { UploadSection } from './components/UploadSection'
export { FileList } from './components/FileList'
export { FilePreview } from './components/FilePreview'
export { CreateFolderModal } from './components/CreateFolderModal'
export { DeleteConfirmModal } from './components/DeleteConfirmModal'

// src/components/ui/index.ts

// UI Components


// src/components/toast/index.ts

// Toast System
import { ToastConfig } from '@/types/toast'


// src/config/fileManager.ts


// File Manager Configuration
export const FILE_MANAGER_CONFIG = {
  // Upload settings
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFilesPerUpload: 50,
  allowedFileTypes: [
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
    // Videos
    'mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv', 'm4v',
    // Audio
    'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma',
    // Documents
    'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
    // Code files
    'js', 'ts', 'html', 'css', 'json', 'xml', 'py', 'java',
    'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift',
    // Archives
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
    // Spreadsheets
    'xlsx', 'xls', 'csv',
    // Presentations
    'ppt', 'pptx'
  ],

  // UI settings
  defaultViewMode: 'list' as 'grid' | 'list',
  defaultSortBy: 'name' as 'name' | 'date' | 'size',
  defaultSortOrder: 'asc' as 'asc' | 'desc',
  
  // Search settings
  searchDebounceMs: 300,
  
  // Grid view settings
  gridColumns: {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 8
  },

  // Performance settings
  virtualScrolling: false, // Enable for large file lists
  lazyLoadThumbnails: true,
  
  // Feature flags
  features: {
    dragAndDrop: true,
    bulkOperations: true,
    filePreview: true,
    folderCreation: true,
    fileSearch: true,
    sortAndFilter: true,
    keyboardShortcuts: true
  }
}

// Toast Configuration
export const TOAST_CONFIG: ToastConfig = {
  maxToasts: 5,
  defaultDuration: 5000,
  position: 'top-right'
}

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  search: 'ctrl+k',
  selectAll: 'ctrl+a',
  delete: 'delete',
  escape: 'escape',
  upload: 'ctrl+u',
  newFolder: 'ctrl+shift+n'
}

// Error Messages
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

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'File uploaded successfully',
  DOWNLOAD_SUCCESS: 'Download started',
  DELETE_SUCCESS: 'File deleted successfully',
  CREATE_FOLDER_SUCCESS: 'Folder created successfully',
  BULK_DELETE_SUCCESS: 'Items deleted successfully'
}

// File type icons mapping (for fallback)
export const FILE_TYPE_ICONS = {
  folder: '📁',
  image: '🖼️',
  video: '🎥',
  audio: '🎵',
  document: '📄',
  code: '💻',
  archive: '📦',
  spreadsheet: '📊',
  presentation: '📋',
  file: '📄'
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

// Utility function to format upload progress
export const formatUploadProgress = (loaded: number, total: number): string => {
  const percentage = Math.round((loaded / total) * 100)
  return `${percentage}%`
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