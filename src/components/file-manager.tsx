'use client'

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
  useMemo,
  useCallback
} from 'react'
import { FileObject } from '../utils/r2'
import { useToast } from './toast'

interface FolderItem {
  name: string
  isFolder: boolean
  key: string
  size?: number
  lastModified?: Date
  fullPath?: string // For search results
}

export default function FileManager() {
  const [files, setFiles] = useState<FileObject[]>([])
  const [displayItems, setDisplayItems] = useState<FolderItem[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [currentPath, setCurrentPath] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchFiles()
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch()
    } else {
      processFilesForDisplay()
    }
  }, [files, currentPath, searchQuery])

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(query)
    }, 300)
  }, [])

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const query = searchQuery.toLowerCase().trim()
    const searchResults: FolderItem[] = []
    const seenFolders = new Set<string>()

    files.forEach(file => {
      if (!file.Key) return

      const fileName = file.Key.split('/').pop() || ''
      const folderPath = file.Key.substring(0, file.Key.lastIndexOf('/'))
      
      // Search in file names
      if (fileName.toLowerCase().includes(query)) {
        searchResults.push({
          name: fileName,
          isFolder: false,
          key: file.Key,
          size: file.Size,
          lastModified: file.LastModified,
          fullPath: file.Key
        })
      }
      
      // Search in folder names
      const pathParts = file.Key.split('/').filter(part => part)
      pathParts.forEach((part, index) => {
        if (part.toLowerCase().includes(query)) {
          const folderKey = pathParts.slice(0, index + 1).join('/') + '/'
          if (!seenFolders.has(folderKey)) {
            seenFolders.add(folderKey)
            searchResults.push({
              name: part,
              isFolder: true,
              key: folderKey,
              fullPath: folderKey
            })
          }
        }
      })
    })

    // Remove duplicates and sort
    const uniqueResults = searchResults.filter((item, index, self) => 
      index === self.findIndex(t => t.key === item.key)
    )
    
    uniqueResults.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      return a.name.localeCompare(b.name)
    })

    setDisplayItems(uniqueResults)
    setIsSearching(false)
  }

  const fetchFiles = async () => {
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
    }
  }

  const processFilesForDisplay = () => {
    const items: FolderItem[] = []
    const seenFolders = new Set<string>()

    files.forEach(file => {
      if (!file.Key) return

      // Check if file is in current path
      if (currentPath && !file.Key.startsWith(currentPath)) return
      if (!currentPath && file.Key.includes('/')) {
        // If at root and file has path, only show top-level folders
        const folderName = file.Key.split('/')[0]
        if (!seenFolders.has(folderName)) {
          seenFolders.add(folderName)
          items.push({
            name: folderName,
            isFolder: true,
            key: folderName + '/'
          })
        }
        return
      }

      // Remove current path prefix
      const relativePath = currentPath ? file.Key.substring(currentPath.length) : file.Key
      
      if (relativePath.includes('/')) {
        // It's a nested folder
        const folderName = relativePath.split('/')[0]
        if (!seenFolders.has(folderName)) {
          seenFolders.add(folderName)
          items.push({
            name: folderName,
            isFolder: true,
            key: currentPath + folderName + '/'
          })
        }
      } else if (relativePath) {
        // It's a file in current directory
        items.push({
          name: relativePath,
          isFolder: false,
          key: file.Key,
          size: file.Size,
          lastModified: file.LastModified
        })
      }
    })

    // Sort: folders first, then files, both alphabetically
    items.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      return a.name.localeCompare(b.name)
    })

    setDisplayItems(items)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    abortControllerRef.current = new AbortController()

    try {
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

      addToast({
        type: 'success',
        title: 'Success',
        message: 'File uploaded successfully!'
      })
      setFile(null)
      fetchFiles()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        addToast({
          type: 'info',
          title: 'Upload Cancelled',
          message: 'File upload was cancelled'
        })
      } else {
        console.error('Error uploading file:', error)
        addToast({
          type: 'error',
          title: 'Upload Failed',
          message: 'Error uploading file'
        })
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      abortControllerRef.current = null
    }
  }

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
          setUploadProgress(percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Upload failed'))
      }

      xhr.send(file)

      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload cancelled'))
      })
    })
  }

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

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

  const handleDelete = async (key: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      
      if (!response.ok) throw new Error('Failed to delete file')
      
      addToast({
        type: 'success',
        title: 'Deleted',
        message: 'File deleted successfully'
      })
      fetchFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Error deleting file'
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return

    try {
      const deletePromises = Array.from(selectedItems).map(async (key) => {
        // If it's a folder, delete all files in that folder
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
        title: 'Bulk Delete Complete',
        message: `${selectedItems.size} item(s) deleted successfully`
      })
      
      setSelectedItems(new Set())
      setShowDeleteConfirm(false)
      fetchFiles()
    } catch (error) {
      console.error('Error in bulk delete:', error)
      addToast({
        type: 'error',
        title: 'Bulk Delete Failed',
        message: 'Some items could not be deleted'
      })
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const folderKey = currentPath + newFolderName.trim() + '/.keep'
      
      // Create an empty .keep file to represent the folder
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

      // Upload empty content
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

  const navigateToFolder = (folderKey: string) => {
    setCurrentPath(folderKey)
    setSelectedItems(new Set())
    clearSearch()
  }

  const navigateBack = () => {
    const pathParts = currentPath.split('/').filter(part => part)
    pathParts.pop()
    setCurrentPath(pathParts.length > 0 ? pathParts.join('/') + '/' : '')
    setSelectedItems(new Set())
    clearSearch()
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const navigateToSearchResult = (item: FolderItem) => {
    if (item.isFolder) {
      navigateToFolder(item.key)
    } else {
      // Navigate to the folder containing the file
      const folderPath = item.fullPath?.substring(0, item.fullPath.lastIndexOf('/'))
      if (folderPath) {
        setCurrentPath(folderPath + '/')
        clearSearch()
        // Optionally select the file
        setTimeout(() => {
          setSelectedItems(new Set([item.key]))
        }, 100)
      }
    }
  }

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

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getBreadcrumbs = () => {
    if (!currentPath) return []
    const parts = currentPath.split('/').filter(part => part)
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/') + '/'
    }))
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-600 text-center">
        Cloudflare R2 File Manager
      </h1>
      
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPath('')}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={index}>
              <span>/</span>
              <button
                onClick={() => setCurrentPath(crumb.path)}
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search files and folders..."
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 text-sm">
              {isSearching 
                ? 'Searching...' 
                : `Found ${displayItems.length} result(s) for "${searchQuery}"`
              }
            </span>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload File</h2>
        <form onSubmit={handleUpload} className="mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <div className="cursor-pointer bg-blue-50 text-blue-500 rounded-lg px-4 py-2 border border-blue-300 hover:bg-blue-100 transition duration-300">
                {file ? file.name : 'Choose a file'}
              </div>
            </label>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>

        {/* Create Folder */}
        <div className="flex items-center space-x-4">
          {!showCreateFolder ? (
            <button
              onClick={() => setShowCreateFolder(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Create Folder
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateFolder}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateFolder(false)
                  setNewFolderName('')
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {uploadProgress.toFixed(1)}% uploaded
              </p>
              <button
                onClick={handleCancelUpload}
                className="text-red-500 hover:text-red-600 transition duration-300"
              >
                Cancel Upload
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {displayItems.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.size === displayItems.length && displayItems.length > 0}
                onChange={toggleSelectAll}
                className="mr-2"
              />
              Select All ({displayItems.length})
            </label>
            {selectedItems.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedItems.size} selected
              </span>
            )}
          </div>
          {selectedItems.size > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Delete Selected ({selectedItems.size})
            </button>
          )}
        </div>
      )}

      {/* Files List */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {searchQuery 
            ? `Search Results` 
            : `Files ${currentPath && `in ${currentPath}`}`
          }
        </h2>
        
        {!searchQuery && currentPath && (
          <button
            onClick={navigateBack}
            className="flex items-center text-blue-500 hover:text-blue-600 transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {displayItems.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            {searchQuery 
              ? `No files or folders found matching "${searchQuery}".`
              : 'No files found in this location.'
            }
          </p>
        ) : (
          <div className="space-y-1">
            {displayItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedItems.has(item.key) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.key)}
                    onChange={() => toggleItemSelection(item.key)}
                    className="text-blue-600"
                  />
                  
                  {item.isFolder ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      <button
                        onClick={() => searchQuery ? navigateToSearchResult(item) : navigateToFolder(item.key)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex-1 text-left"
                      >
                        {item.name}
                      </button>
                      {searchQuery && item.fullPath && (
                        <span className="text-xs text-gray-500 ml-2">
                          {item.fullPath}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 flex-1">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">
                            {searchQuery ? (
                              <button
                                onClick={() => navigateToSearchResult(item)}
                                className="text-blue-600 hover:text-blue-800 text-left"
                              >
                                {item.name}
                              </button>
                            ) : (
                              item.name
                            )}
                          </span>
                          <div className="text-xs text-gray-500 flex flex-col items-end">
                            {item.size && <span>{formatFileSize(item.size)}</span>}
                            {item.lastModified && (
                              <span>{new Date(item.lastModified).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        {searchQuery && item.fullPath && (
                          <div className="text-xs text-gray-500 mt-1">
                            Path: {item.fullPath}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {!item.isFolder && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleDownload(item.key)}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 px-2 py-1"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(item.key)}
                      className="text-red-500 hover:text-red-600 transition duration-300 px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Bulk Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedItems.size} selected item(s)? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}