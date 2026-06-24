# CricBid — API Reference (Current State)

**Base URL:** `https://cricbid.online`
**Auth:** Send `userId` in request body or `x-user-id` header for protected routes.

> Note: This documents the current API as-is. The v2 rebuild will follow proper REST conventions.

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/user/login` | Public | Login with email + password |

---

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/user/create` | Protected | Create a user (role enforced) |
| POST | `/api/user/detail` | Protected | Get user by ID |
| POST | `/api/user/my-users` | Protected | Get users you created |
| POST | `/api/user/hierarchy` | Protected | Get all descendants in your hierarchy |
| POST | `/api/user/all` | Boss only | Get all users |
| POST | `/api/user/update` | Protected | Update user |
| POST | `/api/user/delete` | Protected | Deactivate/delete user |

---

## Tournaments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tournament/register` | Protected | Create tournament |
| POST | `/api/tournament/all` | Public | List tournaments (role-filtered) |
| POST | `/api/tournament/detail` | Public | Get single tournament |
| POST | `/api/tournament/update` | Protected | Update tournament |
| POST | `/api/tournament/delete` | Protected | Delete tournament |
| GET | `/api/tournament/hosts` | Protected | List all tournament hosts |
| POST | `/api/tournament/export` | Protected | Export tournament data |
| GET | `/api/tournament/:id/registration-config` | Public | Get registration form config |
| POST | `/api/tournament/update-registration-config` | Protected | Update registration form config |

---

## Players

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/player/register` | Protected | Register single player |
| POST | `/api/player/register-public` | Public | Register via public link (with photo upload) |
| POST | `/api/player/all` | Public | Get all players in tournament |
| POST | `/api/player/detail` | Public | Get single player |
| POST | `/api/player/update` | Protected | Update player |
| POST | `/api/player/delete` | Protected | Delete player |
| POST | `/api/player/delete-all` | Protected | Delete all players in tournament |
| POST | `/api/player/categories` | Public | Get player categories in tournament |
| POST | `/api/player/bulk-create` | Protected | Bulk create from JSON |
| POST | `/api/player/bulk-update` | Protected | Bulk update players |
| POST | `/api/player/reset-unsold` | Protected (admin) | Mark all unsold players as available |
| POST | `/api/player/sync-diff` | Protected | Preview Google Sheets delta |
| POST | `/api/player/sync-apply` | Protected | Apply Google Sheets changes to DB |
| POST | `/api/player/sync-to-sheet` | Protected | Push DB data to Google Sheets |
| POST | `/api/player/overlay-stats` | Public | Get stats for overlay marquee |

---

## Teams

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/team/register` | Protected | Register team |
| POST | `/api/team/register-public` | Public | Register via public link (with logo upload) |
| POST | `/api/team/all` | Public | Get all teams with players, budget, stats |
| POST | `/api/team/detail` | Public | Get single team |
| POST | `/api/team/update` | Protected | Update team |
| POST | `/api/team/names` | Public | Get team names only |
| POST | `/api/team/names-budget` | Public | Get team names with remaining budget |
| POST | `/api/team/bulk-create` | Protected | Bulk create teams |
| POST | `/api/team/delete-all` | Protected | Delete all teams in tournament |

---

## Auction

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auction/next-player` | Public | Get next unsold player |
| POST | `/api/auction/player-categories` | Public | Get categories for filtering |

---

## Auction Logs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auction-log/save` | Protected | Save auction session log |
| GET | `/api/auction-log/tournament/:tournamentId` | Protected | Logs for tournament |
| GET | `/api/auction-log/player/:playerId` | Protected | Log for specific player |
| GET | `/api/auction-log/stats/:tournamentId` | Protected | Auction statistics |
| GET | `/api/auction-log/top-teams/:tournamentId` | Protected | Top bidding teams |

---

## WhatsApp

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/whatsapp/notify-player-sold` | Protected | Send sold notification to player |
| POST | `/api/whatsapp/announce-auction` | Protected | Broadcast to all players + teams |
| POST | `/api/whatsapp/preview-recipients` | Protected | Preview recipient count |
| POST | `/api/whatsapp/test` | Protected | Test WhatsApp connection |

---

## Events / Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/event/track` | Public | Track single event |
| POST | `/api/event/track-batch` | Public | Track multiple events |
| GET | `/api/event/user/:userId` | Protected | Events by user |
| GET | `/api/event/tournament/:tournamentId` | Protected | Events by tournament |
| GET | `/api/event/stats/:tournamentId` | Protected | Event statistics |
| GET | `/api/event/analytics` | Protected | Analytics dashboard (query: startDate, endDate, userId) |
| GET | `/api/event/auction-room-analytics` | Protected | Auction room metrics |
| GET | `/api/event/geo-analytics` | Protected | Geolocation analytics |

---

## Socket.IO Events

**Namespace:** `/auction`

### Client → Server

| Event | Payload | Who Can Emit | Description |
|-------|---------|--------------|-------------|
| `auction:join` | `{ tournamentId, userId?, ipAddress? }` | Anyone | Join auction room |
| `auction:start` | `{ tournamentId, userId }` | Auctioneer | Initialize auction |
| `auction:selectPlayer` | `{ tournamentId, playerId?, category? }` | Auctioneer | Select player for bidding |
| `auction:bid` | `{ tournamentId, teamId }` | Auctioneer | Place bid for a team |
| `auction:undoBid` | `{ tournamentId }` | Auctioneer | Undo last bid |
| `auction:sold` | `{ tournamentId, userId }` | Auctioneer | Mark current player sold |
| `auction:unsold` | `{ tournamentId, userId }` | Auctioneer | Mark current player unsold |
| `auction:resetMode` | `{ tournamentId }` | Auctioneer | Return to mode selection |
| `auction:updateSlabs` | `{ tournamentId, bidIncrementSlabs }` | Auctioneer | Update bid increment slabs |
| `auction:delete` | `{ tournamentId, userId }` | Host/Admin | Close auction room |
| `auction:list` | — | Anyone | Request active auctions |
| `overlay:layout_change` | `{ tournamentId, layout }` | Auctioneer | Change overlay layout |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `auction:state` | Full state object | Authoritative auction state (see below) |
| `auction:role` | `{ role }` | Assign role (auctioneer / viewer) |
| `auction:viewerCount` | `{ count }` | Current viewer count |
| `auction:playerSelected` | Player object | New player selected animation trigger |
| `auction:bidPlaced` | `{ teamId, teamName, amount }` | Bid placed notification |
| `auction:sold` | `{ player, team, amount }` | Player sold |
| `auction:unsold` | `{ player }` | Player marked unsold |
| `auction:list` | Array of active auctions | Active auction rooms |
| `auction:error` | `{ message }` | Error |
| `auction:info` | `{ message }` | Info message |
| `auction:ended` | — | Auction room closed |
| `overlay:layout_change` | `{ layout }` | Layout change for overlay |

### Auction State Object

```json
{
  "tournamentId": "string",
  "isActive": "boolean",
  "auctionMode": "category | manual | null",
  "selectedCategory": "string | null",
  "currentPlayer": "Player | null",
  "currentBid": "number",
  "leadingTeam": "teamId | null",
  "teamBids": "{ [teamId]: number }",
  "teams": "Team[]",
  "playerNumber": "number",
  "bidPrice": "number",
  "hasAuctioneer": "boolean",
  "viewerCount": "number"
}
```

---

## Redundant / Overlapping Endpoints (to clean up in v2)

| Overlap | Endpoints |
|---------|-----------|
| Player fetch | `/api/player/all` vs `/api/auction/next-player` |
| Team names | `/api/team/names` vs `/api/team/names-budget` vs `/api/team/all` |
| Event tracking | `/api/event/track` vs `/api/event/track-batch` |
| Analytics | `/api/event/analytics` + `/api/event/auction-room-analytics` + `/api/event/geo-analytics` (could be one endpoint with query params) |
