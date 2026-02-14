# System Design: Commit Life Architecture v1.0

> **Role**: Staff Engineer (Scalability & Optimization Focus)
> **Goal**: Design a performant, cost-effective, and scalable system for a gamified habit tracker deployed on a single DigitalOcean Droplet via Docker.

---

## 1. High-Level Architecture (Containerized Monolith)
We are adopting a **Containerized Monolith** pattern using Next.js (App Router). This minimizes operational complexity (only one deployment unit) while leveraging Next.js's built-in optimization features (Server Components, Partial Prerendering).

### Diagram
```
[Client (Browser)] 
       │ HTTPS (SSL)
       ▼
[Nginx Reverse Proxy (Container)]  <-- Rate Limiting, SSL Termination, Static Asset Caching
       │ HTTP
       ▼
[Next.js App Server (Container)]   <-- Logic, Server Actions, Auth
       │ TCP (Port 5432)
       ▼
[PostgreSQL Database (Container)]  <-- Persistent Storage
```

---

## 2. Database Design (Optimized for Reads)
The application is **read-heavy** (Dashboards, Stats). Writes happen only when a user commits a habit or updates settings.

### Schema Improvements (Prisma)
We will add indexes to support frequent queries.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  isPremium     Boolean   @default(false)
  
  // Optimization: Relation count for fast "Freemium Check"
  pillarCount   Int       @default(0) 

  pillars       Pillar[]
}

model Pillar {
  id            String   @id @default(cuid())
  userId        String
  
  // Composite Index for Dashboard Fetching
  // Fetching all pillars for a user sort by creation date
  @@index([userId, createdAt])
}

model Habit {
  id            String   @id @default(cuid())
  pillarId      String
  
  // Index for fetching habits by pillar
  @@index([pillarId])
}
```

### Connection Pooling
**Crucial for Scale**: Since we are using Server Actions (lambda-like execution), database connections can be exhausted quickly.
- **Solution**: Use `pgbouncer` (if load increases) or strict connection limits in Prisma.
- **Config**: Set `connection_limit=10` in Docker Compose for the app to prevent PG overload.

---

## 3. API Design (Server Actions)
We will use **Server Actions** exclusively for data mutation to ensure type safety and reduced client bundle size.

### Pattern: Optimistic UI
For gamification to feel "snappy," we must update the UI *before* the server responds.

**Example: Committing a Habit**
1. **Client**: User clicks "Commit".
2. **UI**: Immediately shows "Done", plays animation, updates XP bar (Optimistic Update).
3. **Server Action**:
   - Verify ownership.
   - Update `Habit` (set `completedToday = true`).
   - Calculate new XP.
   - Update `Pet` and `Pillar` stats transactionally (`prisma.$transaction`).
   - Revalidate path `/pillars/[id]` to sync server state.

### Transactional Integrity
Critical for the "Commit" loop. We cannot have a state where the Habit is marked done but the Pet didn't get XP.
**Requirement**: All commit logic MUST be wrapped in `prisma.$transaction`.

---

## 4. Deployment Strategy (Docker)
We maximize the $15/mo droplet by using Docker Compose.

### Docker Optimization
- **Multi-stage Build**: Already implemented (keeps image small, ~100MB).
- **Node Environment**: `NODE_ENV=production` ensures optimized React builds.
- **Health Checks**: Add `healthcheck` to `docker-compose.yml` to auto-restart unhealthy containers.
- **Restart Policy**: `restart: unless-stopped`.

### Volume Management
- **Database**: `pgdata` volume to persist data across container restarts.
- **Backups**: A simple cron job on the host machine to `pg_dump` the database daily to DO Spaces (Object Storage) or local disk.

---

## 5. Security & Scalability
- **NextAuth**: Session-based, stateless (JWT). No database hit required for *every* request if we store critical flags (like `isPremium`) in the JWT token.
- **Rate Limiting**: Nginx configuration to limit requests per IP (prevent abuse).

## 6. Future Proofing (When we hit 10k users)
1. **Cache Layer**: Introduce Redis for caching dashboard data.
2. **Read Replicas**: Separate PG instance for reads if analytics become heavy.
3. **CDN**: Cloudflare in front of the Droplet for static assets/images.

---
### Action Plan
1. **Refine Prisma Schema**: Add the indexes mentioned above.
2. **Implement Transactional Logic**: Rewrite `commitHabit` to use `$transaction`.
3. **Optimistic UI**: Ensure the frontend reflects changes instantly.
