import { db } from "./FirebaseClient";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { getCurrentUID } from "./FirebaseClient";
import { Folder, Chat, Message } from '../../types';
import { fetchAttachedFiles } from "./firebasefiles";

// ============= FOLDERS =============
export const saveFolders = async (folders: Folder[]) => {
  try {
    const uid = getCurrentUID();
    const batch = writeBatch(db);
    
    folders.forEach(folder => {
      const ref = doc(db, `users/${uid}/folders/${folder.id}`);
      batch.set(ref, {
        id: folder.id,
        name: folder.name,
        createdAt: folder.createdAt || new Date().toISOString(),
        isSelected: folder.isSelected || false
      });
    });
    
    // await batch.commit();
    batch.commit()
    .then(() => {
      console.log("Folders saved successfully!");
    })
    .catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error saving folders:", error);
  }
};

export const saveFolder = async (folder: Folder) => {
  try {
    const uid = getCurrentUID();
    const ref = doc(db, `users/${uid}/folders/${folder.id}`);
    setDoc(ref, {
      id: folder.id,
      name: folder.name,
      createdAt: folder.createdAt || new Date().toISOString(),
      isSelected: folder.isSelected || false,
    })
      .then(() => {
        console.log("Folder saved successfully!");
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.error("Error saving folder:", error);
  }
};

export const fetchFolders = async (): Promise<Folder[]> => {
  try {
    const uid = getCurrentUID();
    const colRef = collection(db, `users/${uid}/folders`);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data() as Folder);
    })
    .catch((error) => {
      throw error; 
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

export const updateFolder = async (id: string, updates: Partial<Folder>) => {
  try {
    const uid = getCurrentUID();
    updateDoc(doc(db, `users/${uid}/folders/${id}`), updates)
    .then(() => {
      console.log("Folder updated successfully!");
    })
    .catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error updating folder:", error);
  }
};

export const deleteFolder = async (id: string) => {
  try {
    const uid = getCurrentUID();
    deleteDoc(doc(db, `users/${uid}/folders/${id}`))
    .then(() => {
      console.log("Folder deleted successfully!");
    })
    .catch((error) => {
      throw error;
    })
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};

// ============= CHATS =============
export const saveChat = async (chat: Chat, folderId?: string) => {
  try {
    const uid = getCurrentUID();
    const chatData = {
      id: chat.id,
      name: chat.name,
      folderId: folderId || null,
      createdAt: chat.createdAt || new Date().toISOString(),
      updatedAt: chat.updatedAt || new Date().toISOString(),
      isActive: chat.isActive || false
    };
    
    const ref = doc(db, `users/${uid}/chats/${chat.id}`);
    setDoc(ref, chatData)
    .then(() => {
      console.log("Chat saved successfully!");
    })
    .catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error saving chat:", error);
  }
};

export const fetchChats = async (): Promise<Chat[]> => {
  try {
    const uid = getCurrentUID();
    const colRef = collection(db, `users/${uid}/chats`);
    const q = query(colRef, orderBy('updatedAt', 'desc'));
    return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          name: data.name,
          folderId: data.folderId,
          messages: [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isActive: data.isActive,
        } as Chat;
      });
    })
    .catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const updateChat = async (id: string, updates: Partial<Chat>) => {
  try {
    const uid = getCurrentUID();
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    updateDoc(doc(db, `users/${uid}/chats/${id}`), updateData)
    .then(() => {
      console.log("Chat updated successfully!");
    })
    .catch((error) => {
      console.error("Error during updatiing chat");
      throw error;
    })
  } catch (error) {
    console.error("Error updating chat:", error);
  }
};

export const deleteChat = async (id: string) => {
  try {
    const uid = getCurrentUID();
    
    // Delete chat document
    deleteDoc(doc(db, `users/${uid}/chats/${id}`))
    .then(() => {
      const messagesRef = collection(db, `users/${uid}/chats/${id}/messages`);
      return getDocs(messagesRef);
    })
    .then((messagesSnapshot) => {
      const batch = writeBatch(db);

      messagesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const attachedFilesRef = collection(db, `users/${uid}/chats/${id}/attachedFiles`);
      return getDocs(attachedFilesRef).then((attachedFilesSnapshot) => {
        attachedFilesSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit();
      });
    })
    .then(() => {
      console.log("Chat and related data deleted successfully!");
    })
    .catch((error) => {
      throw error; 
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};

// ============= MESSAGES =============
export const saveMessage = async (chatId: string, message: Message) => {
  try {
    const uid = getCurrentUID();
    const messageData = {
      id: message.id,
      type: message.type,
      content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
      timestamp: message.timestamp,
      isError: message.isError || false
    };
    
    const ref = doc(db, `users/${uid}/chats/${chatId}/messages/${message.id}`);
    setDoc(ref, messageData)
    .then(() => {
      console.log("Message saved successfully!");
    })
    .catch((error) => {
      console.error("Error during saving message");
      throw error;
    });
  } catch (error) {
    console.error(error);
  }
};

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const uid = getCurrentUID();
    const colRef = collection(db, `users/${uid}/chats/${chatId}/messages`);
    const q = query(colRef, orderBy('timestamp', 'asc'));
    return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        let content = data.content;

        if (typeof content === 'string' && content.startsWith('{')) {
          try {
            content = JSON.parse(content);
          } catch {
            // Keep as string if parsing fails
          }
        }

        return {
          id: data.id,
          type: data.type,
          content: content,
          timestamp: data.timestamp,
          isError: data.isError,
        } as Message;
      });
    })
    .catch((error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const updateMessage = async (chatId: string, messageId: string, updates: Partial<Message>) => {
  try {
    const uid = getCurrentUID();
    const updateData = {
      ...updates,
      content: typeof updates.content === 'string' ? updates.content : JSON.stringify(updates.content)
    };
    updateDoc(doc(db, `users/${uid}/chats/${chatId}/messages/${messageId}`), updateData)
    .then(() => {
      console.log("Message updated successfully!");
    })
    .catch((error) => {
      console.error("Error during updatiing message");
      throw error;
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteMessage = async (chatId: string, messageId: string) => {
  try {
    const uid = getCurrentUID();
    deleteDoc(doc(db, `users/${uid}/chats/${chatId}/messages/${messageId}`))
    .then(() => {
      console.log("Message deleted successfully!");
    })
    .catch((error) => {
      throw error;
    })
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};


// ============= BATCH OPERATIONS =============
export const initializeUserData = async () => {
  try {
    const [folders, chats] = await Promise.all([
      fetchFolders(),
      fetchChats()
    ]);
    
    // Load messages for each chat
    const chatsWithMessages = await Promise.all(
      chats.map(async (chat) => {
        const [messages, attachedFiles] = await Promise.all([
          fetchMessages(chat.id),
          fetchAttachedFiles(chat.id)
        ]);
        return {
          ...chat,
          messages,
          attachedFiles
        };
      })
    );
    
    return {
      folders,
      chats: chatsWithMessages
    };
  } catch (error) {
    console.error("Error initializing user data:", error);
    return {
      folders: [],
      chats: []
    };
  }
};


