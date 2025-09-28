import React from 'react';
import { X, FileText } from 'lucide-react';
import { AttachedFile } from '@/types';

interface AttachedFilesBarProps {
  attachedFiles: AttachedFile[];
  onRemoveFile: (fileId: string) => void;
}

export const AttachedFilesBar: React.FC<AttachedFilesBarProps> = ({
  attachedFiles,
  onRemoveFile,
}) => {
  if (attachedFiles.length === 0) return null;

  return (
    <div className="absolute bottom-[57px] sm:bottom-[72px] flex items-center gap-2 z-10">
      {attachedFiles.map((file) => (
        <div
          key={file.id}
          className="relative group"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap max-w-32 truncate">
              {file.name}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
          
          {/* Remove button */}
          <button
            onClick={() => onRemoveFile(file.id)}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove file"
          >
            <X className="h-2 w-2 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};