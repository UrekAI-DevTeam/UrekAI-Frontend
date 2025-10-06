# 🔧 Backend Requirements & Issues

## 📋 Critical Backend Issues That Must Be Fixed

This document outlines all backend API requirements, CORS configuration issues, and endpoint specifications needed for the frontend to function properly in **Complete Client-Side Rendering (CSR)** mode.

---

## 🚨 **1. CORS Configuration - CRITICAL**

### **Current Issue:**
The backend is **blocking requests from `http://localhost:5173`** with the error:
```
HTTP/1.1 400 Bad Request
Disallowed CORS origin
```

### **Required Fix:**
Update backend CORS configuration to allow the following origins:

```python
# Required allowed origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Local development (Vite/Next.js dev server)
    "http://localhost:3000",      # Alternative local dev port
    "https://yourdomain.com",     # Production domain
    "https://www.yourdomain.com", # Production www subdomain
]

# Required CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": # Dynamic based on request origin
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Cookie",
    "Access-Control-Allow-Credentials": "true",  # CRITICAL: Must be true for cookies
    "Access-Control-Max-Age": "3600"
}
```

### **Important:**
- **`Access-Control-Allow-Credentials: true`** is **MANDATORY** because frontend sends `credentials: 'include'`
- When `credentials: true`, **cannot use `*` for allowed origins** - must explicitly list domains
- Must handle **preflight OPTIONS requests** for all endpoints

---

## 📡 **2. Required API Endpoints**

### **2.1. Authentication Endpoints**

#### **POST `/v1/api/users/sign-in`**
**Purpose:** Email/Password login

**Frontend Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "firebase_token": "optional_token"
}
```

**Must Set Cookies:**
```
Set-Cookie: session_token=abc123; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400
```

**Error Response (401/400):**
```json
{
  "detail": "Invalid email or password"
}
```

**Current Issue:** ❌ Unknown if endpoint exists or response format matches

---

#### **POST `/v1/api/users/sign-up`**
**Purpose:** User registration

**Frontend Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firebase_token": "optional_firebase_token"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": null,
  "firebase_token": "optional_token"
}
```

**Must Set Cookies:**
```
Set-Cookie: session_token=abc123; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400
```

**Error Response (400/409):**
```json
{
  "detail": "Email already exists"
}
```

**Current Issue:** ❌ Unknown if endpoint exists or response format matches

---

#### **POST `/v1/api/users/auth/callback/google`**
**Purpose:** Google OAuth callback (exchange code for user session)

**Frontend Request:**
```json
{
  "code": "google_auth_code_from_oauth_redirect",
  "code_verifier": "pkce_code_verifier_from_session"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://lh3.googleusercontent.com/...",
  "firebase_token": "optional_token"
}
```

**Must Set Cookies:**
```
Set-Cookie: session_token=abc123; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400
```

**Error Response (400/401):**
```json
{
  "detail": "Invalid authorization code"
}
```

**Current Issue:** 
- ✅ Endpoint exists
- ❌ CORS blocking requests from `http://localhost:5173`
- ❌ Unknown if response format matches expected structure

**Backend Must:**
1. Accept PKCE `code_verifier` for security
2. Exchange `code` with Google OAuth servers
3. Retrieve user profile from Google
4. Create/update user in database
5. Generate session token
6. Return user data + set session cookie

---

#### **GET `/v1/api/users/check-user`**
**Purpose:** Verify current session is valid and get user data

**Frontend Request:**
- No body
- Sends session cookie automatically via `credentials: 'include'`

**Expected Response (200 OK):**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "firebase_token": "optional_token"
}
```

**Error Response (401):**
```json
{
  "detail": "Not authenticated"
}
```

**Current Issue:** 
- ✅ Endpoint exists (`src/services/api/auth.ts:113`)
- ❌ Never called by frontend (now fixed)
- ❌ Unknown if response format matches

**Backend Must:**
1. Verify session cookie is valid
2. Check token hasn't expired
3. Return current user data from database
4. Return 401 if session invalid

---

#### **POST `/v1/api/users/log-out`**
**Purpose:** Invalidate user session

**Frontend Request:**
- No body
- Sends session cookie automatically

**Expected Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Must Clear Cookies:**
```
Set-Cookie: session_token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0
```

**Current Issue:** ❌ Unknown if endpoint exists or cookie clearing works

---

### **2.2. Profile Management Endpoints**

#### **PUT `/v1/api/users/profile`**
**Purpose:** Update user profile information

**Frontend Request:**
```json
{
  "name": "John Smith",
  "email": "newEmail@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "user_123",
  "name": "John Smith",
  "email": "newEmail@example.com",
  "avatar": "https://example.com/new-avatar.jpg",
  "firebase_token": "optional_token"
}
```

**Error Response (400/401):**
```json
{
  "detail": "Email already in use by another account"
}
```

**Current Issue:** ❌ Endpoint does not exist (frontend now expects it)

**Backend Must:**
1. Verify user is authenticated
2. Validate email is not used by another user
3. Update user in database
4. Return updated user data

---

## 🔐 **3. Session & Cookie Requirements**

### **Session Cookie Specification:**

```
Name: session_token (or your backend's session cookie name)
Value: JWT token or session ID
HttpOnly: true          # Prevents JavaScript access (security)
Secure: true            # Only sent over HTTPS (production)
SameSite: None          # Required for CORS with credentials
Path: /                 # Available to all routes
Max-Age: 86400          # 24 hours (or your preferred duration)
Domain: .yourdomain.com # For production cross-subdomain access
```

### **Critical Requirements:**
1. **`SameSite=None`** is **MANDATORY** for cross-origin requests (CSR mode)
2. **`Secure=true`** is **REQUIRED** when using `SameSite=None` (use HTTPS in production)
3. **`HttpOnly=true`** prevents XSS attacks (JavaScript cannot access cookie)
4. Cookie **must be set in all auth responses** (sign-in, sign-up, Google callback)
5. Cookie **must be cleared on logout**

### **Development Note:**
- In development (HTTP), you may need to set `SameSite=Lax` and `Secure=false`
- Use environment variable to toggle between dev/prod cookie settings

---

## 📊 **4. Expected Response Format Standardization**

### **User Object Schema:**

All endpoints returning user data should use this consistent format:

```json
{
  "id": "string",              // Required: unique user ID
  "name": "string",            // Required: user's display name
  "email": "string",           // Required: user's email
  "avatar": "string | null",   // Optional: profile picture URL
  "firebase_token": "string | null"  // Optional: Firebase authentication token
}
```

**Alternative field names accepted by frontend:**
- `user_id` → will map to `id`
- `username` → will map to `name`
- `profile_picture` → will map to `avatar`

**Frontend will use fallbacks if fields are missing, but consistent naming is preferred.**

---

## 🔄 **5. Error Response Format**

All error responses should follow this format:

```json
{
  "detail": "Human-readable error message"
}
```

**Common HTTP Status Codes:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Not authenticated or invalid credentials
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Email already exists, etc.
- `500 Internal Server Error` - Server-side error

**Frontend will display `detail` field to users, so make messages user-friendly.**

---

## 🌐 **6. Google OAuth Configuration**

### **Backend Must:**

1. **Register OAuth Client in Google Cloud Console:**
   - Client ID: Already configured
   - Client Secret: Store securely in backend
   - Authorized redirect URIs:
     ```
     http://localhost:5173
     http://localhost:3000
     https://yourdomain.com
     https://www.yourdomain.com
     ```

2. **Handle PKCE Flow:**
   - Frontend generates `code_verifier` and `code_challenge`
   - Frontend sends user to Google with `code_challenge`
   - Google redirects back to frontend with `code`
   - Frontend sends `code` + `code_verifier` to backend
   - Backend verifies and exchanges with Google

3. **Exchange Code for Tokens:**
   ```python
   # Backend sends to Google
   POST https://oauth2.googleapis.com/token
   {
     "code": "auth_code_from_frontend",
     "client_id": "YOUR_CLIENT_ID",
     "client_secret": "YOUR_CLIENT_SECRET",
     "redirect_uri": "http://localhost:5173",  # Must match frontend
     "grant_type": "authorization_code",
     "code_verifier": "code_verifier_from_frontend"
   }
   ```

4. **Retrieve User Info:**
   ```python
   # Backend sends to Google
   GET https://www.googleapis.com/oauth2/v2/userinfo
   Headers: Authorization: Bearer {access_token}
   ```

5. **Create/Update User:**
   - Check if user with Google email exists
   - Create new user or update existing
   - Generate session token
   - Return user data + set cookie

---

## 📝 **7. Testing Checklist for Backend Team**

### **CORS Testing:**
- [ ] Can handle preflight OPTIONS requests
- [ ] Returns correct `Access-Control-Allow-Origin` header
- [ ] Returns `Access-Control-Allow-Credentials: true`
- [ ] Accepts requests from `http://localhost:5173`
- [ ] Accepts requests from production domain

### **Authentication Flow:**
- [ ] Sign-up creates user and returns session cookie
- [ ] Sign-in validates credentials and returns session cookie
- [ ] Google OAuth callback exchanges code and returns session cookie
- [ ] Check-user validates session and returns user data
- [ ] Logout clears session cookie

### **Session Management:**
- [ ] Session cookie is HttpOnly
- [ ] Session cookie has correct SameSite setting
- [ ] Session tokens expire after set duration
- [ ] Invalid tokens return 401 status
- [ ] Expired tokens are properly rejected

### **Profile Management:**
- [ ] Profile update endpoint exists
- [ ] Email uniqueness is validated
- [ ] User data is properly updated
- [ ] Updated data is returned in response

---

## 🔧 **8. Backend Implementation Priorities**

### **Priority 1 - CRITICAL (Blocks all authentication):**
1. ✅ Fix CORS to allow `http://localhost:5173`
2. ✅ Enable `Access-Control-Allow-Credentials: true`
3. ✅ Handle preflight OPTIONS requests
4. ✅ Ensure session cookies are set with correct attributes

### **Priority 2 - HIGH (Core features don't work):**
5. ✅ Verify `/v1/api/users/sign-in` returns correct format
6. ✅ Verify `/v1/api/users/sign-up` returns correct format
7. ✅ Verify `/v1/api/users/auth/callback/google` works with PKCE
8. ✅ Verify `/v1/api/users/check-user` validates sessions correctly

### **Priority 3 - MEDIUM (Feature enhancement):**
9. ⚠️ Create `/v1/api/users/profile` PUT endpoint
10. ⚠️ Implement session refresh mechanism
11. ⚠️ Add rate limiting on auth endpoints

### **Priority 4 - LOW (Nice to have):**
12. ⚠️ Add password reset flow
13. ⚠️ Add email verification
14. ⚠️ Add OAuth providers (GitHub, Facebook, etc.)

---

## 📞 **9. Backend Response Examples for Frontend Team**

### **Successful Sign-In:**
```http
POST /v1/api/users/sign-in
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}

Response: 200 OK
Set-Cookie: session_token=eyJhbGc...; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400

{
  "id": "usr_abc123",
  "name": "Test User",
  "email": "test@example.com",
  "avatar": null,
  "firebase_token": null
}
```

### **Failed Sign-In:**
```http
POST /v1/api/users/sign-in
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "wrongpassword"
}

Response: 401 Unauthorized

{
  "detail": "Invalid email or password"
}
```

### **Session Verification:**
```http
GET /v1/api/users/check-user
Cookie: session_token=eyJhbGc...

Response: 200 OK

{
  "id": "usr_abc123",
  "name": "Test User",
  "email": "test@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "firebase_token": null
}
```

### **Invalid Session:**
```http
GET /v1/api/users/check-user
Cookie: session_token=invalid_or_expired

Response: 401 Unauthorized

{
  "detail": "Invalid or expired session"
}
```

---

## 🚀 **10. Production Deployment Checklist**

### **Environment Variables:**
```bash
# Required backend environment variables
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=random_secure_string_for_signing_tokens
COOKIE_DOMAIN=.yourdomain.com
COOKIE_SECURE=true
COOKIE_SAMESITE=None
```

### **Infrastructure:**
- [ ] HTTPS enabled on backend API
- [ ] CORS configured for production domains
- [ ] Session secret is strong random string
- [ ] Database is secured and backed up
- [ ] Rate limiting enabled on auth endpoints
- [ ] Monitoring and logging configured
- [ ] Error tracking (Sentry, etc.) configured

---

## 📌 **Summary**

**Frontend is now fully configured for CSR mode with:**
- ✅ Real backend API calls for login/signup
- ✅ Google OAuth PKCE flow
- ✅ Session verification on page load
- ✅ Profile update functionality
- ✅ Proper error handling

**Backend must provide:**
1. 🔴 **CORS configuration allowing `http://localhost:5173`** (CRITICAL)
2. 🔴 **Session cookies with `SameSite=None` and `Credentials=true`** (CRITICAL)
3. 🟠 **Consistent user data response format** (HIGH)
4. 🟠 **Profile update endpoint** (MEDIUM)
5. 🟡 **Proper error messages** (LOW)

**Once CORS is fixed, authentication should work end-to-end.**

