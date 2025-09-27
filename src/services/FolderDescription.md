# Services Directory

This directory contains API services and route handlers that manage external communication and business logic.

## Service Organization

### 📁 `api/`
Client-side API service for making HTTP requests to the backend.

#### `index.ts`
- **Purpose**: Centralized API client for all backend communication
- **Features**:
  - Authentication API calls (signin, signup, google auth, logout)
  - Chat API calls (query processing)
  - User management API calls (check user status)
  - Error handling and response processing
- **Dependencies**: Uses `@/types` for type definitions
- **Usage**: Imported by components and stores for API communication

### 📁 `routes/`
Server-side route handlers for Next.js API routes.

#### `auth.ts`
- **Purpose**: Authentication route handlers for server-side API routes
- **Functions**:
  - `postGoogleAuth()` - Handles Google OAuth authentication
  - `postSignUp()` - Handles user registration
  - `postSignIn()` - Handles user login
  - `postLogout()` - Handles user logout
  - `getCheckUser()` - Checks user authentication status
- **Features**:
  - Request validation and error handling
  - Backend API proxying with proper headers
  - Cookie management for session handling
  - Response formatting and error propagation

#### `chat.ts`
- **Purpose**: Chat-related route handlers for server-side API routes
- **Functions**:
  - `postChatQuery()` - Handles chat query processing
  - `getCorsTest()` - CORS testing endpoint
  - `optionsCorsTest()` - CORS preflight handling
- **Features**:
  - Chat query validation and processing
  - Backend API communication
  - CORS configuration for cross-origin requests
  - Error handling and response management

## API Architecture

### Client-Side API (`api/index.ts`)
```typescript
// Example API call structure
export const authAPI = {
  signIn: async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};
```

### Server-Side Routes (`routes/*.ts`)
```typescript
// Example route handler structure
export async function postSignIn(request: NextRequest) {
  try {
    const body = await request.json();
    // Validation and processing
    const response = await fetch(backendUrl, { /* config */ });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Service Patterns

### Request/Response Flow
1. **Client Component** → Calls `api/index.ts` function
2. **API Client** → Makes request to Next.js API route
3. **API Route** → Calls `routes/*.ts` handler
4. **Route Handler** → Proxies to backend service
5. **Backend Service** → Processes request and returns response
6. **Response** → Flows back through the chain

### Error Handling
- **Client-Side**: API client handles network errors and response validation
- **Server-Side**: Route handlers provide consistent error responses
- **Backend**: External service errors are properly formatted and returned

### Authentication Flow
- **Session Management**: Cookies are handled automatically by the browser
- **Token Handling**: Firebase tokens are managed by the authentication system
- **State Synchronization**: Authentication state is kept in sync across the application

## Dependencies

### Internal Dependencies
- **`@/types`** - TypeScript type definitions for API requests/responses
- **Next.js API Routes** - Server-side route handling
- **Zustand Stores** - State management for API responses

### External Dependencies
- **Next.js** - API route framework and request/response handling
- **Fetch API** - HTTP client for making requests
- **Backend Service** - External API service for business logic

## Configuration

### Environment Variables
- **`NEXT_PUBLIC_API_URL`** - Backend service URL
- **Default**: `https://urekaibackendpython.onrender.com`

### CORS Configuration
- **Headers**: Proper CORS headers for cross-origin requests
- **Methods**: Support for GET, POST, PUT, DELETE, OPTIONS
- **Credentials**: Cookie and authentication header support

## Usage Examples

### Client-Side API Usage
```typescript
import { authAPI } from '@/services/api';

// In a component or store
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authAPI.signIn(email, password);
    // Handle successful login
  } catch (error) {
    // Handle login error
  }
};
```

### Server-Side Route Usage
```typescript
// In src/app/api/auth/signin/route.ts
import { postSignIn } from '@/services/routes/auth';

export async function POST(request: NextRequest) {
  return postSignIn(request);
}
```

## Best Practices

### API Design
1. **Consistent Error Handling**: All API calls follow the same error pattern
2. **Type Safety**: Use TypeScript interfaces for request/response types
3. **Validation**: Validate inputs on both client and server side
4. **Documentation**: Document API endpoints and their usage

### Performance
1. **Request Optimization**: Minimize unnecessary API calls
2. **Caching**: Implement appropriate caching strategies
3. **Error Recovery**: Provide fallback mechanisms for failed requests
4. **Loading States**: Implement proper loading and error states

### Security
1. **Input Validation**: Validate all inputs before processing
2. **Authentication**: Properly handle authentication tokens and sessions
3. **CORS**: Configure CORS properly for cross-origin requests
4. **Error Information**: Don't expose sensitive information in error messages

This service architecture provides a clean separation between client and server-side logic while maintaining consistency and reliability across the application.
