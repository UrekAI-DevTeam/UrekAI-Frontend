import React from 'react';
import { X, FileSpreadsheet, Database, File } from 'lucide-react';
import { UploadedFile } from '../../types';

interface UploadingFileBadgeProps {
  file: UploadedFile;
  onRemove: (fileId: string) => void;
}

export const UploadingFileBadge: React.FC<UploadingFileBadgeProps> = ({
  file,
  onRemove,
}) => {
  const getStatusColor = () => {
    switch (file.status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'failed':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-blue-100 border-blue-300';
    }
  };

  const getProgressColor = () => {
    switch (file.status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case 'completed':
        return <span className="text-green-600 text-xs">✓</span>;
      case 'failed':
        return <span className="text-red-600 text-xs">✗</span>;
      default:
        return (
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        );
    }
  };

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv') {
      return <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />;
    }
    if (extension === 'xlsx' || extension === 'xls') {
      return <FileSpreadsheet className="h-4 w-4 text-green-700 flex-shrink-0" />;
    }
    if (extension === 'json') {
      return <Database className="h-4 w-4 text-blue-600 flex-shrink-0" />;
    }
    return <File className="h-4 w-4 text-gray-600 flex-shrink-0" />;
  };

  return (
    <div className={`w-full border rounded-lg p-3 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getFileIcon()}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
            <span className="text-xs text-gray-600">{formatFileSize(file.size)}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {getStatusIcon()}
          </div>
        </div>
        <button
          onClick={() => onRemove(file.id)}
          className="p-1 hover:bg-white/50 rounded-full transition-colors flex-shrink-0 ml-2"
          title="Remove file"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${file.progress || 0}%` }}
        />
      </div>
      
      {/* Status text */}
      <div className="mt-1 text-xs text-gray-600">
        {file.status === 'uploading' && 'Uploading...'}
        {file.status === 'processing' && 'Processing...'}
        {file.status === 'completed' && 'Upload complete'}
        {file.status === 'failed' && 'Upload failed'}
        {file.progress !== undefined && ` ${file.progress}%`}
      </div>
    </div>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};