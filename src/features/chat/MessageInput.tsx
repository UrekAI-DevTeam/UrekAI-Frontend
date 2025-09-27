"use client";
import React, { useState } from 'react';
import { Send, Paperclip, Upload, Database, Plus } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { UploadedFile } from '../../types';
import { AttachmentPopup } from './AttachmentPopup';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (files: FileList) => void;
  isLoading?: boolean;
  isDragOver?: boolean;
  availableFiles?: UploadedFile[];
  onAttachFile?: (file: UploadedFile) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onFileUpload, 
  isLoading = false,
  // isDragOver = false,
  availableFiles = [],
  onAttachFile,
}) => {
  const [message, setMessage] = useState('');
  const [isAttachmentPopupOpen, setIsAttachmentPopupOpen] = useState(false);
  const attachmentButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
      // Reset the input so the same file can be uploaded again
      e.target.value = '';
    }
  };

  const handleAttachFile = (file: UploadedFile) => {
    onAttachFile?.(file);
  };

  return (
    <div className="relative">
      {/* Message Input */}
      <div className="p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 rounded-2xl border border-gray-300 shadow">
          <div className="flex items-center w-full px-2 space-x-2">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full border-none focus:ring-0 focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>

            {/* 📱 Mobile: This block now contains the complete logic for the drop-up menu */}
            <div className="sm:hidden relative ml-2">
              <button
                onClick={() => setIsMobileActionsOpen(!isMobileActionsOpen)}
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
                title="More options"
              >
                <Plus className="h-4 w-4" />
              </button>

              {isMobileActionsOpen && (
                <div className="absolute right-0 bottom-full mb-2 bg-white border rounded shadow-md z-10 w-40 p-2 space-y-1">
                  {/* 1. UPLOAD ACTION */}
                  <label
                    // FIX: Corrected htmlFor to match the input's id
                    htmlFor="file-upload"
                    className="block p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </span>
                  </label>

                  {/* 2. ATTACH ACTION (FIX: Added this button) */}
                  <button
                    ref={attachmentButtonRef}
                    type="button"
                    onClick={() => setIsAttachmentPopupOpen(!isAttachmentPopupOpen)}
                    className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
                    title="Attach file"
                  >
                    <span className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" /> 
                      <span>Attach</span>
                    </span>
                    {isAttachmentPopupOpen && (
                      <AttachmentPopup
                        isOpen={isAttachmentPopupOpen}
                        onClose={() => setIsAttachmentPopupOpen(false)}
                        availableFiles={availableFiles}
                        onAttachFile={handleAttachFile}
                        anchorRef={attachmentButtonRef}
                      />
                    )} 
                  </button>

                  {/* 3. CONNECT ACTION (FIX: Added this button) */}
                  <button
                    type="button"
                    className="w-full p-2 rounded hover:bg-gray-100 text-left"
                  >
                    <span className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Connect</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 🖥 Desktop: This block remains unchanged */}
            <div className="hidden sm:flex items-center space-x-1">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls,.json"
                multiple
              />
              <label
                htmlFor="file-upload"
                className="p-2 text-text-muted hover:text-text-primary cursor-pointer rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                title="Upload file"
              >
                <Upload className="h-4 w-4" />
              </label>

              <button
                ref={attachmentButtonRef}
                type="button"
                onClick={() => setIsAttachmentPopupOpen(!isAttachmentPopupOpen)}
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
                {isAttachmentPopupOpen && (
                  <AttachmentPopup
                    isOpen={isAttachmentPopupOpen}
                    onClose={() => setIsAttachmentPopupOpen(false)}
                    availableFiles={availableFiles}
                    onAttachFile={handleAttachFile}
                    anchorRef={attachmentButtonRef}
                  />
                )}
              </button>

              <button
                type="button"
                className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
                title="Add connection"
              >
                <Database className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          className="px-3 sm:px-4"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </Button>
      </form>
      </div>
    </div>
  );
};