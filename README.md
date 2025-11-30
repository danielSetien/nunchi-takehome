# Ticker + PnL Card - Implementation Notes

## Overview

A real-time ticker component displaying live BTC-PERP prices with PnL calculations for long/short positions. Built with React 18, TypeScript, Next.js 16, and Linaria for styling.

**Time:** 40 minutes
**Stack:** React 18, TypeScript, Next.js 16, Linaria (CSS-in-JS)

---

## Architecture & Design Philosophy

### Separation of Concerns

I structured the codebase into three distinct layers, each with a single responsibility:

```
lib/          → Pure business logic (framework-agnostic)
hooks/        → React integration layer
components/   → Presentational components with light derivations
```

---

## Key Implementation Decisions

### 1. **PnL Calculation Location**

**Decision:** Keep PnL calculation in the component using `useMemo`, NOT in the hook.

**Why component-level?**

-   `usePriceFeed` is **generic** - it shouldn't know about positions or PnL
-   PnL depends on **component-specific props** (`side`, `entryPrice`, `size`)
-   Follows challenge requirement: _"component is presentational + light derivations"_
-   Makes the hook **reusable** for other use cases (charts, simple tickers, etc.)

**Alternative considered:** `usePnl` custom hook → rejected as over-engineering for a single use case.

### 2. **Type Safety**

**Zero `any` types.** Used TypeScript's utility types and narrow types throughout.

### 3. **Accessibility (A11y)**

**WCAG AA compliant with comprehensive ARIA support.**

**Live regions for dynamic content:**

**Why this matters:**

-   Screen readers announce price updates automatically
-   `aria-label` provides context that color alone conveys visually
-   Not relying on color alone (uses `+/-` signs)

**Other a11y features:**

-   Semantic HTML (`<h2>` for symbol, `<button>` for controls)
-   Keyboard navigation (native button = Space/Enter support)
-   Focus indicators (green outline on `:focus-visible`)

### 4. **Styling with Linaria**

**Decision:** Used Linaria (zero-runtime CSS-in-JS) instead of Tailwind.

**Why Linaria?**

-   **Zero runtime cost:** Extracts to static CSS at build time
-   **Co-location:** Styles live with components but compile to CSS
-   **Type-safe:** TypeScript support for styled components
-   **Dynamic styling:** Can still use props for conditional styles

---

## Component Instance Behavior

**Each `TickerPnLCard` has its own hook instance:**

**Alternative approach:** Context provider to share state across cards.

**Why I chose independent instances:**

-   Simpler to understand
-   Each card can be paused independently
-   Performance difference is negligible (2 intervals vs 1)
-   Better demonstrates component isolation

---

## Number Formatting Choices

**Tabular numerals for live updates:**
**Locale formatting:**

**What I'd test if this were production:**

**Unit tests:**

-   `pnl.ts`: Pure function tests (long/short calculations, edge cases)
-   `priceStream.ts`: Subscribe/unsubscribe, pause/resume, cleanup

**Integration tests:**

-   `usePriceFeed`: State updates, cleanup on unmount, re-run on symbol change

**Component tests:**

-   PnL updates when price changes
-   Badge shows correct color for long/short
-   Pause button toggles correctly
-   Accessibility (ARIA labels, keyboard navigation)

**E2E tests:**

-   Price updates every interval
-   Both cards update independently

**Not needed (but could add):**

-   `useCallback` for `togglePause` → button re-renders anyway when `isPaused` changes

--

## How to Run

```
npm install
npm run dev
```

---

## Key Takeaways for Reviewer

**What went well:**

-   Clean separation of concerns (lib → hooks → components)
-   Zero `any` types, comprehensive type safety
-   Production-ready accessibility
-   Proper effects hygiene (no leaks, no stale closures)
-   Matches nunchi.trade design system

**What I'd improve with more time:**

-   Comprehensive test suite
-   Storybook for component variants
-   Error boundary for stream failures
-   More sophisticated gradient effects
-   Performance profiling with 100+ cards
