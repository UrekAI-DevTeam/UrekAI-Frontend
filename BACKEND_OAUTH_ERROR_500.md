# 🚨 Backend OAuth Callback Error (500)

## ❌ **Error Summary**

**Endpoint:** `POST /v1/api/users/auth/callback/google`  
**Status:** `500 Internal Server Error`  
**Cause:** Backend server is crashing when processing Google OAuth callback

---

## 🔍 **What's Working (Frontend)**

✅ OAuth callback detected on page load  
✅ State validation passes (CSRF protection)  
✅ Code and code_verifier retrieved from sessionStorage  
✅ Request sent to backend with correct data  

**Frontend is 100% functional!**

---

## ❌ **What's Failing (Backend)**

The backend endpoint `/v1/api/users/auth/callback/google` is returning a 500 error when processing the OAuth code exchange.

### **Request Details:**

```http
POST /v1/api/users/auth/callback/google HTTP/1.1
Host: urekaibackendpython.onrender.com
Content-Type: application/json
Origin: http://localhost:5173

{
  "code": "4/0AVGzR1BVnYpynjTYZp4HmTl4QKZ9xtqecJB7AOkeEX6xWD7hchZWrjWWIgvIE5dP7PjkcQ",
  "code_verifier": "<generated_verifier_string>"
}
```

### **Response:**

```http
HTTP/1.1 500 Internal Server Error

Internal server error
```

---

## 🐛 **Possible Backend Issues**

### **1. Missing/Invalid Google OAuth Credentials**
```python
# Backend might be missing:
GOOGLE_CLIENT_ID = "xxx"
GOOGLE_CLIENT_SECRET = "xxx"
```

**Solution:** Verify Google OAuth credentials are set in backend environment variables.

---

### **2. Invalid Redirect URI Configuration**
```python
# Backend redirect_uri might not match Google Console
GOOGLE_REDIRECT_URI = "http://localhost:5173"  # Must match exactly
```

**Solution:** Ensure backend is using `http://localhost:5173` as redirect URI when exchanging code.

---

### **3. Token Exchange Request Failing**

Backend needs to exchange the authorization code for tokens:

```python
# Expected token exchange request to Google:
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id={GOOGLE_CLIENT_ID}
&client_secret={GOOGLE_CLIENT_SECRET}
&code={authorization_code}
&code_verifier={code_verifier}  # PKCE
&grant_type=authorization_code
&redirect_uri=http://localhost:5173
```

**Common issues:**
- Missing `code_verifier` in token request
- Wrong `redirect_uri` (must match initial request)
- Expired authorization code (codes expire in ~10 minutes)
- Invalid client credentials

---

### **4. PKCE Verification Failure**

Backend must use the `code_verifier` when exchanging the code:

```python
# Correct PKCE flow in backend:
token_data = {
    "client_id": settings.GOOGLE_CLIENT_ID,
    "client_secret": settings.GOOGLE_CLIENT_SECRET,
    "code": code,
    "code_verifier": code_verifier,  # CRITICAL!
    "grant_type": "authorization_code",
    "redirect_uri": settings.GOOGLE_REDIRECT_URI
}

response = requests.post("https://oauth2.googleapis.com/token", data=token_data)
```

**If missing:** Google will reject the request and backend will crash.

---

### **5. Missing Error Handling**

Backend might not be catching exceptions from Google's API:

```python
# Backend should have:
try:
    # Exchange code for tokens
    response = requests.post(google_token_url, data=token_data)
    response.raise_for_status()
    tokens = response.json()
except requests.exceptions.RequestException as e:
    logger.error(f"Google token exchange failed: {e}")
    raise HTTPException(status_code=500, detail="OAuth callback failed")
```

**Without error handling:** Backend crashes with 500 and no useful error message.

---

### **6. Database/Session Issues**

Backend might be failing when creating user or session:

```python
# Backend might be crashing when:
- Creating new user in database
- Setting session cookie
- Storing user tokens
```

---

## 🔧 **Required Backend Fixes**

### **Priority 1: Add Detailed Error Logging**

```python
@router.post("/auth/callback/google")
async def google_callback(code: str, code_verifier: str):
    try:
        logger.info(f"Received OAuth callback with code: {code[:10]}...")
        
        # Exchange code for tokens
        token_response = await exchange_code_for_tokens(code, code_verifier)
        logger.info("Token exchange successful")
        
        # Get user info from Google
        user_info = await get_google_user_info(token_response['access_token'])
        logger.info(f"Retrieved user info for: {user_info['email']}")
        
        # Create/update user in database
        user = await create_or_update_user(user_info)
        logger.info(f"User created/updated: {user.id}")
        
        # Create session
        session = await create_session(user.id)
        logger.info(f"Session created: {session.id}")
        
        return {"user": user, "session": session}
        
    except GoogleAPIError as e:
        logger.error(f"Google API error: {e}")
        raise HTTPException(status_code=502, detail=f"Google API error: {str(e)}")
    except DatabaseError as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.error(f"Unexpected error in OAuth callback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"OAuth callback failed: {str(e)}")
```

---

### **Priority 2: Verify PKCE Implementation**

Ensure `code_verifier` is being sent to Google:

```python
async def exchange_code_for_tokens(code: str, code_verifier: str):
    token_data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "code": code,
        "code_verifier": code_verifier,  # MUST include this!
        "grant_type": "authorization_code",
        "redirect_uri": settings.GOOGLE_REDIRECT_URI  # Must be http://localhost:5173
    }
    
    response = requests.post(
        "https://oauth2.googleapis.com/token",
        data=token_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    if not response.ok:
        logger.error(f"Google token exchange failed: {response.text}")
        response.raise_for_status()
    
    return response.json()
```

---

### **Priority 3: Check Environment Variables**

```bash
# Required environment variables:
GOOGLE_CLIENT_ID="<your_client_id>.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="<your_client_secret>"
GOOGLE_REDIRECT_URI="http://localhost:5173"  # Must match frontend
```

---

### **Priority 4: Update CORS for localhost:5173**

```python
# Backend CORS must allow:
origins = [
    "http://localhost:5173",  # Not 127.0.0.1!
    "https://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # CRITICAL for cookies!
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 **Testing Backend Directly**

Test the endpoint with curl to see detailed error:

```bash
curl -X POST "https://urekaibackendpython.onrender.com/v1/api/users/auth/callback/google" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "code": "test_code",
    "code_verifier": "test_verifier"
  }' \
  -v
```

This should reveal the exact error message from the backend.

---

## 📊 **Summary**

| Component | Status | Details |
|-----------|--------|---------|
| **Frontend** | ✅ **Working** | Callback detected, request sent correctly |
| **Backend** | ❌ **Failing** | 500 error when processing OAuth callback |
| **Issue** | 🔴 **Backend** | Token exchange or user creation failing |

---

## ✅ **Next Steps**

1. **Backend Team:** Check server logs for detailed error
2. **Backend Team:** Add comprehensive error logging
3. **Backend Team:** Verify Google OAuth credentials
4. **Backend Team:** Confirm PKCE implementation includes `code_verifier`
5. **Backend Team:** Test token exchange endpoint directly
6. **Backend Team:** Fix CORS to allow `http://localhost:5173`

**Frontend is production-ready and waiting for backend fix!**

