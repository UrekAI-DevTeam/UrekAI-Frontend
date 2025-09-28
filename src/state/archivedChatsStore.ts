import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, AttachedFile } from '@/types';

export interface ArchivedChat {
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

interface ArchivedChatsStore {
  archivedChats: ArchivedChat[];
  archiveChat: (chat: {
    id: string;
    name: string;
    folderId?: string;
    originalFolderId: string;
    originalFolderName: string;
    messages: Message[];
    attachedFiles: AttachedFile[];
    createdAt?: string;
    updatedAt?: string;
  }) => void;
  restoreChat: (chatId: string) => ArchivedChat | null;
  deleteArchivedChat: (chatId: string) => void;
  getArchivedChats: () => ArchivedChat[];
}

export const useArchivedChatsStore = create<ArchivedChatsStore>()(persist((set, get) => ({
      archivedChats: [],

      archiveChat: (chat) =>
        set((state) => ({
          archivedChats: [
            ...state.archivedChats,
            {
              ...chat,
              archivedAt: new Date().toISOString(),
            },
          ],
        })),

      restoreChat: (chatId) => {
        const state = get();
        const chatToRestore = state.archivedChats.find(chat => chat.id === chatId);
        
        if (chatToRestore) {
          set((state) => ({
            archivedChats: state.archivedChats.filter(chat => chat.id !== chatId),
          }));
          return chatToRestore;
        }
        
        return null;
      },

      deleteArchivedChat: (chatId) =>
        set((state) => ({
          archivedChats: state.archivedChats.filter(chat => chat.id !== chatId),
        })),

      getArchivedChats: () => {
        const state = get();
        return state.archivedChats;
      },
    }),
    {
      name: 'archived-chats-storage',
    }
  ));