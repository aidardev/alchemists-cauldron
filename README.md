# Alchemist's Cauldron

A browser puzzle game: mix ingredients to match a potion's Temperature, Density and Magic Power, and earn points before time, lives or supplies run out.

## Implemented

- Ingredient shelf with hover/focus tooltips, inline stats on touch devices, limited stock and a cauldron capacity counter.
- 20 recipes across Easy, Medium and Hard, random recipe selection and brewing checks.
- Animated parameter bars with target zones, value markers and in-range highlighting.
- Score, lives, countdown, low-time warning and Game Over with the final score and reason.
- Manual and hidden-tab pause, Help and Settings dialogs.
- A local Top-10 leaderboard per difficulty, with name validation and confirmation before clearing results.
- Automatic saving and continuation through `localStorage`, saved-data validation and storage error handling.
- Pour Out clears a mixture for 10 seconds without losing a life or returning ingredients.
- Mouse drag and drop from the shelf into the cauldron, with valid drop-target highlighting.
- Floating ingredient icons inside the cauldron, a green pulse on success, and a local explosion with a short field shake on failure. Effects use CSS animations, pause with the game and respect reduced-motion preferences.
- Responsive mobile and desktop layout with reduced-motion support.

## How to play

1. Choose a difficulty in **Settings** (gear icon), then click **Start game**. Medium is the default. Difficulty is fixed for the run.
2. Click ingredient cards or drag them into the cauldron to add portions. Hover or focus a card to read its base parameter values; on touch devices these stay inline. Stock always stays on the card, starting with 2–15 portions. The shelf locks when the cauldron is full, while tooltips remain available for stocked cards. Each successful drop spends one portion; cancelling a drag spends nothing. On touch screens, tap the cards.
3. Match all three recipe ranges using the parameter bars. Values are ingredient sums; brewing allows the selected difficulty's tolerance on each side of each range.
4. Click **Brew** with at least one ingredient. Success awards points, adds time and draws a new recipe. Failure costs one life and keeps the recipe. Every brew empties the cauldron; ingredients are spent permanently. Time bonuses are capped at the starting duration.
5. Use **Pour Out −10 s** to discard a non-empty mixture without losing a life. The recipe and score stay the same; spent ingredients do not return. The action can end the run if time or supplies run out.
6. **Pause** stops the clock and hides the field; **Resume** continues. Hiding the browser tab also pauses the game. The run ends when time or lives reach zero, or both shelf and cauldron are empty. **Play again** starts a fresh run.

The bottom-right icons open **Help**, **Leaderboard** and **Settings**. Qualifying scores can be saved with a name of 2–15 characters: letters, digits, spaces, `_` or `-`. Leaderboards are stored in the current browser; earlier results rank higher on ties.

| Rule               |  Easy | Medium |  Hard |
| ------------------ | ----: | -----: | ----: |
| Ingredient types   |     4 |      6 |     8 |
| Cauldron capacity  |     4 |      4 |     5 |
| Starting time      | 180 s |  150 s | 150 s |
| Lives              |     5 |      3 |     3 |
| Brew tolerance     |   ±12 |     ±8 |    ±5 |
| Points per success |   100 |    200 |   300 |
| Time bonus         | +15 s |  +10 s |  +5 s |

## Keyboard controls

| Key          | Action                           |
| ------------ | -------------------------------- |
| 1–8          | Add an ingredient in shelf order |
| B            | Brew                             |
| X            | Pour Out                         |
| P or Esc     | Pause                            |
| Tab          | Move focus between controls      |
| Enter, Space | Press the focused button         |

Ingredient keys use the top number row: 1–4 on Easy, 1–6 on Medium and 1–8 on Hard. Empty slots keep their number. Letter shortcuts use physical key positions and work with other keyboard layouts.

Game shortcuts run only during active play. Typing, held keys and modifier combinations are ignored. On pause, use the Resume button or press Esc to close the dialog and continue; normal keyboard navigation remains available in menus and dialogs.

## Save and continue

Progress is saved automatically during play and on pause. After a reload or reopening the page, **Continue Game** restores difficulty, score, time, lives, recipe, mixture and stock. It opens the game paused; click **Resume** to continue.

**New game** replaces the save. **Exit to Menu** discards the run and clears its save. Finished games cannot be continued.

## Run locally

Requires Node.js 22.13+ (22.x) or 24+, and npm. From the repository root:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite in Google Chrome.

Build and preview the production version:

```bash
npm run build
npm run preview
```

## Tech and structure

Vanilla TypeScript, HTML, SCSS and Vite. DOM components, CSS animations and SVG icons.

`src/data` holds game data; `src/logic` holds rules and view selectors; `src/state` manages state and timing; `src/storage` handles saves and leaderboards; `src/ui` contains components and dialogs; `src/styles` contains shared styles and design tokens.
