// src/components/file-manager/hooks/useFileManagerState.ts

import { useState, useCallback, useEffect } from 'react'
import { FileObject, FolderItem } from '../../../types/fileManager'

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
      const response = await fetch('/api/files')
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
  }, [])

  // Fetch files on component mount
  useEffect(() => {
    console.log('Component mounted, fetching files...') // Debug log
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