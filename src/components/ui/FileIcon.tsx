// src/components/ui/FileIcon.tsx

import React from 'react'

interface FileIconProps {
  type: string
  className?: string
}

export const FileIcon: React.FC<FileIconProps> = ({ type, className = "w-6 h-6" }) => {
  const getIconStyles = () => {
    const baseStyle = "rounded-xl flex items-center justify-center text-white font-medium shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer";
    switch (type) {
      case 'folder':
        return `${baseStyle} bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-500/25 hover:shadow-gray-500/40`;
      case 'image':
        return `${baseStyle} bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25 hover:shadow-emerald-500/40`;
      case 'video':
        return `${baseStyle} bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25 hover:shadow-red-500/40`;
      case 'audio':
        return `${baseStyle} bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25 hover:shadow-purple-500/40`;
      case 'document':
        return `${baseStyle} bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25 hover:shadow-purple-500/40`;
      case 'code':
        return `${baseStyle} bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-500/25 hover:shadow-gray-500/40`;
      case 'archive':
        return `${baseStyle} bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/25 hover:shadow-yellow-500/40`;
      case 'spreadsheet':
        return `${baseStyle} bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25 hover:shadow-green-500/40`;
      case 'presentation':
        return `${baseStyle} bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-500/25 hover:shadow-gray-500/40`;
    }
  };

  const getIconSymbol = () => {
    switch (type) {
      case 'folder': return '📁';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'document': return '📄';
      case 'code': return '💻';
      case 'archive': return '📦';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className={`${className} ${getIconStyles()}`}>
      <span className="text-xs">{getIconSymbol()}</span>
    </div>
  );
};