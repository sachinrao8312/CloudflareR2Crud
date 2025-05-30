// src/components/file-manager/FileManager.tsx
'use client'

import React, { useState } from 'react'
import { useFileManagerState } from './hooks/useFileManagerState'
import { useFileUpload } from './hooks/useFileUpload'
import { useFileOperations } from './hooks/useFileOperations'
import { useNavigation } from './hooks/useNavigation'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { FileManagerHeader } from './components/FileManagerHeader'
import { Breadcrumbs } from './components/Breadcrumbs'
import { EnhancedSearchBar } from './components/SearchBar'
import { BulkActions } from './components/BulkActions'
import { FileList } from './components/FileList'
import { FilePreview } from './components/FilePreview'
import { CreateFolderModal } from './components/CreateFolderModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { UploadDropdown } from './components/UploadDropdown'
import { ToastContainer } from '../toast/ToastContainer'
import { useToast } from '../toast/useToast'

// Theme context
const ThemeContext = React.createContext({ darkMode: true, toggleTheme: () => {} });

// Drag and Drop Overlay
interface DragDropOverlayProps {
  isActive: boolean;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isActive }) => {
  const { darkMode } = React.useContext(ThemeContext);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-orange-500/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className={`backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-2 border-dashed border-orange-500 max-w-md mx-4 ${
        darkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'
      }`}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Drop files here
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Release to upload to your cloud storage
          </p>
        </div>
      </div>
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
  const { toasts, addToast, removeToast } = useToast()
  
  // Feature hooks
  const fileUpload = useFileUpload(state, addToast)
  const fileOperations = useFileOperations(state, addToast)
  const navigation = useNavigation(state)
  const dragAndDrop = useDragAndDrop(fileUpload.addFiles)

  // Classes for theming
  const bgClass = darkMode ? 'bg-black' : 'bg-gray-50';
  const surfaceClass = darkMode ? 'bg-gray-900/80' : 'bg-white/80';

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div 
        className={`min-h-screen transition-colors duration-300 ${bgClass}`}
        {...dragAndDrop.dragHandlers}
      >
        {/* Header */}
        <FileManagerHeader 
          viewMode={state.viewMode}
          onViewModeChange={state.setViewMode}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <Breadcrumbs 
            currentPath={state.currentPath}
            onNavigate={navigation.navigateToFolder}
            onGoHome={() => navigation.navigateToFolder('')}
            darkMode={darkMode}
          />

          {/* Upload Dropdown */}
          <UploadDropdown
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

          {/* Search */}
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

          {/* Bulk Actions */}
          {state.selectedItems.size > 0 && (
            <BulkActions
              selectedCount={state.selectedItems.size}
              onClearSelection={() => state.setSelectedItems(new Set())}
              onDeleteSelected={() => state.setShowDeleteConfirm(true)}
              darkMode={darkMode}
            />
          )}

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

          {/* Toast Notifications */}
          <ToastContainer toasts={toasts} onRemove={removeToast} darkMode={darkMode} />
        </div>

        {/* Drag and Drop Overlay */}
        <DragDropOverlay isActive={dragAndDrop.dragActive} />
      </div>
    </ThemeContext.Provider>
  )
}

export default FileManager