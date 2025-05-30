// src/types/fileManager.ts

export interface FileObject {
  Key?: string
  LastModified?: Date
  ETag?: string
  Size?: number
  StorageClass?: string
}

export interface FolderItem {
  name: string
  isFolder: boolean
  key: string
  size?: number
  lastModified?: Date
  fullPath?: string
  fileType?: string
}

export interface UploadProgress {
  [fileName: string]: number
}

export interface FileManagerState {
  // File data
  files: FileObject[]
  displayItems: FolderItem[]
  
  // UI state
  isLoading: boolean
  currentPath: string
  selectedItems: Set<string>
  searchQuery: string
  isSearching: boolean
  previewFile: FolderItem | null
  viewMode: 'grid' | 'list'
  sortBy: 'name' | 'date' | 'size'
  sortOrder: 'asc' | 'desc'
  
  // Modal states
  showCreateFolder: boolean
  showDeleteConfirm: boolean
  newFolderName: string
  
  // State setters
  setFiles: (files: FileObject[]) => void
  setDisplayItems: (items: FolderItem[]) => void
  setIsLoading: (loading: boolean) => void
  setCurrentPath: (path: string) => void
  setSelectedItems: (items: Set<string>) => void
  setSearchQuery: (query: string) => void
  setIsSearching: (searching: boolean) => void
  setPreviewFile: (file: FolderItem | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSortBy: (sortBy: 'name' | 'date' | 'size') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setShowCreateFolder: (show: boolean) => void
  setShowDeleteConfirm: (show: boolean) => void
  setNewFolderName: (name: string) => void
  
  // Actions
  fetchFiles: () => Promise<void>
  toggleItemSelection: (key: string) => void
  toggleSelectAll: () => void
}

export interface BreadcrumbItem {
  name: string
  path: string
}

export type FileType = 
  | 'folder'
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'code' 
  | 'archive' 
  | 'spreadsheet' 
  | 'presentation' 
  | 'file'

export interface FileOperationResult {
  success: boolean
  message?: string
  error?: string
}