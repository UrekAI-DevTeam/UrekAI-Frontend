# UrekAI Theme System Documentation

## Overview
The theme system is controlled entirely through CSS variables in `src/styles/theme.css` and made available as Tailwind classes through `tailwind.config.js`. This ensures consistent theming across the entire application.

## Color Palette

### Primary Brand Colors
- `blood-red` - Primary brand color (#B91C1C)
- `dark-red` - Dark red variant (#7F1D1D)
- `crimson` - Crimson accent (#DC2626)
- `copper-orange` - Orange accent (#EA580C)

### Neutral Colors
- `almost-black` - Deepest dark (#0F0F0F)
- `smoky-gray` - Dark gray (#374151)
- `charcoal` - Medium gray (#404040)
- `slate-gray` - Light gray (#6B7280)
- `light-gray` - Very light gray (#9CA3AF)

### Background & Surface Colors
- `background` - Main background (#FCFCFA)
- `surface` - Card surfaces (#FFFFFF)
- `surface-secondary` - Secondary surfaces (#F9FAFB)
- `surface-tertiary` - Tertiary surfaces (#F3F4F6)

### Border Colors
- `border` - Primary borders (#E6E6E6)
- `border-light` - Light borders (#F3F4F6)
- `border-dark` - Dark borders (#D1D5DB)

### Text Colors
- `text-primary` - Primary text (#1C1C1E)
- `text-secondary` - Secondary text (#3C3C43)
- `text-muted` - Muted text (#6E6E73)
- `text-light` - Light text (#8E8E93)
- `text-white` - White text (#FFFFFF)

### Status Colors
- `success` - Success green (#22C55E)
- `warning` - Warning amber (#F59E0B)
- `error` - Error red (#EF4444)
- `info` - Info blue (#3B82F6)

### Interactive Colors
- `hover` - Hover states (#F3F4F6)
- `active` - Active states (#E5E7EB)
- `focus` - Focus ring (#3B82F6)

### Gradient Colors
- `gradient-start` - Gradient start (#B91C1C)
- `gradient-end` - Gradient end (#DC2626)
- `gradient-light-start` - Light gradient start (#EA580C)
- `gradient-light-end` - Light gradient end (#B91C1C)

## Usage Examples

### Tailwind Classes
```css
/* Backgrounds */
bg-background bg-surface bg-surface-secondary

/* Text */
text-text-primary text-text-secondary text-text-muted

/* Borders */
border border-border border-border-light

/* Brand colors */
bg-blood-red text-white border-crimson

/* Gradients */
bg-gradient-to-r from-gradient-start to-gradient-end
bg-gradient-to-br from-blood-red to-crimson

/* Interactive states */
hover:bg-hover active:bg-active focus:ring-focus
```

### CSS Variables (Direct Usage)
```css
/* Using CSS variables directly */
background-color: rgb(var(--color-background));
color: rgb(var(--color-text-primary));
border-color: rgb(var(--color-border));
```

## Dark Mode
All colors automatically adapt for dark mode. The `.dark` class overrides the light mode colors with appropriate dark variants.

## Theme Customization
To change the theme colors, simply update the CSS variables in `src/styles/theme.css`. The changes will automatically apply throughout the entire application.

### Example: Changing Primary Color
```css
:root {
  --color-blood-red: 59 130 246; /* Change to blue */
}
```

This will change all instances of `blood-red` throughout the app to blue.

## Best Practices

1. **Always use theme colors** - Don't use hardcoded colors like `#000000` or `text-gray-500`
2. **Use semantic names** - Use `text-primary` instead of `text-gray-900`
3. **Leverage CSS variables** - For custom components, use CSS variables directly
4. **Test both themes** - Always test your changes in both light and dark modes
5. **Use opacity modifiers** - Tailwind supports opacity like `bg-blood-red/50` for 50% opacity

## Component Examples

### Button
```jsx
<button className="bg-blood-red text-white hover:bg-crimson focus:ring-focus">
  Click me
</button>
```

### Card
```jsx
<div className="bg-surface border border-border rounded-lg p-4">
  <h3 className="text-text-primary">Card Title</h3>
  <p className="text-text-muted">Card description</p>
</div>
```

### Input
```jsx
<input className="bg-surface border border-border focus:ring-focus text-text-primary" />
```
