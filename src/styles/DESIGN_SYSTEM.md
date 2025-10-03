# Enhanced Design System Documentation

This document outlines the comprehensive design system for the UrekAI Frontend application, featuring priority-based color palettes, enhanced typography hierarchy, and sophisticated shadow systems.

## 🎨 Color System

### White Shades (5 Levels)
The white color palette is designed with priority-based hierarchy:

- **`--color-white-1`** (`#FFFFFF`) - **Highest Priority**: Pure white for critical elements like primary buttons, important cards, and main content areas
- **`--color-white-2`** (`#FCFCFD`) - **High Priority**: Off-white for secondary surfaces and important UI elements
- **`--color-white-3`** (`#F8FAFC`) - **Medium Priority**: Light gray-white for main backgrounds and standard surfaces
- **`--color-white-4`** (`#F1F5F9`) - **Low Priority**: Soft gray-white for tertiary elements and subtle backgrounds
- **`--color-white-5`** (`#E2E8F0`) - **Background Priority**: Muted gray-white for borders and background elements

### Dark Shades (5 Levels)
The dark color palette follows the same priority hierarchy:

- **`--color-dark-1`** (`#0F172A`) - **Highest Priority**: Deep slate for primary text and critical elements
- **`--color-dark-2`** (`#1E293B`) - **High Priority**: Dark slate for secondary text and important elements
- **`--color-dark-3`** (`#334155`) - **Medium Priority**: Medium slate for tertiary text and standard elements
- **`--color-dark-4`** (`#475569`) - **Low Priority**: Light slate for muted text and less important elements
- **`--color-dark-5`** (`#64748B`) - **Background Priority**: Muted slate for borders and background elements

### Premium Blue Theme
- **Primary**: `#1E40AF` - Deep royal blue for very important elements (Save, Login, Sign-in buttons)
- **Light**: `#2563EB` - Bright blue for accents and highlights
- **Lighter**: `#3B82F6` - Light blue for subtle accents
- **Lightest**: `#60A5FA` - Lightest blue for gentle highlights

## 📝 Typography Hierarchy (5 Levels)

### Level 1: Largest - Extremely Important
- **Size**: 60px (3.75rem)
- **Weight**: 800 (Extra Bold)
- **Use**: Hero headings, main CTAs, primary page titles
- **Class**: `.text-1`

### Level 2: Second Largest - Important Headings
- **Size**: 36px (2.25rem)
- **Weight**: 700 (Bold)
- **Use**: Page titles, section headers, important announcements
- **Class**: `.text-2`

### Level 3: Medium - Section Headings
- **Size**: 24px (1.5rem)
- **Weight**: 600 (Semi-bold)
- **Use**: Sub-sections, card titles, form section headers
- **Class**: `.text-3`

### Level 4: Standard - Regular Body Text
- **Size**: 16px (1rem)
- **Weight**: 400 (Normal)
- **Use**: Main content, descriptions, form inputs
- **Class**: `.text-4`

### Level 5: Smallest - Secondary Information
- **Size**: 14px (0.875rem)
- **Weight**: 400 (Normal)
- **Use**: Captions, labels, metadata, secondary information
- **Class**: `.text-5`

## 🌟 Shadow System

### Shadow Levels
- **`--shadow-xs`**: Extra small - subtle depth for form inputs and small elements
- **`--shadow-sm`**: Small - light separation for cards and buttons
- **`--shadow-md`**: Medium - moderate depth for modals and important cards
- **`--shadow-lg`**: Large - prominent depth for primary elements
- **`--shadow-xl`**: Extra large - strong depth for hero sections
- **`--shadow-2xl`**: 2X large - maximum depth for overlays and modals

### Specialized Shadows
- **`--shadow-soft`**: Gentle depth for subtle elements
- **`--shadow-glow`**: Premium blue glow for special effects
- **`--shadow-focus`**: Focus ring shadow for accessibility

## 🎯 Usage Guidelines

### Priority-Based Design
1. **Highest Priority Elements**: Use `white-1` backgrounds with `dark-1` text and `shadow-lg` or `shadow-xl`
2. **High Priority Elements**: Use `white-2` backgrounds with `dark-2` text and `shadow-md`
3. **Medium Priority Elements**: Use `white-3` backgrounds with `dark-3` text and `shadow-sm`
4. **Low Priority Elements**: Use `white-4` backgrounds with `dark-4` text and minimal shadows
5. **Background Elements**: Use `white-5` backgrounds with `dark-5` text and no shadows

### Button Hierarchy
- **Primary Buttons**: Premium blue gradient with white text and medium shadow
- **Secondary Buttons**: White background with dark text and light shadow
- **Tertiary Buttons**: Minimal styling with subtle borders

### Card Hierarchy
- **Priority 1 Cards**: `white-1` background, `shadow-lg`, for important content
- **Priority 2 Cards**: `white-2` background, `shadow-md`, for secondary content
- **Priority 3 Cards**: `white-3` background, `shadow-sm`, for standard content

## 🎨 Component Examples

### Hero Section
```html
<div class="bg-priority-1 text-priority-1 text-1 shadow-xl">
  <h1>Welcome to UrekAI</h1>
  <p class="text-4">Transform your business with AI</p>
  <button class="btn-primary">Get Started</button>
</div>
```

### Card Component
```html
<div class="card-priority-1">
  <h3 class="card-title">Feature Title</h3>
  <p class="card-description">Feature description text</p>
</div>
```

### Form Component
```html
<label class="form-label">Email Address</label>
<input class="form-input" type="email" />
<p class="form-description">We'll never share your email</p>
```

### Status Component
```html
<div class="status-success">
  <strong>Success!</strong> Your changes have been saved.
</div>
```

## 🌙 Dark Mode Support

All colors automatically adapt to dark mode:
- White shades become dark shades (inverted hierarchy)
- Text colors invert (dark text becomes light text)
- Shadows become more prominent for better contrast
- Premium blue becomes brighter for better visibility

## 📱 Responsive Typography

Typography scales appropriately across devices:
- **Mobile**: Reduced font sizes for better readability
- **Tablet**: Medium font sizes for comfortable reading
- **Desktop**: Full font sizes for optimal impact

## ♿ Accessibility Features

- **High Contrast Mode**: Enhanced contrast ratios for better visibility
- **Reduced Motion**: Respects user preferences for motion
- **Focus States**: Clear focus indicators for keyboard navigation
- **Screen Reader Support**: Proper semantic markup and ARIA labels

## 🔧 Implementation

### CSS Variables
All design tokens are available as CSS custom properties:
```css
.my-component {
  background-color: rgb(var(--color-white-1));
  color: rgb(var(--color-text-primary));
  box-shadow: var(--shadow-md);
  font-size: var(--text-3-size);
}
```

### Tailwind Classes
Use the enhanced Tailwind classes:
```html
<div class="bg-priority-1 text-priority-1 text-3 shadow-md">
  Content here
</div>
```

### Component Classes
Use the pre-built component classes:
```html
<button class="btn-primary">Primary Action</button>
<div class="card-priority-1">Card Content</div>
<input class="form-input" type="text" />
```

## 🎯 Best Practices

1. **Consistency**: Always use the same priority level for similar elements
2. **Hierarchy**: Use higher priority colors and typography for more important content
3. **Shadows**: Apply shadows based on element importance and depth needs
4. **Contrast**: Ensure sufficient contrast between text and background colors
5. **Accessibility**: Test with screen readers and keyboard navigation
6. **Dark Mode**: Verify all components work well in both light and dark modes

This design system ensures a modern, clean, and professional appearance while maintaining excellent usability and accessibility across all devices and user preferences.
