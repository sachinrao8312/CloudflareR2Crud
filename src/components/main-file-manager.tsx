'use client'

import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useCallback,
  DragEvent
} from 'react'
import { 
  FileIcon, 
  ToastContainer, 
  LoadingSpinner, 
  EmptyState, 
  Modal, 
  Button,
  getFileType,
  formatFileSize,
  Toast,
  FolderItem
} from './file-manager-components'

interface FileObject {
  Key?: string
  LastModified?: Date
  ETag?: string
  Size?: number
  StorageClass?: string
}

const FileManager: React.FC = () => {
  // State management
  const [files, setFiles] = useState<FileObject[]>([])
  const [displayItems, setDisplayItems] = useState<FolderItem[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentPath, setCurrentPath] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [previewFile, setPreviewFile] = useState<FolderItem | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Toast management
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => removeToast(id), 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Fetch files from API
  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/files')
      if (!response.ok) throw new Error('Failed to fetch files')
      const data = await response.json()
      setFiles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch files'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Process files for display with search and sorting
  const processFilesForDisplay = useCallback(() => {
    let items: FolderItem[] = []
    const seenFolders = new Set<string>()

    if (searchQuery.trim()) {
      setIsSearching(true)
      const query = searchQuery.toLowerCase().trim()
      files.forEach(file => {
        if (!file.Key) return
        const fileName = file.Key.split('/').pop() || ''
        if (fileName.toLowerCase().includes(query)) {
          items.push({
            name: fileName,
            isFolder: false,
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
            fullPath: file.Key,
            fileType: getFileType(fileName)
          })
        }
      })
      setIsSearching(false)
    } else {
      files.forEach(file => {
        if (!file.Key) return

        if (currentPath && !file.Key.startsWith(currentPath)) return
        if (!currentPath && file.Key.includes('/')) {
          const folderName = file.Key.split('/')[0]
          if (!seenFolders.has(folderName)) {
            seenFolders.add(folderName)
            items.push({
              name: folderName,
              isFolder: true,
              key: folderName + '/',
              fileType: 'folder'
            })
          }
          return
        }

        const relativePath = currentPath ? file.Key.substring(currentPath.length) : file.Key
        
        if (relativePath.includes('/')) {
          const folderName = relativePath.split('/')[0]
          if (!seenFolders.has(folderName)) {
            seenFolders.add(folderName)
            items.push({
              name: folderName,
              isFolder: true,
              key: currentPath + folderName + '/',
              fileType: 'folder'
            })
          }
        } else if (relativePath) {
          items.push({
            name: relativePath,
            isFolder: false,
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
            fileType: getFileType(relativePath)
          })
        }
      })
    }

    // Apply sorting
    items.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          const dateA = a.lastModified?.getTime() || 0
          const dateB = b.lastModified?.getTime() || 0
          comparison = dateA - dateB
          break
        case 'size':
          comparison = (a.size || 0) - (b.size || 0)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setDisplayItems(items)
  }, [files, currentPath, searchQuery, sortBy, sortOrder])

  // Effects
  useEffect(() => {
    fetchFiles()
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    processFilesForDisplay()
  }, [processFilesForDisplay])

  // Drag and drop handlers
  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      setSelectedFiles(prev => [...prev, ...droppedFiles])
      addToast({
        type: 'success',
        title: 'Files Added',
        message: `${droppedFiles.length} file(s) ready for upload`
      })
    }
  }

  // File upload with progress tracking
  const uploadFileWithProgress = (
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
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Upload failed'))
      xhr.send(file)

      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload cancelled'))
      })
    })
  }

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    const newProgress: { [key: string]: number } = {}
    selectedFiles.forEach(file => {
      newProgress[file.name] = 0
    })
    setUploadProgress(newProgress)
    abortControllerRef.current = new AbortController()

    try {
      for (const file of selectedFiles) {
        const fileName = currentPath + file.name
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, fileType: file.type })
        })
        
        if (!response.ok) throw new Error('Failed to get upload URL')
        const { signedUrl } = await response.json()

        await uploadFileWithProgress(
          file,
          signedUrl,
          abortControllerRef.current.signal
        )
      }

      addToast({
        type: 'success',
        title: 'Upload Complete',
        message: `${selectedFiles.length} file(s) uploaded successfully`
      })
      
      setSelectedFiles([])
      setUploadProgress({})
      fetchFiles()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        addToast({
          type: 'info',
          title: 'Upload Cancelled',
          message: 'File upload was cancelled'
        })
      } else {
        console.error('Error uploading files:', error)
        addToast({
          type: 'error',
          title: 'Upload Failed',
          message: 'Some files could not be uploaded'
        })
      }
    } finally {
      setIsUploading(false)
      setUploadProgress({})
      abortControllerRef.current = null
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...newFiles])
      addToast({
        type: 'success',
        title: 'Files Selected',
        message: `${newFiles.length} file(s) ready for upload`
      })
    }
  }

  // Handle file download
  const handleDownload = async (key: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      
      if (!response.ok) throw new Error('Failed to get download URL')
      const { signedUrl } = await response.json()
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
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return

    try {
      const deletePromises = Array.from(selectedItems).map(async (key) => {
        if (key.endsWith('/')) {
          const folderFiles = files.filter(file => 
            file.Key && file.Key.startsWith(key)
          )
          return Promise.all(
            folderFiles.map(file => 
              fetch('/api/files', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: file.Key })
              })
            )
          )
        } else {
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
        message: `${selectedItems.size} item(s) deleted successfully`
      })
      
      setSelectedItems(new Set())
      setShowDeleteConfirm(false)
      fetchFiles()
    } catch (error) {
      console.error('Error in bulk delete:', error)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Some items could not be deleted'
      })
    }
  }

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const folderKey = currentPath + newFolderName.trim() + '/.keep'
      
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
        message: `Folder "${newFolderName}" created successfully`
      })
      
      setNewFolderName('')
      setShowCreateFolder(false)
      fetchFiles()
    } catch (error) {
      console.error('Error creating folder:', error)
      addToast({
        type: 'error',
        title: 'Failed to Create Folder',
        message: 'Error creating folder'
      })
    }
  }

  // Navigation functions
  const navigateToFolder = (folderKey: string) => {
    setCurrentPath(folderKey)
    setSelectedItems(new Set())
    setSearchQuery('')
  }

  const navigateBack = () => {
    const pathParts = currentPath.split('/').filter(part => part)
    pathParts.pop()
    setCurrentPath(pathParts.length > 0 ? pathParts.join('/') + '/' : '')
    setSelectedItems(new Set())
  }

  // Search handler
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value)
    }, 300)
  }

  // Item selection
  const toggleItemSelection = (key: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedItems(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === displayItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(displayItems.map(item => item.key)))
    }
  }

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    if (!currentPath) return []
    const parts = currentPath.split('/').filter(part => part)
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/') + '/'
    }))
  }

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Gradient */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 transform rotate-3">
                  <span className="text-white font-bold text-lg transform -rotate-3">R2</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    File Manager
                  </h1>
                  <p className="text-sm text-gray-500">Cloudflare R2 Storage</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumbs */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setCurrentPath('')}
              className="flex items-center px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:text-orange-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
              </svg>
              Home
            </button>
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={index}>
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <button
                  onClick={() => setCurrentPath(crumb.path)}
                  className="px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:text-orange-600"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* Enhanced Search and Controls */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search files and folders..."
                onChange={handleSearch}
                className="block w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all duration-200 text-lg placeholder-gray-400"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 text-sm font-medium"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="size">Sort by Size</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-blue-800 font-medium">
                    {isSearching 
                      ? 'Searching...' 
                      : `Found ${displayItems.length} result(s) for "${searchQuery}"`
                    }
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-orange-800 font-semibold">
                      {selectedItems.size} item(s) selected
                    </p>
                    <p className="text-orange-600 text-sm">
                      Choose an action to perform on selected items
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedItems(new Set())}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Upload Section */}
        <div className="mb-8">
          <div 
            className={`relative bg-white/60 backdrop-blur-sm border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 shadow-lg ${
              dragActive 
                ? 'border-orange-400 bg-orange-50/80 shadow-orange-500/20 shadow-2xl scale-105' 
                : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50/30 hover:shadow-xl'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center shadow-inner transform transition-transform hover:scale-110">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 mb-2">
                  Drop files here to upload
                </p>
                <p className="text-gray-600 text-lg">
                  or click below to browse from your device
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Choose Files
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => setShowCreateFolder(true)}
                  className="px-8"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Folder
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected Files for Upload */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Files Ready for Upload ({selectedFiles.length})
                </h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFiles([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="primary"
                    loading={isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? 'Uploading...' : 'Upload All'}
                  </Button>
                  {isUploading && (
                    <Button
                      variant="secondary"
                      onClick={handleCancelUpload}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <FileIcon type={getFileType(file.name)} className="w-10 h-10" />
                      <div>
                        <p className="font-semibold text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    {isUploading && uploadProgress[file.name] !== undefined && (
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[50px]">
                          {Math.round(uploadProgress[file.name])}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced File List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* List Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? 'Search Results' : currentPath ? `Files in ${currentPath}` : 'All Files'}
                </h2>
                {isLoading && <LoadingSpinner />}
              </div>
              
              <div className="flex items-center space-x-3">
                {currentPath && !searchQuery && (
                  <Button
                    variant="ghost"
                    onClick={navigateBack}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Button>
                )}
                {displayItems.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={toggleSelectAll}
                  >
                    {selectedItems.size === displayItems.length ? 'Deselect All' : 'Select All'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* File List Content */}
          <div className={viewMode === 'grid' ? 'p-8' : ''}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">Loading files...</p>
                </div>
              </div>
            ) : displayItems.length === 0 ? (
              <EmptyState
                title={searchQuery ? 'No files found' : 'This folder is empty'}
                description={searchQuery 
                  ? `No files match "${searchQuery}". Try a different search term.`
                  : 'Upload files or create folders to get started with your cloud storage.'
                }
                action={
                  <div className="space-x-3">
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Files
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowCreateFolder(true)}
                    >
                      Create Folder
                    </Button>
                  </div>
                }
              />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {displayItems.map((item) => (
                  <div
                    key={item.key}
                    className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                      selectedItems.has(item.key) 
                        ? 'border-orange-300 bg-orange-50 shadow-lg shadow-orange-500/20 scale-105' 
                        : 'border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                    onClick={() => item.isFolder ? navigateToFolder(item.key) : setPreviewFile(item)}
                  >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.key)}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleItemSelection(item.key)
                        }}
                        className="text-orange-600 focus:ring-orange-500 rounded"
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <FileIcon type={item.fileType || 'file'} className="w-16 h-16" />
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate mb-1" title={item.name}>
                        {item.name}
                      </p>
                      {!item.isFolder && (
                        <p className="text-xs text-gray-500">
                          {formatFileSize(item.size)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {displayItems.map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-6 hover:bg-gray-50/50 transition-all duration-200 ${
                      selectedItems.has(item.key) ? 'bg-orange-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.key)}
                        onChange={() => toggleItemSelection(item.key)}
                        className="text-orange-600 focus:ring-orange-500 rounded"
                      />
                      
                      <FileIcon type={item.fileType || 'file'} className="w-8 h-8" />
                      
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => item.isFolder ? navigateToFolder(item.key) : setPreviewFile(item)}
                          className="text-left w-full group"
                        >
                          <p className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors text-lg">
                            {item.name}
                          </p>
                          {searchQuery && item.fullPath && !item.isFolder && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              Path: {item.fullPath}
                            </p>
                          )}
                        </button>
                      </div>
                      
                      <div className="text-right text-gray-500 text-sm min-w-[120px]">
                        {!item.isFolder && (
                          <div className="space-y-1">
                            <p className="font-medium">{formatFileSize(item.size)}</p>
                            {item.lastModified && (
                              <p className="text-xs">{new Date(item.lastModified).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!item.isFolder && (
                      <div className="flex items-center space-x-2 ml-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPreviewFile(item)
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(item.key)}
                        >
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        title={previewFile?.name || ''}
        size="lg"
      >
        {previewFile && (
          <div className="p-6">
            {previewFile.fileType === 'image' ? (
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mb-6">
                  <FileIcon type="image" className="w-24 h-24 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Image preview would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {previewFile.name} • {formatFileSize(previewFile.size)}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleDownload(previewFile.key)
                    setPreviewFile(null)
                  }}
                >
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileIcon type={previewFile.fileType || 'file'} className="w-20 h-20 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {previewFile.name}
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {formatFileSize(previewFile.size)} • {previewFile.fileType} file
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    handleDownload(previewFile.key)
                    setPreviewFile(null)
                  }}
                >
                  Download File
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showCreateFolder}
        onClose={() => {
          setShowCreateFolder(false)
          setNewFolderName('')
        }}
        title="Create New Folder"
      >
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateFolder(false)
                setNewFolderName('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
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
                This will permanently delete {selectedItems.size} selected item(s). This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleBulkDelete}
            >
              Delete Items
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default FileManager