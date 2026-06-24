# CricBid — Frontend Routes

## Page Routes

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Home | No | Landing page with feature showcase |
| `/login` | Login | No | Email + password login |
| `/tournaments` | Tournaments | No | List all tournaments, send WhatsApp announcement |
| `/tournament/:tournamentId` | TournamentDetail | No | View tournament details |
| `/tournaments/manage` | TournamentManagement | boss / super_user | Create, edit, delete tournaments |
| `/players` | Players | No | Browse players with filters |
| `/add-player` | AddPlayer | No | Quick add single player |
| `/register` | PlayerRegistration | Yes | Internal player registration form |
| `/register/:tournamentId` | PublicPlayerRegistration | No | Public registration via WhatsApp link |
| `/teams` | Teams | No | Browse all teams |
| `/team/:teamId` | TeamDetail | No | Single team profile with roster |
| `/team-register/:tournamentId` | PublicTeamRegistration | No | Public team registration via WhatsApp link |
| `/auction` | LiveAuctionLobby | No | List active auction rooms |
| `/auction/room/:tournamentId` | Auction | Viewers: No / Auctioneer: Yes | Live auction room |
| `/bulk-upload` | BulkUpload | boss / super_user | CSV bulk import teams & players |
| `/users` | UserManagement | boss / super_user | Manage user hierarchy |
| `/analytics` | Analytics | boss / super_user | Event & WhatsApp analytics dashboard |
| `/overlay/:tournamentId/camera-hud` | CameraHudOverlay | No | OBS overlay — lower third |
| `/overlay/:tournamentId/fullscreen` | FullscreenOverlay | No | OBS overlay — fullscreen |
| `/overlay/:tournamentId/split-screen` | SplitScreenOverlay | No | OBS overlay — split screen |
| `*` | NotFound | No | 404 |

## Special Redirect
- `/tournament/:placeholder/:tournamentId` → Redirects to `/tournament/:tournamentId`
  - Handles malformed WhatsApp link format

## Overlay Notes
- Overlay pages have no navbar (standalone layout)
- Used as OBS Browser Sources for YouTube streaming
- Read-only socket connection — no auctioneer controls
- Auto-detect tournament from URL param
