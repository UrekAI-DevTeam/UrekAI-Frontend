import React from 'react';
import { X, FileText, Paperclip, FileSpreadsheet, Database, File } from 'lucide-react';
import { UploadedFile } from '@/types';
import { Button } from '@/components/ui/Button';

interface AttachmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  availableFiles: UploadedFile[];
  onAttachFile: (file: UploadedFile) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export const AttachmentPopup: React.FC<AttachmentPopupProps> = ({
  isOpen,
  onClose,
  availableFiles,
  onAttachFile,
  anchorRef,
}) => {
  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getFileIcon = (name: string, type: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv' || type.includes('csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    }
    if (extension === 'xlsx' || extension === 'xls' || type.includes('excel') || type.includes('spreadsheet')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-700" />;
    }
    if (extension === 'json' || type.includes('json')) {
      return <Database className="h-5 w-5 text-blue-600" />;
    }
    return <File className="h-5 w-5 text-gray-600" />;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Popup */}
      <div className="absolute bottom-full mb-2 right-0 z-50 bg-white border border-border rounded-xl shadow-lg min-w-80 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-text-muted" />
            <h3 className="text-sm font-medium text-text-primary">Attach Files</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Files List */}
        <div className="max-h-64 overflow-y-auto">
          {availableFiles.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">No files available to attach</p>
              <p className="text-xs text-text-muted mt-1">Upload files to see them here</p>
            </div>
          ) : (
            <div className="p-2">
              {availableFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">{getFileIcon(file.name, file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt ?? Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onAttachFile(file);
                      onClose();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Attach
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};