# Module 4 — Project Showcase & Developer Feed

## Schema relationships

```
User (1) ──creates──▶ (N) Project
User (N) ◀──likes──▶ (N) Project     [likes array on Project]
User (N) ──savedProjects──▶ (N) Project  [ObjectId refs on User]
User (1) ──writes──▶ (N) Comment ──belongs to──▶ Project
```

- **Project.likes**: array of user IDs (toggle like/unlike)
- **User.savedProjects**: bookmark list (toggle save)
- **Comment**: separate collection for scalability vs embedding

## API routes

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/projects/create` | Yes |
| GET | `/api/projects/all` | Optional |
| GET | `/api/projects/saved` | Yes |
| GET | `/api/projects/:id` | Optional |
| PUT | `/api/projects/update/:id` | Owner |
| DELETE | `/api/projects/:id` | Owner |
| POST | `/api/projects/like/:id` | Yes |
| POST | `/api/projects/save/:id` | Yes |
| POST | `/api/projects/comment/:id` | Yes |
| GET | `/api/projects/:id/comments` | Public |
| PUT | `/api/projects/comments/:commentId` | Author |
| DELETE | `/api/projects/comments/:commentId` | Author |

## Likes & comments architecture

**Likes**: Stored on the project document as `likes: [userId]`. Toggle = `$push` / `$pull` equivalent in app code. `likesCount = likes.length` in aggregation.

**Comments**: Separate `Comment` collection with `project` + `user` refs. Count via `$lookup` in feed aggregation or `countDocuments` on detail page.

**Saves**: `User.savedProjects` array — toggle adds/removes project ObjectId.

## Pagination & sorting

- Query: `page`, `limit` (max 30)
- `sort=latest` → `createdAt` desc
- `sort=liked` → `likesCount` desc
- `sort=trending` → `likes / (hoursSinceCreated + 2)^1.5`

Frontend uses **infinite scroll** via `IntersectionObserver` on a sentinel element.

## Frontend state management

- **Feed**: local `projects` array; optimistic updates for like/save on card
- **ToastContext**: global success/error toasts
- **No Redux**: React `useState` + service layer (matches existing auth pattern)

## Interview questions

**Q: Why store likes on the project vs a separate Like collection?**  
A: For moderate scale, an array of user IDs is simple and fast to read. A separate collection scales better for millions of likes but adds joins.

**Q: How does trending work?**  
A: Score = likes divided by time decay so new posts with engagement can rank above old posts with many likes.

**Q: How do you secure update/delete?**  
A: Compare `project.createdBy` to `req.user._id`; return 403 if mismatch.

**Q: Why multipart for create?**  
A: Thumbnail file + JSON fields in one request; Multer parses `thumbnail` field, body fields as strings.

**Q: How does infinite scroll work?**  
A: IntersectionObserver fires when sentinel enters viewport → fetch `page + 1` → append to state until `hasMore` is false.
