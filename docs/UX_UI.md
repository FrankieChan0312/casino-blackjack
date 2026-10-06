## Authorized M13 playable Baccarat amendment — 2026-10-07 02:59:14 +08:00

[Table scope/acceptance and approved presentation](BACCARAT_TABLE.md) connects M12 authority to a single-user Baccarat table with existing art/cards/visual vocabulary. This supersedes only M11 Baccarat bootstrap availability. Accepted Blackjack remains protected; static dealing now, M14 animation after clean technical gate. Human visual acceptance PENDING; no multiplayer/deployment/M15.

## Authorized Casino Platform M11 amendment — 2026-10-07 01:33:04 +08:00

The owner authorizes a thin platform around accepted Blackjack; [M11 scope, acceptance and approved integration](CASINO_PLATFORM.md) defines /casino lobby, /blackjack deep link and /baccarat bootstrap, preserving /. Existing Blackjack requirements and accepted behaviour remain protected. Baccarat engine/UI/presentation require sequential M12/M13/M14 gates; no multiplayer, deployment or M15. This requirement/design amendment is not verification or human visual acceptance. Earlier M10 planning statements below are historical; M10 remains ACCEPTED / CLOSED under its final owner closure.

## M10-PRE-T11 owner requirement and acceptance — 2026-10-06 10:43:11 +08:00

M10-T07 / T08 / T09 / T10 HUMAN VISUAL ACCEPTANCE: **ACCEPTED**, explicitly recorded by the owner. Their dated PENDING records remain historical. [Legacy Dealer cleanup](M10_PRE_T11_DEALER_CLEANUP.md) is a new task, starting 0/10 with normal maximum10; closed T04/T06 counters remain unchanged. M10-T11 NOT STARTED; DEPLOYMENT NOT RUN.

The old cartoon Dealer is retired from all live setup, active, exhausted-pool, unconfigured, failed-image, replay, quiet/immediate and responsive paths. Keep the exact five approved roster identities, deterministic session ordinal and seated exclusion. Before safe session resolution, or with no eligible/available roster portrait, use the owner-approved **non-roster generic formal portrait**; requested image failure -> generic PNG -> neutral non-image placeholder. No new identity, seat, RNG, replay/digest state, fake preview session, animation or timing change. This supersedes only the earlier generic illustration depiction; historical evidence and computer guest drawings stay intact. Implementation/verification of this new task initially NOT RUN; owner acceptance of this task PENDING.

## M10-T04B approved formal pool amendment — 2026-10-05 11:29:53 +08:00

The owner supplies and approves the five-pair Dealer pack in [M10-T04B](M10_T04B.md), superseding the earlier absent-asset prerequisite and canonical-ID production fallback policy. The production registry is exactly noble_female/Celestine, knight_female/Seraphine, mage_female/Nyra, elf_female/Elaria, halforc_female/Vesha. Sources1086x1448 and runtime240x320 are transparent3:4 PNGs copied unchanged; original MANIFEST.json and separate import/provenance receipt retained. No PA1 artwork/provenance is rewritten and no generation/resizing is performed.

Use the existing presentationSession ordinal, starting0 on a new controller, to begin at ordinal modulo5 and scan cyclically past all seated human/computer identities including Sitting Out. Preserve the entire existing lineup; if all five are seated use null/non-roster generic Dealer. Successful existing NEW_TABLE/new-demo/MODE reset advances the ordinal; NEXT/REPEAT/actions/resize/avatar changes retain the assignment. Assignment is presentation-only and consumes zero gameplay RNG. No wall clock or persistent storage is used. The old unconfigured helper remains supported; its historical tests use an explicit e2e-only legacy input.

The portrait uses contain within the existing Dealer reserve, with short alt text Dealer: name and generic fallback on unavailable/decode-failed artwork. Actual visible cards, hidden-card back, public total/status, shoe and3:2/S17 rules remain authoritative and separate from decorative cards held in the portrait. IDLE/DEALING/WAITING_PLAYER/REVEALING/DRAWING/SETTLING all use the same static PNG. STATIC FORMAL PORTRAIT USED FOR ALL SIX STATES. ANIMATION NOT IMPLEMENTED.

This static integration has focused technical/visual evidence; full gate and owner human visual acceptance are recorded separately in STATE. Earlier planning/absence records remain historical. M10-T05 NOT STARTED; MOTION NOT INSTALLED; DEPLOYMENT NOT RUN.

# M10A casino-game composition and attention amendment

Current owner decision: **M10-T01 Human Visual Acceptance = NOT ACCEPTED** despite technically verified/published geometry and11/11 repairs. [M10A planning](M10A_PLANNING.md) responds with a new composition milestone, not another T01 repair. [DESIGN M10A.1–18](DESIGN.md) owns visual structure; [SPEC](SPEC.md) owns acceptance. All implementation tasks/M10-T02/M10-T04 remain NOT STARTED, planning acceptance pending, deployment NOT RUN. This amendment changes no current gameplay.

## M10A attention and local ownership

At entry/betting, attention goes to the local wager spot and explicit Deal; during decisions, to the local current hand/score and attached legal actions; at completion, to that hand's result and exact returned/net values followed by Deal Again/Repeat Bet. The Dealer's public cards/state remain visible as the shared comparison context, with opponents subordinate but recognizable. Header/disclaimer/secondary setup/character/demo tools support this scene rather than becoming equal-sized panels. Keep simulation-only/no-redemption disclosure readable.

The lower-centre HUD visibly says You / Human / Seat4 with the selected avatar/name and full hand. Its label connects it to the retained real-seat arc marker even when the future even-count slot is right-central. It is the same human/hand, not a duplicate player. Cards, adjacent total, accepted wager and active split-leaf label form one meaningful unit. Show each full semantic hand/decision once and retain stable seat/hand IDs.

## M10A turns, computer players and Dealer state

Use explicit Current hand / Your turn text and visible border/icon plus colour. Current seat and current hand come from public authority; never infer a turn from an animation or card position. A computer unit says Computer and its stable seat/name, with public hand total/result or Sitting Out/Waiting as applicable. Do not imply a completed automatic computer is still awaiting input. M10A remains static immediate presentation; future M10-T05 owns presentation-catch-up labelling.

Dealer status belongs beside the upper-centre public card lane: waiting/betting, Hole card hidden / Visible total, publicly revealed cards/total, completed result or integrity interruption. Reserve future character/shoe/gesture destinations without pretending they are implemented. Hidden rank/suit must never enter tooltip, text, ARIA or a cosmetic placeholder. DESIGN M10.7 continues to govern the future avatar/formal variant and IDLE/DEALING/WAITING_PLAYER/REVEALING/DRAWING/SETTLING mapping; M10-T04 owns character integration, not this zone plan.

## M10A control and split-hand context

Hit/Stand/Double/Split/Surrender sit immediately beside/beneath the actual local hand or along its lower rail, with native labelled controls and unchanged legal-action/rejection reasons. Preserve Insurance/Even Money/follower decision ownership, Deal/Repeat/result focus restoration and optional wager/manual access. Visual closeness cannot change semantic or command ownership. Keyboard order remains Dealer/ascending occupied seats and named hands -> local decisions -> funds/detail/status -> secondary tools; controls clearly name the hand/seat when multiple contexts exist. Focus survives resize/reflow and repeated rounds.

Split hands are ordered child units of the same seat. Keep the existing hand label, exact cards, per-leaf stake/total/result and Current hand indication for all four possible leaves, including completed/busted leaves. Five cards wrap/fan only with readable identities. No combined split total, mislabeled split Blackjack, hidden leaf or early supplement is permitted. Vertical reflow is acceptable; the current decision and its corresponding hand must stay understandable while scrolling.

## M10A accounting and secondary access

Available, Reserved / current exposure and Pending return stay directly accessible in a compact local strip during betting/decisions/results. A keyboard-operable native disclosure may add per-wager financial explanations/results; it cannot hide those three values or relabel pending as available. Actual half-credit precision and rejection feedback remain. Seat units reserve balance context, but current public BrowserView has no computer-bankroll value: mark that future feature BLOCKED for a separately approved safe projection, never show inferred/fake money or raw engine data.

Secondary character/demo/audit/setup access stays labelled and subordinate; do not bury legal actions behind a details panel. Future player-count/Start remains M10-T02, with no selector added here. Existing profile/side/back choices retain their current scope and financial boundaries.

## M10A responsive and accessible interaction

Desktop prioritizes recognizable occupied seats/Dealer and comfortably accessible lower local actions within the normal1280x900 primary-play gate. Tablet tightens framing before card/control legibility. Mobile retains Dealer/felt/seat arc, active-opponent context, full own/current hand and integrated actions; other public hands expand in ascending labelled context rather than become generic dashboard cards. At200% text or actual browser200% zoom allow vertical scrolling without essential clipping/page horizontal overflow.

Preserve native keyboard access, meaningful screen-reader regions/labels, visible focus,44px primary targets and measured contrast (DESIGN M10A.14). Use text/icon plus colour for identity/turn/result; geometry alone is insufficient. Readable name/seat/controller fallback survives failed portraits/masks. Reduced motion retains identical static public facts/controls; later animation/Skip behaviour remains M10-T05/T10. Existing polite announcements convey decision/result changes rather than decorative frames. Separate actual-browser zoom from text-scaling evidence. Human review must confirm scene/hand/control comprehension, not only a DOM/test PASS.

## Retained M10 future casino-table interaction amendment

T01 geometry delivery: existing four-person entry/actions/characters retained with a half-ellipse felt/rail and central Dealer/card anchors; full hands use vertical flow and compact perimeter summaries on narrow screens. Planning HUMAN ACCEPTED; T01 IMPLEMENTED / VERIFIED, final verification PASS/0 after immutable-evidence repair7/10. Three viewport/five-card/four-leaf/200%-text/native-keyboard checks PASS. [T01 evidence](M10_T01.md). Count/Start setup and all motion described below remain future T02+ work; no implementation acceptance or deployment claimed.

M10 PLANNED / NOT STARTED. [SPEC acceptance](SPEC.md), [DESIGN presentation authority](DESIGN.md), [task sequence](PLAN.md). This owner-authorized planning amendment applies only to future M10 Player Mode; current product still uses accepted PA1 presentation and the implemented M9 journey.

Before explicit Start table/session, choose **Total players (including you)** from 1–7; dealer excluded, one local human plus 0–6 clearly labelled computers, default 4. This replaces automatic prepared-table entry only for the initial count choice; do not add repeated guest setup/wager forms. Count persists on Deal Again/Repeat Bet. Funded active participation may be lower when guests sit out. Count changes require an explicit new session at an existing safe reset boundary, with starting-credit-reset disclosure; no mid-round/funded change or silent refill.

People retain the responsive semicircle and ascending real-seat order: one central, two balanced, three left/centre/right and4–7 distributed. Local Seat4's canonical slot stays central for odd/right-central for even counts; the M10A amendment associates this same seat with its lower-centre full-hand/HUD rather than duplicating or renumbering it. M10A defines the visual composition; M10-T02/T03 still own actual count configuration and responsive binding. Vertical scrolling/labelled guest expansion are allowed; page horizontal scrolling and overlapping primary information are not.

Normal motion sequentially presents already-resolved cards in the RULES R08 two-pass order, culminating in a generic dealer hole-card back. Public reveal/draw and action/settlement motion follows actual authoritative events, never a timer-driven engine action. Dealer states/gestures accompany this sequence at top centre. Meaningful Dealing/Showing dealer play text describes presentation catch-up; actual human choices wait without timers. Skip animations immediately shows latest public facts. Temporarily unavailable inputs have a reason and cannot submit a stale staged hand; Skip/focus remain available. Decorative settlement cannot obstruct next-round access.

Mandatory M10 normal-motion dealing supersedes historical optional animation/immediate presentation only within this scope. `prefers-reduced-motion` or session Reduce motion removes flights/flips/gestures/stagger delays and retains equivalent semantic feedback/decisions. Switching preference or skipping changes presentation only. Keep 44px targets, visible focus, polite non-per-frame announcements, exact Available/Reserved/Pending, split leaf/result identity and explicit Insurance/Even Money/follower ownership. Hidden card identity must never enter public events/DOM/ARIA. Portrait failures retain readable names/controller text. No sound/3D/real-money branding or changes to accepted PA1 assets; future separate Dealer variants follow DESIGN M10.7, with no artwork created now. Existing terminal replay remains; separate animated replay is read-only and labelled.

This plan does not change RULES, accept M9, or establish visual acceptance. P0 and P1 require actual moving-table review and explicit owner acceptance after verified implementation and genuinely fresh review.

P0 Dealer clarification after owner review: **Dealer = avatar-derived character presentation entity**. Show a recognizable roster character at the existing T01 upper-centre Dealer anchor, supporting a separate formal casino-attire presentation variant while retaining face, hair and established style. Accepted player/source PNGs and provenance stay immutable. Within an active table/session the Dealer identity is not simultaneously a seated human/computer identity by default. No manual Dealer picker is required; assignment/exclusion policy remains future-defined. Premium formal attire is restrained and identity-led, with no rigid gender clothing rule or sexually explicit/exaggerated styling; [DESIGN M10.7](DESIGN.md) owns the detailed asset/visual contract.

Retain IDLE/DEALING/WAITING_PLAYER/REVEALING/DRAWING/SETTLING and restrained 2D gestures from already-resolved public events. At1280x900/768x1024/320x720 the character is readable/prominent and separate from cards/controls; reduced motion retains understandable quiet poses/text or immediate state changes with identical gameplay. A generic/unrelated standalone icon or static component alone is insufficient. M10-T04 prepares integration/role/variant/placement/state mappings; T05 infrastructure,T06 initial deal,T08 reveal/draw,T09 settlement keep their sequencing scope. This amendment implements no UI, artwork, selection, exclusion or animation; Dealer presentation never controls authoritative game behaviour.

## Historical pre-M10 UX records

## Current PA1 amendment

Current delivery receipt: [PA1 independent review ACCEPTED](PA1_INDEPENDENT_REVIEW.md) for `3c50ab4d0183cff13f2380bd60faa31583d3e988`, under conditional owner delegation. M9 HUMAN ACCEPTED: NO, M10 NOT STARTED, deployment NOT RUN. No UX requirements changed; the implementation acceptance/review status below is historical.

RA1 HUMAN ACCEPTED by explicit owner update supplied with PA1. M1-M8 HUMAN ACCEPTED; M9 HUMAN ACCEPTED: NO; PA1 HUMAN ACCEPTED: NO. Deployment NOT RUN. No M10. Earlier delivery status below is historical.

PA1 follows the [canonical fantasy roster and interaction contract](PA1_CONTRACT.md). Player Mode opens with Roland and keeps Change Character secondary and non-blocking. Human/Computer/You and seat numbers remain explicit alongside portrait/name/archetype. Unique guests persist through normal rounds, Deal Again and Repeat Bet; dealer remains independent. Choosing an occupied character exchanges that guest with your previous avatar. Cards/legal decisions/results retain priority at1280x900/768x1024/320x720, with native keyboard controls, visible focus,44px targets, reduced motion and hidden-card secrecy. T06 verified five PA1 browser checks plus all preserved checks, including failed images and200% root-text enlargement; [inspected screenshots and bounded coverage](PA1_SCREENSHOTS.md). Current inventory76 Vitest files/1031 tests/63 Chromium. T01-T07 implemented/verified/committed/pushed; T07 checkpoint9d1fa1a333aa1f3940333dc16f82b41ff6042734; fresh-review handoff prepared; PA1 fresh review NOT RUN. This narrowly supersedes M9 evening-attire guest art and historical local-avatar non-goal; accounts/social profiles remain outside scope.

<!-- END CURRENT PA1 -->

## Historical RA1 delivery

House Rules v1.2 / Re-split Aces: [contract](RA1_CONTRACT.md), [mapping](RA1_MAPPING.md), [evidence](RA1_EVIDENCE.md), [fresh-session handoff](RA1_REVIEW_HANDOFF.md). M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS at `8326f846ad753b79fd8d35f76b00f28854e2f448`; M9 ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

RA1-T01..T05 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. Final code/test checkpoint `1fc211a3b92aa095bc9d37de63e2f967a0a52ad4` published on main; normal push/fetch PASS/0 at 2026-10-02 00:52:21 +08:00, main=origin/main,0/0,clean/full untracked empty. Final evidence-only receipt SHA is identified by Git/final delivery. Official final harness PASS/0 at 2026-10-02 00:47:18 +08:00; complete Vitest/Chromium and accepted M1-M8 preservation PASS. Same-session task diff reviewed; genuinely fresh independent review remains pending. RA1 repair ledger T01..T05 `2,0,2,1,1` (each /10); historical M8 `0,2,3,2,2,1,2,6,4` and M9 `0,2,1,1,3,0,2,1,5` unchanged. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. RA1 fresh independent review NOT RUN.

Current inventory: **73 Vitest files / 1020 tests**, **1 Chromium project / 58 tests**; **30 uniquely mapped RSA regressions** plus additional preservation/contract/UI checks. Inventory is not execution evidence; checked results are in RA1_EVIDENCE. Default normal Player Mode: CLASSIC_6D_S17_V1_2. Supported: CLASSIC_6D_S17_V1_1, CHARLIE5_6D_S17_V1_1 (RSA OFF), CLASSIC_6D_S17_V1_2, CHARLIE5_6D_S17_V1_2 (RSA ON). Replay schema/RNG/digest/audit versions unchanged.

Records below preserve their historical versions, inventories, review boundaries and failed attempts; earlier M9 fresh-review NOT RUN statements are superseded by the supplied NO FINDINGS review at the baseline. They do not describe RA1 behavior or accept M9/RA1.

<!-- END CURRENT RA1 -->

## Current M9 delivery

M1-M8 HUMAN ACCEPTED. M8 HUMAN ACCEPTED at `8f5aca327f41f1078fc4fef20b611fd9cd494492`; final independent review NO FINDINGS, MEDIUM-05 CLOSED, all previous findings CLOSED. The owner's explicit acceptance was recorded with substantive T01. M8 repair ledger `0,2,3,2,2,1,2,6,4` remains unchanged.

M9-T01..T09 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED. Stop at the fresh-session review gate. M9 NOT ACCEPTED. Fresh-session review NOT RUN. Deployment NOT RUN. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED.

Current suite inventory: **68 Vitest files / 978 tests**, **1 Chromium project / 55 tests**. Execution results and failures are recorded separately in [M9 evidence](M9_EVIDENCE.md); inventory is not a PASS claim. [Fresh review pack](M9_REVIEW_HANDOFF.md). M9 cumulative repair ledger: `0,2,1,1,3,0,2,1,5`.

T09 implementation published on main at fc5cbd687a14e0e1eb1fae0ee6830e139397fe06, normal push/fetch PASS at 2026-10-01 22:35:03 +08:00, main=origin/main,0/0,clean/full untracked empty. This final documentation receipt changes no executable/test/dependency/runtime settings; its own final SHA is recorded in Git/delivery.

<!-- END CURRENT M9 -->

> The material below retains earlier milestone requirements and timestamped history. Earlier delivery/review statements are historical and superseded by the current delivery block above; manual UX remains supported in deliberate demo mode.

# Casino Blackjack — UX/UI Specification

## Historical M8 pre-acceptance review status

M1-M7 HUMAN ACCEPTED. M8 IMPLEMENTED / VERIFIED.
Current verification inventory: **66 Vitest files / 956 tests**, **1 Chromium project / 44 tests**.
Historical Original fresh review: COMPLETED at eb85032604b03031b5b934818fda773ea9aae666 (3 MEDIUM / 3 LOW).
Historical Repair batch 1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781.
Historical Independent recheck #1: COMPLETED at 5218bb9594580090cf39bad219a0b40f268c9781 (0 BLOCKER / 0 HIGH / 1 MEDIUM / 1 LOW).
Reconstructed independent review: COMPLETED at 07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54.
CLOSED BY INDEPENDENT REVIEW: MEDIUM-01, MEDIUM-02, MEDIUM-03, MEDIUM-04, LOW-01, LOW-02, LOW-03.
Independent complete-harness review: COMPLETED at 1c639cb6ab35fa7bad80a6db174cda115666279f (0 BLOCKER / 0 HIGH / 1 MEDIUM / 0 LOW).
LOW-04: CLOSED by independent review at 1c639cb6ab35fa7bad80a6db174cda115666279f.
LOW-05: CLOSED by independent review at 1c639cb6ab35fa7bad80a6db174cda115666279f.
All earlier M8 findings remain CLOSED. Only MEDIUM-05 (complete-harness reproducibility under full-suite load) remains OPEN.
MEDIUM-05: OPEN - repair VERIFIED; independent recheck pending.
Read-only diagnosis and stability evidence: [M8_HARNESS_STABILITY](M8_HARNESS_STABILITY.md). No independent recheck occurs in this implementation session; the next recheck requires a genuinely fresh reviewer and the repaired final SHA.
M8 NOT ACCEPTED. Deployment NOT RUN.

Document date: 2026-09-28  
Document task: UXUI-1.0  
Intended repository location: `docs/UX_UI.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Primary implementation milestone: `M7 — Browser UX/UI and E2E`  
Status: UX authority. Accepted M7 browser/mappings and implemented M8 secondary demo tools are described here; actual verification/delivery is recorded in STATE. Mechanical PASS is not acceptance or deployment.

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

RA1 v1.2 adds one explicit exception to automatic completion: a current A+A with a legal funded re-split displays Split and Stand as its only enabled actions. Explain that Stand keeps Soft 12 and that Split requires the matching wager. Both choices remain native keyboard buttons with descriptive text. Hit/Double/Surrender stay disabled and authority rejects direct calls. If funds/cap prevent RSA, complete automatically with no redundant Stand. Ordered descendants remain ahead of siblings; all leaves remain visible. Normal Player Mode starts Classic V1.2; deliberate historical profiles remain supported in secondary demo settings.

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

## M8 human manual feedback: visual polish

The owner found functionality acceptable but the UI visually boring. The authorized presentation repair uses a restrained CSS felt/rail, top-center Dealer, horseshoe seats with lower-center local priority, light playing cards and original card backs, active/result labels and larger action controls. On mobile, current public cards/actions precede compact seats while Dealer remains visible. Available, Reserved and Pending are compact and distinct; chip amounts select inputs before explicit Set. Action guidance is expandable with disabled-reason ARIA links; secondary settings/history stay below gameplay. Insurance/follower choices retain their ownership, amounts and consequences. Motion is presentation-only, disabled under reduced motion. No sound, asset dependency or gameplay-rule changes. The [manual game-feel checklist](M8_VISUAL_CHECKLIST.md) is pending owner evaluation; automated checks do not approve visual quality or make M8 ACCEPTED.

## 36. Historical pre-acceptance implementation status

M1-M7 are HUMAN ACCEPTED. M7's accepted HEAD is **da6f068ffd27713848ed48f023c17ed388b8b44e**, after a genuinely fresh independent review and explicit human acceptance. UX-01..14 have exact unique executable mappings in [M7_MAPPING](M7_MAPPING.md); all 15 planned E2E scenarios ran and remain in preservation verification. This status does not revise any UX/gameplay requirement.

M8 T01-T09 implementation exists and is VERIFIED. Reconstructed independent review completed at07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54 and closed MEDIUM-01..04 and LOW-01..03. The later complete-harness review at1c639cb closed LOW-04/05 and opened MEDIUM-05; stability verification and independent recheck status are recorded above and in STATE. The title and ACTIVE now use a dedicated wrapping hand-header, preserving both labels in normal flow. M8 ACCEPTED: NO. Deployment: NOT RUN. The bounded seeded demo rejects commands before mutation when fewer than two journal entries remain, reserving an automatic SETTLE/VOID; an unfinished capped demo requires refresh, while finalized sessions retain Start new demo. Refer to [STATE](STATE.md), [DEVELOPMENT_LOG](DEVELOPMENT_LOG.md) and [M8_REVIEW_HANDOFF](M8_REVIEW_HANDOFF.md).

## 37. M9 Player Mode authority

The [M9 contract](M9_CONTRACT.md) supersedes the historical manual default journey for Player Mode only. Open table -> own main bet -> Deal -> explicit human decisions -> automatic guests/dealer -> per-wager results -> Deal Again or explicit Repeat Bet. Computer guests begin seated; dealer and own cards dominate. Native collapsed Developer / demo tools retain manual table setup, Profile/Seed/Replay/Audit. Optional own side/back wagers are secondary but human financial choices never auto-resolve. Responsive first-person felt composition, professional fictional vector characters, keyboard focus, 44px primary controls, public-state secrecy and reduced-motion are required.

## 38. M9 implemented player journey

Production opens a Classic table with Human Seat4, guests1/3/6 and central original professional female dealer. Enter your own whole-credit MAIN (default25) or choose10/25/100, then Deal once. Optional wagers expand separately; reserve your MAIN before adding own side bets, and manage only your own Bet Behind stakes. No guest setup/wager forms appear in normal Player Mode. Automatic guests/dealer pause for every human card/Insurance/Even Money/follower choice. Natural hands and final dealer resolution finish without Continue table.

Own cards sit at the near edge and exceed guest/dealer card size. Desktop1280x900/tablet768x1024 show primary decisions alongside the table. Mobile320x720 scrolls vertically, keeps guests present and offers individual expandable public guest cards. Focus moves to your current hand, explicit decision or round result, then your own wager input after Deal Again; skip link/live status/semantic hidden card and reduced motion remain.

Round complete shows exact net, separate expandable result records, Deal Again and Repeat Bet with the original main amount. Repeat excludes side/back/Insurance/Double/Split additions. Insufficient repeat is disabled with a reason; controller rejection leaves betting open without changing the amount or refilling funds. Developer/demo tools is a closed native details element; expanding it enables deliberate manual mode, profiles/seeds, Audit and finalized seeded Replay. A new demo/mode explicitly resets all simulation credits; funded or active rounds cannot reset. Unfunded betting between terminal rounds can deliberately reset, including after exhausting credits. [Human judgment checklist](M9_VISUAL_CHECKLIST.md) remains NOT RUN.
