# Design System Documentation

This directory contains the comprehensive design system for the UrekAI Frontend application, including typography, colors, and component styles.

## Files Overview

- `theme.css` - Core design tokens and CSS variables
- `typography.css` - Typography utility classes and component styles
- `README.md` - This documentation file

## Color System

### Primary Colors
- `--color-primary` - Main brand color (Deep Blue)
- `--color-primary-dark` - Darker variant
- `--color-primary-light` - Lighter variant
- `--color-primary-lighter` - Even lighter variant
- `--color-primary-lightest` - Lightest variant

### Text Colors
- `--color-text-primary` - Primary text color
- `--color-text-secondary` - Secondary text color
- `--color-text-muted` - Muted text color
- `--color-text-light` - Light text color
- `--color-text-white` - White text color

### Background Colors
- `--color-background` - Main background color
- `--color-background-surface` - Surface background color
- `--color-background-surface-secondary` - Secondary surface color
- `--color-background-surface-tertiary` - Tertiary surface color

### Status Colors
- `--color-success` - Success state color
- `--color-warning` - Warning state color
- `--color-error` - Error state color
- `--color-info` - Info state color

## Typography System

### Font Families
- `--font-family-sans` - Primary sans-serif font (Inter)
- `--font-family-mono` - Monospace font (JetBrains Mono)
- `--font-family-display` - Display font (Inter)

### Font Sizes
- `--font-size-xs` - 12px
- `--font-size-sm` - 14px
- `--font-size-base` - 16px
- `--font-size-lg` - 18px
- `--font-size-xl` - 20px
- `--font-size-2xl` - 24px
- `--font-size-3xl` - 30px
- `--font-size-4xl` - 36px
- `--font-size-5xl` - 48px
- `--font-size-6xl` - 60px

### Font Weights
- `--font-weight-thin` - 100
- `--font-weight-extralight` - 200
- `--font-weight-light` - 300
- `--font-weight-normal` - 400
- `--font-weight-medium` - 500
- `--font-weight-semibold` - 600
- `--font-weight-bold` - 700
- `--font-weight-extrabold` - 800
- `--font-weight-black` - 900

## Usage Examples

### Typography Classes

```html
<!-- Headings -->
<h1 class="h1">Main Heading</h1>
<h2 class="h2">Section Heading</h2>
<h3 class="h3">Subsection Heading</h3>

<!-- Body Text -->
<p class="body-large">Large body text</p>
<p class="body">Regular body text</p>
<p class="body-small">Small body text</p>

<!-- Labels -->
<label class="label">Form Label</label>
<span class="label-small">Small label</span>

<!-- Buttons -->
<button class="btn btn-large">Large Button</button>
<button class="btn">Regular Button</button>
<button class="btn btn-small">Small Button</button>
```

### Color Classes

```html
<!-- Text Colors -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-muted">Muted text</p>

<!-- Background Colors -->
<div class="bg-background">Main background</div>
<div class="bg-surface">Surface background</div>
<div class="bg-primary">Primary background</div>

<!-- Status Colors -->
<span class="text-success">Success message</span>
<span class="text-warning">Warning message</span>
<span class="text-error">Error message</span>
```

### Component-Specific Classes

```html
<!-- Card Components -->
<div class="card-title">Card Title</div>
<div class="card-description">Card description text</div>

<!-- Form Components -->
<label class="form-label">Form Label</label>
<div class="form-description">Form help text</div>
<div class="form-error">Form error message</div>

<!-- Navigation -->
<a class="nav-item">Navigation Item</a>
<a class="nav-item-active">Active Navigation Item</a>

<!-- Tables -->
<th class="table-header">Table Header</th>
<td class="table-cell">Table Cell</td>

<!-- Modals -->
<h2 class="modal-title">Modal Title</h2>
<p class="modal-description">Modal description</p>
```

## Dark Mode Support

All colors and typography automatically adapt to dark mode using CSS custom properties. The dark mode is activated by adding the `dark` class to the root element.

```html
<html class="dark">
  <!-- Dark mode styles will be applied -->
</html>
```

## Responsive Typography

The typography system includes responsive utilities that adjust font sizes based on screen size:

```html
<h1 class="responsive-h1">Responsive Heading</h1>
<h2 class="responsive-h2">Responsive Subheading</h2>
```

## Accessibility Features

- High contrast mode support
- Reduced motion support
- Screen reader utilities
- Focus visible styles
- Proper color contrast ratios

## Best Practices

1. **Use semantic classes**: Prefer component-specific classes like `card-title` over generic ones
2. **Consistent spacing**: Use the spacing system defined in `theme.css`
3. **Color consistency**: Always use the defined color variables
4. **Typography hierarchy**: Use the heading classes in proper order
5. **Dark mode**: Test all components in both light and dark modes

## Migration Guide

When updating existing components to use the new typography system:

1. Replace hardcoded font sizes with typography classes
2. Replace hardcoded colors with color variables
3. Use component-specific classes where available
4. Test in both light and dark modes
5. Ensure accessibility standards are met

## Browser Support

- Modern browsers with CSS custom properties support
- IE11+ with CSS custom properties polyfill
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
