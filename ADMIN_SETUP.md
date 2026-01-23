# Admin Authentication System - Setup & Usage

## Overview
This admin panel is now protected with a secure 6-digit PIN authentication system with automatic session management and activity logging.

## 🔐 Security Features

### 1. **6-Digit PIN Authentication**
- Default PIN: `123456` (change in production)
- Secure PIN input interface with visual feedback
- Auto-focus and keyboard navigation support
- PIN masking/show toggle option

### 2. **Session Management**
- **30-minute auto-logout** on inactivity
- Real-time session timer display
- Activity monitoring (mouse, keyboard, touch, scroll)
- Session persistence across page refreshes

### 3. **Protected Routes**
- All admin routes require authentication
- Automatic redirect to login if not authenticated
- Loading states during authentication checks

### 4. **Activity Logging**
- All admin actions are logged with timestamps
- Tracks tab changes, product operations, and user actions
- Includes user agent and activity details
- Console logging (extend to backend in production)

## 🚀 Quick Start

### Access the Admin Panel
1. Navigate to `http://localhost:8082/admin`
2. Enter the 6-digit PIN: `123456`
3. Click "Access Admin Panel"

### Session Features
- **Session Timer**: Shows remaining time in header (turns red when < 5 minutes)
- **Auto-Logout**: Automatically logs out after 30 minutes of inactivity
- **Manual Logout**: Click the red "Logout" button in the header
- **Activity Reset**: Any user interaction resets the session timer

## 📁 File Structure

```
src/
├── contexts/
│   └── AdminAuthContext.tsx     # Authentication state & logic
├── components/admin/
│   ├── AdminAuth.tsx           # PIN input interface
│   ├── ProtectedRoute.tsx      # Route protection wrapper
│   └── index.ts                # Admin exports
├── pages/
│   └── Admin.tsx               # Enhanced admin panel
└── App.tsx                     # Updated routing with protection
```

## 🔧 Configuration

### Change Default PIN
Edit `src/contexts/AdminAuthContext.tsx`:
```typescript
const ADMIN_PIN = '123456'; // Change to your secure PIN
```

### Adjust Session Duration
Edit `src/contexts/AdminAuthContext.tsx`:
```typescript
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
```

## 🛡️ Security Best Practices

### For Production
1. **Change the default PIN** to a secure 6-digit code
2. **Implement backend authentication** instead of client-side PIN
3. **Add rate limiting** for login attempts
4. **Store activity logs** in a secure database
5. **Add IP whitelisting** for admin access
6. **Enable HTTPS** for secure communication

### Activity Monitoring
The system logs:
- Login attempts (success/failure)
- Tab navigation changes
- Product creation/editing/deletion
- Order status updates
- Logout events

## 🎯 User Interface

### Login Screen Features
- Elegant gradient background with security theme
- 6-digit PIN input with individual boxes
- Show/hide PIN toggle
- Paste support for quick PIN entry
- Auto-focus management
- Error handling with clear messages
- "Back to Store" navigation

### Admin Panel Enhancements
- **Session Timer**: Real-time countdown in header
- **Logout Button**: Prominent red logout button
- **Activity Tracking**: Automatic logging of all actions
- **Responsive Design**: Works on all device sizes

## 🔍 Troubleshooting

### Common Issues

1. **Can't access admin panel**
   - Check if the development server is running
   - Ensure you're using the correct URL: `/admin`
   - Verify PIN is correct: `123456`

2. **Session expires too quickly**
   - Check browser console for activity monitoring
   - Ensure you're interacting with the page
   - Verify no browser extensions are blocking events

3. **PIN not working**
   - Ensure you're entering exactly 6 digits
   - Check if CAPS LOCK is on (shouldn't matter for numbers)
   - Try refreshing the page and re-entering PIN

### Development Notes
- Authentication state is stored in `localStorage`
- Session timestamp is persisted across page refreshes
- All admin activities are logged to browser console
- The system is designed to be extended with backend authentication

## 🚀 Next Steps

### Production Enhancements
1. **Backend Integration**: Replace client-side PIN with JWT tokens
2. **Multi-factor Authentication**: Add 2FA for enhanced security
3. **Role-based Access**: Different permission levels for different users
4. **Audit Dashboard**: Visual interface for activity logs
5. **Security Headers**: Implement CSP, HSTS, and other security headers

### Additional Features
1. **Remember Me**: Option for extended sessions
2. **Concurrent Sessions**: Limit number of active admin sessions
3. **IP Restrictions**: Allow only specific IP ranges
4. **Email Notifications**: Alert on suspicious activities

## 📞 Support

For any issues or questions about the admin authentication system:
1. Check the browser console for error messages
2. Verify all files are correctly placed
3. Ensure the development server is running properly
4. Review the configuration settings above

---

**⚠️ Important**: This is a client-side authentication system suitable for development and demonstration. For production use, implement proper backend authentication with secure token management.
