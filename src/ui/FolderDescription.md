# UI Directory

This directory contains reusable UI primitive components that form the foundation of the application's design system.

## UI Components

### 📁 Core UI Primitives

#### `Button.tsx`
- **Purpose**: Reusable button component with multiple variants and sizes
- **Variants**:
  - `primary` - Main action button with solid background
  - `secondary` - Secondary action with outlined style
  - `outline` - Outlined button with transparent background
  - `ghost` - Minimal button with no background
- **Sizes**: `sm`, `md`, `lg` for different use cases
- **Features**:
  - Loading state support
  - Disabled state handling
  - Icon support
  - Accessibility attributes
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `Input.tsx`
- **Purpose**: Form input component with consistent styling and behavior
- **Types**: Text, email, password, number, and other HTML input types
- **Features**:
  - Label support
  - Error state handling
  - Placeholder text
  - Required field indication
  - Accessibility attributes
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `card.tsx`
- **Purpose**: Card component for grouping related content
- **Components**:
  - `Card` - Main card container
  - `CardHeader` - Card header section
  - `CardTitle` - Card title text
  - `CardDescription` - Card description text
  - `CardContent` - Main card content area
  - `CardFooter` - Card footer section
- **Features**:
  - Consistent spacing and styling
  - Flexible content areas
  - Hover effects and interactions
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `badge.tsx`
- **Purpose**: Badge component for displaying status, labels, and indicators
- **Variants**:
  - `default` - Standard badge styling
  - `secondary` - Secondary badge with muted colors
  - `destructive` - Error or warning badge
  - `outline` - Outlined badge style
- **Features**:
  - Small, compact design
  - Color-coded variants
  - Text and icon support
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `label.tsx`
- **Purpose**: Form label component for accessibility and styling
- **Features**:
  - Proper label-input association
  - Required field indication
  - Consistent typography
  - Accessibility attributes
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `select.tsx`
- **Purpose**: Dropdown select component for form inputs
- **Features**:
  - Custom styling to match design system
  - Keyboard navigation support
  - Option grouping
  - Search functionality
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `switch.tsx`
- **Purpose**: Toggle switch component for boolean inputs
- **Features**:
  - Smooth animations
  - Accessibility support
  - Custom styling
  - Disabled state handling
- **Dependencies**: Uses `@/utils/cn` for class name merging

#### `tabs.tsx`
- **Purpose**: Tab navigation component for organizing content
- **Components**:
  - `Tabs` - Main tabs container
  - `TabsList` - Tab navigation list
  - `TabsTrigger` - Individual tab trigger
  - `TabsContent` - Tab content area
- **Features**:
  - Keyboard navigation
  - Smooth transitions
  - Flexible content areas
- **Dependencies**: Uses `@/utils/cn` for class name merging

## Design System Principles

### Consistency
- **Color Palette**: All components use CSS variables from `src/styles/theme.css`
- **Typography**: Consistent font sizes, weights, and line heights
- **Spacing**: Uniform padding, margins, and gaps using Tailwind classes
- **Border Radius**: Consistent corner rounding across all components

### Accessibility
- **ARIA Attributes**: Proper ARIA labels, roles, and states
- **Keyboard Navigation**: Full keyboard support for interactive components
- **Screen Readers**: Semantic HTML and proper labeling
- **Color Contrast**: WCAG compliant color combinations

### Responsiveness
- **Mobile-First**: Components are designed for mobile devices first
- **Flexible Layouts**: Components adapt to different screen sizes
- **Touch-Friendly**: Appropriate touch targets for mobile devices
- **Progressive Enhancement**: Additional features for larger screens

## Component Architecture

### Base Component Pattern
```typescript
import { cn } from '@/utils/cn';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // Component-specific props
}

export function Component({ className, children, ...props }: ComponentProps) {
  return (
    <div className={cn('base-styles', className)} {...props}>
      {children}
    </div>
  );
}
```

### Variant System
```typescript
const variants = {
  variant: {
    primary: 'primary-styles',
    secondary: 'secondary-styles',
    outline: 'outline-styles',
    ghost: 'ghost-styles'
  },
  size: {
    sm: 'small-styles',
    md: 'medium-styles',
    lg: 'large-styles'
  }
};
```

## Styling Approach

### Tailwind CSS Integration
- **Utility Classes**: Extensive use of Tailwind utility classes
- **Custom Classes**: Component-specific styles when needed
- **Responsive Design**: Tailwind responsive prefixes for different screen sizes
- **Dark Mode**: Automatic dark mode support through CSS variables

### CSS Variables
- **Theme Colors**: All colors reference CSS variables from `theme.css`
- **Consistent Theming**: Easy theme switching and customization
- **Design Tokens**: Centralized design values for consistency

### Class Name Merging
- **`cn` Utility**: Combines Tailwind classes with custom classes
- **Conditional Styling**: Dynamic class application based on props
- **Override Support**: Allows parent components to override styles

## Usage Patterns

### Basic Usage
```typescript
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button variant="primary">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Advanced Usage
```typescript
import { Button } from '@/ui/Button';

export function AdvancedButton() {
  return (
    <Button
      variant="primary"
      size="lg"
      className="custom-styles"
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Click Me'}
    </Button>
  );
}
```

## Dependencies

### Internal Dependencies
- **`@/utils/cn`** - Class name merging utility
- **`@/styles/theme.css`** - CSS variables for theming

### External Dependencies
- **React** - Component framework
- **Tailwind CSS** - Styling framework
- **TypeScript** - Type safety

## Best Practices

### Component Development
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition**: Build complex components by composing simpler ones
3. **Props Interface**: Define clear, typed interfaces for all props
4. **Default Values**: Provide sensible defaults for optional props

### Styling Guidelines
1. **Consistent Spacing**: Use Tailwind spacing scale consistently
2. **Color Usage**: Always use CSS variables for colors
3. **Responsive Design**: Consider all screen sizes when designing
4. **Accessibility**: Ensure components meet accessibility standards

### Performance
1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Load components only when needed
3. **Bundle Size**: Keep components lightweight and focused
4. **Tree Shaking**: Ensure components can be tree-shaken

This UI system provides a solid foundation for building consistent, accessible, and maintainable user interfaces throughout the application.
