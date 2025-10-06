# 🔍 Backend API Endpoint Analysis

## Complete mapping of backend endpoints and their frontend usage

Based on the backend API documentation at [https://urekaibackendpython.onrender.com/docs](https://urekaibackendpython.onrender.com/docs) and frontend codebase analysis.

---

## 📊 **Backend Endpoints Discovered**

### **Authentication Endpoints** (`/v1/api/users/`)

| Endpoint | Method | Frontend Usage | Location | Status |
|----------|--------|---------------|----------|--------|
| `/v1/api/users/sign-in` | POST | ✅ Used | `src/state/authStore.ts:34` | Active |
| `/v1/api/users/sign-up` | POST | ✅ Used | `src/state/authStore.ts:85` | Active |
| `/v1/api/users/check-user` | GET | ✅ Used | `src/state/authStore.ts:203` | Active |
| `/v1/api/users/profile` | PUT | ✅ Used | `src/state/authStore.ts:300` | Active |
| `/v1/api/users/auth/callback/google` | POST | ✅ Used | `src/services/api/auth.ts:8` | Active |
| `/v1/api/users/log-out` | POST | ❌ Defined but not used | `src/services/api/auth.ts:88` | Unused |

### **Chat Endpoints** (`/v1/api/chat/`)

| Endpoint | Method | Frontend Usage | Location | Status |
|----------|--------|---------------|----------|--------|
| `/v1/api/chat/query` | POST | ✅ Used | `src/services/api/chat.ts:12` | Active |

### **Data/File Endpoints** (`/v1/api/data/`)

| Endpoint | Method | Frontend Usage | Location | Status |
|----------|--------|---------------|----------|--------|
| `/v1/api/data/upload-file` | POST | ✅ Used | `src/app/api/data/upload-file/route.ts:27` | Active |
| `/v1/api/data/upload-status` | GET | ✅ Used | `src/app/api/data/upload-status/route.ts:20` | Active |
| `/v1/api/data/upload-remove` | POST | ✅ Used | `src/app/api/data/delete-file/route.ts:17` | Active |

---

## 🗂️ **Frontend Code Organization**

### **1. State Management (`src/state/` folder)**

**Purpose:** Zustand stores for global state management

#### **`authStore.ts`** - Authentication State
- **Direct Backend Calls:**
  - ✅ `POST /v1/api/users/sign-in` (line 34)
  - ✅ `POST /v1/api/users/sign-up` (line 85)
  - ✅ `GET /v1/api/users/check-user` (line 203)
  - ✅ `PUT /v1/api/users/profile` (line 300)

- **Functions:**
  - `login()` - Authenticates user with email/password
  - `signup()` - Registers new user
  - `checkAuth()` - Verifies session on page load
  - `updateProfile()` - Updates user profile
  - `googleLogin()` - Handles Google OAuth user data
  - `logout()` - Clears local session (doesn't call backend endpoint)

#### **`chatStore.ts`** - Chat State
- **No direct backend calls** (uses services)
- Manages chat data, messages, uploaded/attached files
- State only - API calls delegated to `src/services/api/`

#### **`filesStore.ts`** - Files State
- **No direct backend calls** (uses services)
- Manages uploaded files list
- State only - API calls delegated to `src/services/api/`

#### **`foldersStore.ts`** - Folders State
- **No backend integration** (local state only)
- Manages folder organization for chats
- Currently no backend persistence

#### **`archivedChatsStore.ts`** - Archived Chats State
- **No backend integration** (local state only)
- Manages archived chats
- Currently no backend persistence

---

### **2. API Services (`src/services/api/` folder)**

**Purpose:** Centralized API functions (currently mix of Next.js routes and direct calls)

#### **`index.ts`** - Main API exports
- **Exports:**
  - `authAPI` - Authentication functions (❌ **UNUSED** - state calls backend directly)
  - `dataAPI` - File upload/management functions (✅ Used by components)
  - `chatAPI` - Chat query function (✅ Used by components)

- **dataAPI Functions:**
  ```typescript
  uploadFile(file: File)              // → /api/data/upload-file (Next.js route)
  getUploadStatus(id, ext)            // → /api/data/upload-status (Next.js route)
  deleteFile(uploadId)                // → /api/data/delete-file (Next.js route)
  ```

- **chatAPI Functions:**
  ```typescript
  query(userQuery, attachedFiles, chatId) // → /api/chat/query (Next.js route)
  ```

- **authAPI Functions (UNUSED):**
  ```typescript
  signIn(email, password)             // → /api/auth/signin (UNUSED)
  signUp(name, email, password)       // → /api/auth/signup (UNUSED)
  googleAuth(authCodeOrToken)         // → /api/auth/google (UNUSED)
  logout()                            // → /api/auth/logout (UNUSED)
  checkUser()                         // → /api/auth/check-user (UNUSED)
  ```

#### **`auth.ts`** - Auth-specific functions
- **Exports:**
  - `googleAuthCallback()` - Google OAuth code exchange (✅ Used by AuthModal)
  - `postSignUp()` - Next.js route handler (❌ Unused)
  - `postSignIn()` - Next.js route handler (❌ Unused)
  - `postLogout()` - Next.js route handler (❌ Unused)
  - `getCheckUser()` - Next.js route handler (❌ Unused)

- **Usage:**
  ```typescript
  googleAuthCallback(code, codeVerifier) // Used in AuthModal.tsx
  ```

#### **`chat.ts`** - Chat-specific functions
- **Exports:**
  - `postChatQuery()` - Next.js route handler (✅ Used via `/api/chat/query`)
  - `getCorsTest()` - CORS testing (❌ Development only)
  - `optionsCorsTest()` - CORS testing (❌ Development only)

---

### **3. Next.js API Routes (`src/app/api/` folder)**

**Purpose:** Server-side proxy routes (currently mixing SSR with CSR goals)

#### **Authentication Routes (`/api/auth/`)**

| Route | Handler | Backend Endpoint | Status |
|-------|---------|-----------------|--------|
| `/api/auth/check-user` | `getCheckUser()` | `/v1/api/users/check-user` | ❌ Unused (state calls directly) |
| `/api/auth/status` | Custom handler | `/v1/api/users/check-user` | ❌ Unused |
| ~~`/api/auth/signin`~~ | ❌ Deleted | - | - |
| ~~`/api/auth/signup`~~ | ❌ Deleted | - | - |
| ~~`/api/auth/google`~~ | ❌ Deleted | - | - |

#### **Chat Routes (`/api/chat/`)**

| Route | Handler | Backend Endpoint | Status |
|-------|---------|-----------------|--------|
| `/api/chat/query` | `postChatQuery()` | `/v1/api/chat/query` | ✅ Used by chatAPI |

#### **Data Routes (`/api/data/`)**

| Route | Handler | Backend Endpoint | Status |
|-------|---------|-----------------|--------|
| `/api/data/upload-file` | Custom handler | `/v1/api/data/upload-file` | ✅ Used by dataAPI |
| `/api/data/upload-status` | Custom handler | `/v1/api/data/upload-status` | ✅ Used by dataAPI |
| `/api/data/delete-file` | Custom handler | `/v1/api/data/upload-remove` | ✅ Used by dataAPI |

#### **Debug/Test Routes (`/api/`)**

| Route | Purpose | Status |
|-------|---------|--------|
| `/api/test-backend` | Backend connectivity test | ❌ Development only |
| `/api/test-cors` | CORS testing | ❌ Development only |
| `/api/debug-cookies` | Cookie debugging | ❌ Development only |

---

## 🔄 **Data Flow Analysis**

### **Authentication Flow**

```
┌─────────────────────────────────────────────────────────────┐
│  Component (AuthModal.tsx)                                  │
│  → calls: authStore.login(email, password)                 │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  State (authStore.ts)                                       │
│  → fetch() directly to backend                              │
│  → POST /v1/api/users/sign-in                              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (https://urekaibackendpython.onrender.com)        │
│  → Validates credentials                                    │
│  → Returns user data + sets session cookie                  │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ✅ **CSR Compliant** - Direct backend calls from client
- ✅ Bypasses Next.js API routes
- ❌ **Inconsistent** - Some auth endpoints in `services/api/auth.ts` are unused

---

### **Chat Flow**

```
┌─────────────────────────────────────────────────────────────┐
│  Component (ChatInterface.tsx)                              │
│  → calls: chatAPI.query(message, files, chatId)           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Service (services/api/index.ts - chatAPI)                 │
│  → fetch('/api/chat/query')                                │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js Route (/api/chat/query/route.ts)                  │
│  → postChatQuery() handler                                  │
│  → fetch() to backend: POST /v1/api/chat/query            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (https://urekaibackendpython.onrender.com)        │
│  → Processes chat query                                     │
│  → Returns AI response + analysis data                      │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ❌ **NOT CSR Compliant** - Uses Next.js API route as proxy
- 🔄 Adds unnecessary hop: Client → Next.js → Backend
- ⚠️ Should call backend directly from client (like auth does)

---

### **File Upload Flow**

```
┌─────────────────────────────────────────────────────────────┐
│  Component (ChatInterface.tsx)                              │
│  → calls: dataAPI.uploadFile(file)                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Service (services/api/index.ts - dataAPI)                 │
│  → fetch('/api/data/upload-file')                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js Route (/api/data/upload-file/route.ts)            │
│  → fetch() to backend: POST /v1/api/data/upload-file      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (https://urekaibackendpython.onrender.com)        │
│  → Processes file upload                                    │
│  → Returns upload ID and status                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ❌ **NOT CSR Compliant** - Uses Next.js API route as proxy
- 🔄 Adds unnecessary hop: Client → Next.js → Backend
- ⚠️ Should call backend directly from client

---

## ⚠️ **Critical Issues & Inconsistencies**

### **1. Mixed Architecture Pattern**

| Feature | Pattern | CSR Compliant? |
|---------|---------|---------------|
| Authentication | Direct backend calls from `authStore.ts` | ✅ Yes |
| Chat queries | Next.js API route → Backend | ❌ No |
| File uploads | Next.js API route → Backend | ❌ No |
| File status check | Next.js API route → Backend | ❌ No |
| File deletion | Next.js API route → Backend | ❌ No |

**Problem:** Inconsistent approach - auth is CSR, but chat/files use SSR proxy pattern.

---

### **2. Duplicate/Unused Code**

#### **Unused Auth Functions in `services/api/index.ts`:**
```typescript
// ❌ THESE ARE NEVER CALLED
authAPI.signIn()      // authStore calls backend directly
authAPI.signUp()      // authStore calls backend directly
authAPI.googleAuth()  // Not used (googleAuthCallback used instead)
authAPI.logout()      // authStore doesn't call backend on logout
authAPI.checkUser()   // authStore calls backend directly
```

#### **Unused Next.js Route Handlers:**
```typescript
// ❌ THESE EXIST BUT NEVER CALLED
postSignUp()    // in services/api/auth.ts
postSignIn()    // in services/api/auth.ts
postLogout()    // in services/api/auth.ts
getCheckUser()  // in services/api/auth.ts (there's also /api/auth/check-user route)
```

**Files to Clean Up:**
- `src/services/api/index.ts` - Remove unused `authAPI` exports
- `src/services/api/auth.ts` - Remove unused Next.js route handlers (lines 24-137)
- `src/app/api/auth/check-user/route.ts` - Unused (state calls backend directly)
- `src/app/api/auth/status/route.ts` - Unused

---

### **3. Logout Endpoint Not Used**

**Backend Endpoint:** `POST /v1/api/users/log-out`

**Current Frontend Behavior:**
```typescript
// authStore.ts - logout function
logout: async () => {
  try {
    await firebaseClient.firebaseSignOut();  // Only clears Firebase
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    set({ user: null, isAuthenticated: false });
    sessionManager.clearSession();  // Only clears local data
    // ❌ NEVER CALLS BACKEND TO INVALIDATE SESSION
  }
}
```

**Problem:** Backend session cookie is never invalidated - security risk!

---

### **4. Profile Update Endpoint May Not Exist**

**Frontend Expects:** `PUT /v1/api/users/profile`

**Status:** ❓ Unknown if this endpoint exists in backend API

**Used By:** `authStore.ts:300` (updateProfile function)

**If Endpoint Missing:** Profile updates will fail with 404/405 errors

---

## 🎯 **Recommendations**

### **Priority 1: Achieve Full CSR Compliance**

**Convert chat and file operations to direct backend calls:**

1. **Update Chat API:**
   ```typescript
   // services/api/index.ts
   export const chatAPI = {
     query: async (userQuery: string, attachedFiles?: any[], chatId?: string) => {
       const response = await fetch(
         `${BACKEND_URL}/v1/api/chat/query`,
         {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           credentials: 'include',
           body: JSON.stringify({ userQuery, attachedFiles, chatId })
         }
       );
       // ...
     }
   }
   ```

2. **Update Data API:**
   ```typescript
   // services/api/index.ts
   export const dataAPI = {
     uploadFile: async (file: File) => {
       const formData = new FormData();
       formData.append('files', file);
       
       const response = await fetch(
         `${BACKEND_URL}/v1/api/data/upload-file`,
         {
           method: 'POST',
           body: formData,
           credentials: 'include'
         }
       );
       // ...
     }
   }
   ```

3. **Remove Next.js API Routes:**
   - Delete `src/app/api/chat/`
   - Delete `src/app/api/data/`
   - Delete unused auth routes

---

### **Priority 2: Clean Up Unused Code**

**Remove:**
1. ❌ `authAPI` from `src/services/api/index.ts` (lines 36-131)
2. ❌ Unused route handlers from `src/services/api/auth.ts` (lines 24-137)
3. ❌ `src/app/api/auth/check-user/route.ts`
4. ❌ `src/app/api/auth/status/route.ts`
5. ❌ Test/debug routes: `/api/test-backend`, `/api/test-cors`, `/api/debug-cookies`

---

### **Priority 3: Fix Logout Flow**

**Update authStore.ts logout function:**
```typescript
logout: async () => {
  try {
    // Call backend to invalidate session
    await fetch(`${BACKEND_URL}/v1/api/users/log-out`, {
      method: 'POST',
      credentials: 'include'
    });
    
    // Clear Firebase
    await firebaseClient.firebaseSignOut();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local state
    set({ user: null, isAuthenticated: false });
    sessionManager.clearSession();
    // Clear all stores...
  }
}
```

---

### **Priority 4: Verify Backend Endpoints**

**Confirm with backend team:**
1. ✅ `POST /v1/api/users/sign-in` - exists, format verified
2. ✅ `POST /v1/api/users/sign-up` - exists, format verified
3. ✅ `GET /v1/api/users/check-user` - exists, format verified
4. ✅ `POST /v1/api/users/auth/callback/google` - exists (needs CORS fix)
5. ⚠️ `POST /v1/api/users/log-out` - exists but never called
6. ❓ `PUT /v1/api/users/profile` - unknown if exists
7. ✅ `POST /v1/api/chat/query` - exists
8. ✅ `POST /v1/api/data/upload-file` - exists
9. ✅ `GET /v1/api/data/upload-status` - exists
10. ✅ `POST /v1/api/data/upload-remove` - exists

---

## 📁 **File Structure Summary**

```
src/
├── state/                          # Global state management (Zustand)
│   ├── authStore.ts               # ✅ Direct backend calls (CSR)
│   ├── chatStore.ts               # ⚪ State only (no API calls)
│   ├── filesStore.ts              # ⚪ State only (no API calls)
│   ├── foldersStore.ts            # ⚪ Local state (no backend)
│   └── archivedChatsStore.ts      # ⚪ Local state (no backend)
│
├── services/api/                   # API service layer
│   ├── index.ts                    # Main API exports
│   │   ├── authAPI                # ❌ UNUSED (state calls directly)
│   │   ├── dataAPI                # ✅ Used (but via Next.js routes - should be direct)
│   │   └── chatAPI                # ✅ Used (but via Next.js routes - should be direct)
│   ├── auth.ts                     # Auth-specific functions
│   │   ├── googleAuthCallback()   # ✅ Used by AuthModal
│   │   └── [route handlers]       # ❌ UNUSED (postSignIn, postSignUp, etc.)
│   └── chat.ts                     # Chat-specific functions
│       └── postChatQuery()        # ✅ Used by /api/chat/query route
│
└── app/api/                        # Next.js API routes (proxy pattern)
    ├── auth/
    │   ├── check-user/            # ❌ UNUSED
    │   └── status/                # ❌ UNUSED
    ├── chat/
    │   └── query/                 # ✅ Used (should remove for CSR)
    ├── data/
    │   ├── upload-file/           # ✅ Used (should remove for CSR)
    │   ├── upload-status/         # ✅ Used (should remove for CSR)
    │   └── delete-file/           # ✅ Used (should remove for CSR)
    ├── test-backend/              # ❌ Dev only
    ├── test-cors/                 # ❌ Dev only
    └── debug-cookies/             # ❌ Dev only
```

---

## ✅ **Action Items**

### **For Frontend Team:**

1. **Convert to Full CSR:**
   - [ ] Update `chatAPI.query()` to call backend directly
   - [ ] Update `dataAPI.uploadFile()` to call backend directly
   - [ ] Update `dataAPI.getUploadStatus()` to call backend directly
   - [ ] Update `dataAPI.deleteFile()` to call backend directly
   - [ ] Remove all Next.js API routes in `src/app/api/`

2. **Clean Up Code:**
   - [ ] Remove unused `authAPI` from `services/api/index.ts`
   - [ ] Remove unused route handlers from `services/api/auth.ts`
   - [ ] Delete unused auth routes

3. **Fix Logout:**
   - [ ] Call `POST /v1/api/users/log-out` in logout function
   - [ ] Ensure backend session is invalidated

4. **Verify Endpoints:**
   - [ ] Confirm `/v1/api/users/profile` exists
   - [ ] Test all direct backend calls with CORS

### **For Backend Team:**

1. **CORS (CRITICAL):**
   - [ ] Allow `http://localhost:5173` origin
   - [ ] Set `Access-Control-Allow-Credentials: true`
   - [ ] Handle preflight OPTIONS requests

2. **Verify Endpoints:**
   - [ ] Confirm `/v1/api/users/profile` PUT endpoint exists
   - [ ] Document response formats for all endpoints
   - [ ] Test session invalidation on `/v1/api/users/log-out`

---

## 📊 **Endpoint Usage Summary**

| Category | Total Endpoints | Used | Unused | CSR Compliant |
|----------|----------------|------|--------|---------------|
| Authentication | 6 | 5 | 1 | ✅ 4/5 |
| Chat | 1 | 1 | 0 | ❌ 0/1 |
| Data/Files | 3 | 3 | 0 | ❌ 0/3 |
| **TOTAL** | **10** | **9** | **1** | **40%** |

**CSR Compliance: 4/10 endpoints (40%)**

**Target: 100% CSR compliance by removing Next.js API routes**

