// src/components/file-manager/components/BulkActions.tsx

import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '../../ui/Button'

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onDeleteSelected: () => void
  darkMode: boolean
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  darkMode
}) => {
  const bgClass = darkMode 
    ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' 
    : 'bg-gradient-to-r from-orange-50 to-red-50'
  const borderClass = darkMode ? 'border-orange-700/50' : 'border-orange-200/50'
  const textClass = darkMode ? 'text-orange-200' : 'text-orange-800'
  const secondaryTextClass = darkMode ? 'text-orange-300' : 'text-orange-600'
  const iconBgClass = darkMode ? 'bg-orange-800' : 'bg-orange-100'

  return (
    <div className="mb-8">
      <div className={`${bgClass} border ${borderClass} rounded-2xl p-6 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 ${iconBgClass} rounded-full flex items-center justify-center`}>
              <svg 
                className="w-5 h-5 text-orange-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${textClass}`}>
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <p className={`text-sm ${secondaryTextClass}`}>
                Choose an action to perform on selected items
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onClearSelection}
            >
              Clear Selection
            </Button>
            <Button
              variant="danger"
              onClick={onDeleteSelected}
              icon={Trash2}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}