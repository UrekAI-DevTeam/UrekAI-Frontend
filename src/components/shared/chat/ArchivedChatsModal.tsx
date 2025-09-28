import React from 'react';
import { X, Archive, MessageSquare, RotateCcw, Folder } from 'lucide-react';
import { Message, AttachedFile } from '@/types';

interface ArchivedChat {
  id: string;
  name: string;
  folderId?: string;
  originalFolderId: string;
  originalFolderName: string;
  archivedAt: string;
  messages: Message[];
  attachedFiles: AttachedFile[];
  createdAt?: string;
  updatedAt?: string;
}

interface ArchivedChatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  archivedChats: ArchivedChat[];
  onRestoreChat: (chat: ArchivedChat) => void;
  onSelectChat: (chat: ArchivedChat) => void;
}

export const ArchivedChatsModal: React.FC<ArchivedChatsModalProps> = ({
  isOpen,
  onClose,
  archivedChats,
  onRestoreChat,
  onSelectChat,
}) => {
  const handleRestoreChat = (e: React.MouseEvent, chat: ArchivedChat) => {
    e.stopPropagation();
    if (window.confirm(`Restore "${chat.name}" to "${chat.originalFolderName}" folder?`)) {
      onRestoreChat(chat);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background-surface rounded-xl max-w-md w-full max-h-[90vh] flex flex-col shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Archived Chats</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-interactive-hover rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          {archivedChats.length === 0 ? (
            <div className="text-center py-8">
              <Archive className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No archived chats</p>
              <p className="text-sm text-text-muted mt-1">
                Archive chats to keep them organized
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {archivedChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 rounded-lg border bg-background-surface-secondary border-border hover:bg-interactive-hover cursor-pointer transition-colors group"
                  onClick={() => {
                    onSelectChat(chat);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-text-muted flex-shrink-0" />
                        <h3 className="text-sm font-medium text-text-primary truncate">
                          {chat.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                        <Folder className="h-3 w-3" />
                        <span>{chat.originalFolderName}</span>
                      </div>
                      <p className="text-xs text-text-muted">
                        Archived {formatDate(chat.archivedAt)}
                      </p>
                    </div>
                    
                    {/* Unarchive button */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleRestoreChat(e, chat)}
                        className="p-1 text-text-muted hover:text-success hover:bg-success/10 rounded transition-colors"
                        title="Restore chat"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full bg-background-surface-secondary hover:bg-interactive-hover text-text-primary font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};