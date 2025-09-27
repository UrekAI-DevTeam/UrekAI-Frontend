# State Directory

This directory contains Zustand stores that manage application state using a lightweight, type-safe state management solution.

## State Stores

### 📁 Core State Files

#### `authStore.ts`
- **Purpose**: Manages user authentication state and operations
- **State Properties**:
  - `user` - Current user information
  - `isAuthenticated` - Authentication status
  - `isFirebaseAuthenticated` - Firebase authentication status
  - `isLoading` - Loading state for auth operations
- **Actions**:
  - `login()` - User login with email/password
  - `signup()` - User registration
  - `googleLogin()` - Google OAuth authentication
  - `logout()` - User logout and state cleanup
  - `checkAuth()` - Verify authentication status
  - `setUser()` - Update user information
  - `setLoading()` - Update loading state
- **Persistence**: Uses Zustand persist middleware for state persistence
- **Dependencies**: Uses `@/utils/firebase/FirebaseClient` for Firebase operations

#### `chatStore.ts`
- **Purpose**: Manages chat data, messages, and chat-related state
- **State Properties**:
  - `chats` - Dictionary of chat objects
  - `activeChat` - Currently active chat
  - `isLoading` - Loading state for chat operations
- **Actions**:
  - `createChat()` - Create new chat
  - `updateChat()` - Update existing chat
  - `deleteChat()` - Delete chat and related data
  - `setActiveChat()` - Set active chat
  - `addMessage()` - Add message to chat
  - `updateMessage()` - Update existing message
  - `deleteMessage()` - Delete message
  - `loadChats()` - Load all user chats
  - `loadMessages()` - Load messages for specific chat
- **Dependencies**: Uses `@/utils/firebase/firebaseData` and `@/utils/firebase/firebasefiles`

#### `foldersStore.ts`
- **Purpose**: Manages folder organization and hierarchy
- **State Properties**:
  - `folders` - Array of folder objects
  - `selectedFolderId` - Currently selected folder
  - `expandedFolders` - Set of expanded folder IDs
- **Actions**:
  - `createFolder()` - Create new folder
  - `updateFolder()` - Update folder properties
  - `deleteFolder()` - Delete folder
  - `setSelectedFolder()` - Set selected folder
  - `toggleFolderExpansion()` - Toggle folder expansion state
  - `loadFolders()` - Load all user folders
- **Dependencies**: Uses `@/utils/firebase/firebaseData`

#### `filesStore.ts`
- **Purpose**: Manages file uploads and attachments
- **State Properties**:
  - `uploadedFiles` - Array of uploaded files
  - `attachedFiles` - Dictionary of files attached to chats
  - `isUploading` - Upload progress state
- **Actions**:
  - `uploadFile()` - Upload new file
  - `deleteUploadedFile()` - Delete uploaded file
  - `attachFileToChat()` - Attach file to specific chat
  - `detachFileFromChat()` - Remove file from chat
  - `loadUploadedFiles()` - Load all uploaded files
  - `loadAttachedFiles()` - Load files for specific chat
- **Dependencies**: Uses `@/utils/firebase/firebasefiles`

#### `archivedChatsStore.ts`
- **Purpose**: Manages archived chat history and restoration
- **State Properties**:
  - `archivedChats` - Array of archived chat objects
  - `isLoading` - Loading state for archive operations
- **Actions**:
  - `archiveChat()` - Archive chat
  - `restoreChat()` - Restore archived chat
  - `deleteArchivedChat()` - Permanently delete archived chat
  - `loadArchivedChats()` - Load archived chat history
- **Dependencies**: Uses `@/utils/firebase/firebaseData`

## State Architecture

### Store Pattern
Each store follows a consistent Zustand pattern:
```typescript
interface StoreState {
  // State properties
  data: DataType[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadData: () => Promise<void>;
  updateData: (id: string, updates: Partial<DataType>) => void;
  deleteData: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // State implementation
    }),
    {
      name: 'store-storage',
      partialize: (state) => ({ /* persisted state */ })
    }
  )
);
```

### State Synchronization
- **Firebase Integration**: All stores sync with Firebase for data persistence
- **Real-time Updates**: Changes are immediately reflected in the UI
- **Optimistic Updates**: UI updates before server confirmation for better UX

### Persistence Strategy
- **Selective Persistence**: Only essential state is persisted to localStorage
- **Session Recovery**: User sessions are restored on app reload
- **Data Freshness**: Fresh data is loaded from Firebase on app start

## State Management Patterns

### Data Flow
1. **User Action** → Component calls store action
2. **Store Action** → Updates local state and calls Firebase
3. **Firebase Response** → Confirms or rejects the change
4. **UI Update** → Component re-renders with new state

### Error Handling
- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: User-friendly error messages
- **State Recovery**: Automatic state recovery after errors

### Loading States
- **Global Loading**: App-wide loading indicators
- **Component Loading**: Component-specific loading states
- **Optimistic Updates**: Immediate UI feedback for better UX

## Dependencies

### Internal Dependencies
- **`@/utils/firebase/*`** - Firebase utilities for data operations
- **`@/types`** - TypeScript interfaces for state types
- **`@/services/api`** - API services for external communication

### External Dependencies
- **Zustand** - State management library
- **Firebase** - Backend data storage and authentication
- **React** - Component framework for state consumption

## Usage Patterns

### Store Consumption
```typescript
// In a React component
import { useChatStore } from '@/state/chatStore';

export function ChatComponent() {
  const { chats, activeChat, createChat } = useChatStore();
  
  const handleCreateChat = () => {
    createChat({ name: 'New Chat' });
  };
  
  return (
    <div>
      {chats.map(chat => (
        <div key={chat.id}>{chat.name}</div>
      ))}
    </div>
  );
}
```

### Store Actions
```typescript
// Store action implementation
const createChat = async (chatData: Partial<Chat>) => {
  set({ isLoading: true });
  try {
    const newChat = await saveChat(chatData);
    set(state => ({
      chats: { ...state.chats, [newChat.id]: newChat },
      isLoading: false
    }));
  } catch (error) {
    set({ isLoading: false, error: error.message });
  }
};
```

## Best Practices

### State Design
1. **Single Responsibility**: Each store manages one domain of state
2. **Immutable Updates**: Always create new state objects
3. **Type Safety**: Use TypeScript interfaces for all state types
4. **Normalized Data**: Use dictionaries for efficient lookups

### Performance
1. **Selective Subscriptions**: Components only subscribe to needed state
2. **Memoization**: Use React.memo for expensive components
3. **Batch Updates**: Group related state updates together
4. **Lazy Loading**: Load data only when needed

### Error Handling
1. **Graceful Degradation**: App continues working with partial data
2. **User Feedback**: Clear error messages and recovery options
3. **Retry Logic**: Automatic retry for transient failures
4. **State Recovery**: Restore state after errors

This state management system provides a robust, scalable foundation for managing application state with excellent developer experience and user performance.
