// src/utils/fileUtils.ts

import { FileType } from '../types/fileManager'

// File type detection
export const getFileType = (fileName: string): FileType => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  if (!ext) return 'file'
  
  const fileTypeMap: Record<string, FileType> = {
    // Images
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', 
    webp: 'image', svg: 'image', bmp: 'image', ico: 'image',
    
    // Videos
    mp4: 'video', avi: 'video', mov: 'video', wmv: 'video',
    webm: 'video', mkv: 'video', flv: 'video', m4v: 'video',
    
    // Audio
    mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio',
    aac: 'audio', m4a: 'audio', wma: 'audio',
    
    // Documents
    pdf: 'document', doc: 'document', docx: 'document',
    txt: 'document', rtf: 'document', odt: 'document',
    
    // Code
    js: 'code', ts: 'code', html: 'code', css: 'code',
    json: 'code', xml: 'code', py: 'code', java: 'code',
    cpp: 'code', c: 'code', php: 'code', rb: 'code',
    go: 'code', rs: 'code', swift: 'code',
    
    // Archives
    zip: 'archive', rar: 'archive', '7z': 'archive',
    tar: 'archive', gz: 'archive', bz2: 'archive', xz: 'archive',
    
    // Spreadsheets
    xlsx: 'spreadsheet', xls: 'spreadsheet', csv: 'spreadsheet',
    
    // Presentations
    ppt: 'presentation', pptx: 'presentation'
  }
  
  return fileTypeMap[ext] || 'file'
}

// File size formatter
export const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  
  return `${Math.round(size * 100) / 100} ${sizes[i]}`
}

// Generate unique file ID
export const generateFileId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

// Check if file is image
export const isImageFile = (fileName: string): boolean => {
  return getFileType(fileName) === 'image'
}

// Check if file is video
export const isVideoFile = (fileName: string): boolean => {
  return getFileType(fileName) === 'video'
}

// Check if file is audio
export const isAudioFile = (fileName: string): boolean => {
  return getFileType(fileName) === 'audio'
}

// Get file extension
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

// Remove file extension
export const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.')
  return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
}

// Validate file name
export const isValidFileName = (fileName: string): boolean => {
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/g
  return !invalidChars.test(fileName) && fileName.trim().length > 0
}

// Sanitize file name
export const sanitizeFileName = (fileName: string): string => {
  // Replace invalid characters with underscores
  return fileName.replace(/[<>:"/\\|?*]/g, '_').trim()
}

// Sort files by different criteria
export const sortFiles = <T extends { name: string; lastModified?: Date; size?: number; isFolder?: boolean }>(
  items: T[],
  sortBy: 'name' | 'date' | 'size',
  sortOrder: 'asc' | 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    // Always put folders first
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1
    
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        })
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
}

// Get breadcrumbs from path
export const getBreadcrumbsFromPath = (currentPath: string) => {
  if (!currentPath) return []
  
  const parts = currentPath.split('/').filter(part => part)
  return parts.map((part, index) => ({
    name: part,
    path: parts.slice(0, index + 1).join('/') + '/'
  }))
}

// Check if file name matches search query
export const matchesSearchQuery = (fileName: string, query: string): boolean => {
  if (!query.trim()) return true
  return fileName.toLowerCase().includes(query.toLowerCase().trim())
}