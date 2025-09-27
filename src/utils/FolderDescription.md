# Utils Directory

This directory contains utility functions, helper modules, and configurations that support the application's functionality.

## Utility Modules

### 📁 `firebase/`
Firebase utilities for backend data operations and authentication.

#### `FirebaseClient.tsx`
- **Purpose**: Firebase configuration and client setup
- **Exports**:
  - `auth` - Firebase Authentication instance
  - `db` - Firestore database instance
  - `storage` - Firebase Storage instance
  - `firebaseClient` - Custom client with sign-in/sign-out methods
  - `getCurrentUID()` - Helper to get current user ID
- **Features**:
  - Firebase app initialization
  - Authentication state management
  - Error handling for auth operations
  - UID validation and retrieval
- **Configuration**: Uses environment-specific Firebase config

#### `firebaseData.ts`
- **Purpose**: Firestore data operations for folders, chats, and messages
- **Functions**:
  - **Folders**: `saveFolders()`, `saveFolder()`, `fetchFolders()`, `updateFolder()`, `deleteFolder()`
  - **Chats**: `saveChat()`, `fetchChats()`, `updateChat()`, `deleteChat()`
  - **Messages**: `saveMessage()`, `fetchMessages()`, `updateMessage()`, `deleteMessage()`
  - **Batch Operations**: `initializeUserData()` - Loads all user data
- **Features**:
  - Batch operations for performance
  - Error handling and logging
  - Data validation and transformation
  - User-specific data isolation
- **Dependencies**: Uses `FirebaseClient` for database access

#### `firebasefiles.ts`
- **Purpose**: File upload and attachment operations
- **Functions**:
  - **Uploaded Files**: `saveUploadedFile()`, `fetchUploadedFiles()`, `deleteUploadedFiles()`
  - **Attached Files**: `saveAttachedFile()`, `fetchAttachedFiles()`, `deleteAttachedFile()`
- **Features**:
  - File metadata management
  - Chat-specific file attachments
  - File deletion and cleanup
  - Error handling for file operations
- **Dependencies**: Uses `FirebaseClient` for database access

### 📁 Core Utility Files

#### `cn.ts`
- **Purpose**: Class name merging utility for combining Tailwind CSS classes
- **Function**: `cn(...classes)` - Merges and deduplicates class names
- **Features**:
  - Handles conditional classes
  - Removes duplicate classes
  - Supports arrays and objects
  - Integrates with Tailwind CSS
- **Usage**: Used throughout UI components for dynamic styling

## Utility Architecture

### Firebase Integration Pattern
```typescript
// Firebase utility pattern
export const firebaseOperation = async (data: DataType) => {
  try {
    const uid = getCurrentUID();
    const result = await firebaseMethod(uid, data);
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  }
};
```

### Error Handling Strategy
- **Consistent Logging**: All utilities log errors consistently
- **Graceful Degradation**: Functions return safe defaults on failure
- **Error Propagation**: Errors are properly thrown for handling by consumers
- **User Feedback**: Error messages are user-friendly

### Performance Optimization
- **Batch Operations**: Multiple operations are batched for efficiency
- **Caching**: Results are cached where appropriate
- **Lazy Loading**: Data is loaded only when needed
- **Connection Management**: Firebase connections are managed efficiently

## Dependencies

### Internal Dependencies
- **`@/types`** - TypeScript interfaces for data types
- **Firebase SDK** - Firebase client libraries

### External Dependencies
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **React** - Component framework for hooks and context
- **Tailwind CSS** - Styling framework for class utilities

## Usage Patterns

### Firebase Data Operations
```typescript
import { fetchChats, saveChat } from '@/utils/firebase/firebaseData';

// In a component or store
const loadChats = async () => {
  try {
    const chats = await fetchChats();
    setChats(chats);
  } catch (error) {
    console.error('Failed to load chats:', error);
  }
};
```

### Class Name Merging
```typescript
import { cn } from '@/utils/cn';

// In a component
const buttonClasses = cn(
  'base-button-styles',
  variant === 'primary' && 'primary-styles',
  size === 'lg' && 'large-styles',
  className
);
```

### Firebase Client Usage
```typescript
import { firebaseClient, getCurrentUID } from '@/utils/firebase/FirebaseClient';

// Authentication operations
const handleSignIn = async (token: string) => {
  try {
    const uid = await firebaseClient.firebaseSignIn(token);
    return uid;
  } catch (error) {
    console.error('Sign-in failed:', error);
  }
};
```

## Best Practices

### Firebase Operations
1. **Error Handling**: Always wrap Firebase operations in try-catch blocks
2. **User Context**: Ensure user is authenticated before data operations
3. **Batch Operations**: Use batch operations for multiple related changes
4. **Data Validation**: Validate data before saving to Firebase

### Utility Functions
1. **Pure Functions**: Keep utility functions pure and predictable
2. **Type Safety**: Use TypeScript interfaces for all parameters and returns
3. **Documentation**: Document complex utility functions
4. **Testing**: Write tests for critical utility functions

### Performance
1. **Lazy Loading**: Load data only when needed
2. **Caching**: Cache expensive operations where appropriate
3. **Connection Management**: Manage Firebase connections efficiently
4. **Memory Management**: Clean up resources and listeners

## Configuration

### Firebase Configuration
- **Environment Variables**: Firebase config is environment-specific
- **Security Rules**: Firestore security rules are properly configured
- **Authentication**: Firebase Auth is configured for the application
- **Storage**: Firebase Storage is configured for file uploads

### Development vs Production
- **Environment Detection**: Utilities detect and adapt to environment
- **Error Logging**: Different logging levels for development and production
- **Performance Monitoring**: Firebase performance monitoring is enabled
- **Debug Mode**: Debug logging is available in development

This utility system provides a robust foundation for data operations, styling, and other common functionality throughout the application.
