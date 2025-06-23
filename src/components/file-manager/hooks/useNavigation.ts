// src/components/file-manager/hooks/useNavigation.ts

import { useCallback, useRef, useEffect, ChangeEvent } from 'react'
import { getBreadcrumbsFromPath } from '../../../utils/fileUtils'

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
    state.setIsSearching(true)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      state.setSearchQuery(value)
      state.setIsSearching(false)
    }, 300)
  }, [state])

  const getBreadcrumbs = useCallback(() => {
    return getBreadcrumbsFromPath(state.currentPath)
  }, [state.currentPath])

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