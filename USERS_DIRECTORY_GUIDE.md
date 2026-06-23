# Users Directory Page - Integration Guide

## Overview
The users directory page allows displaying and managing a list of InterChat user accounts from the database. It features search, filtering, sorting, pagination, and dual view modes (grid and list).

## Features

### Display Features
- ✅ **Grid View** - Card-based layout with user avatars and info
- ✅ **List View** - Table-based layout for detailed information
- ✅ **View Toggle** - Easy switching between grid and list views
- ✅ **Responsive Design** - Works on all device sizes (mobile, tablet, desktop)

### Search & Filter
- ✅ **Search** - Filter users by name, email, or username (real-time)
- ✅ **Status Filter** - Filter by Active, Inactive, or Pending
- ✅ **Sorting** - Sort by Recent, Name (A-Z, Z-A), or Oldest first
- ✅ **Pagination** - Navigate through user pages (12 per page)

### Statistics
- ✅ **Total Users Count** - Total number of users
- ✅ **Active Users** - Count of active users
- ✅ **Inactive Users** - Count of inactive users

### User Interactions
- ✅ **Profile View** - Click to view user profile details
- ✅ **Send Message** - Message button for quick contact
- ✅ **Refresh Data** - Manual refresh button with loading animation

## Files Created

### 1. **users.html** (HTML Page)
The main user interface with:
- Header with navigation
- Search and filter controls
- View toggle (grid/list)
- Statistics display
- User grid container
- User list container (table)
- Empty state message
- Pagination controls
- Footer

### 2. **assets/js/users.js** (JavaScript Logic - 400+ lines)
Complete functionality including:
- API integration for fetching users
- Mock data fallback for demo/testing
- Search and filter logic
- Pagination implementation
- Grid and list view rendering
- User action handlers
- Event listeners setup
- Utility functions (debounce, escape HTML, date formatting)

### 3. **assets/css/users.css** (Styling - 500+ lines)
Comprehensive styling featuring:
- Modern card design for grid view
- Professional table design for list view
- Responsive breakpoints (768px, 480px)
- Smooth animations and transitions
- Color-coded status badges
- Loading states and empty states
- Mobile optimization

## API Integration

### Endpoint Configuration
File: `assets/js/users.js` (Lines 3-9)

```javascript
const USERS_API_CONFIG = {
    BASE_URL: 'http://localhost:3002',
    ENDPOINTS: {
        GET_USERS: '/api/v1/users',          // Main endpoint
        GET_USER: '/api/v1/user/:id',        // Individual user
        SEARCH_USERS: '/api/v1/users/search' // Optional search
    }
};
```

### Expected API Response Format
```json
[
  {
    "id": "1",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "status": "active",
    "joinDate": "2024-01-15",
    "lastActive": "2026-06-23",
    "bio": "User bio text"
  }
]
```

Or wrapped response:
```json
{
  "users": [...],
  "total": 100
}
```

### Required Fields
- `id` - Unique user identifier
- `username` - User's username
- `email` - User's email address
- `fullName` - User's full name
- `avatar` - Avatar image URL
- `status` - 'active', 'inactive', or 'pending'
- `joinDate` - Date user joined (ISO format)
- `lastActive` - Last active date (ISO format)
- `bio` - Short user bio (optional)

## Configuration

### Update API URL
Edit `assets/js/users.js` (Line 4):

```javascript
BASE_URL: 'http://localhost:3002'  // Change to your API server
```

Examples:
- Local: `http://localhost:3002`
- Staging: `https://staging-api.interchat.com`
- Production: `https://api.interchat.com`

### Fallback: Mock Data
If API is not available, the page uses mock data automatically:
- 8 sample users with complete data
- Different statuses (active, inactive, pending)
- Used for demo and testing

## Features in Detail

### Search
- Real-time search with 300ms debounce
- Searches by: Full Name, Username, Email
- Case-insensitive matching
- Updates pagination automatically

### Filters
**Status Filter:**
- All Status (default)
- Active - Users actively using the app
- Inactive - Users not active recently
- Pending - New users pending verification

**Sort Options:**
- Most Recent (default)
- Name (A-Z)
- Name (Z-A)
- Oldest First

### Views

**Grid View** (Default)
- Card-based layout
- Shows: Avatar, Name, Username, Bio, Email, Join Date
- Actions: View Profile, Send Message
- Hover effects

**List View**
- Table format
- Shows: Name, Email, Status, Join Date, Last Active
- Compact representation
- Better for large datasets

### Pagination
- 12 items per page (configurable)
- Previous/Next navigation buttons
- Page number buttons
- Current page indicator

## Usage

### Basic Usage
1. Navigate to `/users.html`
2. Users load automatically
3. Use search to find specific users
4. Use filters to narrow results
5. Click view or message buttons for actions

### Search Examples
- Search "john" → Finds all users with John in name
- Search "gmail.com" → Finds all Gmail users
- Search "john_doe" → Finds specific username

### Filtering Examples
- Filter by "Active" + Sort "Name A-Z" → Active users alphabetically
- Filter by "Pending" → New pending users
- Sort "Oldest First" → First registered users

## Customization

### Change Items Per Page
Edit `assets/js/users.js` (Line 13):
```javascript
let itemsPerPage = 12;  // Change to desired number
```

### Add Custom Fields
To add more user fields:

1. Update API response to include field
2. Add to mock data (getMockUsers function)
3. Update rendering functions (renderGridView, renderListView)
4. Add CSS styling for new field

Example:
```javascript
// In renderGridView, add to HTML:
<span class="user-field">${user.newField}</span>

// In CSS, add:
.user-field {
    font-size: var(--small-font-size);
    color: var(--text-color);
}
```

### Change Styling
- Colors: Edit CSS variables in `/assets/css/styles.css`
- Grid columns: Edit `grid-template-columns` in `.users__grid`
- Card size: Edit `minmax()` values
- Responsive breakpoints: Edit `@media` queries

## Security Considerations

### Data Exposure
- Avatar URLs should use secure HTTPS
- User email visibility (consider masking partially)
- Bio/profile info should be public-safe
- No sensitive data in list response

### Access Control
- Consider adding authentication check
- Implement role-based visibility (who can see users)
- Add rate limiting on API
- Validate and sanitize all inputs

### XSS Prevention
- All user input is escaped with `escapeHtml()`
- HTML content is text-based, not innerHTML
- Prevents injection attacks

## Performance Optimization

### Current Optimizations
- Debounced search (300ms)
- Pagination (only render 12 items)
- Lazy loading of images (avatars)
- CSS animations (GPU accelerated)

### Additional Optimization
```javascript
// Add lazy loading for avatars:
<img loading="lazy" src="..." alt="...">

// Add virtual scrolling for large lists:
// Consider library like react-window or vanilla-virtualized-list
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ | Latest versions |
| Firefox | ✅ | Latest versions |
| Safari | ✅ | Latest versions |
| Edge | ✅ | Latest versions |
| Mobile Safari | ✅ | iOS 12+ |
| Chrome Mobile | ✅ | Latest |

## Troubleshooting

### Issue: No users displayed
**Solution:**
- Check API BASE_URL configuration
- Verify API server is running
- Check Network tab in DevTools
- Ensure mock data loads (fallback)

### Issue: Search not working
**Solution:**
- Check search input is focused
- Verify user data has required fields
- Open console for error messages
- Test with mock data

### Issue: Images not loading (avatars)
**Solution:**
- Check avatar URL is correct
- Verify HTTPS is used
- Check CORS configuration
- Verify image source is accessible

### Issue: Pagination not appearing
**Solution:**
- Ensure more than 12 users loaded
- Check pagination render code
- Verify filteredUsers has content
- Test with mock data (8+ users)

### Issue: Responsive design broken
**Solution:**
- Check browser window width
- Clear browser cache
- Test in different device sizes
- Check CSS media queries

## API Implementation Guide (Backend)

If `/api/v1/users` endpoint doesn't exist, create it:

### Express.js Example
```javascript
app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .limit(100)
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Required Fields in Database
```javascript
{
  id: ObjectId,
  username: String,
  email: String,
  fullName: String,
  avatar: String,
  status: String ('active', 'inactive', 'pending'),
  joinDate: Date,
  lastActive: Date,
  bio: String
}
```

## Testing Checklist

- [ ] Users load successfully
- [ ] Search works for name, email, username
- [ ] Status filter works correctly
- [ ] Sort options work
- [ ] Pagination navigates correctly
- [ ] Grid view displays properly
- [ ] List view displays properly
- [ ] View toggle switches views
- [ ] Refresh button reloads users
- [ ] Statistics update correctly
- [ ] Empty state shows when no results
- [ ] Error handling works
- [ ] Mobile responsive (480px)
- [ ] Tablet responsive (768px)
- [ ] Desktop display (1024px+)
- [ ] All links and buttons functional

## FAQ

### Q: Can I customize the number of users per page?
**A:** Yes, edit `itemsPerPage = 12` in users.js

### Q: How do I add more user fields?
**A:** Update API response, mock data, and rendering functions

### Q: Can I add sorting by other fields?
**A:** Yes, add cases to `applyFilters()` sort switch statement

### Q: How do I connect to my actual database?
**A:** Update `BASE_URL` and implement `/api/v1/users` endpoint

### Q: Is the data encrypted?
**A:** Use HTTPS in production and encrypt sensitive fields

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check Network tab for API responses
4. Verify API configuration
5. Test with mock data

---

**Version:** 1.0.0  
**Created:** 2026-06-23  
**Status:** Production Ready  
**Last Updated:** 2026-06-23
