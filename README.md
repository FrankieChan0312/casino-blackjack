# Casino Blackjack

A local React browser demo backed by a headless TypeScript Blackjack engine, with deterministic domain tests and real Chromium end-to-end checks.

**Simulation credits only: no real-money gambling or redemption.** M1-M6 are HUMAN ACCEPTED. M6 was accepted at `681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5` after the user's fresh independent review reported NO FINDINGS. M7 T01-T09 are mechanically verified; the final documentation checkpoint supplies the fresh-review package. M7 independent review is NOT RUN and M7 is NOT ACCEPTED. No deployed URL or casino/security certification is claimed. [STATE](docs/STATE.md) records current evidence; [review handoff](docs/M7_REVIEW_HANDOFF.md) defines the next gate.

## Run locally

Use Node **>=24.19.0 <25**, npm and Windows PowerShell. From the repository:

```powershell
npm.cmd ci
npx.cmd playwright install chromium
npm.cmd run dev
```

Open the localhost address Vite prints (normally http://127.0.0.1:5173). Choose your seat or Spectator, optionally select computer seats, then Open betting. Set your MAIN and optional Pair/THREE_CARD wagers. Place computer MAIN wagers explicitly to activate their seats or enable Bet Behind. Close betting and deal. Use the enabled local actions; **Continue table** explicitly advances computer/dealer play. At completion, **Next round** retains credits and the persistent shoe. Refresh starts a new in-memory session; there is no save/load or automatic credit replenishment.

```powershell
npm.cmd run build
npm.cmd run preview
npm.cmd test
npm.cmd run test:e2e
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ./scripts/verify.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ./scripts/verify-preservation.ps1
```

The unified harness checks typecheck, lint, Vitest, a DOM-free domain compile, production Vite build (including fixture exclusion) and Chromium E2E. Each failed required command propagates non-zero status. E2E starts its own localhost Vite server on port 4173; that port must be free. Chromium must be installed before running it. Historical preservation reruns M1-M6 suites separately and checks original test preservation.

## Browser behaviour

- Seven explicit Human/Computer/Empty/Sitting Out seats, one local HUMAN marked **You**, or spectator mode. Computers use deterministic Hit/Stand policy, not LLM intelligence or remote people.
- Separate Available, Reserved/current exposure and Pending return amounts; starting funds are 1000 simulated credits. Internal integer half-credit units render exact .5 values.
- MAIN and Bet Behind: 10-1000 whole credits. Pair/THREE_CARD: 1-100 whole credits, own-seat only. OPEN-only placement/change/cancellation; closing freezes wagers.
- Hit, Stand, matching-funded Double, Split/Re-split, one-card Split Aces and Late Surrender. Ordered hands have stable labels and independent stakes/status/results. Split A+ten is ordinary 21.
- Pre-peek Insurance and eligible Even Money are distinct choices. Bet Behind followers own stakes/financial decisions and never choose target card actions.
- Independent main, side, Insurance and Bet Behind result groups. Required-draw integrity failure is interruption/VOID with actual-stake refunds, rather than normal loss. Healthy six-deck shoes persist; replacement occurs only when required at the next deal.
- Semantic controls, labels, live status, visible focus, keyboard workflow and local-hand priority. Desktop, tablet and 320px layouts have executable overflow/touch checks. No animation or sound.

## Architecture and verification

`src/domain` owns rules and immutable transitions. `src/browser/controller.ts` retains the latest returned state, invokes authoritative commands, explicitly advances computers/dealer, finalizes completed/faulted rounds and projects only public fields. React receives safe snapshots and callbacks. The dealer hole identity, shoe order and physical card IDs never enter the player-facing React tree before reveal.

Read-only domain action/wager queries reuse authoritative validation; disabled buttons are guidance, and illegal direct commands still reject. A separate ES2023-only compile and AST import-boundary test keep the domain independent from React/DOM/Playwright/UI modules. Historical REG-M6-095 now checks browser absence at accepted M6 Git objects, as explicitly authorized; REG-M6-001..094 are unchanged.

Current executable evidence: **56 Vitest files / 870 tests**, **1 Chromium project / 24 tests**, **UX-01..14**, **REG-M7-001..064** and all **15 required browser scenarios**. Exact unique owners are in [M7_MAPPING](docs/M7_MAPPING.md). [DESIGN](docs/DESIGN.md) explains the boundary; [LAB_MANUAL](docs/LAB_MANUAL.md) explains the tests and tradeoffs. [RULES](docs/RULES.md), [SPEC](docs/SPEC.md) and [UX_UI](docs/UX_UI.md) remain the authorities.

The normal computer policy only Hits below 17 and Stands at 17+. It never initiates Double/Split/Surrender, so advanced follower screens are verified using clearly isolated real-domain test fixtures, not a second HUMAN or changed bot policy. Vite e2e mode is used only by the test runner; production build excludes these factories. This is not a user-facing seed/replay product.

Historical headless command surfaces remain importable: `game.ts` (M1), `tableGame.ts` (M2), `bettingGame.ts` (M3), `advancedGame.ts` (M4), `optionalGame.ts` (M5), `behindGame.ts`/`behindController.ts` (M6), with their matching public views. Retain returned states and use the orchestration API matching the state; bypassing wrappers bypasses their decision/funding timing. Existing financial, secrecy and integrity tests remain authoritative.

## Limits

Local memory only; no persistence, accounts, server, database, network multiplayer or production deployment. Only Chromium is in the browser matrix. Native keyboard, focus, names and ARIA secrecy are checked; this is not a formal WCAG certification or a full assistive-technology audit. Manual Continue table keeps computer/dealer steps explicit. M8 Charlie/replay/audit products are NOT STARTED.
