# CricBid — Product Requirements Document

**Version:** 1.0 (Current State Audit)
**Last Updated:** 2026-06-23

---

## 1. Product Overview

**CricBid** is a web platform for conducting live cricket (and other sport) auctions to form teams. It supports the full auction lifecycle — from team & player registration through live bidding to post-auction analytics — with real-time updates, WhatsApp notifications, and YouTube/OBS streaming overlays.

### Primary Users
| Role | Who | What They Do |
|------|-----|--------------|
| `boss` | Super admin | Full system access, creates super_users |
| `super_user` | Platform admin | Manages tournaments, creates hosts |
| `tournament_host` | Auction organizer | Runs their own tournaments |
| `guest` | Team owner / Player | Views auction, registers via public link |

### Core Value Props
1. Run a professional live auction with real-time bidding from any device
2. Broadcast the auction on YouTube via OBS overlays (no software needed)
3. Notify players & team owners automatically via WhatsApp
4. Manage registration, teams, players, and budgets in one place
5. Track analytics on every action

---

## 2. Feature Inventory

### 2.1 Authentication & User Management
- Email/password login
- Hierarchical user roles: boss → super_user → tournament_host
- Create / deactivate users under your hierarchy
- Role-based access control on all protected routes

### 2.2 Tournament Management
- Create / edit / delete tournaments
- Configure: number of teams, budget per team, players per team (min/max)
- Player categories with base prices (e.g., Icon @ ₹2000, Regular @ ₹500)
- Configurable bid increment slabs (e.g., ₹0–1000 → +100, ₹1000–5000 → +500)
- Registration form builder (standard + custom fields, toggle required/public)
- Google Sheets integration for player import/export

### 2.3 Player Management
- Register players individually or via bulk CSV upload
- Public registration form (shareable link, no login needed)
- Player fields: name, age, gender, mobile, email, photo, skill, address, category, custom fields
- Photo upload (S3 or local)
- Google Sheets sync — diff preview before applying
- Reset unsold players between auction sessions

### 2.4 Team Management
- Register teams individually or via bulk CSV upload
- Public team registration form (shareable link)
- Team fields: name, logo, owner name/email/mobile
- Budget tracking (total budget minus sold amounts)
- View team roster with all purchased players

### 2.5 Live Auction Room
- Real-time bidding via Socket.IO
- Two auction modes:
  - **Category Mode** — auto-fetches next random unsold player from selected category
  - **Manual Mode** — auctioneer manually selects player
- Bid increment slabs enforced automatically
- Actions: Select Player → Bid → Sold / Unsold → Next Player
- Undo last bid
- Live team budget panel (updates in real-time)
- Viewer count display
- Audio feedback (bid sound, sold sound, unsold sound)
- Celebration animation on sold, shake animation on unsold
- Auctioneer reconnection (same user rejoins as auctioneer)

### 2.6 OBS / YouTube Streaming Overlays
Three browser-source overlay layouts for OBS:
1. **Camera HUD** — Transparent lower-third panel (layered over camera)
2. **Fullscreen** — Full opaque display (standalone, no camera)
3. **Split Screen** — Camera left 50%, data right 50%

All overlays show: current player, current bid, leading team, recent bids feed, team colors.
Overlay URLs auto-generated per tournament.

### 2.7 WhatsApp Integration
- Auction announcement broadcast (to all players + team owners in a tournament)
- Preview recipient count before sending
- Player sold notification (auto-triggered on auction sold event)
- Message logging with success/failure tracking
- Uses Meta WhatsApp Business API (template messages)

### 2.8 Analytics Dashboard
- Page view tracking (with date range + user filter)
- Auction room analytics (peak viewers, session duration, joins)
- WhatsApp message stats (sent, success rate, by message type)
- Geo-location map of visitors
- Event tracking: page_view, login, auction_start, player_sold, player_unsold, and 15+ more event types

### 2.9 Auction Log
- Full bid history saved per auction (player, bids, teams, amounts, timestamps)
- View logs per tournament or per player
- Auction statistics (sold/unsold counts, total bids, top spending teams)

### 2.10 Bulk Upload
- CSV upload for teams and players
- Validation and error reporting

### 2.11 PDF Export
- Export team rosters as PDF

---

## 3. Current Tech Stack

### Frontend
| Concern | Technology |
|---------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Server State | TanStack React Query |
| Real-time | Socket.IO Client |
| UI | shadcn/ui + Radix UI + Tailwind CSS |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Maps | Leaflet / React-Leaflet |
| Animations | Framer Motion |
| PDF | jsPDF |

### Backend
| Concern | Technology |
|---------|-----------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO |
| Auth | Simple userId header (no JWT currently) |
| File Upload | Multer + AWS S3 (local fallback) |
| WhatsApp | Meta Business API v22.0 |
| Google | googleapis (Sheets) |

---

## 4. Known Issues & Technical Debt (Current State)

| # | Issue | Area |
|---|-------|------|
| 1 | No JWT auth — sends plain `userId` in request body | Security |
| 2 | All API methods are `POST` even for reads/deletes | API Design |
| 3 | Redundant API endpoints (e.g., multiple player fetch variants) | API Design |
| 4 | Frontend and backend are separate repos | Dev Experience |
| 5 | MongoDB used but no relational integrity | Data |
| 6 | No mobile-optimized UI | Frontend |
| 7 | No mobile app | Platform |
| 8 | Socket.IO CORS allows all origins in production | Security |
| 9 | Auction state is in-memory (lost on server restart) | Reliability |
| 10 | `touranmentId` typo in DB schema used everywhere | Code Quality |
| 11 | No pagination on most list endpoints | Performance |
| 12 | No rate limiting on public endpoints | Security |

---

## 5. Rebuild Goals (v2)

- [ ] Monorepo (single repo, frontend + backend)
- [ ] Proper REST API (GET/POST/PUT/DELETE) with no redundant endpoints
- [ ] Move to SQL (PostgreSQL) for relational integrity
- [ ] JWT-based authentication
- [ ] Mobile-first responsive UI
- [ ] React Native / PWA for mobile app
- [ ] Persistent auction state (survive server restart)
- [ ] Proper CORS configuration
- [ ] Rate limiting on public endpoints
- [ ] Fix all typos and naming inconsistencies
- [ ] Pagination on all list endpoints
