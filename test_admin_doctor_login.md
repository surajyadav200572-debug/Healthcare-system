# Test Admin/Doctor Login

## Current Status:
- ✅ Backend: http://localhost:4000
- ✅ User Frontend: http://localhost:5173 
- ✅ Admin Panel: http://localhost:5174

## Test Steps:

### 1. Test Admin Login:
1. Go to: http://localhost:5173/login
2. Click: "Admin Login" button
3. Enter:
   - Email: prescripto7208@gmail.com
   - Password: surajyadav123
4. Click: "Login as Admin"
5. **Should redirect to**: http://localhost:5174 (Admin Dashboard)

### 2. Test Doctor Login:
1. Go to: http://localhost:5173/login
2. Click: "Doctor Login" button
3. Enter doctor credentials
4. Click: "Login as Doctor"
5. **Should redirect to**: http://localhost:5174 (Doctor Dashboard)

## If Not Working:
1. Check browser console (F12) for errors
2. Check if tokens are being saved in localStorage
3. Check if admin panel (5174) is responding

## Debug Info Added:
- Admin App.jsx now logs token status to console
- Check console for "App.jsx - aToken/dToken" messages

## Troubleshooting:
- If redirect doesn't work: Clear localStorage and try again
- If 5174 not accessible: Restart admin panel server
- If login fails: Check backend logs