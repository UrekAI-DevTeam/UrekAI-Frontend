"use client";
import React from 'react';
import { ChevronDown, ChevronRight, MessageSquare, FolderOpen, Plus, FileDown } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/state/chatStore';
import { useFoldersStore } from '@/state/foldersStore';

interface ChatSidebarProps {
  onSelectChat?: (chatId: string) => void;
  onClose?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, onClose }) => {
  const { getAllChats, getFolderChats, setActiveChat, createChat } = useChatStore();
  const { folders, toggleFolder, expandedFolders } = useFoldersStore();

  const allChats = getAllChats();
  const independentChats = allChats.filter((c) => !c.folderId);

  const handleSelect = (chatId: string) => {
    setActiveChat(chatId);
    onSelectChat?.(chatId);
    onClose?.(); // Close sidebar on mobile after selection
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
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className="w-full text-left h-10 px-3 rounded-lg text-sm hover:bg-hover transition"
              >
                {c.name || `Chat ${c.id}`}
              </button>
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
                <div key={f.id} className="rounded-lg border border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => toggleFolder(f.id)}
                    className="w-full flex items-center justify-between h-10 px-3 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    <span className="font-medium">{f.name}</span>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="p-2 pt-0 space-y-1">
                      {chats.length === 0 && (
                        <div className="text-xs text-gray-500 dark:text-white/60 px-2 py-1">No chats</div>
                      )}
                      {chats.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelect(c.id)}
                          className="w-full text-left h-10 px-3 rounded-lg text-sm hover:bg-hover transition"
                        >
                          {c.name}
                        </button>
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
      <div className="pt-3 mt-3 border-t border-gray-200 dark:border-white/10">
        <div className="px-2 space-y-2">
          <Link href="/projects" className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-background-surface-secondary/80 backdrop-blur-sm text-text-primary border border-border/40 hover:bg-hover transition shadow-soft">
            <FolderOpen className="h-4 w-4" />
            Projects
          </Link>
          <button
            onClick={() => { /* TODO: wire export later */ }}
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 hover:bg-white dark:hover:bg-white/15 transition shadow-soft"
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
    <div className="flex items-center gap-2 px-2 mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-white/60">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);


