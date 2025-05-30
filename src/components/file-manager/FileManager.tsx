// src/components/file-manager/FileManager.tsx
'use client'

import React from 'react'
import { useFileManagerState } from './hooks/useFileManagerState'
import { useFileUpload } from './hooks/useFileUpload'
import { useFileOperations } from './hooks/useFileOperations'
import { useNavigation } from './hooks/useNavigation'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { FileManagerHeader } from './components/FileManagerHeader'
import { Breadcrumbs } from './components/Breadcrumbs'
import { SearchBar } from './components/SearchBar'
import { BulkActions } from './components/BulkActions'
import { UploadSection } from './components/UploadSection'
import { FileList } from './components/FileList'
import { FilePreview } from './components/FilePreview'
import { CreateFolderModal } from './components/CreateFolderModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { ToastContainer } from '../toast/ToastContainer'
import { useToast } from '../toast/useToast'

const FileManager: React.FC = () => {
  // State management
  const state = useFileManagerState()
  const { toasts, addToast, removeToast } = useToast()
  
  // Feature hooks
  const fileUpload = useFileUpload(state, addToast)
  const fileOperations = useFileOperations(state, addToast)
  const navigation = useNavigation(state)
  const dragAndDrop = useDragAndDrop(fileUpload.addFiles)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <FileManagerHeader 
        viewMode={state.viewMode}
        onViewModeChange={state.setViewMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <Breadcrumbs 
          currentPath={state.currentPath}
          onNavigate={navigation.navigateToFolder}
          onGoHome={() => navigation.navigateToFolder('')}
        />

        {/* Search */}
        <SearchBar
          searchQuery={state.searchQuery}
          isSearching={state.isSearching}
          onSearch={navigation.handleSearch}
          onClearSearch={() => navigation.setSearchQuery('')}
          sortBy={state.sortBy}
          sortOrder={state.sortOrder}
          onSortChange={state.setSortBy}
          onSortOrderChange={state.setSortOrder}
        />

        {/* Bulk Actions */}
        {state.selectedItems.size > 0 && (
          <BulkActions
            selectedCount={state.selectedItems.size}
            onClearSelection={() => state.setSelectedItems(new Set())}
            onDeleteSelected={() => state.setShowDeleteConfirm(true)}
          />
        )}

        {/* Upload Section */}
        <UploadSection
          selectedFiles={fileUpload.selectedFiles}
          uploadProgress={fileUpload.uploadProgress}
          isUploading={fileUpload.isUploading}
          dragActive={dragAndDrop.dragActive}
          onSelectFiles={fileUpload.selectFiles}
          onUpload={fileUpload.uploadFiles}
          onCancelUpload={fileUpload.cancelUpload}
          onRemoveFile={fileUpload.removeFile}
          onCreateFolder={() => state.setShowCreateFolder(true)}
          dragHandlers={dragAndDrop.dragHandlers}
        />

        {/* File List */}
        <FileList
          displayItems={state.displayItems}
          selectedItems={state.selectedItems}
          viewMode={state.viewMode}
          isLoading={state.isLoading}
          searchQuery={state.searchQuery}
          currentPath={state.currentPath}
          onToggleSelection={state.toggleItemSelection}
          onSelectAll={state.toggleSelectAll}
          onNavigateToFolder={navigation.navigateToFolder}
          onNavigateBack={navigation.navigateBack}
          onPreviewFile={state.setPreviewFile}
          onDownloadFile={fileOperations.downloadFile}
          onSelectFiles={fileUpload.selectFiles}
        />

        {/* Modals */}
        <FilePreview
          previewFile={state.previewFile}
          onClose={() => state.setPreviewFile(null)}
          onDownload={fileOperations.downloadFile}
        />

        <CreateFolderModal
          isOpen={state.showCreateFolder}
          currentPath={state.currentPath}
          onClose={() => {
            state.setShowCreateFolder(false)
            state.setNewFolderName('')
          }}
          onCreateFolder={fileOperations.createFolder}
          folderName={state.newFolderName}
          onFolderNameChange={state.setNewFolderName}
        />

        <DeleteConfirmModal
          isOpen={state.showDeleteConfirm}
          selectedCount={state.selectedItems.size}
          onClose={() => state.setShowDeleteConfirm(false)}
          onConfirmDelete={fileOperations.bulkDelete}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  )
}

export default FileManager