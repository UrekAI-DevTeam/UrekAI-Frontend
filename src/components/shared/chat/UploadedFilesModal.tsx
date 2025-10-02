"use client";
import React from 'react';
import { X, FileText, Trash2, FileSpreadsheet, Database, File } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFilesStore } from '@/state/filesStore';
import { dataAPI } from '@/services/api';
import { useChatStore } from '@/state/chatStore';


interface UploadedFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadedFilesModal: React.FC<UploadedFilesModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { uploadedFiles, removeUploadedFile } = useFilesStore();
  const { removeFileFromAllChats } = useChatStore();

  const handleDeleteFile = async (file: any) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      if (file.uploadId) {
        await dataAPI.deleteFile(file.uploadId);
      }
      // Remove from uploaded files and all chats that have it attached
      removeUploadedFile(file.id, true, (fileId) => {
        // Also remove from chat store
        removeFileFromAllChats(fileId);
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getFileIcon = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv') {
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    }
    if (extension === 'xlsx' || extension === 'xls') {
      return <FileSpreadsheet className="h-5 w-5 text-green-700" />;
    }
    if (extension === 'json') {
      return <Database className="h-5 w-5 text-blue-600" />;
    }
    return <File className="h-5 w-5 text-gray-600" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 max-w-md w-full max-h-[90vh] flex flex-col shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Uploaded Files</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-interactive-hover rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Files List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-interactive-hover transition-colors group"
                >
                  <div className="flex items-center flex-1">
                    <div className="mr-3">{getFileIcon(file.name)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt ?? Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file)}
                    className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};