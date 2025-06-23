// src/components/file-manager/FileManager.tsx
'use client'

import React, { useState } from 'react'
import { useFileManagerState } from './hooks/useFileManagerState'
import { useFileUpload } from './hooks/useFileUpload'
import { useFileOperations } from './hooks/useFileOperations'
import { useNavigation } from './hooks/useNavigation'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { EnhancedFileManagerHeader } from './components/FileManagerHeader'
import { EnhancedBreadcrumbs } from './components/Breadcrumbs'
import { EnhancedSearchBar } from './components/SearchBar'
import { EnhancedBulkActions } from './components/BulkActions'
import { EnhancedFileList } from './components/FileList'
import { FilePreview } from './components/FilePreview'
import { CreateFolderModal } from './components/CreateFolderModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { EnhancedUploadDropdown } from './components/UploadDropdown'
import { useToast } from '../toast/useToast'

// Enhanced Drag and Drop Overlay
interface DragDropOverlayProps {
  isActive: boolean;
  darkMode: boolean;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isActive, darkMode }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-orange-500/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className={`backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-2 border-dashed border-orange-500 max-w-md mx-4 ${
        darkMode ? 'bg-gray-900/95' : 'bg-white/95'
      }`}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-orange-900'}`}>
            Drop files here
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-orange-700'}>
            Release to upload to your cloud storage
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Empty State
const EnhancedEmptyState: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
  darkMode: boolean;
}> = ({ title, description, action, darkMode }) => {
  return (
    <div className="text-center py-20">
      <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-xl ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-orange-100 to-orange-200'
      }`}>
        <svg className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-lg max-w-md mx-auto mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
      {action}
    </div>
  );
};

const FileManager: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  
  const toggleTheme = () => setDarkMode(!darkMode);

  // State management
  const state = useFileManagerState()
  const { addToast } = useToast()
  
  // Feature hooks
  const fileUpload = useFileUpload(state, addToast)
  const fileOperations = useFileOperations(state, addToast)
  const navigation = useNavigation(state)
  const dragAndDrop = useDragAndDrop(fileUpload.addFiles)

  // Enhanced theme classes
  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-black via-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-gray-50 via-orange-50/30 to-red-50/20';

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${bgClass}`}
      {...dragAndDrop.dragHandlers}
    >
      {/* Enhanced Header */}
      <EnhancedFileManagerHeader 
        viewMode={state.viewMode}
        onViewModeChange={state.setViewMode}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Enhanced Navigation */}
        <EnhancedBreadcrumbs 
          currentPath={state.currentPath}
          onNavigate={navigation.navigateToFolder}
          onGoHome={() => navigation.navigateToFolder('')}
          darkMode={darkMode}
        />

        {/* Enhanced Upload Section */}
        <EnhancedUploadDropdown
          isOpen={uploadDropdownOpen}
          onToggle={() => setUploadDropdownOpen(!uploadDropdownOpen)}
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
          darkMode={darkMode}
        />

        {/* Enhanced Search */}
        <EnhancedSearchBar
          searchQuery={state.searchQuery}
          isSearching={state.isSearching}
          onSearch={navigation.handleSearch}
          onClearSearch={() => navigation.setSearchQuery('')}
          sortBy={state.sortBy}
          sortOrder={state.sortOrder}
          onSortChange={state.setSortBy}
          onSortOrderChange={state.setSortOrder}
          resultsCount={state.displayItems.length}
          darkMode={darkMode}
        />

        {/* Enhanced Bulk Actions */}
        {state.selectedItems.size > 0 && (
          <EnhancedBulkActions
            selectedCount={state.selectedItems.size}
            onClearSelection={() => state.setSelectedItems(new Set())}
            onDeleteSelected={() => state.setShowDeleteConfirm(true)}
            darkMode={darkMode}
          />
        )}

        {/* Enhanced File List */}
        <EnhancedFileList
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
          darkMode={darkMode}
        />

        {/* Enhanced Modals */}
        <FilePreview
          previewFile={state.previewFile}
          onClose={() => state.setPreviewFile(null)}
          onDownload={fileOperations.downloadFile}
          darkMode={darkMode}
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
      </div>

      {/* Enhanced Toast Container - moved to layout.tsx */}

      {/* Enhanced Drag and Drop Overlay */}
      <DragDropOverlay 
        isActive={dragAndDrop.dragActive} 
        darkMode={darkMode}
      />
    </div>
  )
}

export default FileManager