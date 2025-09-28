import { create } from 'zustand';
import { Folder } from '@/types';
import {
  saveFolder,
  deleteFolder,
  fetchFolders,
  updateFolder,
} from '@/utils/firebase/firebaseData';

interface FoldersStore {
  folders: Folder[];
  selectedFolderId: string | null;
  expandedFolders: Set<string>;
  isLoading: boolean;
  
  // Initialize
  initializeFolders: () => Promise<void>;
  
  // Folder management
  addFolder: (folder: Folder) => Promise<void>;
  updateFolderData: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  
  // UI state
  setSelectedFolder: (id: string | null) => void;
  toggleFolder: (id: string) => void;
  setExpandedFolders: (folders: Set<string>) => void;
  
  // Getters
  getFolderById: (id: string) => Folder | undefined;
  getAllFolders: () => Folder[];
}

export const useFoldersStore = create<FoldersStore>((set, get) => ({
  folders: [],
  selectedFolderId: null,
  expandedFolders: new Set(),
  isLoading: false,

  initializeFolders: async () => {
    set({ isLoading: true });
    try {
      const folders = await fetchFolders();
      set({ folders, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize folders:', error);
      set({ isLoading: false });
    }
  },

  addFolder: async (folder: Folder) => {
    try {
      await saveFolder(folder);
      set((state) => ({
        folders: [...state.folders, folder]
      }));
    } catch (error) {
      console.error('Failed to add folder:', error);
      throw error;
    }
  },

  updateFolderData: async (id: string, updates: Partial<Folder>) => {
    try {
      await updateFolder(id, updates);
      set((state) => ({
        folders: state.folders.map(folder =>
          folder.id === id ? { ...folder, ...updates } : folder
        )
      }));
    } catch (error) {
      console.error('Failed to update folder:', error);
      throw error;
    }
  },

  deleteFolder: async (id: string) => {
    try {
      await deleteFolder(id);
      set((state) => ({
        folders: state.folders.filter(folder => folder.id !== id),
        selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
        expandedFolders: new Set([...state.expandedFolders].filter(fId => fId !== id))
      }));
    } catch (error) {
      console.error('Failed to delete folder:', error);
      throw error;
    }
  },

  setSelectedFolder: (id: string | null) => {
    set({ selectedFolderId: id });
  },

  toggleFolder: (id: string) => {
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { 
        expandedFolders: newExpanded,
        selectedFolderId: newExpanded.has(id) ? id : null
      };
    });
  },

  setExpandedFolders: (folders: Set<string>) => {
    set({ expandedFolders: folders });
  },

  getFolderById: (id: string) => {
    const state = get();
    return state.folders.find(folder => folder.id === id);
  },

  getAllFolders: () => {
    const state = get();
    return state.folders;
  },
}));