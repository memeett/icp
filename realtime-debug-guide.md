# Real-time Debugging Guide 🔍

## Step 1: Check Supabase Realtime Setup

### ⚠️ CRITICAL: Enable Realtime First
```sql
-- Jalankan di Supabase SQL Editor:
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Verify dengan query ini:
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Should return: public | messages
```

## Step 2: Check Console Logs

### Saat buka chat room, harus ada logs ini:
```javascript
🔔 Setting up real-time subscription for room: [room-id]
🔔 ChatService: Setting up subscription for room: [room-id]
🔔 Supabase client: [client-object]
🔔 Channel name: messages_[room-id]
📡 Subscription object created: [channel-object]

// After 2 seconds:
📡 Channel state after 2s: [should be "joined" or "subscribed"]

// Status changes:
📡 Subscription status changed: SUBSCRIBED ✅
// or
📡 Subscription status changed: CHANNEL_ERROR ❌
```

## Step 3: Manual Testing

### Setelah buka chat, jalankan di console:
```javascript
// 1. Check if debug methods available
console.log(window.chatDebug);

// 2. Test realtime connection
window.chatDebug.testRealtime();

// 3. Test manual message sending
window.chatDebug.testSend();
```

## Step 4: Expected Results

### ✅ If Working:
```javascript
// When you send message:
🧪 Test sending message manually...
🧪 Test message sent: { id: "msg-123", content: "Test message...", ... }

// Immediately after (realtime):
🔥 REALTIME EVENT RECEIVED!
🔥 ChatService: Raw payload received: { eventType: "INSERT", new: {...} }
📨 Real-time message received: { ... }
✅ Adding new message to state: msg-123
```

### ❌ If NOT Working:
```javascript
// Missing realtime enable:
📡 Subscription status changed: CHANNEL_ERROR
❌ Channel error - realtime might not be enabled

// Connection issues:
⏰ Subscription timed out
🔌 Subscription closed

// No realtime events:
🧪 Test message sent: { ... }
// But no "🔥 REALTIME EVENT RECEIVED!" after
```

## Step 5: Common Issues & Solutions

### Issue 1: No Subscription Logs
**Problem:** No logs starting with "🔔 Setting up real-time subscription"
**Solution:** Room not selected properly, check ContactList

### Issue 2: CHANNEL_ERROR Status
**Problem:** `📡 Subscription status changed: CHANNEL_ERROR`
**Solution:** Realtime not enabled, run the SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

### Issue 3: TIMED_OUT Status
**Problem:** `⏰ Subscription timed out`
**Solution:** Network issues or Supabase connection problems

### Issue 4: Messages Send But No Realtime
**Problem:** `🧪 Test message sent` but no `🔥 REALTIME EVENT RECEIVED!`
**Solution:** Filter mismatch or table not in publication

### Issue 5: Duplicate Prevention
**Problem:** `🔄 Duplicate message ignored`
**Solution:** This is normal - means realtime is working but preventing duplicates

## Step 6: Advanced Debugging

### Check Supabase Dashboard:
1. Go to Database > Publications
2. Check if "supabase_realtime" includes "messages" table
3. Go to Database > Replication and check status

### Check Network:
1. Open DevTools > Network
2. Look for WebSocket connections to Supabase
3. Should see ws://... connections established

### Check Environment:
```javascript
// In console:
console.log('SUPABASE URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('SUPABASE KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
```

## Step 7: Complete Test Flow

1. **Enable realtime** (SQL)
2. **Open chat room** (check subscription logs)
3. **Test manual send** (`window.chatDebug.testSend()`)
4. **Verify realtime receive** (check for 🔥 logs)
5. **Test UI send** (type and click send)
6. **Open 2nd browser/tab** (different user)
7. **Send from tab 1** → **should appear in tab 2 instantly**

---

## 🎯 Quick Checklist:

- [ ] SQL realtime enabled in Supabase
- [ ] Console shows subscription setup logs
- [ ] Status shows "SUBSCRIBED" 
- [ ] `window.chatDebug.testSend()` works
- [ ] Realtime events show "🔥 REALTIME EVENT RECEIVED!"
- [ ] Messages appear without refresh

**Test this step by step dan share console logs untuk setiap step! 🎯**

