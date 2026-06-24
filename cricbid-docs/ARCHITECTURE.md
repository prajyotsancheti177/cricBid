# CricBid — Architecture Overview (Current State)

---

## System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │              CLIENTS                     │
                    │                                          │
                    │  Browser (Web App)   OBS Browser Source  │
                    │  React + TypeScript  (Overlay pages)     │
                    └──────────────┬──────────────────────────┘
                                   │
                           HTTPS + WSS (Socket.IO)
                                   │
                    ┌──────────────▼──────────────────────────┐
                    │           BACKEND (Node.js)              │
                    │                                          │
                    │  Express REST API (/api/*)               │
                    │  Socket.IO  (/auction namespace)         │
                    │  In-Memory Auction State Manager         │
                    └──────┬──────────────────┬───────────────┘
                           │                  │
               ┌───────────▼───┐    ┌────────▼──────────────┐
               │   MongoDB      │    │  External Services     │
               │                │    │                        │
               │  - users       │    │  Meta WhatsApp API     │
               │  - tournaments │    │  Google Sheets API     │
               │  - players     │    │  AWS S3 (file uploads) │
               │  - teams       │    │  ipapi.co (geo)        │
               │  - auctionlogs │    └────────────────────────┘
               │  - whatsapplogs│
               │  - userevents  │
               │  - sessions    │
               │  - ipgeocache  │
               └───────────────┘
```

---

## Frontend Architecture

```
src/
├── pages/          # Route-level components (21 pages)
├── components/
│   ├── ui/         # shadcn/Radix primitives (60+ components)
│   ├── auction/    # Auction-specific components
│   ├── player/     # Player components
│   ├── team/       # Team components
│   └── layout/     # Navbar
├── hooks/
│   ├── useAuctionSocket.ts   # Main auction socket logic
│   └── useOverlaySocket.ts   # Read-only overlay socket
├── lib/
│   ├── socket.ts             # Socket.IO singleton
│   ├── eventTracker.ts       # Analytics helper
│   ├── auctionSounds.ts      # Audio feedback
│   ├── exportTeamsPdf.ts     # PDF generation
│   └── imageUtils.ts         # Image compression + Google Drive URLs
├── config/
│   └── apiConfig.ts          # API base URL from env
└── types/
    └── auction.ts            # TypeScript interfaces
```

**State Strategy:**
- Server data → TanStack React Query (caching + refetch)
- Real-time auction → Socket.IO (direct state from server)
- Auth → localStorage (`user`, `isAuthenticated`)
- No global state manager (no Redux/Zustand)

---

## Backend Architecture

```
server/
├── routes/         # Express route definitions
├── controller/     # HTTP request handlers (thin layer)
├── services/       # Business logic
│   ├── auctionStateManager.js   # In-memory auction state
│   ├── auctionService.js
│   ├── playerService.js
│   ├── teamService.js
│   ├── tournamentService.js
│   ├── userService.js
│   ├── whatsappService.js
│   ├── eventService.js
│   ├── auctionLogService.js
│   ├── auctionRoomSessionService.js
│   └── geoService.js
├── models/         # Mongoose schemas
├── sockets/        # Socket.IO event handlers
├── utils/
│   ├── authMiddleware.js    # userId header check
│   ├── uploadMiddleware.js  # Multer + S3
│   └── googleService.js    # Google Sheets
└── config/         # Environment variables
```

---

## Real-time Auction Flow

```
Auctioneer                    Server                    Viewers
    │                            │                          │
    │── auction:join ──────────► │ ◄──── auction:join ──────│
    │                            │─── auction:state ───────►│
    │                            │─── auction:role ────────►│
    │                            │   (auctioneer / viewer)  │
    │── auction:start ─────────► │                          │
    │                            │─── auction:state ───────►│ (all)
    │── auction:selectPlayer ──► │                          │
    │                            │─── auction:playerSelected►│ (all)
    │── auction:bid ───────────► │                          │
    │                            │─── auction:bidPlaced ───►│ (all)
    │   (repeat bids)            │─── auction:state ───────►│ (all)
    │── auction:sold ──────────► │                          │
    │                            │── DB: mark player sold   │
    │                            │── DB: save auction log   │
    │                            │── WhatsApp: notify ─────►│ (player's phone)
    │                            │─── auction:sold ────────►│ (all)
    │                            │─── auction:state ───────►│ (all)
```

---

## Authentication Flow (Current — Weak)

```
Client                          Server
  │                                │
  │── POST /api/user/login ───────►│
  │   { email, password }          │── bcrypt.compare ──► password check
  │                                │── return user object (no token)
  │◄─ { user: { _id, role... } } ──│
  │                                │
  │   Store in localStorage        │
  │                                │
  │── POST /api/protected ────────►│
  │   body: { userId: "..." }      │── authMiddleware: check userId exists in DB
  │◄─ response ────────────────────│
```

**Problem:** No JWT token. Any request with a valid userId string passes auth. No expiry, no signing.

---

## File Upload Flow

```
Client ──► POST /api/player/register-public
           multipart/form-data (photo field)
                │
                ▼
           uploadMiddleware (Multer)
                │
                ├── if AWS_BUCKET_NAME set ──► S3 upload ──► S3 URL
                └── else ──────────────────► local /uploads/ ──► /uploads/filename URL
```

---

## WhatsApp Integration Flow

```
Auction: player sold
    │
    ▼
Socket: auction:sold event
    │
    ▼
Backend: whatsappService.sendPlayerSoldNotification()
    │
    ├── Format mobile: ensure country code
    ├── POST to Meta API v22.0 (template: 'sold_message')
    │   Params: player name, team name, amount, tournament
    └── Log result to whatsappLog collection (success/failed)
```

---

## Key Architectural Concerns for v2

| Concern | Current | Target v2 |
|---------|---------|-----------|
| Database | MongoDB (schemaless) | PostgreSQL (relational, typed) |
| Auth | Plain userId in body | JWT with expiry + refresh token |
| Repos | 2 separate repos | Monorepo (turborepo / nx) |
| Auction state | In-memory (volatile) | Redis or DB-backed (persistent) |
| API style | All POST | REST (GET/POST/PUT/DELETE) |
| Mobile | Not optimized | Mobile-first UI + PWA / React Native |
| File hosting | S3 / local mixed | Always S3 (or Cloudflare R2) |
| CORS | Allow all origins | Whitelist specific origins |
| Rate limiting | None | express-rate-limit on public endpoints |
