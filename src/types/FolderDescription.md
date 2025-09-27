# Types Directory

This directory contains TypeScript type definitions and interfaces that provide type safety throughout the application.

## Type Definitions

### 📁 Core Type Files

#### `index.ts`
- **Purpose**: Centralized type definitions for the entire application
- **Contents**: All TypeScript interfaces, types, and enums used across the codebase

## Type Categories

### 📁 Data Models

#### User and Authentication Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isFirebaseAuthenticated: boolean;
  isLoading: boolean;
}
```

#### Chat and Message Types
```typescript
interface Chat {
  id: string;
  name: string;
  folderId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string | object;
  timestamp: string;
  isError?: boolean;
}
```

#### Folder and Organization Types
```typescript
interface Folder {
  id: string;
  name: string;
  createdAt: string;
  isSelected?: boolean;
}

interface FolderState {
  folders: Folder[];
  selectedFolderId: string | null;
  expandedFolders: Set<string>;
}
```

#### File Management Types
```typescript
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  attachedAt: string;
}
```

### 📁 Component Props Types

#### UI Component Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

#### Modal Component Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

interface CreateItemModalProps extends ModalProps {
  type: 'folder' | 'chat';
  onConfirm: (name: string) => void;
}
```

### 📁 API and Service Types

#### API Request/Response Types
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  firebase_token?: string;
}

interface ChatQueryRequest {
  userQuery: string;
  chatId?: string;
}

interface ChatQueryResponse {
  response: string;
  chatId: string;
  messageId: string;
}
```

#### Service Function Types
```typescript
interface AuthAPI {
  signIn: (email: string, password: string) => Promise<LoginResponse>;
  signUp: (name: string, email: string, password: string) => Promise<LoginResponse>;
  googleAuth: (code: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkUser: () => Promise<User>;
}

interface ChatAPI {
  sendQuery: (query: string, chatId?: string) => Promise<ChatQueryResponse>;
}
```

### 📁 State Management Types

#### Zustand Store Types
```typescript
interface ChatStore {
  chats: Record<string, Chat>;
  activeChat: Chat | null;
  isLoading: boolean;
  createChat: (chat: Partial<Chat>) => Promise<void>;
  updateChat: (id: string, updates: Partial<Chat>) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  setActiveChat: (chat: Chat | null) => void;
}

interface FilesStore {
  uploadedFiles: UploadedFile[];
  attachedFiles: Record<string, AttachedFile[]>;
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  deleteUploadedFile: (id: string) => Promise<void>;
  attachFileToChat: (fileId: string, chatId: string) => Promise<void>;
}
```

### 📁 Utility and Helper Types

#### Generic Utility Types
```typescript
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

#### Event Handler Types
```typescript
type EventHandler<T = void> = (event: T) => void;
type AsyncEventHandler<T = void> = (event: T) => Promise<void>;
type ChangeHandler<T = string> = (value: T) => void;
```

## Type Architecture

### Type Organization
- **Centralized**: All types are defined in a single file for easy management
- **Categorized**: Types are grouped by functionality (data, props, API, etc.)
- **Exported**: All types are properly exported for use throughout the app
- **Documented**: Complex types include JSDoc comments for clarity

### Type Safety Patterns
```typescript
// Generic type constraints
interface Repository<T extends { id: string }> {
  findById: (id: string) => Promise<T | null>;
  save: (item: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

// Discriminated unions
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };
```

### Type Guards and Validation
```typescript
// Type guard functions
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

// Runtime validation
function validateChat(chat: any): chat is Chat {
  return chat && 
    typeof chat.id === 'string' && 
    typeof chat.name === 'string' &&
    Array.isArray(chat.messages);
}
```

## Usage Patterns

### Import and Usage
```typescript
import { User, Chat, Message, ButtonProps } from '@/types';

// In components
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  // Component implementation
};

// In stores
const useChatStore = create<ChatStore>((set, get) => ({
  // Store implementation
}));
```

### Type Assertions
```typescript
// Safe type assertions
const user = response.data as User;
const chat = await fetchChat(chatId) as Chat;

// Type narrowing
if (isUser(data)) {
  // data is now typed as User
  console.log(data.name);
}
```

## Best Practices

### Type Definition
1. **Descriptive Names**: Use clear, descriptive names for types
2. **Consistent Naming**: Follow consistent naming conventions
3. **Documentation**: Add JSDoc comments for complex types
4. **Generic Types**: Use generics for reusable type patterns

### Type Usage
1. **Strict Typing**: Use strict TypeScript configuration
2. **Type Guards**: Implement type guards for runtime validation
3. **Error Handling**: Define error types for consistent error handling
4. **API Types**: Define types for all API requests and responses

### Maintenance
1. **Version Control**: Track type changes in version control
2. **Breaking Changes**: Document breaking changes in type definitions
3. **Migration**: Provide migration guides for type changes
4. **Testing**: Test type definitions with real data

## Dependencies

### Internal Dependencies
- **React Types**: React component and hook types
- **Next.js Types**: Next.js specific types for routing and API

### External Dependencies
- **TypeScript**: Core type system
- **Firebase Types**: Firebase SDK type definitions
- **Zustand Types**: Zustand state management types

This type system provides comprehensive type safety throughout the application, ensuring better developer experience and fewer runtime errors.
