import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import { UploadedFile, AttachedFile } from '@/types';
import { useChatStore } from './chatStore';
// import { getCurrentUID } from '../components/firebase/FirebaseClient';
import { saveUploadedFile, fetchUploadedFiles, deleteUploadedFiles } from '@/utils/firebase/firebasefiles';

interface FilesStore {
  uploadedFiles: UploadedFile[];
  attachedFiles: Record<string, AttachedFile[]>; // chatId -> files
  initializeUploadedFiles: () => Promise<void>;
  addUploadedFile: (file: UploadedFile) => void;
  updateUploadedFile: (id: string, updates: Partial<UploadedFile>) => void;
  removeUploadedFile: (id: string, removeFromChats?: boolean, onFileRemovedFromChats?: (fileId: string) => void) => void;
  attachFileToChat: (chatId: string, file: UploadedFile) => void;
  removeAttachedFile: (chatId: string, fileId: string) => void;
  getAttachedFiles: (chatId: string) => AttachedFile[];
  getAvailableFiles: (chatId: string) => UploadedFile[];
}

export const useFilesStore = create<FilesStore>()(
  // persist(
    (set, get) => ({
      uploadedFiles: [],

      initializeUploadedFiles: async () => {
        const files = await fetchUploadedFiles();
        set(() => ({ uploadedFiles: files }));
      },

      attachedFiles: {},

      addUploadedFile: async (file) => {
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        }));
        await saveUploadedFile(file);
      },

      updateUploadedFile: async (id, updates) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((file) =>
            file.id === id ? { ...file, ...updates } : file
          ),
        }))
      },

      removeUploadedFile: async (id, removeFromChats = false, onFileRemovedFromChats) => {
        set((state) => {
          const newState = {
          uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
          attachedFiles: removeFromChats 
            ? Object.fromEntries(
                Object.entries(state.attachedFiles).map(([chatId, files]) => [
                  chatId,
                  files.filter(file => file.id !== id)
                ])
              )
            : state.attachedFiles,
          };
          deleteUploadedFiles(id);
          // Call the callback to notify about file removal
          if (removeFromChats && onFileRemovedFromChats) {
            onFileRemovedFromChats(id);
          }
          
          return newState;
        })
      },

      attachFileToChat: (chatId, file) => {
        if (file.status !== 'completed' || !file.uploadId || !file.extension) return;
        
        const attachedFile: AttachedFile = {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadId: file.uploadId,
          extension: file.extension,
        };

        set((state) => ({
          attachedFiles: {
            ...state.attachedFiles,
            [chatId]: [...(state.attachedFiles[chatId] || []), attachedFile],
          },
        }));
      },

      removeAttachedFile: (chatId, fileId) =>
        set((state) => ({
          attachedFiles: {
            ...state.attachedFiles,
            [chatId]: (state.attachedFiles[chatId] || []).filter(
              (file) => file.id !== fileId
            ),
          },
        })),

      getAttachedFiles: (chatId) => {
        const state = get();
        return state.attachedFiles[chatId] || [];
      },

      getAvailableFiles: (chatId) => {
        const state = get();
        // Get attached files from the legacy files store
        const legacyAttachedFileIds = new Set(
          (state.attachedFiles[chatId] || []).map((file) => file.id)
        );
        
        // Also get attached files from the chat store
        const chatStore = useChatStore.getState();
        const chatAttachedFileIds = new Set(
          (chatStore.chats[chatId]?.attachedFiles || []).map((file) => file.id)
        );
        
        // Combine both sets of attached file IDs
        const allAttachedFileIds = new Set([
          ...legacyAttachedFileIds,
          ...chatAttachedFileIds
        ]);
        
        return state.uploadedFiles.filter(
          (file) => file.status === 'completed' && !allAttachedFileIds.has(file.id)
        );
      },
    }), 
//     {
//       name: 'file-storage',
//     } 
// )
);