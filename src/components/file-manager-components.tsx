import React from 'react'

// Types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
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

// File type detection utility
export const getFileType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv', 'm4v']
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma']
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
  const codeTypes = ['js', 'ts', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift']
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz']
  
  if (!ext) return 'file'
  if (imageTypes.includes(ext)) return 'image'
  if (videoTypes.includes(ext)) return 'video'
  if (audioTypes.includes(ext)) return 'audio'
  if (documentTypes.includes(ext)) return 'document'
  if (codeTypes.includes(ext)) return 'code'
  if (archiveTypes.includes(ext)) return 'archive'
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'spreadsheet'
  if (['ppt', 'pptx'].includes(ext)) return 'presentation'
  return 'file'
}

// File size formatter
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// File Icon Component with beautiful gradients and shadows
export const FileIcon: React.FC<{ type: string; className?: string }> = ({ 
  type, 
  className = "w-6 h-6" 
}) => {
  const getIconStyles = () => {
    switch (type) {
      case 'folder':
        return 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25'
      case 'image':
        return 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25'
      case 'video':
        return 'bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-500/25'
      case 'audio':
        return 'bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg shadow-purple-500/25'
      case 'document':
        return 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25'
      case 'code':
        return 'bg-gradient-to-br from-gray-600 to-slate-700 shadow-lg shadow-gray-500/25'
      case 'archive':
        return 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/25'
      case 'spreadsheet':
        return 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/25'
      case 'presentation':
        return 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/25'
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-400/25'
    }
  }

  const getIconSymbol = () => {
    switch (type) {
      case 'folder': return '📁'
      case 'image': return '🖼️'
      case 'video': return '🎥'
      case 'audio': return '🎵'
      case 'document': return '📄'
      case 'code': return '💻'
      case 'archive': return '📦'
      case 'spreadsheet': return '📊'
      case 'presentation': return '📋'
      default: return '📄'
    }
  }

  return (
    <div className={`${className} rounded-xl flex items-center justify-center text-white font-medium ${getIconStyles()} transform transition-transform hover:scale-105`}>
      <span className="text-xs">{getIconSymbol()}</span>
    </div>
  )
}

// Enhanced Toast Component
export const ToastContainer: React.FC<{ 
  toasts: Toast[]
  onRemove: (id: string) => void 
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ 
  toast: Toast
  onRemove: (id: string) => void 
}> = ({ toast, onRemove }) => {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-500/10'
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-red-500/10'
      case 'warning':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-amber-500/10'
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-500/10'
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-gray-500/10'
    }
  }

  const getIconColor = () => {
    switch (toast.type) {
      case 'success': return 'text-emerald-500'
      case 'error': return 'text-red-500'
      case 'warning': return 'text-amber-500'
      case 'info': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getTextColor = () => {
    switch (toast.type) {
      case 'success': return 'text-emerald-800'
      case 'error': return 'text-red-800'
      case 'warning': return 'text-amber-800'
      case 'info': return 'text-blue-800'
      default: return 'text-gray-800'
    }
  }

  return (
    <div className={`
      transform transition-all duration-500 ease-out animate-in slide-in-from-right-full
      shadow-xl rounded-xl border backdrop-blur-sm p-4 ${getToastStyles()}
    `}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {toast.type === 'success' && (
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${getTextColor()}`}>
            {toast.title}
          </p>
          {toast.message && (
            <p className={`text-sm mt-1 opacity-80 ${getTextColor()}`}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-orange-200 border-t-orange-600`} />
  )
}

// Empty State Component
export const EmptyState: React.FC<{ 
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}> = ({ title, description, icon, action }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
        {icon || (
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  )
}

// Modal Component
export const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// Button Component
export const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  children, 
  onClick, 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 focus:ring-orange-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 focus:ring-red-500',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 focus:ring-emerald-500',
    ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" />}
      <span className={loading ? 'ml-2' : ''}>{children}</span>
    </button>
  )
}