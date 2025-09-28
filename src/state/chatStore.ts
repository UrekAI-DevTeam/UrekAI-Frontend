import { create } from 'zustand';
import { Message, UploadedFile, AttachedFile } from '@/types';
import {
  saveChat,
  fetchChats,
  deleteChat,
  fetchMessages,
  saveMessage,
  deleteMessage,
  updateMessage,
  updateChat,
} from '@/utils/firebase/firebaseData';
import { saveAttachedFile, fetchAttachedFiles, deleteAttachedFile } from '@/utils/firebase/firebasefiles';

interface ChatData {
  id: string;
  name: string;
  folderId?: string;
  messages: Message[];
  attachedFiles: AttachedFile[];
  uploadingFiles: UploadedFile[];
  isLoaded: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface ChatStore {
  chats: Record<string, ChatData>;
  activeChat: string | null;
  isLoading: boolean;
  
  // Initialize
  initializeChats: (chats: any[]) => void;
  loadChatData: (chatId: string) => Promise<void>;
  
  // Chat management
  createChat: (chatId: string, name: string, folderId?: string) => Promise<void>;
  updateChatData: (chatId: string, updates: Partial<ChatData>) => Promise<void>;
  deleteChatData: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string) => void;
  getChatData: (chatId: string) => ChatData | undefined;
  getAllChats: () => ChatData[];
  getIndependentChats: () => ChatData[];
  getFolderChats: (folderId: string) => ChatData[];
  
  // Messages
  addMessage: (chatId: string, message: Message, thinkingMsg?: boolean) => Promise<void>;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => Promise<void>;
  editMessage: (chatId: string, messageId: string, content: string | React.ReactNode, thinkingMsg?: boolean) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  
  // Uploading files
  addUploadingFile: (chatId: string, file: UploadedFile) => void;
  updateUploadingFile: (chatId: string, fileId: string, updates: Partial<UploadedFile>) => void;
  removeUploadingFile: (chatId: string, fileId: string) => void;
  getUploadingFiles: (chatId: string) => UploadedFile[];
  
  // Attached files
  attachFile: (chatId: string, file: AttachedFile) => Promise<void>;
  removeAttachedFile: (chatId: string, fileId: string) => Promise<void>;
  removeFileFromAllChats: (fileId: string) => void;
  getAttachedFiles: (chatId: string) => AttachedFile[];
}

export const useChatStore = create<ChatStore>()(
  (set, get) => ({
      chats: {},
      activeChat: null,
      isLoading: false,

      initializeChats: (chats) => {
        const chatsRecord: Record<string, ChatData> = {};
        chats.forEach(chat => {
          chatsRecord[chat.id] = {
            id: chat.id,
            name: chat.name,
            folderId: chat.folderId,
            messages: chat.messages || [],
            attachedFiles: chat.attachedFiles || [],
            uploadingFiles: [],
            isLoaded: true
          };
        });
        set({ chats: chatsRecord });
      },

      loadChatData: async (chatId) => {
        const state = get();
        if (state.chats[chatId]?.isLoaded) return;

        try {
          const [messages, attachedFiles] = await Promise.all([
            fetchMessages(chatId),
            fetchAttachedFiles(chatId)
          ]);

          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages,
                attachedFiles,
                isLoaded: true
              }
            }
          }));
        } catch (error) {
          console.error('Failed to load chat data:', error);
        }
      },

      createChat: async (chatId, name, folderId) => {
        try {
          const chatData = {
            id: chatId,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
          };

          await saveChat(chatData, folderId);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                id: chatId,
                name,
                folderId,
                messages: [],
                attachedFiles: [],
                uploadingFiles: [],
                isLoaded: true
              },
            }
          }));
        } catch (error) {
          console.error('Failed to create chat:', error);
          throw error;
        }
      },

      updateChatData: async (chatId, updates) => {
        try {
          await updateChat(chatId, updates);
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                ...updates
              }
            }
          }));
        } catch (error) {
          console.error('Failed to update chat:', error);
          throw error;
        }
      },

      deleteChatData: async (chatId) => {
        try {
          await deleteChat(chatId);
          set((state) => {
            const newChats = { ...state.chats };
            delete newChats[chatId];
            return {
              chats: newChats,
              activeChat: state.activeChat === chatId ? null : state.activeChat
            };
          });
        } catch (error) {
          console.error('Failed to delete chat:', error);
          throw error;
        }
      },

      setActiveChat: (chatId) => {
        set({ activeChat: chatId });
        // Load chat data if not already loaded
        const state = get();
        if (!state.chats[chatId]?.isLoaded) {
          state.loadChatData(chatId);
        }
      },

      getChatData: (chatId) => {
        const state = get();
        return state.chats[chatId];
      },

      getAllChats: () => {
        const state = get();
        return Object.values(state.chats);
      },

      getIndependentChats: () => {
        const state = get();
        return Object.values(state.chats).filter(chat => !chat.folderId);
      },

      getFolderChats: (folderId) => {
        const state = get();
        return Object.values(state.chats).filter(chat => chat.folderId === folderId);
      },

      addMessage: async (chatId, message, thinkingMsg = false) => {
        try {
          if(!thinkingMsg)
            await saveMessage(chatId, message);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages: [...(state.chats[chatId]?.messages || []), message],
              },
            },
          }));

          // Update chat's updatedAt timestamp
          await updateChat(chatId, { updatedAt: new Date().toISOString() });
        } catch (error) {
          console.error('Failed to add message:', error);
          throw error;
        }
      },

      updateMessage: async (chatId, messageId, updates) => {
        try {
          await updateMessage(chatId, messageId, updates);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages: (state.chats[chatId]?.messages || []).map((msg) =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
              },
            },
          }));
        } catch (error) {
          console.error('Failed to update message:', error);
          throw error;
        }
      },

      editMessage: async (chatId, messageId, content, thinkingMsg = false) => {
        try {
          const updates = { content };
          if(!thinkingMsg)
            await updateMessage(chatId, messageId, updates);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages: (state.chats[chatId]?.messages || []).map((msg) =>
                  msg.id === messageId 
                    ? { 
                        ...msg, 
                        content: typeof msg.content === 'string' && typeof content === 'string'
                          ? msg.content + '\n' + content
                          : content
                      }
                    : msg
                ),
              },
            },
          }));
        } catch (error) {
          console.error('Failed to edit message:', error);
          throw error;
        }
      },

      deleteMessage: async (chatId, messageId) => {
        try {
          await deleteMessage(chatId, messageId);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages: (state.chats[chatId]?.messages || []).filter(
                  (msg) => msg.id !== messageId
                ),
              },
            },
          }));
        } catch (error) {
          console.error('Failed to delete message:', error);
          throw error;
        }
      },

      updateMessages: (chatId: string, messages: Message[]) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: {
              ...state.chats[chatId],
              messages,
            },
          },
        })),

      addUploadingFile: (chatId, file) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: {
              ...state.chats[chatId],
              uploadingFiles: [...(state.chats[chatId]?.uploadingFiles || []), file],
            },
          },
        })),

      updateUploadingFile: (chatId, fileId, updates) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: {
              ...state.chats[chatId],
              uploadingFiles: (state.chats[chatId]?.uploadingFiles || []).map((file) =>
                file.id === fileId ? { ...file, ...updates } : file
              ),
            },
          },
        })),

      removeUploadingFile: (chatId, fileId) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: {
              ...state.chats[chatId],
              uploadingFiles: (state.chats[chatId]?.uploadingFiles || []).filter(
                (file) => file.id !== fileId
              ),
            },
          },
        })),

      getUploadingFiles: (chatId) => {
        const state = get();
        return state.chats[chatId]?.uploadingFiles || [];
      },

      attachFile: async (chatId, file) => {
        try {
          await saveAttachedFile(chatId, file);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                attachedFiles: [...(state.chats[chatId]?.attachedFiles || []), file],
              },
            },
          }));
        } catch (error) {
          console.error('Failed to attach file:', error);
          throw error;
        }
      },

      removeAttachedFile: async (chatId, fileId) => {
        try {
          await deleteAttachedFile(chatId, fileId);
          
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                attachedFiles: (state.chats[chatId]?.attachedFiles || []).filter(
                  (file) => file.id !== fileId
                ),
              },
            },
          }));
        } catch (error) {
          console.error('Failed to remove attached file:', error);
          throw error;
        }
      },

      getAttachedFiles: (chatId) => {
        const state = get();
        return state.chats[chatId]?.attachedFiles || [];
      },

      removeFileFromAllChats: (fileId) =>
        set((state) => {
          const updatedChats = { ...state.chats };
          Object.keys(updatedChats).forEach(chatId => {
            updatedChats[chatId] = {
              ...updatedChats[chatId],
              attachedFiles: updatedChats[chatId].attachedFiles.filter(
                file => file.id !== fileId
              ),
            };
          });
          return { chats: updatedChats };
        }),
    })
);