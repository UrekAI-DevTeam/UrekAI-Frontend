# Pages Directory

This directory contains the actual UI components for different pages, organized by application area.

## Page Organization

### 📁 `marketing/`
Marketing and public-facing pages for user acquisition and information.

#### `HomePage.tsx`
- **Purpose**: Main landing page with marketing content
- **Features**:
  - Hero section with value proposition
  - Feature highlights and benefits
  - Call-to-action buttons
  - Social proof and testimonials
- **Special Configuration**: Uses `export const dynamic = 'force-dynamic'` to prevent prerendering (fixes Google OAuth issues)
- **Dependencies**: Uses `@/layouts/Navbar`, `@/ui/*` components, `@/features/auth/AuthModal`

#### `SolutionsPage.tsx`
- **Purpose**: Detailed solutions and use cases page
- **Features**:
  - Industry-specific solutions
  - Use case examples
  - Feature comparisons
  - Implementation guides
- **Usage**: Accessed via `/solutions` route

#### `AboutPage.tsx`
- **Purpose**: Company information and team page
- **Features**:
  - Company mission and values
  - Team member profiles
  - Company history and milestones
  - Contact information
- **Usage**: Accessed via `/about` route

#### `HelpPage.tsx`
- **Purpose**: Help center and support page
- **Features**:
  - FAQ section
  - Documentation links
  - Support contact options
  - Video tutorials
- **Usage**: Accessed via `/help` route

### 📁 `app/`
Application pages for authenticated users.

#### `Dashboard.tsx`
- **Purpose**: Main dashboard with overview and quick actions
- **Features**:
  - User statistics and metrics
  - Recent activity feed
  - Quick action buttons
  - Pinned items and shortcuts
- **Dependencies**: Uses `@/ui/*` components, `@/features/modals/PinItemModal`, `@/services/api`
- **Usage**: Accessed via `/dashboard` route

#### `ChatInterface.tsx`
- **Purpose**: Main chat interface for AI conversations
- **Features**:
  - Chat history and message display
  - File attachment capabilities
  - Real-time messaging
  - AI response handling
- **Dependencies**: Uses `@/ui/*` components, `@/state/*` stores, `@/services/api`
- **Usage**: Accessed via `/chat` route

#### `FoldersPage.tsx`
- **Purpose**: Folder management and organization
- **Features**:
  - Create, rename, and delete folders
  - Folder hierarchy display
  - Drag-and-drop organization
  - Search and filter functionality
- **Dependencies**: Uses `@/ui/*` components
- **Usage**: Accessed via `/folders` route

#### `InsightsPage.tsx`
- **Purpose**: Analytics and insights dashboard
- **Features**:
  - Usage statistics and trends
  - Performance metrics
  - Data visualizations
  - Export capabilities
- **Dependencies**: Uses `@/ui/*` components
- **Usage**: Accessed via `/insights` route

#### `ProfilePage.tsx`
- **Purpose**: User profile management
- **Features**:
  - Personal information editing
  - Account settings
  - Subscription management
  - Security settings
- **Dependencies**: Uses `@/ui/*` components
- **Usage**: Accessed via `/profile` route

#### `SettingsPage.tsx`
- **Purpose**: Application settings and preferences
- **Features**:
  - Theme selection (light/dark)
  - Notification preferences
  - Privacy settings
  - Integration configurations
- **Dependencies**: Uses `@/ui/*` components
- **Usage**: Accessed via `/settings` route

## Page Architecture

### Component Structure
Each page component follows a consistent pattern:
```typescript
export default function PageName() {
  // Page-specific logic and state
  return (
    <div className="page-container">
      {/* Page content */}
    </div>
  );
}
```

### Route Integration
Pages are imported by thin wrapper components in `src/app/`:
```typescript
// In src/app/[route]/page.tsx
import PageComponent from '@/pages/[category]/PageComponent';
export default PageComponent;
```

### State Management
Pages use Zustand stores for data management:
- **`@/state/authStore`** - Authentication state
- **`@/state/chatStore`** - Chat data and messages
- **`@/state/filesStore`** - File uploads and attachments
- **`@/state/foldersStore`** - Folder organization
- **`@/state/archivedChatsStore`** - Archived chat history

## Design Patterns

### Responsive Design
- **Mobile-First**: All pages are designed for mobile devices first
- **Progressive Enhancement**: Additional features for larger screens
- **Flexible Layouts**: Adapt to different screen sizes and orientations

### Theme Support
- **Light/Dark Mode**: All pages support theme switching
- **Consistent Colors**: Uses CSS variables from `src/styles/theme.css`
- **Accessible Contrast**: Meets WCAG accessibility standards

### Performance Optimization
- **Code Splitting**: Pages are loaded on demand
- **Lazy Loading**: Heavy components are loaded when needed
- **Optimized Images**: Proper image optimization and lazy loading

## Dependencies

### Internal Dependencies
- **`@/ui/*`** - UI primitive components
- **`@/state/*`** - Zustand state management
- **`@/services/*`** - API services
- **`@/features/*`** - Feature-specific components
- **`@/layouts/*`** - Layout components

### External Dependencies
- **React** - Component framework
- **Next.js** - Routing and optimization
- **Tailwind CSS** - Styling framework
- **Zustand** - State management

## Usage Guidelines

### Page Development
1. **Start with Mobile**: Design for mobile devices first
2. **Use UI Primitives**: Leverage components from `@/ui/*`
3. **Manage State**: Use appropriate Zustand stores
4. **Handle Loading**: Implement loading states and error handling
5. **Test Responsively**: Ensure pages work on all screen sizes

### Performance Considerations
1. **Minimize Bundle Size**: Import only necessary dependencies
2. **Optimize Images**: Use Next.js Image component
3. **Lazy Load**: Implement lazy loading for heavy components
4. **Cache Data**: Use appropriate caching strategies

This page structure provides a scalable and maintainable approach to building the application's user interface.
