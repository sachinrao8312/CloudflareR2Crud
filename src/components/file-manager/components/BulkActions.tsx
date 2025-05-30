
// src/components/file-manager/components/BulkActions.tsx

import React from 'react'
import { Button } from '../../ui/Button'

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onDeleteSelected: () => void
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onDeleteSelected
}) => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-orange-800 font-semibold">
                {selectedCount} item(s) selected
              </p>
              <p className="text-orange-600 text-sm">
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
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}