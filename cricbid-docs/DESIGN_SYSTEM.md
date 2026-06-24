# CricBid — Design System & Styling Guide

> This document is the single source of truth for CricBid's visual design. It is detailed enough to rebuild the UI from scratch without looking at the original code.

---

## 1. Design Philosophy

- **Dark-first**: Only dark mode. No light theme.
- **Glassmorphism**: Frosted-glass cards with `backdrop-blur` over dark translucent backgrounds.
- **Neon accent system**: Purple primary, orange secondary, green success — all with glow effects.
- **Mobile-first**: Layouts designed for small screens first, enhanced for desktop.
- **High information density**: Large bold typography for auction-critical numbers (bid price, player name).
- **Interactive feedback**: Every clickable element has hover state, glow on active, animation on events.

---

## 2. Color Palette

### CSS Variables (defined in `src/index.css` under `:root`)

All colors use HSL values to allow easy manipulation. Only one theme (dark) is defined.

```css
:root {
  /* ── Backgrounds ── */
  --background:          240 20%  7%;   /* #0d0f1a  Very dark navy */
  --card:                240 15% 10%;   /* #131a2e  Dark blue-grey card */
  --popover:             240 15% 10%;   /* Same as card */
  --muted:               240 10% 20%;   /* #1a2238  Subtle muted area */

  /* ── Foregrounds ── */
  --foreground:          0   0%  98%;   /* #f5f5f5  Near-white text */
  --card-foreground:     0   0%  98%;
  --popover-foreground:  0   0%  98%;
  --muted-foreground:    240  5%  65%;  /* #a5a5a5  Subdued text */

  /* ── Primary — Purple / Violet ── */
  --primary:             263 70% 50%;   /* #7c3aed  Main CTA, active states */
  --primary-foreground:  0   0% 100%;   /* White text on primary */
  --primary-glow:        263 70% 65%;   /* #a78bfa  Lighter purple for glows */

  /* ── Secondary — Orange / Amber ── */
  --secondary:           30 100% 55%;   /* #ff9d1a  Bids, prices, alternate CTA */
  --secondary-foreground: 0  0% 100%;
  --secondary-glow:      30 100% 65%;   /* #ffc966  Lighter orange */

  /* ── Accent — Green ── */
  --accent:              142 76% 36%;   /* #22c55e  Sold status, success */
  --accent-foreground:   0   0% 100%;

  /* ── Destructive — Red ── */
  --destructive:         0  84% 60%;    /* #f87171  Errors, unsold, warnings */
  --destructive-foreground: 0 0% 100%;

  /* ── Border / Input ── */
  --border:              240 10% 20%;   /* #1a2238  Subtle borders */
  --input:               240 10% 15%;   /* #0f1825  Input backgrounds */
  --ring:                263 70% 50%;   /* Focus ring — same as primary */

  /* ── Border Radius ── */
  --radius: 0.75rem;                    /* 12px base */

  /* ── Gradients ── */
  --gradient-primary:   linear-gradient(135deg, hsl(263 70% 50%), hsl(263 70% 65%));
  --gradient-secondary: linear-gradient(135deg, hsl(30 100% 55%), hsl(30 100% 65%));
  --gradient-accent:    linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 50%));
  --gradient-dark:      linear-gradient(180deg, hsl(240 20% 7%), hsl(240 25% 10%));

  /* ── Shadows ── */
  --shadow-glow:          0 0 40px hsl(263 70% 50% / 0.3);   /* Purple glow */
  --shadow-glow-secondary: 0 0 40px hsl(30 100% 55% / 0.3);  /* Orange glow */
  --shadow-elevated:      0 20px 50px -10px hsl(240 20% 5% / 0.8);

  /* ── Transitions ── */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Quick Reference — Hex Equivalents

| Token | HSL | Approx Hex | Usage |
|-------|-----|------------|-------|
| `--background` | 240 20% 7% | `#0d0f1a` | Page background |
| `--card` | 240 15% 10% | `#131a2e` | Card backgrounds |
| `--muted` | 240 10% 20% | `#1a2238` | Subtle fills |
| `--foreground` | 0 0% 98% | `#f5f5f5` | Body text |
| `--muted-foreground` | 240 5% 65% | `#a5a5a5` | Subdued / label text |
| `--primary` | 263 70% 50% | `#7c3aed` | Buttons, active state |
| `--primary-glow` | 263 70% 65% | `#a78bfa` | Glow, hover |
| `--secondary` | 30 100% 55% | `#ff9d1a` | Bid price, price tags |
| `--accent` | 142 76% 36% | `#22c55e` | Sold, success |
| `--destructive` | 0 84% 60% | `#f87171` | Unsold, error |
| `--border` | 240 10% 20% | `#1a2238` | All borders |

---

## 3. Typography

### Font Stack
No external web font is loaded. The stack is:
```css
font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
```
Inter is used in overlays explicitly; everywhere else falls back to the system sans-serif.

### Base Font Sizes (responsive)
```css
html { font-size: 14px; }                /* Mobile */
@media (min-width: 640px)  { font-size: 15px; }
@media (min-width: 768px)  { font-size: 16px; }
```

### Scale & Usage

| Size Class | px (desktop) | Usage |
|------------|-------------|-------|
| `text-[9px]` | 9px | Compact mobile labels in team grid |
| `text-xs` | 12px | Badges, secondary labels |
| `text-sm` | 14px | Body text, form labels |
| `text-base` | 16px | Default body |
| `text-lg` | 18px | Subheadings |
| `text-xl` | 20px | Section titles |
| `text-2xl` | 24px | Page headings (mobile) |
| `text-3xl–5xl` | 30–48px | Hero headings |
| `text-6xl–9xl` | 60–96px | Auction bid price, sold celebration |

### Font Weights
| Weight | Class | Usage |
|--------|-------|-------|
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Labels, captions |
| 600 | `font-semibold` | Subheadings, button text |
| 700 | `font-bold` | Headings |
| 900 | `font-black` | Bid price, sold amount, hero text |

### Responsive Heading Pattern
```html
<!-- Hero heading -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">

<!-- Section heading -->
<h2 class="text-xl sm:text-2xl md:text-3xl font-bold">

<!-- Card title -->
<h3 class="text-sm sm:text-base md:text-lg font-semibold truncate">

<!-- Auction bid price -->
<span class="text-xl sm:text-3xl md:text-6xl lg:text-7xl font-black text-secondary">
```

---

## 4. Spacing & Layout

### Border Radius
```
--radius = 0.75rem (12px)

rounded-sm  = 8px   (buttons, badges)
rounded-md  = 10px  (inputs)
rounded-lg  = 12px  (cards)
rounded-xl  = 16px  (modals, panels)
rounded-2xl = 20px  (team cards)
rounded-3xl = 24px  (sold celebration panel)
rounded-full        (avatars, pills)
```

### Container & Sections
```html
<!-- Standard page wrapper -->
<div class="min-h-screen bg-background text-foreground">

<!-- Content container -->
<div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

<!-- Section vertical padding -->
<section class="py-8 sm:py-12 md:py-16 lg:py-24">
```

### Common Spacing Patterns
```
Gap:       gap-2 sm:gap-3 md:gap-4 lg:gap-6
Padding:   p-2 sm:p-3 md:p-4 lg:p-6
Card pad:  p-3 sm:p-4 md:p-6
Button:    px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3
```

---

## 5. Tailwind Config Extensions

Add these to `tailwind.config.ts` in addition to standard Tailwind:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow:       "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow:       "hsl(var(--secondary-glow))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-primary":   "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent":    "var(--gradient-accent)",
        "gradient-dark":      "var(--gradient-dark)",
      },
      boxShadow: {
        "glow":           "var(--shadow-glow)",
        "glow-secondary": "var(--shadow-glow-secondary)",
        "elevated":       "var(--shadow-elevated)",
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        "pop-in": {
          "0%":   { transform: "scale(0.5) rotate(-5deg)", opacity: "0" },
          "50%":  { transform: "scale(1.1) rotate(2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)",   opacity: "1" },
        },
        "slide-up": {
          "0%":   { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(263 70% 50% / 0.5)" },
          "50%":       { boxShadow: "0 0 40px hsl(263 70% 50% / 0.8)" },
        },
        "celebrate": {
          "0%":   { transform: "scale(1) rotate(0deg)" },
          "25%":  { transform: "scale(1.2) rotate(10deg)" },
          "50%":  { transform: "scale(1.1) rotate(-10deg)" },
          "75%":  { transform: "scale(1.2) rotate(5deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "fade-in":    "fade-in 0.5s ease-out",
        "scale-in":   "scale-in 0.3s ease-out",
        "pop-in":     "pop-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-up":   "slide-up 0.4s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "celebrate":  "celebrate 0.6s ease-in-out",
      },
    },
  },
};
export default config;
```

---

## 6. Reusable UI Patterns

### Standard Card
```html
<div class="bg-card border border-border rounded-xl p-4 
            hover:border-primary/50 hover:shadow-elevated 
            transition-all duration-300">
```

### Glass Card
```html
<div class="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-4">
```

### Primary Button
```html
<button class="bg-gradient-primary text-primary-foreground 
               px-4 py-2.5 rounded-lg font-semibold
               hover:shadow-glow hover:scale-105
               transition-all duration-300 active:scale-95">
```

### Secondary Button (outline)
```html
<button class="border border-border text-foreground bg-transparent
               px-4 py-2.5 rounded-lg font-semibold
               hover:border-primary hover:text-primary
               transition-all duration-300">
```

### Badge / Status Chip
```html
<!-- Sold -->
<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
  SOLD
</span>

<!-- Unsold -->
<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/20 text-destructive border border-destructive/30">
  UNSOLD
</span>

<!-- Category (e.g., Icon) -->
<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
  Icon
</span>
```

### Input Field
```html
<input class="w-full bg-input border border-border rounded-md px-3 py-2 text-sm
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
              transition-colors" />
```

### Section Header
```html
<div class="flex items-center justify-between mb-4 sm:mb-6">
  <div class="flex items-center gap-2">
    <IconName class="h-5 w-5 text-primary" />
    <h2 class="text-lg sm:text-xl font-bold">Section Title</h2>
  </div>
  <button class="text-sm text-muted-foreground hover:text-foreground">Action</button>
</div>
```

### Stat Card
```html
<div class="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
  <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Label</span>
  <span class="text-2xl font-black text-secondary">42</span>
  <span class="text-xs text-muted-foreground">Supporting text</span>
</div>
```

### Player Category Color Map
```typescript
const categoryColors: Record<string, string> = {
  "Icon":     "bg-rose-500/80   text-white border-rose-500/60",
  "Gold":     "bg-amber-500/80  text-white border-amber-500/60",
  "Silver":   "bg-sky-500/80    text-white border-sky-500/60",
  "Regular":  "bg-emerald-500/80 text-white border-emerald-500/60",
  "Special":  "bg-violet-500/80 text-white border-violet-500/60",
  "default":  "bg-muted         text-muted-foreground border-border",
};
```

---

## 7. Navbar

### Structure
```
sticky top-0 z-50
bg-card/80 backdrop-blur-xl border-b border-border
```

### Layout
```html
<nav class="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
  <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

    <!-- Logo -->
    <a href="/" class="flex items-center gap-2">
      <div class="bg-white rounded-lg p-1 shadow-glow">
        <img src="/logo.png" class="h-7 w-7" />
      </div>
      <span class="font-black text-lg hidden sm:block">CricBid</span>
    </a>

    <!-- Desktop Nav Links -->
    <div class="hidden md:flex items-center gap-1">
      <!-- Active link -->
      <a class="px-3 py-1.5 rounded-lg text-sm font-medium
                bg-gradient-primary text-primary-foreground shadow-glow">
        Tournaments
      </a>
      <!-- Inactive link -->
      <a class="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground
                hover:text-foreground hover:bg-muted transition-colors">
        Players
      </a>
    </div>

    <!-- Live Auction Indicator (when active) -->
    <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
      <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      LIVE
    </div>

    <!-- Mobile menu button -->
    <button class="md:hidden p-2 rounded-lg hover:bg-muted">
      <Menu class="h-5 w-5" />
    </button>
  </div>
</nav>
```

---

## 8. Page Layouts

### Tournament Grid
```html
<div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
```

### Player Grid
```html
<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
```

### Auction Page (desktop: side-by-side, mobile: stacked)
```html
<div class="flex flex-col md:flex-row gap-3 md:gap-4 h-full">
  <!-- Player card — grows to fill -->
  <div class="flex-1 min-h-0 md:h-[55vh]">
    <AuctionPlayerCard />
  </div>
  <!-- Team budget panel — fixed width on desktop -->
  <div class="w-full md:w-[420px] lg:w-[460px]">
    <TeamBudgetPanel />
  </div>
</div>
```

---

## 9. Auction Player Card

### Mobile Layout (column)
```
┌──────────────────────────────────┐
│  [Status badge]    [Category]    │
│                                  │
│         Player Photo             │
│         (35% height)             │
│                                  │
│  Player Name          #Serial    │
│  Base: ₹500                      │
│  ─────────────────────────────   │
│  Current Bid                     │
│  ₹ 2,400  (text-5xl font-black)  │
│  Leading: Team Name              │
└──────────────────────────────────┘
```

### Desktop Layout (row)
```
┌───────────────────────────────────────────────────────────┐
│ [Status]      │                                            │
│ [#Serial]     │   Player Name (text-3xl font-black)       │
│               │   Skill | Category badge                  │
│  Player Photo │   ─────────────────────────────────────   │
│  (w-[24rem]   │   Base Price: ₹500                        │
│   rounded-xl) │                                            │
│               │   Current Bid                              │
│  [Category]   │   ₹ 2,400  (text-6xl font-black text-sec) │
│               │   Leading: [Team logo] Team Name          │
└───────────────────────────────────────────────────────────┘
```

### Key classes
```
Card wrapper:    bg-card border-2 border-border rounded-2xl overflow-hidden
Image overlay:   bg-gradient-to-t from-card/60 via-card/40 to-transparent
Bid price:       text-xl sm:text-3xl md:text-6xl lg:text-7xl font-black text-secondary
Animation on new player: animate-pop-in
Animation on bid placed: animate-celebrate (brief scale+rotate)
```

---

## 10. Team Budget Panel

### Team Card States
```
Normal:   border-border/50 bg-background/40 hover:bg-muted/30
Leading:  border-primary/60 bg-primary/10 shadow-glow scale-105
Warning:  border-red-500/60 bg-red-500/10   (budget critically low or maxed)
```

### Desktop (2-column grid, 420px wide)
```html
<div class="grid grid-cols-2 gap-2">
  <div class="px-2.5 py-2.5 rounded-xl border transition-all duration-300
              [state-classes]">
    <div class="flex items-center gap-2">
      <img class="h-10 w-10 rounded-full object-cover" />
      <div>
        <p class="text-sm font-bold truncate max-w-[80px]">Team Name</p>
        <p class="text-xs text-muted-foreground">Budget remaining</p>
        <p class="text-sm font-black text-secondary">₹1,500</p>
      </div>
    </div>
    <!-- Slots indicator -->
    <div class="flex-shrink-0 text-center px-2 py-1 rounded-lg text-xs font-bold [slot-state-class]">
      8/11
    </div>
  </div>
</div>
```

### Slot State Classes
```
Normal (slots > 2):  bg-muted/40 text-muted-foreground
Warning (slots ≤ 2): bg-yellow-500/15 text-yellow-400
Critical (slots = 0): bg-red-500/20 text-red-400
```

### Mobile (3-column grid, compact)
```
Logo: h-7 w-7
Font: text-[9px]
Padding: p-1.5
```

---

## 11. Sold / Unsold Animations

### Sold Celebration (fullscreen overlay)
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-background/70 backdrop-blur-md z-50 flex items-center justify-center">

  <!-- Celebration box -->
  <div class="rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500
              shadow-[0_0_100px_rgba(168,85,247,0.6)]
              p-8 sm:p-12 text-center max-w-sm sm:max-w-md w-full mx-4">

    <!-- Emoji (Framer Motion: rotate + scale loop) -->
    <div class="text-6xl mb-4">🏏</div>

    <!-- SOLD text -->
    <h2 class="text-7xl sm:text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
      SOLD!
    </h2>

    <!-- Player name -->
    <p class="text-xl sm:text-2xl font-bold text-white/90 mt-2">Player Name</p>

    <!-- Team name -->
    <p class="text-lg text-white/70 mt-1">to Team Name</p>

    <!-- Amount (Framer Motion: continuous scale pulse) -->
    <p class="text-4xl sm:text-6xl font-black text-yellow-300 mt-4">₹2,400</p>
  </div>
</div>
```

**Framer Motion spring**: `{ damping: 12, stiffness: 200 }`
**Confetti colors**: `["#a855f7","#ec4899","#f97316","#eab308","#22c55e","#3b82f6"]`

---

## 12. Glow & Glass Effects

### Glow Variants
```css
/* Purple — primary actions */
box-shadow: 0 0 30px hsl(263 70% 50% / 0.4);
/* Orange — prices/bids */
box-shadow: 0 0 30px hsl(30 100% 55% / 0.3);
/* Gold — auction overlay text */
filter: drop-shadow(0 4px 20px rgba(251, 191, 36, 0.4));
```

### Glass Panel
```css
background: rgba(15, 10, 30, 0.85);
backdrop-filter: blur(30px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 20px;
```

### Gradient Text (Gold — used in overlays)
```css
background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## 13. Custom Scrollbar
```css
/* Thin colored scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
.custom-scrollbar::-webkit-scrollbar       { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 999px;
}

/* Hide scrollbar but allow scroll (horizontal lists) */
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

---

## 14. Responsive Breakpoints

| Prefix | Min-width | Typical use |
|--------|-----------|-------------|
| *(none)* | 0px | Mobile phones |
| `sm:` | 640px | Large phones / small tablets |
| `md:` | 768px | Tablets / small laptops |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

### Key Responsive Patterns
```html
<!-- Show/hide by breakpoint -->
<div class="hidden md:block">  <!-- desktop only -->
<div class="block md:hidden">  <!-- mobile only -->
<div class="hidden sm:flex">   <!-- sm+ only -->

<!-- Responsive grid -->
<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

<!-- Responsive flex direction -->
<div class="flex flex-col md:flex-row">

<!-- Responsive text -->
<p class="text-xs sm:text-sm md:text-base">
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
```

---

## 15. Framer Motion Animation Variants

Use these standard variants across pages for consistent feel:

```typescript
// Fade up on scroll into view
const fadeInUp = {
  initial:     { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition:  { duration: 0.6, ease: "easeOut" },
};

// Stagger children
const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
};

// Scale in
const scaleIn = {
  initial:     { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  transition:  { duration: 0.5 },
};

// Sold celebration entrance (spring)
const celebrationSpring = {
  initial:   { scale: 0, opacity: 0 },
  animate:   { scale: 1, opacity: 1 },
  transition: { type: "spring", damping: 12, stiffness: 200 },
};
```

---

## 16. OBS Overlay Design System

Overlays are standalone pages rendered at **1920×1080px** in OBS as Browser Sources.

### Overlay Color Palette
```css
/* Background */
--overlay-bg-dark:  rgba(15, 10, 30, 0.85);
--overlay-bg-glass: rgba(255, 255, 255, 0.06);

/* Gold text (bid amounts) */
--overlay-gold: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);

/* Live indicator */
--overlay-live-red: #ef4444;
```

### Overlay Typography
```css
/* Player name */
font-size: 64px; font-weight: 900;
text-shadow: 0 2px 20px rgba(0,0,0,0.5);

/* Bid amount */
font-size: 96px; font-weight: 900;
/* Use gradient-gold text effect */

/* Category badge */
font-size: 18px; font-weight: 700;
padding: 6px 20px; border-radius: 999px;
background: rgba(255,255,255,0.1);
backdrop-filter: blur(10px);
```

### Overlay Layouts Summary

**1. Camera HUD** (`/overlay/:id/camera-hud`)
- Transparent full-page (OBS composites over camera feed)
- Fixed lower-third panel at bottom: `position: fixed; bottom: 40px; left: 60px; right: 60px;`
- Top marquee strip: Scrolling recent bids
- Periodic panels every 60s: Teams overview, Top players, QR code

**2. Fullscreen** (`/overlay/:id/fullscreen`)
- Opaque background; no camera needed
- Background gradient shifts based on leading team color
- Player photo (400×480px) left, data (flex-1) right
- Gap: 80px; Photo border-radius: 24px with team-color glow ring

**3. Split Screen** (`/overlay/:id/split-screen`)
- Left 50%: Transparent (camera bleeds through)
- Right 50%: Dark glass panel with player info + bid history
- Vertical divider with team-color glow

---

## 17. Icon System

All icons from `lucide-react`. Standard sizes:

| Size | Class | Usage |
|------|-------|-------|
| Small | `h-3 w-3` | Inline with small text |
| Default | `h-4 w-4` | Button icons, list icons |
| Medium | `h-5 w-5` | Nav icons, card icons |
| Large | `h-6 w-6` | Section headings |
| XL | `h-8 w-8` | Feature showcase |

### Commonly Used Icons
```
Navigation:  ChevronDown, ArrowRight, Menu, X
Auction:     Gavel, Trophy, Target, DollarSign, Wallet
Users:       Users, User, Shield
Actions:     Search, Settings, Upload, Download, Trash2
Status:      Sparkles, Zap, Globe, Phone, LogOut
Media:       Play, Volume2, VolumeX, Loader2, Megaphone
Analytics:   BarChart3, MessageSquare
```

---

## 18. Global CSS Utilities to Include

```css
/* index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
  html { font-size: 14px; }
  @screen sm { html { font-size: 15px; } }
  @screen md { html { font-size: 16px; } }
}

@layer utilities {
  /* Hide scrollbar while keeping scroll */
  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  /* Thin scrollbar */
  .custom-scrollbar { scrollbar-width: thin; scrollbar-color: hsl(var(--border)) transparent; }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 999px; }

  /* Gradient text helper */
  .text-gradient-gold {
    background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-primary {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```
