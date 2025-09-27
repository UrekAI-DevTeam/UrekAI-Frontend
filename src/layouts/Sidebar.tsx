"use client";
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Folder as FolderIcon, 
  FolderOpen, 
  Archive, 
  File,
  FileText,
  FileSpreadsheet,
  FileJson, 
  Trash2,
  Edit2,
  ArchiveX,
  RotateCcw,
  X,
  BarChart3,
  Brain,
  User,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { CreateItemModal } from '@/features/modals/CreateItemModal';
import { RenameModal } from '@/features/modals/RenameModal';
import { useArchivedChatsStore, ArchivedChat } from '@/state/archivedChatsStore';
import { useFilesStore } from '@/state/filesStore';
import { useChatStore } from '@/state/chatStore';
import { useFoldersStore } from '@/state/foldersStore';
import { dataAPI } from '@/services/api';
import { Chat, Folder, UploadedFile } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onChatSelect: (chat: Chat, folder?: Folder) => void;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  isDark?: boolean;
  toggleTheme?: () => void;
  isCollapsed?: boolean;
}

type ViewType = 'chats' | 'folders' | 'files' | 'archived';

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onChatSelect, 
  currentPage = 'dashboard', 
  onPageChange, 
  isDark = false, 
  toggleTheme,
  isCollapsed = false
}) => {
  const [activeView, setActiveView] = useState<ViewType | null>(null);
  const [showCreatePopover, setShowCreatePopover] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'folders', label: 'Folders', icon: FolderOpen },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<{
    id: string;
    name: string;
    type: 'folder' | 'chat';
    folderId?: string;
  } | null>(null);

  const createButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Stores
  const { archivedChats, archiveChat, restoreChat } = useArchivedChatsStore();
  const { uploadedFiles, removeUploadedFile } = useFilesStore();
  const { 
    getAllChats, 
    // getIndependentChats, 
    getFolderChats, 
    getChatData,
    createChat, 
    updateChatData, 
    deleteChatData, 
    addMessage,
    attachFile,
    removeFileFromAllChats 
  } = useChatStore();
  const { 
    folders, 
    selectedFolderId, 
    expandedFolders, 
    addFolder, 
    updateFolderData, 
    deleteFolder, 
    setSelectedFolder, 
    toggleFolder, 
    setExpandedFolders 
  } = useFoldersStore();

  // Close overlay when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
  //       setActiveView(null);
  //     }
  //   };

  //   if (activeView) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //     return () => document.removeEventListener('mousedown', handleClickOutside);
  //   }
  // }, [activeView]);

  const toggleView = (view: ViewType) => {
    setActiveView(activeView === view ? null : view);
  };

  const handleToggleFolder = (folderId: string) => {
    toggleFolder(folderId);
  };

  const selectChat = (chat: Chat, folder?: Folder) => {
    // Update last used timestamp
    const now = new Date().toISOString();
    
    // Update chat timestamp
    updateChatData(chat.id, { updatedAt: now });
    
    onChatSelect(chat, folder);
    setSelectedFolder(null);
    setActiveView(null);
  };

  const handleCreateFolder = async (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      isSelected: false,
      chats: []
    };
    
    try {
      await addFolder(newFolder);
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleCreateChat = async (name: string) => {
    const chatId = Date.now().toString();
    
    try {
      await createChat(chatId, name, selectedFolderId || undefined);
      
      // If created in a folder, expand it
      if (selectedFolderId) {
        const newExpanded = new Set([...expandedFolders, selectedFolderId]);
        setExpandedFolders(newExpanded);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to create chat. Please try again.');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder and all its chats?')) {
      try {
        // Delete all chats in the folder first
        const folderChats = getFolderChats(folderId);
        await Promise.all(folderChats.map(chat => deleteChatData(chat.id)));
        
        // Then delete the folder
        await deleteFolder(folderId);
      } catch (error) {
        console.error('Failed to delete folder:', error);
        alert('Failed to delete folder. Please try again.');
      }
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChatData(chatId);
      } catch (error) {
        console.error('Failed to delete chat:', error);
        alert('Failed to delete chat. Please try again.');
      }
    }
  };

  const handleArchiveChat = (chatId: string, folderId?: string) => {
    const allChats = getAllChats();
    const chat = allChats.find(c => c.id === chatId);
    const chatData = getChatData(chatId);
    let folderName = 'Independent Chats';
    
    if (folderId) {
      const folder = folders.find(f => f.id === folderId);
      folderName = folder?.name || 'Unknown Folder';
    }
    
    if (chat && chatData) {
      if (window.confirm(`Archive "${chat.name}"? You can restore it later from Archived Chats.`)) {
        archiveChat({
          id: chat.id,
          name: chat.name,
          folderId: chat.folderId,
          originalFolderId: folderId || 'independent',
          originalFolderName: folderName,
          messages: chatData.messages,
          attachedFiles: chatData.attachedFiles,
          createdAt: chatData.createdAt,
          updatedAt: chatData.updatedAt,
        });
        
        // Remove from current location
        deleteChatData(chatId);
      }
    }
  };

  const handleRestoreChat = async (archivedChat: ArchivedChat) => {
    const restoredChat = restoreChat(archivedChat.id);
    if (restoredChat) {
      const folderId = restoredChat.originalFolderId === 'independent' ? undefined : restoredChat.originalFolderId;
      
      try {
        // Create the restored chat with all its data
        await createChat(restoredChat.id, restoredChat.name, folderId);
        
        // Restore all messages
        for (const message of restoredChat.messages) {
          await addMessage(restoredChat.id, message);
        }
        
        // Restore all attached files
        for (const file of restoredChat.attachedFiles) {
          await attachFile(restoredChat.id, file);
        }
        
        // Update timestamps if they exist
        if (restoredChat.createdAt || restoredChat.updatedAt) {
          await updateChatData(restoredChat.id, {
            createdAt: restoredChat.createdAt,
            updatedAt: restoredChat.updatedAt,
          });
        }
      } catch (error) {
        console.error('Failed to restore chat:', error);
        alert('Failed to restore chat. Please try again.');
        return;
      }
      
      // If restoring to a folder, expand it
      if (folderId) {
        const newExpanded = new Set([...expandedFolders, folderId]);
        setExpandedFolders(newExpanded);
      }
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      if (file.uploadId) {
        await dataAPI.deleteFile(file.uploadId);
      }
      removeUploadedFile(file.id, true, (fileId) => {
        removeFileFromAllChats(fileId);
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleStartRename = (id: string, name: string, type: 'folder' | 'chat', folderId?: string) => {
    setRenameItem({ id, name, type, folderId });
    setIsRenameModalOpen(true);
  };

  const handleRename = async (newName: string) => {
    if (!renameItem) return;

    try {
      if (renameItem.type === 'folder') {
        await updateFolderData(renameItem.id, { name: newName });
      } else {
        await updateChatData(renameItem.id, { name: newName });
      }
      setRenameItem(null);
    } catch (error) {
      console.error('Failed to rename:', error);
      alert('Failed to rename. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getFileIcon = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    // return <FileText className="h-4 w-4 text-blue-600" />;
    switch (extension) {
    case 'csv':
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    case 'json':
      return <FileJson className="h-4 w-4 text-yellow-600" />;
    default:
      return <File className="h-4 w-4 text-text-muted" />;
  }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort independent chats by last used (most recent first)
  // const independentChats = getIndependentChats();
  const allChats = getAllChats();

  if (!isOpen) return null;

  return (
    <div className={`h-screen backdrop-blur-xl border-r flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-72'
    } ${
      isDark 
        ? 'bg-surface border-border' 
        : 'bg-surface border-border'
    }`}>
      {/* Logo */}
      <div className={`border-b transition-colors duration-300 ${
        'border-border'
      } ${isCollapsed ? 'p-4' : 'p-8'}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blood-red to-crimson flex items-center justify-center shadow-lg shadow-blood-red/20">
            <Brain className="w-6 h-6 text-text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-2xl font-semibold bg-gradient-to-r from-blood-red to-crimson bg-clip-text text-transparent">
              UrekAI
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-2 ${isCollapsed ? 'p-2' : 'p-6'}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange?.(item.id)}
              className={`w-full flex items-center h-12 transition-all duration-200 rounded-xl ${
                isCollapsed ? 'justify-center px-2' : 'gap-4 px-4'
              } ${
                isActive 
                  ? 'bg-gradient-to-r from-blood-red/10 to-crimson/10 text-blood-red border border-blood-red/20 shadow-sm' 
                  : isDark
                    ? 'hover:bg-hover text-text-muted hover:text-text-primary'
                    : 'hover:bg-hover text-text-muted hover:text-text-primary'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* New Chat Button */}
      <div className={`border-t transition-colors duration-300 ${
        'border-border'
      } ${isCollapsed ? 'p-2' : 'p-6'}`}>
        <button 
          className={`w-full bg-gradient-to-r from-blood-red to-crimson hover:from-blood-red/90 hover:to-crimson/90 text-text-white h-12 rounded-xl font-medium shadow-lg shadow-blood-red/20 hover:shadow-xl hover:shadow-blood-red/25 transition-all duration-200 flex items-center ${
            isCollapsed ? 'justify-center px-2' : 'gap-3 justify-center'
          }`}
          onClick={() => onPageChange?.('chat')}
          title={isCollapsed ? 'New Chat' : undefined}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Theme Toggle */}
      {toggleTheme && (
        <div className={`border-t transition-colors duration-300 ${
          'border-border'
        } ${isCollapsed ? 'p-2' : 'p-6'}`}>
          <button
            className={`w-full flex items-center h-12 rounded-xl transition-all duration-200 ${
              isCollapsed ? 'justify-center px-2' : 'gap-4 px-4'
            } ${
              isDark 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={toggleTheme}
            title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!isCollapsed && <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      )}

    </div>
  );
};