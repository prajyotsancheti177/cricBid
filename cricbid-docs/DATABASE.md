# CricBid — Database Schema (Current State: MongoDB)

> The v2 rebuild targets PostgreSQL (SQL). This document captures the current MongoDB schema to guide the migration.

---

## Collections

### `users`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `name` | String | |
| `email` | String | Unique |
| `password` | String | Bcrypt hashed |
| `role` | Enum | `boss`, `super_user`, `tournament_host` |
| `createdBy` | ObjectId → users | Hierarchy parent |
| `isActive` | Boolean | Soft delete flag |
| `logo` | String | URL (for tournament hosts) |
| `permissions` | Object | `canCreateSuperUser`, `canCreateTournamentHost`, `canManageTournaments`, `canManageTeams`, `canManagePlayers` |
| `createdAt`, `updatedAt` | Date | |

**Indexes:** `email` (unique), `createdBy`

---

### `tournaments`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `name` | String | Required |
| `tournamentHostId` | ObjectId → users | |
| `noOfTeams` | Number | |
| `maxPlayersPerTeam` | Number | |
| `minPlayersPerTeam` | Number | |
| `totalBudget` | Number | Per team |
| `playerCategories` | String[] | e.g., `['Icon', 'Regular']` |
| `categoryBasePrices` | Map | `{ Icon: 2000, Regular: 500 }` |
| `bidIncrementSlabs` | Array | `[{ minBid, maxBid, increment }]` |
| `registrationFormConfig` | Object | See below |
| `createdAt`, `updatedAt` | Date | |

**registrationFormConfig structure:**
```
{
  isActive: Boolean,
  fields: {
    age: { required, enabled, showToPublic, defaultValue, label },
    gender: { ... },
    photo: { ... },
    skill: { ... },
    mobile: { ... },
    email: { ... },
    address: { ... },
    playerCategory: { ... }
  },
  customFields: [{ name, label, type, required, enabled }],
  googleSheetId: String,
  googleSheetUrl: String
}
```

**Indexes:** `tournamentHostId`

---

### `players`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `name` | String | |
| `age` | Number | |
| `gender` | String | |
| `mobile` | Number | |
| `email` | String | |
| `photo` | String | URL |
| `skill` | String | |
| `address` | String | |
| `touranmentId` | ObjectId → tournaments | **Typo in DB — note for v2** |
| `teamId` | ObjectId → teams | Assigned after sold |
| `sold` | Boolean | |
| `auctionStatus` | Boolean | True = currently in auction pool |
| `amtSold` | Number | |
| `playerCategory` | String | |
| `auctionSerialNumber` | Number | Auto-increment within tournament |
| `customFields` | Map | Flexible |
| `createdAt`, `updatedAt` | Date | |

**Indexes:** `touranmentId`, `sold`, `auctionStatus`

---

### `teams`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `name` | String | |
| `logo` | String | URL |
| `owner.name` | String | |
| `owner.email` | String | |
| `owner.mobile` | String | |
| `touranmentId` | ObjectId → tournaments | **Typo in DB** |
| `createdAt`, `updatedAt` | Date | |

> Note: Budget remaining is computed at query time (totalBudget - sum of amtSold for team's players). Not stored on the team document.

---

### `auctionlogs`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `tournamentId` | ObjectId | |
| `playerId` | ObjectId | |
| `playerName`, `playerCategory` | String | |
| `basePrice` | Number | |
| `auctionMode` | Enum | `category`, `manual` |
| `status` | Enum | `sold`, `unsold` |
| `winningTeamId` | ObjectId | |
| `winningTeamName` | String | |
| `finalPrice` | Number | |
| `bids` | Array | `[{ teamId, teamName, bidAmount, bidIncrement, timestamp, bidOrder }]` |
| `totalBids`, `uniqueTeamsBidding` | Number | |
| `auctionStartedAt`, `auctionEndedAt` | Date | |
| `totalDurationSeconds` | Number | |
| `conductedBy` | ObjectId → users | |
| `createdAt`, `updatedAt` | Date | |

**Indexes:** `(tournamentId, status)`, `(tournamentId, playerCategory)`, `(playerId, auctionStartedAt)`, `(tournamentId, auctionEndedAt)`

---

### `userevents`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `userId` | ObjectId | Null for anonymous |
| `sessionId` | String | Browser session ID |
| `tournamentId` | ObjectId | |
| `eventType` | Enum | 15+ types (page_view, auction_start, player_sold, etc.) |
| `eventData` | Mixed | Flexible payload |
| `page` | String | Route |
| `userAgent`, `ipAddress` | String | |
| `timestamp` | Date | |

**Event Types:** `page_view`, `auction_start`, `auction_completed`, `player_sold`, `player_unsold`, `player_search`, `category_selected`, `login`, `logout`, `team_created`, `player_registered`, `tournament_created`, `settings_changed`, `tournament_view`, `teams_view`, `players_view`, `auction_room_created`, `auction_room_joined`, `auction_room_left`, `auction_room_closed`

---

### `auctionroomsessions`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `tournamentId` | ObjectId | |
| `tournamentName` | String | |
| `sessionStartedAt`, `sessionEndedAt` | Date | |
| `sessionDurationMinutes` | Number | |
| `hostUserId` | ObjectId | |
| `hostUserName` | String | |
| `uniqueViewerUserIds` | ObjectId[] | |
| `anonymousViewerIPs` | String[] | |
| `totalUniqueViewers`, `totalJoins`, `peakConcurrentViewers` | Number | |
| `peakViewerTimestamp` | Date | |
| `playersAuctioned`, `playersSold`, `playersUnsold` | Number | |
| `totalBids` | Number | |
| `viewerHistory` | Array | `[{ timestamp, viewerCount }]` — 1 min samples |
| `status` | Enum | `active`, `ended`, `abandoned` |

---

### `whatsapplogs`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `messageType` | Enum | `player_sold`, `player_unsold`, `auction_announcement`, `team_purchase_summary`, `test` |
| `templateName` | String | |
| `recipientMobile` | String | |
| `playerId` | ObjectId | |
| `playerName`, `tournamentName`, `teamName` | String | |
| `amtSold` | Number | |
| `tournamentId` | ObjectId | |
| `status` | Enum | `success`, `failed` |
| `messageId` | String | WhatsApp API message ID |
| `errorMessage` | String | |
| `timestamp` | Date | |

---

### `ipgeocaches`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `ipAddress` | String | Unique |
| `city`, `region`, `country`, `countryCode` | String | |
| `lat`, `lon` | Number | |
| `isp` | String | |
| `isValid` | Boolean | |
| `cachedAt` | Date | TTL: 30 days |

---

## Key Issues for SQL Migration

| MongoDB Pattern | SQL Equivalent / Challenge |
|----------------|---------------------------|
| `registrationFormConfig` embedded object | Separate `tournament_form_fields` table |
| `bidIncrementSlabs` embedded array | Separate `bid_increment_slabs` table |
| `customFields` Map on players | `player_custom_field_values` table |
| `bids` array in auctionLog | Separate `auction_bids` table |
| `viewerHistory` array in session | Separate `viewer_history_samples` table |
| `permissions` object on user | Either JSON column or separate `user_permissions` table |
| Computed budget (not stored) | Can store as materialized column or compute with JOIN |
| `touranmentId` typo | Rename to `tournament_id` |
