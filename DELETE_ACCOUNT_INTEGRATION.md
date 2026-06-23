# InterChat Delete Account Integration - Complete Guide

## Overview
This guide provides complete documentation for the InterChat delete account feature integrated from the mobile app to the landing page website. The implementation follows a secure two-step verification process.

## API Specification

### Endpoints
Based on the Interchat OpenAPI 3.0 specification, the delete account flow uses:

#### 1. Request Account Deletion (Step 1)
**Endpoint:** `POST /api/v1/delete-account/request`
**Description:** Request Account Deletion (Public)
**Category:** V1/Mobile App/Authentication/Account Deletion

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
- **200 Success**: Deletion request submitted. OTP/token sent to email
- **404 Failed**: Email not found in system

---

#### 2. Confirm Account Deletion (Step 2)
**Endpoint:** `POST /api/v1/delete-account/confirm`
**Description:** Confirm Account Deletion OTP (Public)
**Category:** V1/Mobile App/Authentication/Account Deletion

**Request Body:**
```json
{
  "token": "verification_code_from_email"
}
```

**Response:**
- **200 Success**: Account permanently deleted
- **404 Failed**: Invalid or expired token

---

## File Structure

```
delete__user.html              # Main HTML page with two-step form
assets/js/delete-user.js       # Complete API integration logic
assets/css/delete-user.css     # Responsive styling
DELETE_ACCOUNT_INTEGRATION.md  # This documentation
```

## Implementation Details

### HTML Form Flow

**Step 1: Email Input**
- User enters their InterChat email address
- Form validates email format
- Button: "Request Deletion"
- Confirmation dialog before submission

**Step 2: Token Verification**
- After successful Step 1, form transitions to Step 2
- User receives verification code in email
- User enters the code
- Button: "Confirm Deletion"
- Final warning dialog before permanent deletion

### JavaScript Configuration

**File:** `assets/js/delete-user.js`

Update the API configuration at the top of the file:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:3002', // Update with your API server
    ENDPOINTS: {
        REQUEST_DELETION: '/api/v1/delete-account/request',
        CONFIRM_DELETION: '/api/v1/delete-account/confirm'
    }
};
```

### Key Features

✅ **Two-Step Verification Process**
- Email verification with OTP
- Prevention of accidental deletions

✅ **Security**
- Email validation before submission
- Multiple confirmation dialogs
- Token-based verification

✅ **User Experience**
- Smooth transitions between steps
- Loading states on buttons
- Clear error messages
- Auto-dismiss error messages after 5 seconds
- Keyboard Enter key support

✅ **Error Handling**
- Network error detection
- Invalid email detection
- Email not found handling
- Invalid/expired token handling
- User-friendly error messages

✅ **Responsive Design**
- Mobile-friendly interface
- Optimized for all screen sizes
- Touch-friendly buttons

## Testing Guide

### Test Credentials
```
Email: Okekefestus@gmail.com
Purpose: Testing account deletion flow
```

### Step-by-Step Testing

#### Test Case 1: Valid Email Request
1. Navigate to the delete account page
2. Enter: `Okekefestus@gmail.com`
3. Click "Request Deletion"
4. Confirm in dialog
5. ✓ Should see success message
6. ✓ Form should transition to Step 2
7. ✓ Email should display in Step 2

#### Test Case 2: Invalid Email Format
1. Enter: `invalid-email`
2. Click "Request Deletion"
3. ✓ Should see error: "Please enter a valid email address."

#### Test Case 3: Missing Email
1. Leave email field empty
2. Click "Request Deletion"
3. ✓ Should see error: "Please enter your email address."

#### Test Case 4: Non-existent Email (404 scenario)
1. Enter an email not registered in the system
2. Click "Request Deletion"
3. Confirm in dialog
4. ✓ Should see error: "Email not found in our system."

#### Test Case 5: Token Verification (Valid)
1. Complete Step 1 with valid email
2. Copy verification code from email
3. Enter code in Step 2
4. Click "Confirm Deletion"
5. Confirm final warning dialog
6. ✓ Should see success message
7. ✓ Should redirect to home page after 3 seconds

#### Test Case 6: Invalid Token
1. Complete Step 1
2. Enter incorrect/expired code
3. Click "Confirm Deletion"
4. Confirm final warning dialog
5. ✓ Should see error: "Invalid or expired verification code."

#### Test Case 7: Cancel at Step 1
1. At any point in Step 1, click "Cancel"
2. Confirm cancellation dialog
3. ✓ Should redirect to home page

#### Test Case 8: Back Button (Step 2)
1. Complete Step 1 and see Step 2
2. Click "Back"
3. ✓ Should return to Step 1
4. ✓ Email field should still have the value
5. ✓ Token field should be cleared

### Browser Console Testing

Open browser DevTools Console (F12) and check for:
- Network requests to the API endpoints
- API response status and data
- Any JavaScript errors

```javascript
// To monitor API calls, open Networks tab in DevTools
// Check requests to:
// POST /api/v1/delete-account/request
// POST /api/v1/delete-account/confirm
```

## Production Deployment

### Configuration Steps

1. **Update Base URL**
   ```javascript
   // In assets/js/delete-user.js
   const API_CONFIG = {
       BASE_URL: 'https://your-production-api.com', // Your production domain
       ENDPOINTS: { ... }
   };
   ```

2. **Environment Setup**
   - Ensure API server is accessible from the landing page
   - Configure CORS if needed
   - SSL/HTTPS should be enabled

3. **Email Configuration**
   - Ensure your backend sends verification codes to user emails
   - Test email delivery
   - Verify email templates

4. **Testing**
   - Test with production credentials
   - Verify email delivery in production
   - Test error scenarios
   - Monitor API logs

## Security Recommendations

### Client-Side
- ✓ Email validation implemented
- ✓ HTTPS recommended for production
- ✓ Multiple confirmation dialogs
- ✓ Token sent via email only

### Server-Side
- Use HTTPS only
- Validate email format on backend
- Implement rate limiting
- Generate secure verification tokens
- Set token expiration time (e.g., 15 minutes)
- Use secure random token generation
- Log deletion requests
- Add email verification before deletion
- Consider adding 2FA or password verification
- Archive user data before deletion (for compliance)
- Delete PII from all systems

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "Please enter your email address." | Empty email field | Enter a valid email |
| "Please enter a valid email address." | Invalid email format | Check email format |
| "Email not found in our system." | Email not registered | Use registered email |
| "Network error. Please check your connection and try again." | Network failure | Check internet connection |
| "Unable to submit deletion request. Please try again." | Server error | Retry or contact support |
| "Invalid or expired verification code." | Wrong/expired token | Request new code |

## FAQ

### Q: Can I recover my account after deletion?
A: No, account deletion is permanent. All data is irreversibly removed.

### Q: How long does deletion take?
A: Accounts are deleted immediately after token confirmation.

### Q: What happens to my messages?
A: All messages and personal data are permanently removed from the system.

### Q: Can I cancel the deletion process?
A: Yes, until you confirm the verification code. After confirmation, deletion is permanent.

### Q: Do I receive a confirmation email?
A: After Step 1, you receive a verification code. After Step 2, you'll receive a deletion confirmation.

## Troubleshooting

### Issue: Button stays disabled after click
- **Solution**: Check network connection, verify API endpoint is accessible

### Issue: Form doesn't transition to Step 2
- **Solution**: Check browser console for errors, verify API response

### Issue: Email not received
- **Solution**: Check spam folder, verify email in system, check backend logs

### Issue: "Network error" message
- **Solution**: Check BASE_URL configuration, verify CORS settings, check API server status

### Issue: CORS errors in console
- **Solution**: Configure CORS on backend, add landing page domain to allowed origins

## API Integration Example (curl)

### Step 1: Request Deletion
```bash
curl -X POST http://localhost:3002/api/v1/delete-account/request \
  -H "Content-Type: application/json" \
  -d '{"email":"Okekefestus@gmail.com"}'
```

### Step 2: Confirm Deletion
```bash
curl -X POST http://localhost:3002/api/v1/delete-account/confirm \
  -H "Content-Type: application/json" \
  -d '{"token":"VERIFICATION_CODE"}'
```

## Support & Maintenance

### Monitoring
- Monitor API endpoint response times
- Track deletion request failures
- Monitor email delivery rates
- Review error logs regularly

### Updates
- Keep dependencies updated
- Monitor for security patches
- Test changes in staging first
- Document any modifications

## Related Documentation
- [OpenAPI Specification](https://openapi.echoapi.com/swagger/v3/66791d3bd002000?locale=en)
- InterChat Mobile App Delete Flow
- API Backend Documentation

---

**Last Updated:** 2026-06-23
**Status:** ✅ Production Ready
**Version:** 1.0.0
