# Source Code Structure

This document describes the organization of the UrekAI frontend codebase.

## Top-Level Folders

### 📁 `app/`
Next.js App Router directory containing all route definitions and API endpoints.
- **Purpose**: Defines the application's routing structure and API routes
- **Contents**: Page components (thin wrappers), API routes, layouts, and providers
- **Key Files**: `layout.tsx`, `page.tsx`, `providers.tsx`

### 📁 `components/`
Legacy components that haven't been migrated to the new structure yet.
- **Purpose**: Contains remaining UI components and shared utilities
- **Contents**: Firebase utilities (moved to utils), shared components, protected routes
- **Status**: Being phased out in favor of `features/` and `ui/` structure

### 📁 `features/`
Feature-based organization of UI components and business logic.
- **Purpose**: Groups related functionality into cohesive modules
- **Contents**: Authentication, chat, modals, designer UI, and page components
- **Structure**: Each feature contains its own components, hooks, and utilities

### 📁 `layouts/`
Application layout components and navigation.
- **Purpose**: Defines the overall structure and navigation of the application
- **Contents**: Global layout, navbar, sidebar, footer, and conditional components
- **Usage**: Used by pages to provide consistent UI structure

### 📁 `pages/`
Page UI components organized by application area.
- **Purpose**: Contains the actual UI logic for different pages
- **Contents**: Marketing pages (landing, about, help) and app pages (dashboard, chat, etc.)
- **Structure**: Separated into `marketing/` and `app/` subfolders

### 📁 `services/`
API services and route handlers.
- **Purpose**: Centralizes all external API calls and route logic
- **Contents**: API client, route handlers for authentication and chat
- **Structure**: `api/` for client calls, `routes/` for Next.js API route logic

### 📁 `state/`
Zustand state management stores.
- **Purpose**: Manages application state using Zustand
- **Contents**: Authentication, chat, files, folders, and archived chats stores
- **Pattern**: Each store manages a specific domain of application state

### 📁 `ui/`
Reusable UI primitive components.
- **Purpose**: Provides a consistent set of base UI components
- **Contents**: Button, Input, Card, Badge, and other fundamental UI elements
- **Usage**: Used throughout the application for consistent styling

### 📁 `utils/`
Utility functions and helper modules.
- **Purpose**: Contains reusable utility functions and configurations
- **Contents**: Firebase utilities, CSS class utilities, and other helpers
- **Structure**: Organized by functionality (firebase, styling, etc.)

### 📁 `types/`
TypeScript type definitions.
- **Purpose**: Centralizes all TypeScript interfaces and types
- **Contents**: Application data models, API response types, and component props
- **Usage**: Imported throughout the application for type safety

### 📁 `styles/`
Styling and theme configuration.
- **Purpose**: Manages the application's visual design system
- **Contents**: CSS variables, theme definitions, and styling documentation
- **Features**: Light/dark theme support with CSS custom properties

## File Organization Principles

1. **Feature-Based**: Related functionality is grouped together in `features/`
2. **Separation of Concerns**: UI components, business logic, and data are separated
3. **Reusability**: Common components are in `ui/`, utilities in `utils/`
4. **Type Safety**: All types are centralized in `types/`
5. **Consistent Styling**: Theme system in `styles/` ensures visual consistency

## Migration Status

- ✅ **Completed**: Firebase utilities moved to `utils/firebase/`
- ✅ **Completed**: API routes refactored with service layer
- ✅ **Completed**: Pages organized into `marketing/` and `app/` folders
- ✅ **Completed**: Features organized into domain-specific modules
- 🔄 **In Progress**: Migrating remaining components from `components/` to new structure
