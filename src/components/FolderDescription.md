# Components Directory

This directory contains legacy components that are being migrated to the new feature-based structure.

## Current Contents

### 📁 `firebase/` (DEPRECATED - Moved to `src/utils/firebase/`)
**Status**: ❌ Removed - Files have been moved to `src/utils/firebase/`

Previously contained:
- `FirebaseClient.tsx` - Firebase configuration and client setup
- `firebaseData.ts` - Firestore data operations (folders, chats, messages)
- `firebasefiles.ts` - File upload and attachment operations

### 📁 `shared/`
Shared utility components used across the application.

#### `BackButton.tsx`
- **Purpose**: Reusable back navigation button component
- **Usage**: Provides consistent back navigation UI
- **Dependencies**: Uses `@/ui/Button` for styling

### 📁 Legacy Component Folders
These folders contain components that are being migrated to the new `features/` structure:

#### `auth/` (DEPRECATED - Moved to `src/features/auth/`)
- **Status**: ❌ Migrated to `src/features/auth/`
- **Contains**: Authentication modal and Google auth debugging components

#### `chat/` (DEPRECATED - Moved to `src/features/chat/`)
- **Status**: ❌ Migrated to `src/features/chat/`
- **Contains**: Chat interface components, message handling, file attachments

#### `designerui/` (DEPRECATED - Moved to `src/features/designerui/`)
- **Status**: ❌ Migrated to `src/features/designerui/`
- **Contains**: Custom UI components, sidebar, theme utilities

#### `layout/` (DEPRECATED - Moved to `src/layouts/`)
- **Status**: ❌ Migrated to `src/layouts/`
- **Contains**: Navigation, sidebar, global layout components

#### `modals/` (DEPRECATED - Moved to `src/features/modals/`)
- **Status**: ❌ Migrated to `src/features/modals/`
- **Contains**: Modal dialogs for various operations

#### `pages/` (DEPRECATED - Moved to `src/pages/`)
- **Status**: ❌ Migrated to `src/pages/`
- **Contains**: Page UI components

#### `ui/` (DEPRECATED - Moved to `src/ui/`)
- **Status**: ❌ Migrated to `src/ui/`
- **Contains**: Base UI primitive components

### Core Files

#### `ProtectedRoute.tsx`
- **Purpose**: Route protection component for authenticated pages
- **Usage**: Wraps protected routes to ensure user authentication
- **Dependencies**: Uses `@/state/authStore` for authentication state

## Migration Status

### ✅ Completed Migrations
- Firebase utilities → `src/utils/firebase/`
- Authentication components → `src/features/auth/`
- Chat components → `src/features/chat/`
- Designer UI → `src/features/designerui/`
- Layout components → `src/layouts/`
- Modal components → `src/features/modals/`
- Page components → `src/pages/`
- UI primitives → `src/ui/`

### 🔄 Remaining Components
- `shared/BackButton.tsx` - Will be moved to `src/ui/` or `src/features/shared/`
- `ProtectedRoute.tsx` - Will be moved to `src/features/auth/` or `src/components/`

## Future Plans

This directory will eventually be removed once all components are migrated to the new structure:
- **`shared/`** → `src/ui/` or `src/features/shared/`
- **`ProtectedRoute.tsx`** → `src/features/auth/ProtectedRoute.tsx`

The new structure provides better organization, clearer dependencies, and easier maintenance.
