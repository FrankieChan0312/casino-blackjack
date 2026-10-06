# M11 — Casino Platform Foundation

Owner-authorized overnight expansion; [batch contract](CASINO_OVERNIGHT_M11_M14_HANDOFF.md). Baseline main `1b71e164d537a8f3d39635fd91875813ec3e1c7a`, observed 2026-10-07 01:29:47 +08:00: live/tracking/local equal, CLEAN, 0/0, untracked0. Protected Blackjack release remains `blackjack-v1.0` / `79533bc22afb8571f8ff53e37cd95eaa6c65e5d8`.

## Contract

- Task ID/milestone M11; repairs0/10, maximum10/10, no exception.
- Recommended GPT-6.1 Sol / Max, client metadata availability confirmed; selected runtime NOT VERIFIED.
- Scope: thin lobby, native game navigation and deep links, Baccarat bootstrap. Existing product integration changes only the main entry; test discovery adds an explicit Casino root to Vitest/TypeScript. Accepted Blackjack modules stay in place and unchanged.
- Non-goals: engine extraction/refactor, Blackjack redesign, new dependencies/art, playable Baccarat before its milestone, multiplayer, deployment or M15.
- Acceptance: truthful lobby availability, accepted Blackjack entry, stable routes/navigation/refresh, semantic keyboard links, >=44px targets, desktop/tablet/mobile without horizontal overflow, formal Dealer and zero retired depiction, all existing preservation and full gates PASS0. Human visual acceptance PENDING under explicit overnight deferral.
- Step -> verification: route mapping/lazy mounting -> unit + native-link/deep-link/refresh browser tests; scoped visual frame -> three widths/keyboard and screenshots; unchanged Blackjack -> protected-input comparison + all preserved tests; publication -> docs/privacy/diff/normal main commit-push and CLEAN/live0/0/untracked0.
- Stop: conflict, unknown overlap, unavailable required tool, sensitive data, unauthorized/destructive operation, repeated no-progress failure or10failed repairs. No next task before clean verified publication.

## Approved thin integration

No router exists at the accepted entry. Native same-origin links and Vite's existing HTML history fallback are sufficient; refresh/deep-link smoke must actually pass. `/casino` is the Casino Lobby. `/blackjack` loads the unchanged accepted App and adds a subordinate navigation footer. `/baccarat` is the explicitly labelled non-playable bootstrap until M13. `/` retains the exact legacy Blackjack DOM, without an added wrapper/navigation; this protects the accepted direct entry and historical tests. Unknown paths provide a labelled return to the lobby.

`blackjackEntry()` retains the existing construction, fixture exclusion and App props; it executes only for Blackjack routes. Lobby/Baccarat preview never construct a Blackjack controller or consume its gameplay randomness. No app copy, file move, domain rename, shared casino engine or dependency upgrade. New CSS selectors are scoped to `casino-*`; accepted Blackjack CSS and motion tokens stay unchanged.

The lobby reuses Georgia/Segoe typography, felt/charcoal/gold palette and existing Celestine formal portrait through DealerAvatar (including its approved fallback hierarchy). No new art is generated. Available Blackjack links to play; Baccarat says IN DEVELOPMENT and links to preview. Each table is an explicitly local simulation session; no persistence/account claim.

## Evidence owners

Unit `[M11-U01..05]` and browser `[M11-B01,B02-1280/768/320,B03]`; full unchanged verify.ps1 includes all old Vitest/Chromium and independent M1–M8 preservation. Actual execution/repair/Git status belongs in STATE/DEVELOPMENT_LOG and the batch handoff. New screenshots are initially written under `.git/overnight/visual/m11`, then inspected/scanned before publication.

## Historical test inventory boundary — 2026-10-07 01:57:47 +08:00

New Casino tests use casino-tests/ with explicit additive Vitest and TypeScript discovery. Original tests/ contains the frozen historical inventory; every original registration and assertion stays unchanged. Full verification executes both roots. This infrastructure-only discovery amendment does not change accepted Blackjack behavior.

## Verified checkpoint — 2026-10-07 02:19:14 +08:00

M11 IMPLEMENTED / VERIFIED; COMMIT/PUSH PENDING. Final unchanged verify.ps1 PASS/native0:102files/1245Vitest,250Chromium, typecheck/lint/domain/build/fixture exclusion and independentM1–M8 preservation. Focused23unit and repaired5browser PASS0; accepted268protectedinputs unchanged plus exact additive test-discovery config, live retiredDealer0. /casino lobby, /blackjack accepted app/footer, /baccarat truthful bootstrap; / legacy preserved; lazy construction and no new dependencies/assets. Final1280/768/320 screenshots inspected. Repairs2/10 (new-test fixture assumption; explicit discovery boundary), failed PNG/context/trace and native output retained. Same-session review PASS; fresh-session review NOT RUN. Human Visual Acceptance PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION. Final docs/privacy/publication pending.

[Native gate receipt](CASINO_OVERNIGHT_EVIDENCE/m11/m11-repair2-unified.json). [Desktop lobby](CASINO_OVERNIGHT_EVIDENCE/m11/gallery/lobby-1280.png), [tablet](CASINO_OVERNIGHT_EVIDENCE/m11/gallery/lobby-768.png), [mobile](CASINO_OVERNIGHT_EVIDENCE/m11/gallery/lobby-320.png), [Blackjack deep link](CASINO_OVERNIGHT_EVIDENCE/m11/gallery/blackjack.png).
