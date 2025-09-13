# Chat Debugging Checklist 🔍

## Debugging Yang Sudah Ditambahkan:

### 1. ChatWindow Component Debug Logs:
```javascript
// Render state debug
🪟 ChatWindow render - selectedContact: [contact-id], currentRoom: [room-id]
🪟 Full state debug: { selectedContact, currentRoom, user, messages, sending }

// Empty state check
🔍 ChatWindow empty check - selectedContact: true/false, currentRoom: true/false
❌ ChatWindow showing empty state - missing selectedContact or currentRoom

// Button interactions
🔵 Send button clicked!
🔴 handleSend called { photoPreview, newMessage, sending, hasCurrentRoom, hasUser }
🚀 Calling sendMessage from ChatWindow
📨 sendMessage result: true/false

// Input interactions
⌨️ Input changed: [user-typed-text]
```

### 2. useChat Hook Debug Logs:
```javascript
// Message sending
📤 Sending message: { roomId, senderId, content }
🏠 useChat - currentRoom changed: [room-id]
🔄 useChat - setCurrentRoom called with: [room-id]
```

### 3. ChatService Debug Logs:
```javascript
// Service calls
📨 ChatService.sendMessage called with: { roomId, senderId, content, messageType, fileData }
✅ Message sent successfully: [message-id]
❌ Error sending message: [error-details]
```

## Step-by-Step Testing:

### Step 1: Check if Chat Window Shows
1. Open browser console
2. Click on a contact in chat list
3. Look for these logs:
   ```
   🪟 ChatWindow render - selectedContact: room-123, currentRoom: room-123
   🪟 Full state debug: { selectedContact: "room-123", currentRoom: {...}, user: "user-456", messages: 0, sending: false }
   ```

**Expected:** Both selectedContact and currentRoom should have values
**If not:** State management issue between ContactList and ChatWindow

### Step 2: Check if Input Works
1. Type in the message input
2. Look for:
   ```
   ⌨️ Input changed: hello
   ⌨️ Input changed: hello world
   ```

**Expected:** Input should log every keystroke
**If not:** Input event handler not connected

### Step 3: Check Button Click
1. Type a message
2. Click "Send" button
3. Look for:
   ```
   🔵 Send button clicked!
   🔴 handleSend called { photoPreview: false, newMessage: "hello", sending: false, hasCurrentRoom: true, hasUser: true }
   ```

**Expected:** Button should trigger handleSend
**If not:** Button onClick handler issue

### Step 4: Check Message Sending
1. After button click, look for:
   ```
   🚀 Calling sendMessage from ChatWindow
   📤 Sending message: { roomId: "room-123", senderId: "user-456", content: "hello" }
   📨 ChatService.sendMessage called with: { roomId: "room-123", senderId: "user-456", content: "hello", messageType: "text" }
   ✅ Message sent successfully: message-789
   📨 sendMessage result: true
   ```

**Expected:** Complete flow from UI to backend
**If stops somewhere:** Check the last successful log to identify issue

## Common Issues & Solutions:

### Issue 1: "Empty state showing"
**Debug logs:** `❌ ChatWindow showing empty state`
**Cause:** selectedContact or currentRoom is null
**Solution:** Check ContactList contact selection

### Issue 2: "Button not clickable"
**Debug logs:** No `🔵 Send button clicked!`
**Cause:** Button disabled or onClick not attached
**Solution:** Check button disabled condition

### Issue 3: "Message not sending"
**Debug logs:** `🔴 handleSend called` but no `📤 Sending message`
**Cause:** Validation failed (empty message, no room, etc.)
**Solution:** Check validation conditions

### Issue 4: "Backend error"
**Debug logs:** `❌ Error sending message`
**Cause:** Supabase connection or table issues
**Solution:** Check Supabase setup and tables

## Quick Fix Commands:

### If Supabase tables missing:
```sql
-- Run in Supabase SQL Editor
-- Copy & paste from chat_enhanced_setup.sql
```

### If environment variables missing:
```bash
# Check .env file has:
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
```

### If state management broken:
```javascript
// Check browser console for:
🏠 useChat - currentRoom changed: [should-show-room-id]
🔄 useChat - setCurrentRoom called with: [should-show-room-id]
```

## Test in Order:
1. ✅ Contact selection (should show room)
2. ✅ Input typing (should log keystrokes) 
3. ✅ Button click (should trigger handleSend)
4. ✅ Message sending (should complete flow)
5. ✅ Real-time update (should see message appear)

**Jalankan test ini dan lihat console logs untuk mengidentifikasi di mana masalahnya! 🎯**

