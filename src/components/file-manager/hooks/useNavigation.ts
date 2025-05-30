// src/components/file-manager/hooks/useNavigation.ts

import { useCallback, useRef, useEffect, ChangeEvent } from 'react'
import { getBreadcrumbsFromPath, matchesSearchQuery, sortFiles, getFileType } from '../../../utils/fileUtils'

export const useNavigation = (state: any) => {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navigateToFolder = useCallback((folderKey: string) => {
    console.log('Navigating to folder:', folderKey) // Debug log
    state.setCurrentPath(folderKey)
    state.setSelectedItems(new Set())
    state.setSearchQuery('')
  }, [state])

  const navigateBack = useCallback(() => {
    const pathParts = state.currentPath.split('/').filter((part: string) => part)
    pathParts.pop()
    const newPath = pathParts.length > 0 ? pathParts.join('/') + '/' : ''
    console.log('Navigating back to:', newPath) // Debug log
    state.setCurrentPath(newPath)
    state.setSelectedItems(new Set())
  }, [state])

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('Search input:', value) // Debug log
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      state.setSearchQuery(value)
    }, 300)
  }, [state])

  const getBreadcrumbs = useCallback(() => {
    return getBreadcrumbsFromPath(state.currentPath)
  }, [state.currentPath])

  // Separate hook for processing files - moved to a different useEffect
  useEffect(() => {
    console.log('Processing files for display...') // Debug log
    console.log('Files count:', state.files.length) // Debug log
    console.log('Current path:', state.currentPath) // Debug log
    console.log('Search query:', state.searchQuery) // Debug log

    let items: any[] = []
    const seenFolders = new Set<string>()

    if (state.searchQuery.trim()) {
      console.log('Processing search query...') // Debug log
      state.setIsSearching(true)
      
      state.files.forEach((file: any) => {
        if (!file.Key) return
        const fileName = file.Key.split('/').pop() || ''
        if (matchesSearchQuery(fileName, state.searchQuery)) {
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
      
      state.setIsSearching(false)
      console.log('Search results:', items.length) // Debug log
    } else {
      console.log('Processing files for current path...') // Debug log
      
      // Process files for current path
      state.files.forEach((file: any) => {
        if (!file.Key) return

        // If we have a current path, only show files that start with it
        if (state.currentPath && !file.Key.startsWith(state.currentPath)) return
        
        // If no current path and file has slash, it's in a subfolder
        if (!state.currentPath && file.Key.includes('/')) {
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

        // Get relative path from current directory
        const relativePath = state.currentPath ? file.Key.substring(state.currentPath.length) : file.Key
        
        if (relativePath.includes('/')) {
          // This is a subdirectory
          const folderName = relativePath.split('/')[0]
          if (!seenFolders.has(folderName)) {
            seenFolders.add(folderName)
            items.push({
              name: folderName,
              isFolder: true,
              key: state.currentPath + folderName + '/',
              fileType: 'folder'
            })
          }
        } else if (relativePath) {
          // This is a file in current directory
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
      
      console.log('Processed items:', items.length) // Debug log
    }

    // Apply sorting
    const sortedItems = sortFiles(items, state.sortBy, state.sortOrder)
    console.log('Setting display items:', sortedItems.length) // Debug log
    state.setDisplayItems(sortedItems)
  }, [state.files, state.currentPath, state.searchQuery, state.sortBy, state.sortOrder])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return {
    navigateToFolder,
    navigateBack,
    handleSearch,
    getBreadcrumbs,
    setSearchQuery: state.setSearchQuery
  }
}