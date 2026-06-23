# Users Directory - Quick Start & Testing Guide

## 🚀 Quick Start (2 Minutes)

### 1. Access the Page
```
URL: /users.html
```

### 2. Configure API (Optional)
File: `assets/js/users.js` (Line 4)
```javascript
BASE_URL: 'http://localhost:3002'  // Update if needed
```

### 3. View Users
- Page loads automatically with mock data
- 8 sample users shown by default
- Ready to switch to real API

---

## 📋 Features Checklist

### Search & Filter ✅
- [ ] Search by name (type "john")
- [ ] Search by email (type "gmail")
- [ ] Search by username (type "@jane")
- [ ] Filter by status (Active/Inactive/Pending)
- [ ] Sort by name (A-Z, Z-A)
- [ ] Sort by recent/oldest

### Views ✅
- [ ] Grid view (card layout)
- [ ] List view (table layout)
- [ ] Toggle between views
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### Statistics ✅
- [ ] Total users count
- [ ] Active users count
- [ ] Inactive users count
- [ ] Stats update on filter

### Actions ✅
- [ ] View profile button
- [ ] Send message button
- [ ] Refresh button
- [ ] Pagination navigation

### User Interface ✅
- [ ] Status badges (color-coded)
- [ ] Avatar images
- [ ] User info (email, joined date)
- [ ] Empty state message
- [ ] Loading spinner
- [ ] Error message display

---

## 🧪 Test Scenarios

### Test 1: Basic Display
1. Open `/users.html`
2. Should see 8 mock users
3. Grid view by default
4. Statistics showing: Total 8, Active 5, Inactive 2

### Test 2: Search Functionality
1. Type "john" in search → 1 result (John Doe)
2. Clear and type "gmail" → 0 results
3. Clear and type "Okeke" → 1 result
4. Clear search → All 8 users back

### Test 3: Status Filter
1. Select "Active" → Shows 5 users
2. Select "Inactive" → Shows 2 users
3. Select "Pending" → Shows 1 user
4. Select "All Status" → Shows 8 users

### Test 4: Sorting
1. Sort "Name (A-Z)" → Users A-Z alphabetically
2. Sort "Name (Z-A)" → Users Z-A alphabetically
3. Sort "Oldest First" → Oldest joined first
4. Sort "Most Recent" → Recently joined first

### Test 5: View Toggle
1. Click grid icon → Grid view active
2. Click list icon → List view active
3. Switch back to grid
4. Verify data persists between views

### Test 6: Pagination
1. Create search that returns >12 items
2. Navigate to page 2 (if available)
3. Verify different users shown
4. Verify page indicator updates

### Test 7: Refresh Button
1. Click refresh button
2. Should show spinning animation
3. Users reload
4. Stats update

### Test 8: User Actions
1. Click view icon on any user
2. Should show alert with user info
3. Click message icon
4. Should remain on page (ready for implementation)

---

## 📊 Data Structure

### User Object
```json
{
  "id": "1",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "status": "active",
  "joinDate": "2024-01-15",
  "lastActive": "2026-06-23",
  "bio": "Software Developer & Tech Enthusiast"
}
```

### Mock Users Included
1. **John Doe** - john@example.com - Active
2. **Jane Smith** - jane@example.com - Active
3. **Okeke Festus** - Okekefestus@gmail.com - Active
4. **Mike Wilson** - mike@example.com - Inactive
5. **Sarah Jones** - sarah@example.com - Active
6. **David Brown** - david@example.com - Pending
7. **Emma Davis** - emma@example.com - Active
8. **Tom Miller** - tom@example.com - Inactive

---

## 🔧 Configuration

### API URL
**File:** `assets/js/users.js` (Line 4)

Change from:
```javascript
BASE_URL: 'http://localhost:3002'
```

To your API server:
```javascript
BASE_URL: 'https://api.interchat.com'  // Production
```

### Items Per Page
**File:** `assets/js/users.js` (Line 13)

```javascript
let itemsPerPage = 12;  // Change to desired number
```

### Mock Data
**File:** `assets/js/users.js` (Function: `getMockUsers()`)

Returns 8 sample users for testing and demo

---

## 📱 Responsive Design

### Desktop (1024px+)
- Grid: 3-4 columns
- Full table view
- All controls visible
- Side-by-side layout

### Tablet (768px - 1023px)
- Grid: 2 columns
- Compact table
- Stacked controls
- Optimized spacing

### Mobile (480px - 767px)
- Grid: 1 column
- Card-based table
- Stacked everything
- Touch-friendly buttons

### Small Mobile (<480px)
- Full width layout
- Single column grid
- Mobile table (custom format)
- Large touch targets

---

## 🎨 Styling Reference

### Colors
- **Active Status:** Green (#10b981)
- **Inactive Status:** Red (#ef4444)
- **Pending Status:** Orange (#f59e0b)
- **Primary:** Uses `var(--first-color)`
- **Text:** Uses `var(--title-color)` and `var(--text-color)`

### Status Badges
- Green background, dark green text = Active
- Red background, dark red text = Inactive
- Orange background, dark orange text = Pending

### View Icons
- Grid icon = Grid view button
- List icon = List view button
- Active button highlighted in blue

---

## 🐛 Troubleshooting

| Issue | Check | Solution |
|-------|-------|----------|
| No users shown | Browser console errors | Check API BASE_URL config |
| Users don't load | Network tab | Verify API server running |
| Search stuck | Filter values | Clear filters and refresh |
| Pagination missing | User count | Need >12 users for pagination |
| Mobile looks broken | Device width | Check browser device size |
| Stats wrong | Filter applied | Clear filters to see all stats |
| Images missing | Avatar URLs | Check image source is HTTPS |
| Slow performance | Item count | Reduce items per page or add pagination |

---

## 📝 Sample API Call

### Using cURL to test endpoint:
```bash
curl -X GET http://localhost:3002/api/v1/users \
  -H "Content-Type: application/json"
```

### Expected Response:
```json
[
  {
    "id": "1",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://...",
    "status": "active",
    "joinDate": "2024-01-15",
    "lastActive": "2026-06-23",
    "bio": "..."
  }
]
```

---

## ✅ Testing Checklist

### Functionality
- [ ] Users load on page open
- [ ] Search works real-time
- [ ] Filters update results
- [ ] Sorting works correctly
- [ ] Pagination navigates
- [ ] View toggle switches layout
- [ ] Statistics update
- [ ] Refresh reloads data
- [ ] Empty state shows when needed
- [ ] Error handling works

### Visual
- [ ] Grid layout looks good
- [ ] List layout looks good
- [ ] Status badges color-coded
- [ ] Avatars display correctly
- [ ] Hover effects work
- [ ] Buttons are clickable
- [ ] Typography is readable

### Responsive
- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1024px)
- [ ] No horizontal scroll
- [ ] Touch targets 44px+
- [ ] Text readable on small screens

### Performance
- [ ] Page loads quickly
- [ ] Search responsive
- [ ] Animations smooth
- [ ] No console errors
- [ ] Network requests efficient
- [ ] Memory usage reasonable

---

## 🎯 Next Steps

### For Testing
1. ✅ Page loads with mock data
2. ✅ Test search and filters
3. ✅ Test view switching
4. ✅ Test on different devices

### For Production
1. Implement `/api/v1/users` endpoint (if not exists)
2. Update `BASE_URL` in users.js
3. Test with real database data
4. Deploy to staging
5. Full QA testing
6. Deploy to production

---

## 📚 Related Files

- [users.html](./users.html) - Main page
- [assets/js/users.js](./assets/js/users.js) - Logic & API
- [assets/css/users.css](./assets/css/users.css) - Styling
- [USERS_DIRECTORY_GUIDE.md](./USERS_DIRECTORY_GUIDE.md) - Full documentation

---

**Status:** ✅ Ready for Testing & Deployment  
**Version:** 1.0.0  
**Last Updated:** 2026-06-23
