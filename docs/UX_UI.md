# Casino Blackjack — UX/UI Specification

Document date: 2026-09-28  
Document task: UXUI-1.0  
Intended repository location: `docs/UX_UI.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Primary implementation milestone: `M7 — Browser UX/UI and E2E`  
Status: UX authority. M7 browser implementation and executable mappings now exist; actual verification/delivery is recorded in STATE. Mechanical PASS is not acceptance or deployment.

## 1. Purpose

### M8 authorized demo extension

The secondary Demo and audit tools panel follows primary gameplay/results. A new demo session can select Classic Blackjack or Five-Card Charlie Demo before initial betting, or after financial COMMITTED/VOID. This explicitly restores 1000 simulation credits and records a session reset. No silent in-round profile change. Five-Card Charlie is labelled a custom demonstration profile, with normal 1:1 return and Charlie Win (including fifth-card 21), never a Natural award.

Optional uint32 seed is for reproducible portfolio demonstrations. Input is removed while play is active; no seed/PRNG state or prediction controls enter the active public snapshot. Normal blank-seed sessions keep existing randomness. Seeded sessions alone offer completed-session package view/copy and Replay completed session after COMMITTED/VOID. NEXT removes package/result display and export availability. Replay mode is a separate labelled result panel; original results/balances remain unchanged. Clipboard refusal gives keyboard-copy guidance.

Public audit history is collapsible and secondary: ordered sequence, actor/action/status, UTC time, round/seat/hand, affected amount/result. It never renders cards, physical IDs, shoe order, seed or developer stack traces. Native summary/select/input/buttons retain keyboard focus indicators; wrapped text and bounded textarea/list keep 320px usable. Domain/controller enforcement still guards every command and restart/export boundary. Historical M7 absence checks are anchored to accepted M7 only where explicitly authorized; active Classic and secrecy assertions still run against current UI.

This document defines how the Casino Blackjack project should present game state and player interaction in the browser.

It is not the source of truth for Blackjack rules.

Use:

- `docs/RULES.md` for game and wagering rules;
- `docs/SPEC.md` for milestone scope and acceptance criteria;
- `docs/DESIGN.md` for engine architecture;
- `docs/STATE.md` for actual implementation state.

If this document conflicts with `RULES.md` or `SPEC.md`, stop and resolve the conflict rather than changing behaviour silently.

M1 remains headless. These UX/UI requirements become implementation requirements only when the relevant browser milestone is active.

## 2. UX goals

The interface should feel like a modern online Blackjack table while remaining clear enough for a software-engineering portfolio demo.

Primary goals:

1. Make the current round state understandable within a few seconds.
2. Make legal actions obvious and illegal actions visibly unavailable.
3. Never rely on UI state as the only enforcement layer.
4. Keep Dealer, local player, other seats, wagers, and results visually distinct.
5. Preserve hidden information correctly.
6. Keep important status and error feedback readable without requiring animation.
7. Support keyboard-only operation for the primary local-player workflow.
8. Remain usable at narrow mobile widths and normal desktop widths.
9. Avoid decorative casino effects that obscure game state.
10. Clearly identify simulated credits as non-redeemable demo value.

## 3. Product identity

Working product name:

`Casino Blackjack`

Possible subtitle:

`A verifiable multi-seat Blackjack engine and browser demo`

Do not use branding or wording that implies:

- licensed gambling;
- real-money play;
- real casino certification;
- live human dealer;
- production wagering;
- cash-equivalent credits.

A persistent or easily visible note should make clear:

`Simulation credits only — no real-money gambling.`

## 4. Primary player journey

Long-term browser journey:

```text
Open table
  ↓
See seat/table state
  ↓
Choose or occupy a seat
  ↓
Set main wager
  ↓
Optionally set approved side bets
  ↓
Betting closes
  ↓
Initial deal
  ↓
Insurance / Even Money window if applicable
  ↓
Player turn
  ├── Hit
  ├── Stand
  ├── Double
  ├── Split
  └── Surrender
  ↓
Other seats resolve
  ↓
Dealer turn
  ↓
Settlement
  ↓
Round result
  ↓
Next betting round
```

M1 does not expose this flow yet.

## 5. Desktop table composition

Desktop-first conceptual layout:

```text
┌────────────────────────────────────────────────────────────┐
│ Casino Blackjack                           Shoe / Round     │
│ Simulation credits only                                    │
│                                                            │
│                       DEALER                               │
│                    [K♠] [CARD BACK]                        │
│                       10                                   │
│                                                            │
│        Seat 1        Seat 2        Seat 3        Seat 4    │
│        [AI]          [Empty]       [Human]       [AI]      │
│                                                            │
│              Seat 5        Seat 6        Seat 7             │
│              [AI]          [Empty]       [AI]               │
│                                                            │
│                     LOCAL PLAYER AREA                       │
│             Cards / total / wager / hand status            │
│                                                            │
│       [Hit] [Stand] [Double] [Split] [Surrender]            │
│                                                            │
│   Balance      Main Bet      Side Bets      Round Status    │
└────────────────────────────────────────────────────────────┘
```

This is a structural direction, not a pixel-perfect layout requirement.

## 6. Visual hierarchy

Priority order:

1. Dealer and current local-player hand
2. Current legal actions
3. Round status/result
4. Local credits/wager information
5. Other seats and their visible state
6. Shoe/cut information
7. Secondary history/audit information

Do not give minor decorative information more visual emphasis than the current decision.

## 7. Dealer presentation

The Dealer area should display:

- visible upcard;
- hole card as a card back before reveal;
- visible total only when it can be computed from public information without leaking the hole card;
- final Dealer total after reveal;
- Dealer Blackjack/Bust/Stand status when applicable.

### Hole-card rule

Before reveal:

- do not display rank;
- do not display suit;
- do not display physical-card ID;
- do not expose hidden-card content through accessibility labels, title attributes, debugging text, or player-facing JSON.

The UI should consume the engine's public/redacted state rather than receive secret data and merely hide it visually.

## 8. Seat model

The long-term UI supports seven modelled seats.

Each seat may appear as:

- `Human`
- `Computer`
- `Empty`
- `Sitting Out`

Each occupied/active seat should make visible:

- seat number or stable label;
- participant type;
- cards;
- current visible total;
- main wager;
- hand status;
- active-turn indicator when relevant;
- result after settlement.

Do not show hidden/private controls or non-public bot information.

## 9. Local player emphasis

The local human-controlled seat should be visually distinguishable from other seats without depending only on colour.

Use at least one of:

- explicit `You` label;
- stronger border;
- location in the interface;
- icon/marker;
- accessible text.

Avoid effects that make the local player look like a different rule category.

## 10. Computer-player presentation

Computer players must be labelled as computer-controlled.

Do not imply they are real remote humans.

Recommended labels:

```text
Computer
Bot
AI Player
```

If `AI Player` is used, documentation should make clear that the initial bot behaviour is deterministic policy logic, not an LLM.

## 11. Game-state presentation

The browser should expose an understandable state label, for example:

```text
BETTING_OPEN
DEALING
INSURANCE_WINDOW
PLAYER_TURN
WAITING_FOR_OTHER_SEATS
DEALER_TURN
SETTLEMENT
ROUND_COMPLETE
INTEGRITY_ERROR
```

The exact internal enum may differ, but the user-visible message must be clear.

Examples:

```text
Your turn
Waiting for Seat 4
Dealer is drawing
Round complete
Shoe is being replaced
```

Avoid exposing raw internal implementation names when a clearer user message exists.

## 12. Player action controls

Core action controls:

- Hit
- Stand
- Double
- Split
- Surrender

Buttons must be:

- visible when relevant;
- enabled only when legally selectable;
- disabled when temporarily unavailable;
- absent or clearly unavailable when the table profile does not support that action.

### Disabled controls

A disabled action should expose the reason when useful.

Examples:

```text
Double unavailable — insufficient credits
Split unavailable — hand limit reached
Surrender unavailable — first decision already used
```

However, disabled UI is only guidance. The engine must still reject the action if called directly.

## 13. Betting controls

Future betting controls should support:

- main wager;
- Pair side bet;
- three-card side bet;
- Insurance when offered;
- Bet Behind where applicable.

Do not expose a control for a wager type outside its legal timing window.

### Credit clarity

Always distinguish:

```text
Available credits
Reserved/current wager
Pending return
```

Do not display one combined number if doing so hides the difference between spendable and committed credits.

## 14. Insufficient-credit UX

When an action requires additional credits and the player cannot afford it:

- the action is not accepted;
- balance does not become negative;
- no card is consumed;
- no wager mutates;
- the player receives a concise explanation.

Example:

```text
Cannot double: you need 100 more credits, but only 50 are available.
```

Do not use alarming language for normal rule rejection.

## 15. Split-hand UX

When Split exists:

- each child hand must have a stable visual identity;
- current hand must be obvious;
- completed hands remain visible;
- wager per hand must be visible;
- hand order must match engine sequencing;
- hand results must not overwrite one another.

Conceptual example:

```text
Seat 3 — You

Hand A   [8♠][3♥]   11   Bet 100   ACTIVE
Hand B   [8♦][K♣]   18   Bet 100   WAITING
```

For Re-split, preserve clear ordering.

## 16. Split Aces UX

When Aces are split under the approved house rule:

- each split-Ace hand receives exactly one additional card;
- Hit/Double/Surrender controls are unavailable for those hands;
- the UI should not imply that `A + K` after Split is Natural Blackjack;
- if useful, label result as `21` rather than `Blackjack`.

## 17. Double UX

When Double is available:

- show that additional wager is required;
- show the added amount before confirmation if the UX includes confirmation;
- after acceptance, exactly one additional card is shown;
- the hand then becomes completed.

Example:

```text
Double
Additional wager: 100 credits
```

Do not allow the player to click Hit after a completed Double.

## 18. Surrender UX

When Late Surrender is legal:

- make it clear that half the original wager is lost;
- after acceptance, the hand becomes terminal;
- the result should not look like a normal full loss.

Example:

```text
Surrendered
Returned: 50
Lost: 50
```

## 19. Insurance and Even Money UX

When Dealer shows Ace:

- display a dedicated decision state before Dealer peek;
- offer Insurance only to eligible wagers;
- show required Insurance amount;
- show Even Money only when applicable to a Natural Blackjack.

Insurance and Even Money should be presented as different choices.

Do not show Insurance after the Dealer peek.

## 20. Side-bet UX

### Pair side bet

Show result classification when placed:

```text
Perfect Pair
Coloured Pair
Mixed Pair
No Pair
```

### Three-card side bet

Show the evaluated category only when a side wager exists:

```text
Suited Trips
Straight Flush
Three of a Kind
Straight
Flush
No Win
```

Side-bet results should be visually separate from the main Blackjack hand result.

## 21. Bet Behind UX

Bet Behind should communicate three roles:

```text
Seat controller
Main bettor
Back bettor
```

A follower should be able to see:

- target seat;
- own back-bet amount;
- whether the controller doubled/split;
- whether the follower added the matching amount;
- which child hand the wager follows after a non-added Split.

Do not imply the back bettor controls Hit/Stand/Split/Double decisions.

## 22. Round result UX

Results should distinguish:

```text
Blackjack
Win
Loss
Push
Bust
Surrendered
Charlie Win
VOID / Integrity Error
```

A round summary should not reduce all seats to one table-wide winner.

Each hand/wager should preserve its own result.

## 23. Integrity-error UX

An integrity error is not a normal gambling loss.

Recommended treatment:

```text
Round interrupted
The game could not continue safely.
No gameplay winner was assigned.
```

When financial milestones exist, show that affected reserved simulated stakes were refunded if the rules require a void.

Avoid technical stack traces in the normal player UI.

Technical detail can be available in developer/audit output separately.

## 24. New-round behaviour

After `ROUND_COMPLETE`:

- action buttons for the completed hand are unavailable;
- a clear next-round control/state is available;
- existing shoe continues unless reshuffle is required;
- shoe replacement can be shown as a brief status message.

Example:

```text
Preparing next round
New shoe shuffled
```

Do not imply every round creates a new shoe.

## 25. Shoe information

Player-facing shoe information may include:

- `6-deck shoe`;
- cards remaining as an approximate/explicit count if approved;
- reshuffle status;
- cut-card reached message after the active round.

Do not expose:

- future card order;
- secret random state;
- hidden hole-card information.

Exact cut-position display is optional and should be decided at implementation time based on demo value.

## 26. Responsive behaviour

### Desktop

Primary target for portfolio/interview demonstration.

Requirements:

- dealer and local hand visible without horizontal scrolling;
- primary action controls visible near the local hand;
- seven seats arranged without overlapping;
- result/status remains readable.

### Tablet

Reflow seats into compact rows or arcs.

Do not shrink cards/buttons below usable sizes merely to preserve the desktop geometry.

### Mobile

At approximately 320 CSS px width:

- no page-level horizontal scrolling;
- action buttons remain tappable;
- local player's hand and current action remain highest priority;
- other seats may collapse into compact summaries;
- secondary history/shoe detail may move below primary play area.

## 27. Accessibility

Primary gameplay must be usable without a mouse.

Requirements:

- semantic `<button>` controls;
- native keyboard focus order;
- visible focus indicator;
- no essential hover-only interaction;
- status changes exposed through appropriate live-region behaviour where implemented;
- dealer card-back has a meaningful accessible label such as `Hidden dealer card`;
- colour is never the only indication of win/loss/active state;
- text contrast should remain readable;
- controls should have touch targets around 44×44 CSS px where practical.

Do not put secret card identity in `aria-label`, alt text, tooltip, or hidden text.

## 28. Motion and animation

Animation is optional and secondary.

Allowed examples:

- card deal movement;
- card flip on Dealer reveal;
- subtle chip movement;
- result transition.

Rules:

- gameplay state must remain understandable with animation disabled;
- respect `prefers-reduced-motion`;
- animation must not block legal input longer than necessary;
- no endless flashing, shaking, or casino-light effects.

## 29. Sound

Sound is optional and off by default unless explicitly enabled later.

If added:

- provide mute control;
- never use sound as the only feedback;
- do not auto-play disruptive audio on page load.

Sound is not required for M7 acceptance unless separately scoped.

## 30. Visual style direction

Desired tone:

- professional;
- modern casino table;
- clean;
- restrained;
- portfolio-ready.

Avoid:

- excessive neon;
- fake real-money branding;
- flashing jackpots;
- cluttered chip graphics;
- decorative elements that hide game state;
- copied proprietary casino artwork.

Suggested visual language:

- dark/neutral table surface;
- high-contrast cards;
- restrained accent colour for current interaction;
- readable sans-serif typography;
- clear spacing around active controls.

Exact palette, font, card artwork, and icon set are implementation decisions unless later locked by a design revision.

## 31. Information architecture

Recommended browser information groups:

```text
Table
├── Dealer
├── Seats
├── Local hand/actions
├── Betting/credits
├── Round status/result
├── Shoe status
└── Optional history/audit summary
```

Do not expose developer diagnostics inside the primary play surface.

## 32. Error and rejection messages

Messages should distinguish:

### Rule rejection

```text
You cannot split this hand.
```

### Funding rejection

```text
Not enough available credits to double.
```

### Timing rejection

```text
Betting is closed for this round.
```

### Integrity failure

```text
The round was interrupted because the game state could not continue safely.
```

Avoid generic `Something went wrong` when a more precise message is available.

## 33. UX acceptance criteria for M7

The exact M7 specification may refine these IDs later.

### UX-01 — Table comprehension

Dealer, local player, and other seats are visually distinguishable without relying only on colour.

### UX-02 — Legal actions

Only currently legal player actions are enabled.

### UX-03 — Domain enforcement

Calling an illegal action outside the UI is still rejected by the engine.

### UX-04 — Hole-card secrecy

Before reveal, no player-facing DOM/text/accessible state contains dealer hole-card identity.

### UX-05 — Round state

The current phase/action owner is understandable from visible text/state.

### UX-06 — Terminal protection

After a hand/round is terminal, the UI does not allow further gameplay mutation.

### UX-07 — Credit clarity

Available credits and committed/reserved wagers are distinguishable.

### UX-08 — Insufficient funds

Unaffordable Split/Double/Insurance/follow-on wager actions are unavailable and produce a clear reason without state mutation.

### UX-09 — Multi-hand clarity

Split hands remain individually identifiable, ordered, and show independent wager/result state.

### UX-10 — Multi-seat clarity

One player's terminal hand does not visually imply that the entire table is complete while other seats are active.

### UX-11 — Keyboard operation

The primary local-player workflow is operable by keyboard alone.

### UX-12 — Responsive layout

The agreed desktop and mobile viewport checks remain usable without clipped primary controls or page-level horizontal scrolling.

### UX-13 — Result clarity

Main-hand, side-bet, Insurance, and Bet Behind results are distinguishable.

### UX-14 — Simulated-credit disclosure

The UI clearly communicates that credits are simulated and non-redeemable.

## 34. Planned E2E scenarios

When M7 becomes active, Playwright or the agreed browser-test tool should cover at least:

1. Start a round and complete Hit/Stand flow.
2. Dealer hole card remains hidden until reveal.
3. Player cannot act after terminal state.
4. Disabled Double due to insufficient credits.
5. Split produces two visible hands and correct action order.
6. Split Aces do not expose Hit/Double controls.
7. Surrender ends the hand with half-return presentation.
8. Dealer Ace opens Insurance/Even Money decision state when applicable.
9. One seat busts while another seat remains active.
10. Side-bet result remains separate from main-hand result.
11. Bet Behind follower does not control the hand.
12. Keyboard-only primary action flow.
13. Narrow mobile viewport remains usable.
14. Classic table does not display Charlie result for a five-card hand.
15. Integrity error is shown as interruption/void, not a player loss.

M7 now implements these scenarios with unique E2E-01..15 tags; executable ownership is in M7_MAPPING.md and executed results in STATE. The scenario requirements above are unchanged.

## 35. Non-goals for UI v1

Unless a future UX revision explicitly adds them:

- no casino lobby;
- no deposits/withdrawals;
- no real-money wallet;
- no chat;
- no live video dealer;
- no social profile/avatar system;
- no achievements/gamification;
- no loot boxes;
- no advertising;
- no autoplay gambling loop;
- no dark-pattern prompts encouraging larger bets;
- no unnecessary 3D engine;
- no mobile native app.

## 36. Current implementation status

M1-M6 are HUMAN ACCEPTED. M7 browser UI/controller/toolchain and real Chromium E2E are implemented; T01-T08 are VERIFIED/PUSHED. T09 documentation and final full validation are VERIFIED; exact publication is recorded in final delivery/Git. UX-01..14 have exact unique executable mappings in [M7_MAPPING](M7_MAPPING.md); all 15 planned scenarios actually ran. This factual status does not revise any UX/gameplay requirement.

M7 fresh independent review: NOT RUN. M7 ACCEPTED: NO. M8: NOT STARTED. Deployment: NOT RUN. Refer to STATE/DEVELOPMENT_LOG and the final delivery for current counts, version, SHA/parity and exact next action.
