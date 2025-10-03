"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, MessageSquare, FolderOpen, Plus, FileDown, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/state/chatStore';
import { useFoldersStore } from '@/state/foldersStore';

interface ChatSidebarProps {
  onSelectChat?: (chatId: string) => void;
  onClose?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, onClose }) => {
  const { getAllChats, getFolderChats, setActiveChat, createChat, updateChatData, deleteChatData, initializeChats } = useChatStore();
  const { folders, toggleFolder, expandedFolders } = useFoldersStore();
  
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const allChats = getAllChats();
  const independentChats = allChats.filter((c) => !c.folderId);

  // Initialize chats on mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        const { fetchChats } = await import('@/utils/firebase/firebaseData');
        const chats = await fetchChats();
        initializeChats(chats);
      } catch (error) {
        console.log('Firebase not available, using local storage for chats');
        // Load chats from local storage as fallback
        const localChats = localStorage.getItem('urekai-chats');
        if (localChats) {
          try {
            const parsedChats = JSON.parse(localChats);
            initializeChats(parsedChats);
          } catch (parseError) {
            console.error('Failed to parse local chats:', parseError);
          }
        }
      }
    };
    loadChats();
  }, [initializeChats]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (chatId: string) => {
    setActiveChat(chatId);
    onSelectChat?.(chatId);
    onClose?.(); // Close sidebar on mobile after selection
  };

  const handleRename = (chatId: string, currentName: string) => {
    setEditingChat(chatId);
    setEditName(currentName);
    setDropdownOpen(null);
  };

  const handleSaveRename = async (chatId: string) => {
    if (editName.trim()) {
      await updateChatData(chatId, { name: editName.trim() });
    }
    setEditingChat(null);
    setEditName('');
  };

  const handleDelete = async (chatId: string) => {
    if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      await deleteChatData(chatId);
    }
    setDropdownOpen(null);
  };

  const handleCancelRename = () => {
    setEditingChat(null);
    setEditName('');
  };

  return (
    <aside className="w-64 md:w-72 h-full border-r border-border bg-background-surface backdrop-blur-xl p-3 flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* New Chat */}
        <div className="px-2">
          <button
            onClick={async () => {
              const id = Date.now().toString();
              await createChat(id, 'New Chat');
              setActiveChat(id);
              onSelectChat?.(id);
            }}
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-medium shadow-soft hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Independent */}
        <Section title="Recent Chats" icon={<MessageSquare className="h-4 w-4" />}> 
          <div className="space-y-1">
            {independentChats.length === 0 && (
              <div className="text-xs text-text-muted px-2 py-1">No chats yet</div>
            )}
            {independentChats.map((c) => (
              <div key={c.id} className="group relative">
                {editingChat === c.id ? (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(c.id);
                        if (e.key === 'Escape') handleCancelRename();
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-background-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(c.id)}
                      className="p-1 text-success hover:bg-success/10 rounded"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelRename}
                      className="p-1 text-error hover:bg-error/10 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center group">
                    <button
                      onClick={() => handleSelect(c.id)}
                      className="flex-1 text-left h-10 px-3 rounded-lg text-sm hover:bg-hover transition"
                    >
                      {c.name || `Chat ${c.id}`}
                    </button>
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === c.id ? null : c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-hover rounded transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {dropdownOpen === c.id && (
                      <div className="absolute right-0 top-10 z-10 bg-background-surface border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                        <button
                          onClick={() => handleRename(c.id, c.name || `Chat ${c.id}`)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-hover flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-hover text-error flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Folders */}
        <Section title="Folders" icon={<FolderOpen className="h-4 w-4" />}> 
          <div className="space-y-1">
            {folders.map((f) => {
              const isOpen = expandedFolders.has(f.id);
              const chats = getFolderChats(f.id);
              return (
                <div key={f.id} className="rounded-lg border border-border">
                  <button
                    onClick={() => toggleFolder(f.id)}
                    className="w-full flex items-center justify-between h-10 px-3 text-sm hover:bg-hover"
                  >
                    <span className="font-medium">{f.name}</span>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="p-2 pt-0 space-y-1">
                      {chats.length === 0 && (
                        <div className="text-xs text-text-muted px-2 py-1">No chats</div>
                      )}
                      {chats.map((c) => (
                        <div key={c.id} className="group relative">
                          {editingChat === c.id ? (
                            <div className="flex items-center gap-2 px-3 py-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(c.id);
                                  if (e.key === 'Escape') handleCancelRename();
                                }}
                                className="flex-1 px-2 py-1 text-sm bg-background-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRename(c.id)}
                                className="p-1 text-success hover:bg-success/10 rounded"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelRename}
                                className="p-1 text-error hover:bg-error/10 rounded"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center group">
                              <button
                                onClick={() => handleSelect(c.id)}
                                className="flex-1 text-left h-10 px-3 rounded-lg text-sm hover:bg-hover transition"
                              >
                                {c.name}
                              </button>
                              <button
                                onClick={() => setDropdownOpen(dropdownOpen === c.id ? null : c.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-hover rounded transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {dropdownOpen === c.id && (
                                <div className="absolute right-0 top-10 z-10 bg-background-surface border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                                  <button
                                    onClick={() => handleRename(c.id, c.name || `Chat ${c.id}`)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-hover flex items-center gap-2"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    Rename
                                  </button>
                                  <button
                                    onClick={() => handleDelete(c.id)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-hover text-error flex items-center gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Footer actions */}
      <div className="pt-3 mt-3 border-t border-border">
        <div className="px-2 space-y-2">
          <Link href="/projects" className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-background-surface-secondary/80 backdrop-blur-sm text-text-primary border border-border/40 hover:bg-hover transition shadow-soft">
            <FolderOpen className="h-4 w-4" />
            Projects
          </Link>
          <button
            onClick={() => { /* TODO: wire export later */ }}
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-background-surface text-text-primary border border-border hover:bg-hover transition shadow-soft"
          >
            <FileDown className="h-4 w-4" />
            Export Chat
          </button>
        </div>
      </div>
    </aside>
  );
};

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 px-2 mb-2 text-xs uppercase tracking-wide text-text-muted">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);


