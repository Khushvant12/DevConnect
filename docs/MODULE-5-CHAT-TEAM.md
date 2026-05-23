# Module 5 — Real-Time Chat & Team Collaboration

## Schema relationships

```
User ──sends──▶ Message ◀──receives── User
         conversationId = sorted(userA, userB)

User ──sends──▶ TeamRequest ──▶ User (receiver)
                    └──optional──▶ Project

User ──receives──▶ Notification (message, team_request, project_like, ...)
```

## Socket.IO architecture

1. HTTP server creates Socket.IO on same port (5000).
2. Client connects with `auth: { token: JWT }`.
3. Middleware verifies JWT → attaches `socket.userId`.
4. User joins room `user:{userId}` for direct pushes.
5. Private chat uses room `chat:{sortedIdA_idB}`.

## Real-time events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `user_online` / `user_offline` | S→C | Presence |
| `online_users` | S→C | Initial online list |
| `join_chat` / `leave_chat` | C→S | Enter private room |
| `send_message` | C→S | Persist + deliver |
| `receive_message` | S→C | New message payload |
| `typing` / `stop_typing` | C↔S | Typing indicator |
| `message_read` / `messages_read` | C↔S | Read receipts |
| `new_notification` | S→C | Push notification + count |

## Message persistence flow

1. Client emits `send_message` with ack callback.
2. Server saves `Message` to MongoDB.
3. Server emits `receive_message` to chat room + receiver user room.
4. Creates `Notification` for receiver.
5. REST fallback: `POST /api/messages/send`.

## Pagination

`GET /api/messages/:userId?page=1&limit=30` — newest page first, reversed for chronological UI. Scroll up loads `page+1`.

## Team requests API

| Method | Route |
|--------|-------|
| POST | `/api/team-requests/send` |
| GET | `/api/team-requests/incoming` |
| GET | `/api/team-requests/outgoing` |
| PUT | `/api/team-requests/:id/accept` |
| PUT | `/api/team-requests/:id/reject` |
| DELETE | `/api/team-requests/:id/cancel` |

## Interview questions

**Q: Why Socket.IO over raw WebSockets?**  
A: Built-in rooms, reconnection, fallbacks to polling, and ack callbacks for reliable delivery.

**Q: How do private rooms work?**  
A: Room name derived from sorted user IDs so both users join the same room regardless of who initiated.

**Q: How do you track online users?**  
A: In-memory `Map<userId, Set<socketId>>` on server; also update MongoDB `isOnline` for REST profile views.

**Q: How are notifications delivered in real time?**  
A: `createNotification()` saves to DB then `io.to(user:{id}).emit('new_notification')`.

**Q: How do you avoid duplicate messages in UI?**  
A: Check `message._id` before appending to state; socket + REST fallback guarded.

## Manual test checklist

- [ ] Two users logged in (two browsers / incognito)
- [ ] Send message → instant delivery
- [ ] Typing indicator appears
- [ ] Online green dot on sidebar
- [ ] Unread badge on conversation
- [ ] Notification bell on like/comment/message
- [ ] Send team request → accept → chat link works
- [ ] Reject / cancel request
