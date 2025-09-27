# App Router Directory

This directory contains Next.js App Router route definitions and API endpoints.

## Structure

### 📁 `api/`
API route handlers that proxy requests to the backend service.

#### `auth/`
Authentication-related API endpoints:
- **`google/route.ts`** - Google OAuth authentication handler
- **`signup/route.ts`** - User registration endpoint
- **`signin/route.ts`** - User login endpoint
- **`logout/route.ts`** - User logout endpoint
- **`check-user/route.ts`** - User authentication status check

#### `chat/`
Chat-related API endpoints:
- **`query/route.ts`** - Chat query processing endpoint

#### `test-cors/route.ts`
CORS testing endpoint for development

### 📁 Page Routes
Thin wrapper components that import and render actual page UIs from `src/pages/`:

#### Marketing Pages
- **`page.tsx`** - Landing page (imports `@/pages/marketing/HomePage`)
- **`about/page.tsx`** - About page (imports `@/pages/marketing/AboutPage`)
- **`help/page.tsx`** - Help page (imports `@/pages/marketing/HelpPage`)
- **`solutions/page.tsx`** - Solutions page (imports `@/pages/marketing/SolutionsPage`)
- **`pricing/page.tsx`** - Pricing page
- **`docs/page.tsx`** - Documentation page

#### App Pages (Authenticated)
- **`dashboard/page.tsx`** - Dashboard (imports `@/pages/app/Dashboard`)
- **`chat/page.tsx`** - Chat interface (imports `@/pages/app/ChatInterface`)
- **`folders/page.tsx`** - Folders management (imports `@/pages/app/FoldersPage`)
- **`insights/page.tsx`** - Analytics insights (imports `@/pages/app/InsightsPage`)
- **`profile/page.tsx`** - User profile (imports `@/pages/app/ProfilePage`)
- **`settings/page.tsx`** - App settings (imports `@/pages/app/SettingsPage`)

#### Special Routes
- **`auth/shopify/page.tsx`** - Shopify authentication page
- **`shopify/dashboard/page.tsx`** - Shopify dashboard integration

### Core App Files
- **`layout.tsx`** - Root layout component with providers and global styles
- **`page.tsx`** - Home page wrapper
- **`not-found.tsx`** - 404 error page
- **`providers.tsx`** - React context providers (theme, auth, etc.)

## Design Pattern

All page routes follow a thin wrapper pattern:
```typescript
import PageComponent from '@/pages/[category]/PageComponent';
export default PageComponent;
```

This separation allows:
- **Route definitions** to remain in `app/` (Next.js requirement)
- **UI logic** to live in `pages/` (organized by feature)
- **Easy testing** of page components independently
- **Clear separation** between routing and presentation logic

## API Route Pattern

API routes are thin wrappers that delegate to service handlers:
```typescript
import { handlerFunction } from '@/services/routes/[module]';
export async function POST(request: NextRequest) {
  return handlerFunction(request);
}
```

This pattern provides:
- **Separation of concerns** between routing and business logic
- **Reusable handlers** that can be tested independently
- **Consistent error handling** across all endpoints
- **Easy maintenance** of API logic
