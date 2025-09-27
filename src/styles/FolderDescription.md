# Styles Directory

This directory contains the application's styling system, theme configuration, and visual design definitions.

## Styling Files

### 📁 Core Style Files

#### `theme.css`
- **Purpose**: Centralized CSS variables for the application's design system
- **Features**:
  - Light and dark theme support
  - Deep blue premium color palette
  - Consistent spacing and typography
  - Component-specific color definitions
- **Color System**:
  - **Primary Colors**: Deep blue tones for brand identity
  - **Neutral Colors**: Cool slate and white/black for backgrounds
  - **Interactive Colors**: Hover states and focus indicators
  - **Semantic Colors**: Success, warning, error, and info states
- **Theme Variables**:
  - `--color-*` - Color definitions
  - `--background-*` - Background colors
  - `--text-*` - Text colors
  - `--border-*` - Border colors
  - `--surface-*` - Surface colors

#### `theme-documentation.md`
- **Purpose**: Documentation for the theme system and design tokens
- **Contents**:
  - Color palette documentation
  - Usage guidelines
  - Theme switching instructions
  - Design system principles

## Theme Architecture

### CSS Variables System
```css
:root {
  /* Light theme colors */
  --color-primary: #1e40af;
  --color-secondary: #3b82f6;
  --background-primary: #ffffff;
  --text-primary: #1f2937;
}

[data-theme="dark"] {
  /* Dark theme overrides */
  --color-primary: #3b82f6;
  --background-primary: #000000;
  --text-primary: #f9fafb;
}
```

### Color Palette Structure
- **Primary Colors**: Brand colors for main actions and highlights
- **Secondary Colors**: Supporting colors for secondary actions
- **Neutral Colors**: Grayscale colors for text and backgrounds
- **Semantic Colors**: Status colors for success, warning, error, info
- **Interactive Colors**: Hover, focus, and active states

### Theme Switching
- **CSS Variables**: All colors use CSS variables for easy theme switching
- **Data Attributes**: Theme is controlled via `data-theme` attribute
- **JavaScript Integration**: Theme switching is handled by React components
- **Persistence**: Theme preference is saved to localStorage

## Design System Principles

### Consistency
- **Color Harmony**: All colors work together harmoniously
- **Spacing Scale**: Consistent spacing using Tailwind's scale
- **Typography**: Consistent font sizes, weights, and line heights
- **Border Radius**: Uniform corner rounding across components

### Accessibility
- **Color Contrast**: WCAG compliant color combinations
- **Focus Indicators**: Clear focus states for keyboard navigation
- **High Contrast**: Support for high contrast mode
- **Color Blindness**: Colors are distinguishable for color-blind users

### Responsiveness
- **Mobile-First**: Design system works on all screen sizes
- **Scalable**: Components scale appropriately across devices
- **Touch-Friendly**: Appropriate touch targets for mobile devices
- **Adaptive**: Layout adapts to different screen orientations

## Theme Implementation

### CSS Variable Usage
```css
.button {
  background-color: var(--color-primary);
  color: var(--text-on-primary);
  border: 1px solid var(--border-primary);
}

.button:hover {
  background-color: var(--color-primary-hover);
}
```

### Tailwind Integration
```typescript
// Tailwind config uses CSS variables
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--background-primary)',
        text: 'var(--text-primary)',
      }
    }
  }
}
```

### Component Integration
```typescript
// Components use theme variables
const Button = styled.button`
  background-color: var(--color-primary);
  color: var(--text-on-primary);
  
  &:hover {
    background-color: var(--color-primary-hover);
  }
`;
```

## Color System

### Primary Palette
- **Deep Blue**: `#1e40af` - Main brand color
- **Blue**: `#3b82f6` - Secondary brand color
- **Light Blue**: `#60a5fa` - Accent color
- **Dark Blue**: `#1e3a8a` - Dark variant

### Neutral Palette
- **White**: `#ffffff` - Light theme background
- **Black**: `#000000` - Dark theme background
- **Slate**: `#64748b` - Neutral text and borders
- **Gray**: `#6b7280` - Muted text and elements

### Semantic Colors
- **Success**: `#10b981` - Success states and confirmations
- **Warning**: `#f59e0b` - Warning states and alerts
- **Error**: `#ef4444` - Error states and failures
- **Info**: `#3b82f6` - Information and tips

## Usage Guidelines

### Color Usage
1. **Primary Colors**: Use for main actions, links, and brand elements
2. **Secondary Colors**: Use for secondary actions and supporting elements
3. **Neutral Colors**: Use for text, backgrounds, and borders
4. **Semantic Colors**: Use for status indicators and feedback

### Theme Switching
1. **User Preference**: Respect user's theme preference
2. **System Preference**: Default to system theme if no preference set
3. **Persistence**: Save theme preference to localStorage
4. **Smooth Transitions**: Provide smooth transitions between themes

### Accessibility
1. **Color Contrast**: Ensure sufficient contrast ratios
2. **Focus States**: Provide clear focus indicators
3. **Color Independence**: Don't rely solely on color for information
4. **High Contrast**: Support high contrast mode

## Dependencies

### Internal Dependencies
- **Tailwind CSS**: Styling framework that uses theme variables
- **React Components**: Components that consume theme variables
- **Theme Context**: React context for theme management

### External Dependencies
- **CSS Variables**: Native CSS custom properties
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization

## Best Practices

### Theme Development
1. **Consistent Naming**: Use consistent naming conventions for variables
2. **Logical Grouping**: Group related variables together
3. **Documentation**: Document all theme variables and their usage
4. **Testing**: Test themes across different devices and browsers

### Performance
1. **CSS Variables**: Use CSS variables for efficient theme switching
2. **Minimal Overrides**: Only override necessary properties for themes
3. **Optimization**: Optimize CSS for production builds
4. **Caching**: Leverage browser caching for theme assets

### Maintenance
1. **Version Control**: Track theme changes in version control
2. **Breaking Changes**: Document breaking changes in theme system
3. **Migration**: Provide migration guides for theme updates
4. **Testing**: Test theme changes across all components

This styling system provides a robust foundation for the application's visual design, ensuring consistency, accessibility, and maintainability across all components and themes.
