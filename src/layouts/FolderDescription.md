# Layouts Directory

This directory contains layout components that define the overall structure and navigation of the application.

## Layout Components

### 📁 Core Layout Files

#### `GlobalLayout.tsx`
- **Purpose**: Main layout wrapper for authenticated pages
- **Features**: 
  - Integrates sidebar navigation
  - Manages page routing and active states
  - Handles authentication-based layout switching
  - Provides consistent page structure
- **Dependencies**: Uses `@/features/designerui/sidebar` and `@/state/authStore`
- **Usage**: Wraps all authenticated app pages

#### `Navbar.tsx`
- **Purpose**: Top navigation bar for public/marketing pages
- **Features**:
  - Logo and brand display
  - Navigation menu items
  - Authentication buttons (login/signup)
  - Responsive design
- **Dependencies**: Uses `@/ui/Button` and `@/features/auth/AuthModal`
- **Usage**: Used on landing page and marketing pages

#### `Sidebar.tsx`
- **Purpose**: Main sidebar navigation for the application
- **Features**:
  - Folder and chat navigation
  - File management
  - Create/rename/delete operations
  - Search functionality
  - User profile access
- **Dependencies**: 
  - Uses `@/features/modals/*` for operations
  - Uses `@/state/*` stores for data management
  - Uses `@/services/api` for API calls
- **Usage**: Primary navigation for authenticated users

#### `Footer.tsx`
- **Purpose**: Footer component for marketing pages
- **Features**:
  - Company information
  - Legal links
  - Social media links
  - Contact information
- **Usage**: Displayed on public/marketing pages

#### `ConditionalFooter.tsx`
- **Purpose**: Conditionally renders footer based on current page
- **Features**:
  - Detects public vs. authenticated pages
  - Only shows footer on marketing pages
  - Handles route-based conditional rendering
- **Dependencies**: Uses Next.js `usePathname()` hook
- **Usage**: Automatically manages footer visibility

## Layout Architecture

### Layout Hierarchy
```
Root Layout (app/layout.tsx)
├── Public Pages
│   ├── Navbar
│   ├── Page Content
│   └── Footer (conditional)
└── Authenticated Pages
    ├── GlobalLayout
    │   ├── Sidebar
    │   └── Page Content
    └── (No Footer)
```

### Responsive Design
- **Mobile**: Collapsible sidebar, stacked navigation
- **Tablet**: Partial sidebar, adaptive navigation
- **Desktop**: Full sidebar, complete navigation

### Theme Integration
- All layouts support light/dark theme switching
- Uses CSS variables from `src/styles/theme.css`
- Consistent color scheme across all layouts

## Component Responsibilities

### Navigation Management
- **Active States**: Tracks current page and highlights active navigation
- **Route Handling**: Manages navigation between different app sections
- **Breadcrumbs**: Provides context for current location

### User Interface
- **Consistent Spacing**: Maintains uniform margins and padding
- **Responsive Breakpoints**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

### State Integration
- **Authentication**: Shows/hides elements based on auth state
- **User Data**: Displays user-specific information
- **Real-time Updates**: Reflects changes in navigation state

## Dependencies

### Internal Dependencies
- **`@/ui/*`** - UI primitive components (Button, Input, etc.)
- **`@/state/*`** - Zustand stores for state management
- **`@/features/*`** - Feature-specific components and modals
- **`@/services/*`** - API services for data operations

### External Dependencies
- **Next.js** - Routing and navigation hooks
- **React** - Component framework
- **Tailwind CSS** - Styling and responsive design

## Usage Patterns

### Layout Wrapper Pattern
```typescript
// GlobalLayout usage
export default function AuthenticatedPage() {
  return (
    <GlobalLayout>
      <PageContent />
    </GlobalLayout>
  );
}
```

### Conditional Rendering Pattern
```typescript
// ConditionalFooter usage
export function ConditionalFooter() {
  const pathname = usePathname();
  const isPublicPage = publicPages.includes(pathname);
  
  return isPublicPage ? <Footer /> : null;
}
```

### Navigation State Pattern
```typescript
// Sidebar navigation state
export function Sidebar() {
  const { folders, chats } = useFoldersStore();
  const { activeChat } = useChatStore();
  
  // Navigation logic
}
```

## Best Practices

1. **Consistent Structure**: All layouts follow the same component pattern
2. **Responsive Design**: Mobile-first approach with progressive enhancement
3. **Accessibility**: Proper semantic HTML and ARIA attributes
4. **Performance**: Lazy loading and code splitting where appropriate
5. **Maintainability**: Clear separation of concerns and reusable components

This layout system provides a solid foundation for the application's user interface and navigation structure.
