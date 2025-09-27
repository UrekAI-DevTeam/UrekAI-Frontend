# Features Directory

This directory contains feature-based modules that group related functionality together.

## Feature Modules

### 📁 `auth/`
Authentication and user management features.

#### Components
- **`AuthModal.tsx`** - Main authentication modal with login/signup forms
- **`GoogleAuthDebug.tsx`** - Debug component for Google OAuth troubleshooting

#### Purpose
- Handles user authentication flows
- Manages login/signup UI
- Integrates with Google OAuth
- Provides authentication state management

### 📁 `chat/`
Chat interface and messaging functionality.

#### Components
- **`ChatArea.tsx`** - Main chat interface with message display and input
- **`ChatSidebar.tsx`** - Secondary sidebar for chat-specific navigation
- **`MessageList.tsx`** - Displays list of chat messages
- **`Message.tsx`** - Individual message component
- **`MessageInput.tsx`** - User input field for sending messages
- **`AttachedFilesBar.tsx`** - Shows files attached to current chat
- **`AttachmentPopup.tsx`** - Modal for attaching files to messages
- **`UploadingFileBadge.tsx`** - Shows individual file upload progress
- **`UploadingFilesBadges.tsx`** - Container for multiple upload badges
- **`AnalysisResponse.tsx`** - Renders AI analysis results
- **`TableModal.tsx`** - Modal for displaying tabular data
- **`GraphModal.tsx`** - Modal for displaying graph visualizations

#### Purpose
- Provides complete chat interface
- Handles real-time messaging
- Manages file attachments
- Displays AI responses and analysis
- Supports various content types (text, tables, graphs)

### 📁 `modals/`
Modal dialogs for various operations.

#### Components
- **`CreateItemModal.tsx`** - Modal for creating new folders or chats
- **`RenameModal.tsx`** - Modal for renaming existing items
- **`PinItemModal.tsx`** - Modal for pinning items to dashboard
- **`UploadedFilesModal.tsx`** - Modal for managing uploaded files
- **`ArchivedChatsModal.tsx`** - Modal for viewing archived chat history

#### Purpose
- Provides consistent modal UI patterns
- Handles user interactions for CRUD operations
- Manages file operations
- Supports item management (pin, rename, archive)

### 📁 `designerui/`
Custom UI components and design system.

#### Components
- **`index.ts`** - Exports all designer UI components
- **`demo.tsx`** - Demo component showcasing designer UI features
- **`sidebar.tsx`** - Custom sidebar component with advanced features
- **`useTheme.ts`** - Theme management hook
- **`raycast-animated-background.tsx`** - Animated background component
- **`raycast-animated-background.css`** - Styles for animated background

#### Purpose
- Provides advanced UI components
- Implements custom design patterns
- Manages theme switching
- Creates engaging visual effects

### 📁 `pages/`
Page-specific components and layouts.

#### Components
- **`Landing.tsx`** - Landing page component with marketing content

#### Purpose
- Contains page-specific UI components
- Separates page logic from routing
- Provides reusable page components

## Design Principles

### Feature-Based Organization
Each feature module contains:
- **Components** - UI components specific to that feature
- **Hooks** - Custom React hooks for feature logic
- **Utils** - Feature-specific utility functions
- **Types** - TypeScript interfaces for the feature

### Separation of Concerns
- **UI Logic** - Components handle presentation and user interaction
- **Business Logic** - Hooks and utils handle data processing
- **State Management** - Uses Zustand stores from `src/state/`
- **API Calls** - Delegates to services in `src/services/`

### Reusability
- Components are designed to be reusable across the application
- Common patterns are abstracted into shared utilities
- UI primitives are imported from `src/ui/`

## Dependencies

### Internal Dependencies
- **`@/ui/*`** - UI primitive components
- **`@/state/*`** - Zustand state management
- **`@/services/*`** - API and service layer
- **`@/types`** - TypeScript type definitions

### External Dependencies
- **React** - Component framework
- **Zustand** - State management
- **Firebase** - Backend services
- **Tailwind CSS** - Styling framework

## Usage Patterns

### Component Structure
```typescript
// Feature component example
import { Button } from '@/ui/Button';
import { useFeatureStore } from '@/state/featureStore';
import { featureAPI } from '@/services/api';

export function FeatureComponent() {
  const { data, actions } = useFeatureStore();
  // Component logic
}
```

### Modal Pattern
```typescript
// Modal component example
import { Button, Input } from '@/ui/*';
import { useState } from 'react';

export function FeatureModal({ isOpen, onClose }) {
  // Modal logic
}
```

This structure provides clear organization, easy maintenance, and scalable architecture for the application.
