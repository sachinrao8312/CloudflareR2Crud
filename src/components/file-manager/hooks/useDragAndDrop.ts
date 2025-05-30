// src/components/file-manager/hooks/useDragAndDrop.ts

import { useState, useCallback, DragEvent } from 'react'

interface UseDragAndDropReturn {
  dragActive: boolean
  dragHandlers: {
    onDragEnter: (e: DragEvent) => void
    onDragLeave: (e: DragEvent) => void
    onDragOver: (e: DragEvent) => void
    onDrop: (e: DragEvent) => void
  }
}

export const useDragAndDrop = (
  onFilesDropped: (files: File[]) => void
): UseDragAndDropReturn => {
  const [dragActive, setDragActive] = useState(false)

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only set dragActive to false if we're leaving the drag container entirely
    // This prevents flickering when dragging over child elements
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragActive(false)
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Ensure we show the correct drag effect
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      
      // Filter out directories (they have size 0 and specific type)
      const validFiles = droppedFiles.filter(file => file.size > 0 || file.type !== '')
      
      if (validFiles.length > 0) {
        onFilesDropped(validFiles)
      }
      
      // Clear the drag data
      e.dataTransfer.clearData()
    }
  }, [onFilesDropped])

  const dragHandlers = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  }

  return {
    dragActive,
    dragHandlers
  }
}