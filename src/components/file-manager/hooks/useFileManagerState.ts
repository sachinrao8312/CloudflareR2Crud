// src/components/file-manager/hooks/useFileManagerState.ts

import { useState, useCallback, useEffect } from 'react'
import { FileObject, FolderItem } from '../../../types/fileManager'
import { getFileType, sortFiles, matchesSearchQuery } from '../../../utils/fileUtils'

export const useFileManagerState = () => {
  const [files, setFiles] = useState<FileObject[]>([])
  const [displayItems, setDisplayItems] = useState<FolderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [previewFile, setPreviewFile] = useState<FolderItem | null>(null)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const fetchFiles = useCallback(async () => {
    console.log('Fetching files...') // Debug log
    setIsLoading(true)
    try {
      const response = await fetch(`/api/files?prefix=${encodeURIComponent(currentPath)}`)
      console.log('Response status:', response.status) // Debug log
      
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Fetched data:', data) // Debug log
      
      const filesArray = Array.isArray(data) ? data : []
      setFiles(filesArray)
      console.log('Files set:', filesArray.length, 'files') // Debug log
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
      // You might want to show an error toast here
    } finally {
      setIsLoading(false)
      console.log('Loading set to false') // Debug log
    }
  }, [currentPath])

  // Process files into display items
  useEffect(() => {
    const processFiles = () => {
      let items: FolderItem[] = []
      
      if (searchQuery.trim()) {
        // For search, show all matching files regardless of path
        items = files
          .filter(file => file.Key && matchesSearchQuery(file.Key, searchQuery))
          .map(file => ({
            key: file.Key!,
            name: file.Key!.split('/').pop() || file.Key!,
            size: file.Size,
            lastModified: file.LastModified,
            isFolder: false,
            fileType: getFileType(file.Key!)
          }))
      } else {
        // Group files by folder structure
        const folderMap = new Map<string, FolderItem>()
        const fileItems: FolderItem[] = []
        
        files.forEach(file => {
          if (!file.Key) return
          
          const relativePath = currentPath ? file.Key.replace(currentPath, '') : file.Key
          const pathParts = relativePath.split('/').filter(part => part)
          
          if (pathParts.length === 1) {
            // Direct file in current folder
            fileItems.push({
              key: file.Key,
              name: pathParts[0],
              size: file.Size,
              lastModified: file.LastModified,
              isFolder: false,
              fileType: getFileType(file.Key)
            })
          } else if (pathParts.length > 1) {
            // File in subfolder - create folder entry
            const folderName = pathParts[0]
            const folderKey = currentPath + folderName + '/'
            
            if (!folderMap.has(folderKey)) {
              folderMap.set(folderKey, {
                key: folderKey,
                name: folderName,
                isFolder: true,
                size: 0,
                lastModified: new Date(),
                fileType: 'folder'
              })
            }
          }
        })
        
        items = [...Array.from(folderMap.values()), ...fileItems]
      }
      
      // Sort items
      const sortedItems = sortFiles(items, sortBy, sortOrder)
      setDisplayItems(sortedItems)
    }
    
    processFiles()
  }, [files, currentPath, searchQuery, sortBy, sortOrder])

  // Fetch files on component mount and when path changes
  useEffect(() => {
    console.log('Component mounted or path changed, fetching files...') // Debug log
    fetchFiles()
  }, [fetchFiles])

  const toggleItemSelection = useCallback((key: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(key)) {
        newSelected.delete(key)
      } else {
        newSelected.add(key)
      }
      return newSelected
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === displayItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(displayItems.map(item => item.key)))
    }
  }, [selectedItems.size, displayItems])

  return {
    // State
    files,
    setFiles,
    displayItems,
    setDisplayItems,
    isLoading,
    setIsLoading,
    currentPath,
    setCurrentPath,
    selectedItems,
    setSelectedItems,
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    previewFile,
    setPreviewFile,
    showCreateFolder,
    setShowCreateFolder,
    showDeleteConfirm,
    setShowDeleteConfirm,
    newFolderName,
    setNewFolderName,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    
    // Actions
    fetchFiles,
    toggleItemSelection,
    toggleSelectAll
  }
}