# Delete User Account Page - Implementation Guide

## Overview
The delete user account page provides a secure way for users to permanently delete their accounts. It includes user information retrieval, password authentication, and confirmation requirements before deletion.

## Files Created/Modified

### 1. **delete__user.html** (Modified)
The main HTML page with:
- User information display section
- Authentication form with password input
- Confirmation checkbox
- Warning information about permanent deletion
- Responsive layout

### 2. **assets/js/delete-user.js** (New)
JavaScript file handling:
- User information retrieval from API
- Form validation and submission
- Password verification
- Account deletion API calls
- Error/success message handling
- Token management

### 3. **assets/css/delete-user.css** (New)
Styling for:
- Delete account page layout
- Form elements and validation states
- Warning boxes and alerts
- Responsive design for mobile and desktop
- Button states and animations

## Features Implemented

### User Information Display
- Fetches user profile data from the API
- Displays email, username, and account status
- Loads dynamically on page load

### Security Features
- Password verification required
- Explicit confirmation checkbox
- Secondary confirmation dialog
- Token-based authentication
- Secure API communication with Bearer tokens

### Error Handling
- Network error handling
- Authentication failure handling
- User-friendly error messages with auto-dismiss
- Success confirmation before redirect

### User Experience
- Loading spinner during API calls
- Form validation and disabled states
- Clear warnings about permanent deletion
- Graceful redirect after successful deletion

## API Configuration

The JavaScript file uses the following API endpoints (via EchoAPI):

```javascript
const API_CONFIG = {
    BASE_URL: 'https://api.echoapi.com',
    ENDPOINTS: {
        GET_USER: '/api/v1/user/profile',           // GET - Retrieve user info
        DELETE_USER: '/api/v1/user/delete',         // POST - Delete account
        VERIFY_AUTH: '/api/v1/user/verify-password' // POST - Verify password
    }
};
```

### Update the API Configuration
Edit `assets/js/delete-user.js` and update the `API_CONFIG` object with your actual EchoAPI endpoints:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://your-api-domain.com',
    ENDPOINTS: {
        GET_USER: '/your/user/endpoint',
        DELETE_USER: '/your/delete/endpoint',
        VERIFY_AUTH: '/your/verify/endpoint'
    }
};
```

## Authentication Token Setup

The system looks for auth tokens in this order:
1. `localStorage.authToken`
2. `sessionStorage.authToken`
3. `localStorage.access_token`
4. `sessionStorage.access_token`

When user logs in, store the token:
```javascript
// After successful login
localStorage.setItem('authToken', response.token);
// OR
localStorage.setItem('access_token', response.access_token);
```

## API Request/Response Format

### GET /api/v1/user/profile
**Headers:**
```
Authorization: Bearer {authToken}
Content-Type: application/json
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": "user123",
        "email": "user@example.com",
        "username": "johndoe",
        "status": "Active"
    }
}
```

### POST /api/v1/user/verify-password
**Headers:**
```
Authorization: Bearer {authToken}
Content-Type: application/json
```

**Body:**
```json
{
    "password": "userPassword123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Password verified successfully"
}
```

### POST /api/v1/user/delete
**Headers:**
```
Authorization: Bearer {authToken}
Content-Type: application/json
```

**Body:**
```json
{
    "user_id": "user123",
    "password": "userPassword123",
    "confirmation": true
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Account deleted successfully"
}
```

## Usage Instructions

### 1. Update API Configuration
Replace the placeholder URLs in `delete-user.js` with your actual EchoAPI endpoints.

### 2. Ensure Authentication
Make sure users are authenticated before accessing this page. You can add a redirect:

```javascript
// At the top of delete-user.js
const authToken = getAuthToken();
if (!authToken) {
    redirectToLogin();
}
```

### 3. Link from User Settings
Add a link to this page in your app's user settings:

```html
<a href="/delete__user.html" class="settings-link">Delete Account</a>
```

### 4. Test the Flow
1. Log in as a test user
2. Navigate to `/delete__user.html`
3. Verify user information displays correctly
4. Test password verification
5. Test account deletion

## Error Handling

The page handles various error scenarios:

- **Missing auth token**: Redirects to home/login
- **Failed to load user info**: Displays error message and allows retry
- **Wrong password**: Shows validation error
- **API failure**: User-friendly error message with retry option
- **Network error**: Catches network failures gracefully

## Security Considerations

- ✅ Password required for verification
- ✅ Explicit confirmation checkbox
- ✅ Double confirmation dialog
- ✅ Bearer token authentication
- ✅ HTTPS recommended for all API calls
- ⚠️ **TODO**: Implement CSRF token validation if needed
- ⚠️ **TODO**: Add rate limiting to prevent abuse
- ⚠️ **TODO**: Consider adding OTP/2FA verification

## Future Enhancements

1. **Two-Factor Authentication**
   - Add OTP verification before deletion

2. **Data Export**
   - Allow users to export their data before deletion

3. **Soft Delete**
   - Implement grace period (30 days) before permanent deletion

4. **Notification**
   - Send confirmation email before deletion
   - Email notification after deletion

5. **Audit Log**
   - Log deletion attempts and successes

6. **Analytics**
   - Track why users are deleting accounts

## Testing Checklist

- [ ] User information loads correctly
- [ ] Password field validation works
- [ ] Checkbox prevents form submission
- [ ] Delete button disabled until requirements met
- [ ] Password verification fails with wrong password
- [ ] Account deletion succeeds with correct credentials
- [ ] Spinner shows during API calls
- [ ] Error messages display and auto-dismiss
- [ ] Success message shows before redirect
- [ ] Redirect to home page after deletion
- [ ] Auth token cleared after deletion
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works

## Troubleshooting

### "Authentication token not found"
- Ensure user is logged in before accessing the page
- Check token storage keys match your implementation
- Verify token is stored with correct key names

### "Failed to fetch user info"
- Verify API endpoint is correct
- Check API is accessible and CORS is configured
- Verify auth token is valid
- Check browser console for detailed error

### "Password verification failed"
- Confirm API endpoint for password verification
- Verify request body format matches backend
- Check backend password validation logic

### User info not displaying
- Check API response format matches expected structure
- Verify data mapping in `displayUserInformation()` function
- Check browser console for JavaScript errors

## Support

For issues or questions about the implementation:
1. Check the browser console for errors
2. Verify API configuration and endpoints
3. Test API endpoints using tools like Postman
4. Review network requests in browser DevTools
