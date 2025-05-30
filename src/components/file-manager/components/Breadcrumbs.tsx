// src/components/file-manager/components/Breadcrumbs.tsx

import React from 'react'

interface BreadcrumbsProps {
  currentPath: string
  onNavigate: (path: string) => void
  onGoHome: () => void
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPath,
  onNavigate,
  onGoHome
}) => {
  const getBreadcrumbs = () => {
    if (!currentPath) return []
    const parts = currentPath.split('/').filter(part => part)
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/') + '/'
    }))
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className="mb-8">
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={onGoHome}
          className="flex items-center px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:text-orange-600"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
          </svg>
          Home
        </button>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <button
              onClick={() => onNavigate(crumb.path)}
              className="px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:text-orange-600"
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}