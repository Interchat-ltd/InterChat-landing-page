# Delete Account Feature - Visual Flow & Reference

## User Interface Flow

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                             ┃
┃         DELETE ACCOUNT PAGE - STEP 1                       ┃
┃                                                             ┃
┃  🚨 Delete Account?                                        ┃
┃  We're sorry to see you go...                              ┃
┃                                                             ┃
┃  ⚠️  Important:                                             ┃
┃    • Your profile may be permanently removed              ┃
┃    • Messages and content no longer accessible            ┃
┃    • This action may be irreversible                       ┃
┃                                                             ┃
┃  Email Address                                             ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Enter your InterChat email                      ▼   │  ┃
┃  │ Okekefestus@gmail.com                               │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃                                                             ┃
┃  [🗑️  Request Deletion]  [❌ Cancel]                       ┃
┃                                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                            ⬇️  (on success)
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                             ┃
┃         DELETE ACCOUNT PAGE - STEP 2                       ┃
┃                                                             ┃
┃  ✅ Deletion request submitted successfully!              ┃
┃     Check your email for verification code                ┃
┃                                                             ┃
┃  Verify Deletion Request                                  ┃
┃  Code sent to: Okekefestus@gmail.com                      ┃
┃                                                             ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Enter verification code                         ▼   │  ┃
┃  │ 123456                                              │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃                                                             ┃
┃  [✓ Confirm Deletion]  [← Back]                           ┃
┃                                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                            ⬇️  (on success)
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                             ┃
┃  ✅ Account successfully deleted!                         ┃
┃     Redirecting to home page...                           ┃
┃                                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                            ⬇️  (3 seconds)
                        (Redirect to /index.html)
```

## Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│              LANDING PAGE FRONTEND                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  delete__user.html (HTML Structure)                  │
│  ├─ Step 1: Email Form                              │
│  └─ Step 2: Token Form                              │
│                                                       │
│  assets/js/delete-user.js (Logic & API Calls)       │
│  ├─ Form State Management (current step)            │
│  ├─ Email Validation                                │
│  ├─ API Request Handling                            │
│  ├─ Error Handling                                  │
│  └─ Navigation Between Steps                        │
│                                                       │
│  assets/css/delete-user.css (Styling)               │
│  ├─ Step Animations                                 │
│  ├─ Form Styling                                    │
│  ├─ Message Styling (success/error)                 │
│  └─ Responsive Design                               │
│                                                       │
└──────────────────────────────────────────────────────┘
              ⬇️  ⬇️  ⬇️  (API Calls)  ⬇️  ⬇️  ⬇️
┌──────────────────────────────────────────────────────┐
│              INTERCHAT API BACKEND                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  POST /api/v1/delete-account/request                │
│  ├─ Input: { email: "..." }                         │
│  ├─ Process: Generate & send verification code      │
│  └─ Output: { success: true, message: "..." }       │
│                                                       │
│  POST /api/v1/delete-account/confirm                │
│  ├─ Input: { token: "..." }                         │
│  ├─ Process: Verify & delete account permanently    │
│  └─ Output: { success: true, message: "..." }       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## State Flow Diagram

```
                    Page Load
                        ⬇️
            ┌───────────────────────┐
            │   INITIAL STATE       │
            │   - currentStep = 1   │
            │   - userEmail = ''    │
            └───────────────────────┘
                        ⬇️
        ┌───────────────────────────────────┐
        │   USER ENTERS EMAIL               │
        │   - Input validation (regex)      │
        │   - Show confirmation dialog      │
        └───────────────────────────────────┘
                        ⬇️
        ┌───────────────────────────────────┐
        │   API: REQUEST_DELETION           │
        │   POST /delete-account/request    │
        │   - Show loading state            │
        │   - Disable button                │
        └───────────────────────────────────┘
                        ⬇️
            ┌─────────────────────┐
            │   API RESPONSE      │
            └─────────────────────┘
              ⬇️               ⬇️
        ✅ Success       ❌ Error
              ⬇️               ⬇️
        Step 2 Form     Error Message
        currentStep=2   (auto-dismiss 5s)
              ⬇️
        Email display
        Token input
              ⬇️
        ┌───────────────────────────────────┐
        │   USER ENTERS TOKEN               │
        │   - Show final warning dialog     │
        └───────────────────────────────────┘
              ⬇️
        ┌───────────────────────────────────┐
        │   API: CONFIRM_DELETION           │
        │   POST /delete-account/confirm    │
        │   - Show loading state            │
        │   - Disable button                │
        └───────────────────────────────────┘
              ⬇️
        ┌─────────────────────┐
        │   API RESPONSE      │
        └─────────────────────┘
          ⬇️               ⬇️
    ✅ Success       ❌ Error
          ⬇️               ⬇️
    Success Msg     Error Message
    Redirect (3s)   (auto-dismiss 5s)
          ⬇️
    /index.html
```

## Error Handling Flow

```
┌─────────────────────────────────────┐
│       USER ACTION / INPUT           │
└─────────────────────────────────────┘
            ⬇️
┌──────────────────────────────────────────┐
│    VALIDATION CHECKS                     │
├──────────────────────────────────────────┤
│                                          │
│  ❌ Empty Field?                         │
│     → "Please enter your email address"  │
│                                          │
│  ❌ Invalid Email Format?                │
│     → "Please enter a valid email"       │
│                                          │
│  ✅ Validation Passed                    │
│     → Continue to API Call               │
│                                          │
└──────────────────────────────────────────┘
            ⬇️
┌──────────────────────────────────────────┐
│    API CALL                              │
├──────────────────────────────────────────┤
│                                          │
│  ❌ Network Error?                       │
│     → "Network error. Check connection"  │
│                                          │
│  ✅ Network OK → API Response            │
│                                          │
└──────────────────────────────────────────┘
            ⬇️
┌──────────────────────────────────────────┐
│    API RESPONSE HANDLING                 │
├──────────────────────────────────────────┤
│                                          │
│  ✅ 200 OK                               │
│     → Success message                    │
│     → Proceed to next step               │
│                                          │
│  ❌ 404 NOT FOUND                        │
│     → "Email not found in system"        │
│                                          │
│  ❌ 500+ SERVER ERROR                    │
│     → Generic error message              │
│                                          │
└──────────────────────────────────────────┘
            ⬇️
┌──────────────────────────────────────────┐
│    USER FEEDBACK                         │
├──────────────────────────────────────────┤
│                                          │
│  ✅ Success (Green)                      │
│     - Persistent message                 │
│     - Button returns to normal           │
│     - Form transitions (Step 1 → Step 2) │
│                                          │
│  ❌ Error (Red)                          │
│     - Auto-dismiss after 5 seconds       │
│     - Button returns to normal           │
│     - User can retry                     │
│                                          │
└──────────────────────────────────────────┘
```

## API Request/Response Examples

### Step 1: Request Deletion

**Request:**
```json
{
  "email": "Okekefestus@gmail.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to your email"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Email not found in our system"
}
```

---

### Step 2: Confirm Deletion

**Request:**
```json
{
  "token": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account successfully deleted"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Invalid or expired verification code"
}
```

---

## Component Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ COMPONENT MOUNT (Page Load)                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ 1. DOM elements cached to variables                     │
│ 2. Event listeners attached:                            │
│    - requestBtn.click → handleRequestDeletion()        │
│    - confirmBtn.click → handleConfirmDeletion()        │
│    - cancelBtn.click → handleCancel()                  │
│    - backBtn.click → handleBackToStep1()               │
│    - emailInput.keypress → (Enter key handler)         │
│    - tokenInput.keypress → (Enter key handler)         │
│ 3. Current step set to 1                               │
│ 4. Page ready for user interaction                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
        ⬇️  (no cleanup, stays until navigation)

┌─────────────────────────────────────────────────────────┐
│ USER INTERACTIONS                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ • Enter email + click button                            │
│ • See loading state                                     │
│ • See success/error message                            │
│ • Transition to Step 2 (if success)                    │
│ • Enter token + click button                            │
│ • See loading state                                     │
│ • See success/error message                            │
│ • Redirect to home (if success)                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| **Enter** | Email input focused (Step 1) | Submit email → Request deletion |
| **Enter** | Token input focused (Step 2) | Submit token → Confirm deletion |
| **Escape** | Any time | (Handled by browser/OS) |
| **Tab** | All inputs | Navigate between form fields |

## Color & Styling Reference

| Element | Color | Usage |
|---------|-------|-------|
| **Success Message** | Green (#d1fae5 bg) | Successful operations |
| **Error Message** | Red (#fee2e2 bg) | Failed operations |
| **Delete Button** | Red (#dc2626) | Destructive actions |
| **Secondary Button** | Blue (#eef2ff) | Cancel/Back actions |
| **Info Text** | Gray (light) | Helper text, labels |
| **Warning Box** | Yellow (#fff8e6) | Alert/warning info |

---

## Quick Reference Checklist

- [ ] Update BASE_URL in `delete-user.js`
- [ ] Test with valid email
- [ ] Test with invalid email
- [ ] Test with non-existent email
- [ ] Verify email delivery
- [ ] Test token verification
- [ ] Test error handling
- [ ] Test mobile responsiveness
- [ ] Verify redirect works
- [ ] Check all button states

---

**For detailed testing procedures**, see: [DELETE_ACCOUNT_TESTING.md](./DELETE_ACCOUNT_TESTING.md)

**For complete documentation**, see: [DELETE_ACCOUNT_INTEGRATION.md](./DELETE_ACCOUNT_INTEGRATION.md)
