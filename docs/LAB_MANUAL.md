# Casino Blackjack — Lab Manual

Document date: 2026-09-28  
Document task: LAB-1.0  
Intended repository location: `docs/LAB_MANUAL.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Current milestone: M8 - Variant, replay, audit and portfolio polish
Status: M1-M7 HUMAN ACCEPTED; M8 IMPLEMENTED / VERIFIED; reconstructed independent review COMPLETED at07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54; all earlier findings including LOW-04 and LOW-05 CLOSED; only MEDIUM-05 OPEN with repair and independent recheck status below. M8 NOT ACCEPTED; deployment NOT RUN. Current M8 notes are section34 and the status below; earlier learning/delivery statements are historical snapshots, superseded by STATE.

## Current M8 review status

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

## M8 human-feedback visual checkpoint

CSS can improve game feel without moving rules into React: the controller continues to supply safe cards, legal actions and funded decisions. Chip presets change only form state; dispatch remains explicit. Local-seat geometry is a presentation mapping independent of ascending domain turn order. Native details reduce first-screen text while disabled buttons retain aria-describedby reasons. CSS animations reflect immediate state and never delay a command; reduced motion removes them. Semantic bounding-box tests caught real first-screen defects that passing gameplay tests did not detect. Portfolio hashes demonstrate reproducible captures, while human visual acceptance remains a separate decision. See [manual checklist](M8_VISUAL_CHECKLIST.md) and STATE/log for cumulative repair evidence.

## 1. Purpose

This manual is for learning, review, and interview preparation.

It explains:

- what each milestone is intended to build;
- why the design is structured that way;
- which engineering concepts are being demonstrated;
- which tests matter and what concrete bugs they can catch;
- how to explain the project in an interview without overstating its status.

This file is not the authority for game rules or acceptance criteria.

Use:

- `docs/RULES.md` for Blackjack rules;
- `docs/SPEC.md` for scope and acceptance criteria;
- `docs/DESIGN.md` for implementation design;
- `docs/STATE.md` for actual current status;
- `docs/DEVELOPMENT_LOG.md` for timestamped execution evidence.

If this manual conflicts with those files, the authoritative source wins.

## 2. How to use this manual

For every completed milestone, review these five questions:

1. **What problem did this milestone solve?**
2. **Why was this design chosen instead of a simpler-looking alternative?**
3. **What invariant or rule must always stay true?**
4. **Which automated test proves it?**
5. **What concrete bug would that test catch?**

Do not memorize implementation details blindly. Be able to explain the flow in plain language.

---

# Part A — Project Overview

## 3. Project goal

The long-term target is a simulated-credit Blackjack table that grows from a verified headless engine into a multi-seat casino-style system.

Capabilities across M1 and later milestones include (see STATE.md for implemented scope):

- six-deck persistent shoe;
- American hole-card Blackjack;
- dealer S17;
- multiple seats;
- human and computer players;
- simulated credits and settlement;
- Double, Split, Re-split, Late Surrender;
- Insurance and Even Money;
- Pair and three-card side bets;
- Bet Behind;
- optional Five-Card Charlie profile;
- browser UX/UI;
- deterministic/replay-friendly testing and audit evidence.

These are roadmap items. Only features marked implemented and verified in `STATE.md` may be described as completed.

## 4. Why this project is useful for a software-engineering portfolio

The project is intended to demonstrate more than drawing cards on a screen.

Engineering themes include:

- domain modelling;
- finite state transitions;
- deterministic testing;
- controlled randomness;
- invariants;
- hidden/public state separation;
- multi-participant sequencing;
- atomic funding rules;
- settlement correctness;
- regression testing;
- reproducible development evidence;
- clear milestone boundaries.

A strong interview explanation is:

> “I treated Blackjack as a rules engine and state-management problem rather than only a UI exercise. I separated the game rules, implementation design, verification harness, and player-facing view so each could be tested independently.”

Only use that wording after the corresponding architecture is actually implemented.

---

# Part B — M1: Headless Blackjack Core

## 5. M1 objective

M1 builds the smallest verified Blackjack engine foundation.

It is deliberately:

- one-seat;
- no-wager;
- headless;
- TypeScript-based;
- deterministic under test;
- independent of browser/UI code.

M1 does not implement Split, Double, betting, side bets, multiple seats, bots, Bet Behind, or React.

The point is to establish correct domain behaviour before adding complexity.

---

## 6. Lab 01 — Repository and Engineering Harness

### Objective

Create the repository structure, engineering documents, TypeScript toolchain, test runner, lint/typecheck setup, and unified PowerShell verification entry point.

### Core concept

**Harness Engineering**

The project is not considered correct because code exists. It needs a repeatable way to prove the expected checks pass.

Target flow:

```text
task
  ↓
implementation
  ↓
scripts/verify.ps1
  ↓
typecheck
lint
tests
other required checks
  ↓
PASS / FAIL / BLOCKED
```

### Why use `scripts/verify.ps1`?

Without one entry point, it is easy to:

- forget a check;
- run different commands in different sessions;
- overlook a non-zero exit code;
- say “tests passed” when lint/typecheck did not run.

A unified harness makes the required validation explicit.

### Important test

Deliberately force one required command to fail during harness validation.

Expected behaviour:

```text
required check fails
      ↓
verify.ps1 returns failure
      ↓
overall verification is not PASS
```

### Bug this test can catch

A PowerShell script such as:

```powershell
npm test
Write-Host "Verification complete"
exit 0
```

could incorrectly report success even when `npm test` failed.

The harness must propagate failure correctly.

### Interview question

**Q: Why did you create a verification script instead of just running npm test?**

Suggested explanation:

> “The milestone had more than one required check. I wanted one reproducible command that enforced the agreed validation contract and propagated failures correctly, so a later agent or reviewer could run the same checks.”

---

## 7. Lab 02 — Physical Card Identity

### Objective

Model a six-deck shoe containing exactly 312 physical cards.

### Core concept

**Logical card value is different from physical card identity.**

In a six-deck shoe:

```text
Q♠ from deck 1
Q♠ from deck 2
...
Q♠ from deck 6
```

all have the same Blackjack rank/suit but are different physical cards.

Conceptually:

```ts
PhysicalCard {
  id
  deckIndex
  suit
  rank
}
```

### Why does physical identity matter?

Later features need to distinguish two identical-looking cards.

Example:

```text
Player:
Q♠ + Q♠
```

This is possible in a six-deck shoe because the two Queens of Spades came from different physical decks.

It also matters for:

- card-accounting invariants;
- replay/audit work;
- Perfect Pair side bets later.

### Important tests

Verify independently:

```text
total cards = 312
unique physical IDs = 312
each rank+suit combination appears exactly 6 times
```

### Bug this test can catch

A common mistake is to build:

```text
52 logical cards
×
reuse references 6 times
```

This can create duplicate object identity or accidental shared state instead of 312 real physical-card instances.

### Interview question

**Q: Why wasn't rank+suit enough as the card ID?**

Suggested explanation:

> “Because a six-deck shoe can contain six physically distinct copies of the same rank and suit. I needed identity for inventory integrity and future replay/side-bet rules.”

---

## 8. Lab 03 — Controlled Randomness

### Objective

Shuffle the shoe and choose the cut-card position while keeping tests deterministic.

### Core concept

**Randomness is an input dependency.**

Production can be random.

Tests should not depend on luck.

Bad test:

```text
shuffle repeatedly until player happens to receive A + K
```

Good test:

```text
inject controlled card order
→ player always receives A + K
```

### Minimal boundary

Conceptually:

```ts
interface RandomSource {
  nextInt(maxExclusive: number): number;
}
```

Production implementation may wrap normal runtime randomness.

Tests provide scripted values.

### Cut card

For the approved house rule:

```text
cut position ∈ [219, 249]
```

One value is chosen when a new shoe is created and remains unchanged for that shoe.

### Important tests

- exact deterministic shuffle result with scripted random values;
- cut lower boundary = 219;
- cut upper boundary = 249;
- same shoe does not silently choose a new cut position later.

### Bug this test can catch

If `Math.random()` is called directly inside game logic, a test may pass today and fail tomorrow because the card order changes.

### Interview question

**Q: Why inject randomness? Isn't Blackjack supposed to be random?**

Suggested explanation:

> “Gameplay can still be random in production. The injection seam lets tests control randomness so a failing scenario is reproducible.”

---

## 9. Lab 04 — Shoe Accounting and Cut-Card Lifecycle

### Objective

Maintain a correct persistent six-deck shoe across rounds.

### Core concept

**A new round is not a new shoe.**

Lifecycle:

```text
create shoe
   ↓
shuffle
   ↓
round 1
   ↓
discard used cards
   ↓
round 2
   ↓
...
   ↓
cut threshold crossed
   ↓
finish current round
   ↓
replace shoe before next round
```

### Key collections

Conceptually:

```text
available
inPlay
discarded
```

They must be disjoint.

Together they must account for the current shoe's physical cards.

### Important invariant

For a healthy shoe:

```text
available ∩ inPlay = ∅
available ∩ discarded = ∅
inPlay ∩ discarded = ∅

available + inPlay + discarded
= all physical cards belonging to that shoe
```

### Why not reshuffle immediately at the cut card?

The cut threshold signals that this is the last round using the current shoe.

It must not interrupt an active Blackjack hand.

### Important tests

1. draw one card:
   - available decreases by exactly one;
   - exactly that card appears in `inPlay`.

2. cut threshold crossed:
   - current round keeps the same shoe;
   - `reshufflePending` becomes true;
   - replacement happens only before the next round.

3. unexpected empty shoe mid-round:
   - do not fabricate a card;
   - do not silently reshuffle;
   - raise integrity failure.

### Bugs these tests can catch

- the same card exists in both `available` and `discarded`;
- cut position triggers a mid-hand shuffle;
- exhausted shoe silently creates a new card;
- new round always creates a new shoe even when not required.

### Interview question

**Q: What's the difference between `Round` and `Shoe` lifecycle?**

Suggested explanation:

> “A round is one game instance. The shoe is shared across multiple rounds. A round consumes cards; the shoe policy decides when the next round must switch to a new shoe.”

---

## 10. Lab 05 — Blackjack Hand Evaluation

### Objective

Correctly calculate hand values with Aces.

### Core concept

Ace is not permanently 1 or permanently 11.

The hand evaluator must choose the best legal value.

Examples:

```text
A + 9       = 20
A + 9 + 5   = 15
A + A       = 12
A + A + 9   = 21
A + A + 9 + 9 = 20
```

### Soft vs hard

```text
A + 6
= soft 17
```

because Ace is currently 11.

```text
A + 6 + 10
= hard 17
```

because Ace must become 1.

### Natural Blackjack

Natural Blackjack is not just “total equals 21”.

It requires:

```text
original two-card hand
+
Ace
+
10-value card
```

So:

```text
A + K   -> natural Blackjack
A + 5 + 5 -> ordinary 21
```

### Important tests

All examples above should be explicit expected facts.

### Bug this test can catch

Naive implementation:

```text
Ace always = 11
```

would calculate:

```text
A + 9 + 5 = 25
```

and incorrectly bust the player.

### Interview question

**Q: What was one tricky rule in hand scoring?**

Suggested explanation:

> “Ace valuation. I treated hand value as derived state and tested multiple-Ace cases explicitly so the evaluator can downgrade Aces from 11 to 1 as needed.”

---

## 11. Lab 06 — Initial Deal and Hidden Information

### Objective

Create the round correctly while keeping the dealer's hole card hidden from the public state.

### Deal order

For M1:

```text
1. player first card
2. dealer upcard
3. player second card
4. dealer hole card
```

### Core concept

**Internal truth and public view are different things.**

Internally:

```text
dealer:
K♣ + 6♥
```

Player-facing state before reveal:

```text
dealer:
K♣ + hidden
```

The hole card exists internally, but public state must not expose its identity.

### Why this matters

If UI code simply receives the full internal state and hides the card visually, the secret still exists in the public data surface.

A clearer model is:

```text
Internal GameState
       ↓
publicView()
       ↓
Redacted Player State
```

### Dealer peek

M1 has no Insurance window.

Therefore, when Dealer upcard is:

```text
Ace
or
10/J/Q/K
```

the engine may check the hole card immediately for Natural Blackjack.

A negative peek must not reveal which hidden card the Dealer has.

### Important test

Assert that before reveal:

```text
public state does not contain hole-card rank/suit/id
```

not merely:

```text
UI element is hidden
```

### Bug this test can catch

The UI may show a card back, but browser state/API output could still contain:

```json
{"rank":"K","suit":"hearts"}
```

which leaks hidden game information.

### Interview question

**Q: Why did you create a public-state projection?**

Suggested explanation:

> “Because presentation hiding is not the same as information hiding. I wanted the player-facing state itself not to contain the dealer's secret card before reveal.”

---

## 12. Lab 07 — Game State Machine

### Objective

Allow only legal actions for the current phase.

Simplified M1 flow:

```text
round start
   ↓
initial deal
   ↓
initial natural resolution
   ↓
PLAYER_TURN
   ↓
Hit / Stand
   ↓
DEALER_TURN
   ↓
ROUND_COMPLETE
```

Integrity faults are separate from normal game outcomes.

### Core concept

**Legal actions depend on state.**

Examples:

```text
Hit during PLAYER_TURN
→ valid
```

```text
Hit after ROUND_COMPLETE
→ reject
```

### Pure transition idea

Preferred conceptual pattern:

```text
command(oldState)
     ↓
newState
```

Rejected command:

```text
old gameplay state
     ↓
unchanged gameplay state
```

### Important test

Take a completed round snapshot.

Call:

```text
hit(completedRound)
```

Then verify:

```text
cards unchanged
shoe position unchanged
result unchanged
phase unchanged
```

### Bug this test can catch

A terminal round accidentally accepts another Hit and consumes a card from the shared shoe, corrupting both the completed result and the next round.

### Interview question

**Q: Why use explicit game phases?**

Suggested explanation:

> “It makes legal transitions explicit and testable. I don't want legality to depend on whichever button happens to be visible in the UI.”

---

## 13. Lab 08 — Dealer S17 Policy

### Objective

Implement Dealer behaviour separately from player decisions.

Approved table rule:

```text
Dealer total < 17
→ Hit

Dealer 17–21
→ Stand

Soft 17
→ Stand
```

### Core concept

Dealer has no strategy choice in this ruleset.

The policy can therefore be represented as a pure rule.

### Important tests

```text
10 + 6
= hard 16
→ Hit

A + 5
= soft 16
→ Hit

10 + 7
= hard 17
→ Stand

A + 6
= soft 17
→ Stand
```

### Bug this test can catch

An H17 implementation accidentally used in an S17 game would Hit:

```text
A + 6
```

when our house rules require Stand.

### Interview question

**Q: Why separate DealerPolicy from the round controller?**

Suggested explanation:

> “The rule is deterministic and independently testable. The round controller decides when dealer resolution happens; the dealer policy only answers whether the current hand should hit.”

---

## 14. Lab 09 — Outcome Resolution

### Objective

Determine the correct terminal result without conflating Blackjack with ordinary 21.

M1 outcome vocabulary stays small:

```text
PLAYER_BLACKJACK
PLAYER_WIN
DEALER_WIN
PUSH
```

Reasons may be stored separately.

### Important priority

```text
Natural Blackjack
≠
ordinary 21
```

Example:

```text
Player:
A + K
= Natural Blackjack

Dealer:
7 + 7 + 7
= 21

Result:
PLAYER_BLACKJACK
```

not Push.

### Ordinary comparison

If no special initial result and neither player nor dealer has already lost:

```text
player > dealer → PLAYER_WIN
player < dealer → DEALER_WIN
player = dealer → PUSH
dealer bust     → PLAYER_WIN
```

### Important test

Player bust stays a loss even if a dealer simulation would later also bust.

The dealer should not needlessly draw after the player's only hand has already lost.

### Bug this test can catch

A naive final comparison:

```text
if dealer > 21:
    player wins
```

could incorrectly convert an already-busted player into a winner.

---

## 15. Lab 10 — Full M1 Regression

### Objective

Prove the complete milestone, not only individual helper functions.

### Core concept

Unit tests prove pieces.

Integration tests prove the pieces work together.

Required end-to-end domain scenarios should include:

- deterministic initial deal;
- player natural;
- dealer natural;
- both natural -> Push;
- Hit -> continue;
- Hit -> 21;
- Hit -> bust;
- Stand -> dealer draws;
- Dealer soft 17 stands;
- dealer bust;
- ordinary player/dealer comparison;
- cut threshold crossing without mid-round shuffle;
- next-round shoe replacement;
- public hole-card secrecy;
- terminal action rejection;
- full card-accounting invariant.

### Important test philosophy

Do not derive all expected outputs using production helpers.

Example:

Bad:

```text
expected = calculateHandValue(cards)
actual = calculateHandValue(cards)
```

Good:

```text
cards = [A, 9, 5]
expected = 15
actual = calculateHandValue(cards)
```

### Interview question

**Q: What's the difference between your unit tests and integration tests?**

Suggested explanation:

> “Unit tests verify isolated rules such as hand scoring or S17. Integration tests verify that the round, shoe, hidden information, transitions, and result resolution work together.”

---

# Part C — Planned Later Milestones

M2, M3 and M4 are implemented as explained in sections 28, 29 and 30. The original targets below are retained for learning context; M5+ remains unimplemented.

## 16. M2 — Multi-seat Table (original learning targets; implemented summary in section 28)

### Planned concepts

- seven modelled seats;
- Human / Computer / Empty states;
- active-seat sequencing;
- sitting out;
- one Dealer shared across all players;
- one player Bust does not end the whole table;
- deterministic computer decision policy.

### Important future lesson

```text
Table
≠
Seat
≠
Player
≠
Hand
```

These should not be collapsed into one object.

### Example future bug

If Player 1 busts and code incorrectly sets:

```text
round = COMPLETE
```

Players 2–7 would never finish their hands.

---

## 17. M3 — Credits and Settlement

### Planned concepts

- available credits;
- reserved stakes;
- one-time final settlement;
- half-credit internal units;
- idempotent settlement;
- no spending pending winnings.

### Key future invariant

```text
available credits must never become negative
```

and:

```text
the same wager must never settle twice
```

### Example future bug

Player begins with 1,000, wagers 100 and wins.

Correct final balance:

```text
1,100
```

A double-credit bug could incorrectly produce:

```text
1,200
```

if the stake is returned twice.

---

## 18. M4 — Double, Split, Re-split, Surrender

### Planned concepts

- action legality;
- atomic funding;
- one seat -> multiple hands;
- hand order;
- four-leaf-hand cap;
- Split Aces special rule;
- Double After Split;
- Late Surrender.

### Important future invariant

A rejected funded action must not mutate:

```text
credits
wagers
cards
shoe
turn
hand state
round state
```

### Example future bug

Available credits:

```text
50
```

Double requires:

```text
100
```

Bad implementation:

```text
draw Double card
then notice funds are insufficient
```

Correct implementation rejects before any card is consumed.

---

## 19. M5 — Insurance, Even Money, Side Bets

### Planned concepts

- independent wagers;
- initial-card snapshots;
- dealer peek timing;
- Perfect Pair classification;
- 21+3-style evaluation;
- payout priority.

### Important future lesson

```text
main hand result
≠
side-bet result
```

The player's main hand can lose while a side bet wins.

### Example future bug

Player:

```text
Q♠ + Q♠
```

Dealer wins the main hand.

Perfect Pair should still retain its own winning result.

---

## 20. M6 — Bet Behind (original learning targets; implemented summary in section 32)

### Planned concepts

A hand may have:

```text
controller
main bettor
one or more back bettors
```

These roles are not the same thing.

The controller chooses gameplay actions.

Back bettors own separate wagers.

### Future Split example

Controller splits.

A follower who cannot or does not add another stake:

```text
keeps original wager on first child hand
does not receive free exposure to second child hand
```

### Engineering lesson

```text
Hand
≠
Player
≠
Wager owner
```

This is one of the strongest domain-modelling examples in the project.

---

## 21. M7 — UX/UI and E2E

### Planned concepts

- state-aware controls;
- accessible keyboard operation;
- clear dealer/player separation;
- hidden dealer card;
- responsive casino table;
- Playwright workflows.

### Important rule

UI validation is convenience.

Domain validation is authority.

Disabling the Double button is not sufficient; the engine must also reject an illegal Double request.

---

## 22. M8 — Variant, Replay, Audit, Portfolio Polish

### Planned concepts

- optional Five-Card Charlie profile;
- reproducible/seeded scenarios if approved;
- event/audit records;
- final README;
- milestone review;
- portfolio evidence.

### Charlie lesson

Classic table:

```text
five-card 20
→ normal 20
```

Charlie profile:

```text
five-card 20
→ Charlie result according to that profile
```

The variant must be explicit, not silently enabled.

---

# Part D — Interview Review

## 23. One-minute project explanation

Use only after the corresponding features are implemented.

A suitable structure is:

> “I built the project incrementally as a Blackjack domain engine rather than starting with the UI. The first milestone focuses on a six-deck persistent shoe, deterministic randomness for testing, Ace-aware hand scoring, dealer S17, hidden dealer state, and explicit game-state transitions. Each milestone has acceptance criteria and a PowerShell verification harness, and failures are repaired from recorded evidence rather than by repeatedly generating code.”

Do not mention later features as completed until they are actually verified.

## 24. Core interview questions to prepare

### Architecture

**Why separate `RULES.md`, `SPEC.md`, and `DESIGN.md`?**

- Rules define how Blackjack behaves.
- Specification defines what the software must deliver and verify.
- Design defines how the current implementation satisfies that specification.

### Testing

**Why deterministic fixtures?**

To reproduce exact card sequences and edge cases without relying on luck.

### State management

**Why explicit phases?**

To make legal/illegal actions mechanical and testable.

### Security/information boundaries

**Why hide the dealer hole card in public state instead of only visually?**

To prevent accidental information leakage across the player-facing boundary.

### Domain modelling

**Why distinguish physical card ID from rank/suit?**

Because a multi-deck shoe contains multiple physical copies of the same visible card.

### Development process

**What does a repair cycle mean?**

A failed validation followed by:

```text
failure evidence
→ hypothesis
→ targeted correction
→ re-verification
```

The first implementation and first validation are not counted as repair cycles.

### Delivery status

**What's the difference between IMPLEMENTED and VERIFIED?**

`IMPLEMENTED` means code changed.

`VERIFIED` means the exact deliverable version passed every agreed required check.

`ACCEPTED` requires explicit user acceptance.

---

# Part E — Milestone Completion Notes

## 25. Required learning note after each milestone

When a milestone is actually completed, append a section containing:

```markdown
## <Milestone> — Learning Summary

### What I built
...

### Core flow
...

### New concepts I learned
...

### Important design tradeoffs
...

### Important tests
| Test | What it verifies | Concrete bug it can catch |
| --- | --- | --- |
| ... | ... | ... |

### What I can now explain without looking at the code
- ...

### What remains unclear
- ...

### Verification state
- ...

### User understanding state
- understood / needs review

### Delivery state
- IMPLEMENTED / VERIFIED / ACCEPTED
```

Learning state and mechanical verification state are independent.

A test can pass while the user still needs to review the concept.

The user's understanding does not make a failing test pass.

## 26. Current learning state

Historical learning baseline before M1-T01 execution:

- House Rules v1.1: discussed and defined.
- M1 scope: defined.
- M1 design: defined.
- M1 task plan: defined.
- Repository execution: not started.
- M1 code: not implemented.
- Automated verification: not run.

The first hands-on lab at that historical baseline was:

`M1-T01 — Repository Bootstrap and Engineering Harness`

## 27. M1 — Implemented Learning Summary (T10)

### What was built

A one-seat, no-wager TypeScript engine now implements all M1 gameplay: physical inventory, persistent shoe, deterministic randomness boundary, scoring, initial naturals, player decisions, S17 and outcomes. The executable API is in src/domain/game.ts and publicView.ts. There is no UI, interactive CLI, persistence or financial settlement. These notes explain implemented behavior; they do not claim that the user has personally mastered it.

### Physical identity, randomness and shoe lifecycle

Each PhysicalCard has readonly id/deckIndex/suit/rank. `1:spades:Q` and `2:spades:Q` are separate physical cards of the same visible value. IDs are unique within one 312-card inventory, not globally across shoes; shoeId distinguishes successive shoes. The inventory is deterministic and shuffle copies its array while preserving card identities.

RandomSource exposes only nextInt(maxExclusive). Fisher–Yates consumes injected integers, and cut selection is exactly `219 + nextInt(31)`. The production adapter is the sole Math.random caller. Test fixtures control the next-draw order without a product seed/replay system. Both endpoints and every legal offset are tested; no random retry loop is needed.

Shoe.available, inPlay and discarded are disjoint and together contain all 312 original IDs. The top is available[0]. Draw moves one physical card into inPlay; normal round completion moves all inPlay cards to discarded once. Consumption is derived as `312 - available.length`, so no extra mutable counter can drift. The cut remains fixed for a shoe. Crossing it makes reshufflePending sticky but lets the current round finish. Only the next start prepares a replacement for pending/retired/<4 cards; a healthy shoe and its cut are otherwise reused. A different replacement shoeId is required. Four cards permit the initial deal, not a guarantee against later exhaustion.

### Ace evaluation and natural precedence

The evaluator starts Aces at 11 and subtracts 10 per Ace while needed. A remaining high Ace makes the hand soft. A,9,5 is hard 15; A,A,9 is soft 21; A,A,9,9 is hard 20. If every legal total busts, the minimum total is reported. Derived totals are returned, never stored as mutable hand state.

`isNaturalBlackjack(cards, originalHandEligible)` requires explicit eligibility and exactly Ace plus 10/J/Q/K. Original A,K is natural; A,5,5 is ordinary 21; ineligible A,K is not natural. Initial natural resolution happens before player decisions and before ordinary comparison. A player natural stays PLAYER_BLACKJACK even if an unnecessary hypothetical third dealer card would make ordinary 21; the engine rejects that later dealer action rather than drawing it.

### Internal/public state and command flow

GameState contains shoe and optional round. Internally dealerCards[0] is upcard and [1] is hole. PublicView constructs copied rank/suit fields explicitly; it excludes physical IDs, future shoe order, cut and hidden totals. The hole is hidden during PLAYER_TURN and INTEGRITY_ERROR, visible during DEALER_TURN and ROUND_COMPLETE per DESIGN. A negative peek does not identify the hole. Local process memory is not claimed to be secure against its owner.

startRound prepares/reuses a shoe, deals player/upcard/player/hole, peeks only for A/10/J/Q/K, then resolves naturals or enters PLAYER_TURN. Hit draws exactly one player card: below 21 continues, ordinary 21 enters DEALER_TURN, bust ends immediately as DEALER_WIN without dealer drawing. Stand changes only phase. resolveDealer evaluates/draws in one call until S17 stops; soft 17 stands just like hard 17. It never chases the player total.

For a surviving ordinary player, dealer bust gives PLAYER_WIN; otherwise higher/lower/equal totals give PLAYER_WIN/DEALER_WIN/PUSH. Result reasons distinguish natural, player/dealer bust and comparisons. Normal completion discards cards; earlier terminal results reject later gameplay commands unchanged. Starting another round returns a new state without mutating the old terminal snapshot.

CommandResult ok=false means an illegal request with the original gameplay state. ok=true means accepted, not necessarily a healthy round: an accepted required draw may enter INTEGRITY_ERROR. Unexpected exhaustion produces no ordinary outcome, preserves diagnostic hands/inPlay, retires the shoe and blocks gameplay actions. A later start must replace the shoe. M1 has no financial VOID/refund implementation.

### Concrete regression lessons

| Test group / file | Executed fact | Concrete bug caught |
| --- | --- | --- |
| unit/card.test.ts | Explicit 312 IDs, 52 combinations per deck, six copies | Reusing rank/suit as ID collapses six cards into one |
| unit/random.test.ts | Exact scripted permutation, input preserved, all 31 cuts | Off-by-one cut selects 250, or shuffle duplicates/drops a card |
| unit/shoe.test.ts | Every draw/discard accounts for the same full ID set | A drawn card remains available or is discarded twice |
| unit/hand.test.ts | A,9,5=15; multiple Aces; natural eligibility | Always counting Ace as 11 causes a false bust; total==21 causes false natural |
| unit/game.test.ts | P/up/P/hole, gated peek, natural matrix, partial-deal faults | Dealing P/P/D/D or continuing after initial dealer natural |
| unit/publicView.test.ts | Serialized redaction and detached public objects | Hidden card survives inside a nested field or is revealed after negative peek |
| unit/playerActions.test.ts | Exact one-card Hit, no-card Stand, terminal snapshots | Stand consumes a card; bust still allows another Hit |
| unit/dealer.test.ts | S17 threshold and explicit total comparisons | Accidentally using H17 or treating equal totals as a loss |
| integration/dealerResolution.test.ts | Exact dealer sequences, discard, terminal rejection, partial faults | Dealer chases player 20 instead of standing at 17; failure fabricates a winner |
| integration/roundLifecycle.test.ts | Two ordinary rounds, both cuts, minimum guard, recovery | startRound reshuffles every round; cut crossing replaces mid-round; retired shoe reused |
| verifyHarness.test.ts | Each required failure and missing npm produces nonzero | Later passing tests overwrite an earlier typecheck/lint failure |
| harness.test.ts | Required documents and SKILL reference exist | A transferred repository loses its engineering entry instructions |

The T09 real type-error experiment independently proved overall exit 2 while lint/tests passed. The temporary file was removed and all 155 tests passed again. Expected fault injections are successful negative tests, not excuses to weaken checks.

### Tradeoffs and remaining review

Pure transitions allocate small arrays; at 312 cards this is simpler than mutation bookkeeping. readonly is a compile-time contract, not runtime deep freezing. A single dealer command avoids an animation API before a UI exists. Pure ordinaryOutcome assumes a surviving non-natural player; game commands enforce that sequencing. Fixture code is test-only and independently checks all physical IDs.

The user can now review/explain identity versus value, shoe versus round lifetime, injected randomness, natural precedence, visibility, legal transitions and integrity versus gameplay outcomes. User understanding: **needs review / not assessed**. Mechanical verification: 12 files / 155 tests PASS at the T09 checkpoint, with final T10 verification recorded in STATE/DEVELOPMENT_LOG. Fresh-session review: **NOT YET COMPLETED at that historical T10 checkpoint**. M1 is now **ACCEPTED** at d1d8966fe55af1bc2b9348e305135952b7723b70 under the explicit M2 contract. M2-M4 implementation is described below; M5+ remains unimplemented.


## M2 T04 learning checkpoint

M1 is ACCEPTED by the M2 batch contract. M2 computer play now uses a deterministic M2 policy: evaluated total <17 means HIT, otherwise STAND. Ace handling comes from the existing evaluator. This is a simple reproducible non-LLM policy, not optimal strategy or basic-strategy compliance. The controller loops through computers until a HUMAN requires input, then later resolves the shared dealer once. Full M2 learning notes and fresh-review handoff follow at T06; M2 is not ACCEPTED.

## 28. M2 — Implemented Learning Summary (T06)

### Table, Seat and Hand

TableGameState owns one persistent shoe, seat configuration and one current round. A SeatState is a stable numbered position and its controller/participation setting. A SeatHand is that round's cards, decision-completion flag and optional outcome for an active seat. EMPTY positions have no hand. There is no account/player identity or wallet in M2; HUMAN and COMPUTER describe who chooses that seat's decisions. At most one local HUMAN may be configured, including one sitting out. A table with no HUMAN is valid, but a round needs at least one active seat.

Separating these concepts prevents confusing the end of one hand with the end of the table. When a player busts, only that hand gets DEALER_WIN/PLAYER_BUST and becomes complete. Other hands still act; discard happens when the table finishes. A stood or ordinary-21 hand is complete for decisions but has no outcome until comparison.

### Frozen participation and sparse deal

Configuration commands are atomic and accepted only between rounds. startTableRound copies and freezes the active participant snapshot and all seven round seat settings. Subsequent configuration cannot change who received cards or rewrite the prior round's controller. getPublicTableView deliberately separates current configuration from the frozen round view.

For seats 2, 5 and 7, initial order is:

```text
Seat2 card1 -> Seat5 card1 -> Seat7 card1 -> Dealer upcard
Seat2 card2 -> Seat5 card2 -> Seat7 card2 -> Dealer hole
```

Empty/sitting-out seats consume no cards. Every active player receives both cards before a decision. The shared shoe must have at least eight cards for these three seats (`2*n+2`); that minimum alone does not guarantee later draws cannot exhaust it.

### HUMAN commands and COMPUTER decisions

startTableRound resolves initial naturals and chooses the first remaining eligible seat. Turns advance by ascending seat number, skipping Natural/completed hands. Hit below 21 keeps the same hand current; ordinary 21 and bust automatically advance. Stand consumes no card and advances. Commands name the seat and reject an empty, sitting-out, wrong, completed or COMPUTER seat when a HUMAN action is requested. Terminal/wrong-phase requests return the exact input state unchanged.

The deterministic M2 computer policy is **total <17 -> HIT; total >=17 -> STAND**. It reads only its own evaluated public hand, not the dealer hole or future shoe. Ace/soft handling reuses evaluateHand: A,5 hits; A,6 stands; A,9,5 hits as hard 15. This reproducible teaching policy is non-LLM and is not optimal Blackjack strategy or a basic-strategy implementation.

advanceTableAutomation is an explicit orchestration command, called after a non-terminal deal/HUMAN action. It handles all consecutive computers, stops at HUMAN input, and proceeds to shared dealer resolution if decisions finish. It adds no background timer or interactive UI. Retaining the returned state is the caller's responsibility.

### One dealer, independent results

Initial dealer Natural resolves each active player immediately: Natural pushes, ordinary hands lose. Without dealer Natural, each player Natural becomes PLAYER_BLACKJACK; it does not terminate ordinary hands elsewhere.

After all decisions, one S17 loop resolves the shared dealer, then compares every unresolved surviving player separately. With a final dealer 19, player 20 wins, 19 pushes and 18 loses; prior bust stays a loss and prior Natural stays PLAYER_BLACKJACK. Dealer does not draw once per player or chase each player's total. If every player already has a result, dealer reveals at completion without unnecessary draws. A three-card dealer 21 cannot downgrade a resolved Natural.

### Shared shoe, integrity and public state

All table hands/dealer consume one shoe. Its available/inPlay/discarded IDs stay disjoint and account for exactly 312 cards. Normal completion discards once. Starting another round reuses the remaining shoe and cut when healthy; pending/retired/insufficient cards requires a new shoe before any deal. Cut 219 or 249 can be crossed by a computer Hit; the dealer still completes using that same shoe, and replacement waits until the next round.

A required draw fault ends the table in INTEGRITY_ERROR, retires the shoe and preserves partial hands for diagnostics. All normal outcomes, including previously resolved Naturals/busts, are cleared under whole-table invalidation. No result is fabricated from the fault. No wagers or refunds exist in M2. A later start uses a replacement shoe and does not mutate the failed snapshot.

Public projection explicitly copies rank/suit data and all seven round seat states. The hole is hidden during PLAYER_TURN and INTEGRITY_ERROR, visible at DEALER_TURN/ROUND_COMPLETE. Early bust does not reveal while another player still needs a decision. No physical IDs, shoe order, cut or hidden totals leak through this projection. This remains a local correctness boundary, not server security.

### Concrete M2 regression lessons

| Test group / case | What it establishes | Concrete bug it catches |
| --- | --- | --- |
| unit/table: fixed positions / atomic invalid settings | Exactly seats 1..7; <=1 HUMAN; duplicate/range rejection | Duplicate position or a second sitting-out HUMAN slips through |
| unit/table: sparse participation / snapshot | EMPTY/sit-out excluded; copied/frozen active list | Config edit changes participants halfway through a round |
| tableDeal: one/sparse/full exact order | Two passes and correct dealer slots | Dealing both cards to seat 2 before seat 5 shifts every hand |
| tableDeal: dealer/mixed/all Naturals | Per-seat initial precedence | First player Natural incorrectly ends the whole table |
| tableDeal: redaction / partial faults | No hidden fields; correct diagnostic cards | A negative peek or spread of internal state leaks the hole |
| tableActions: Hit/Stand/21/bust | One/no card, correct next seat, other players continue | Bust finishes table; ordinary 21 permits another Hit |
| tableActions: HUMAN routing and rejection | Wrong/controller/phase requests preserve state | Human command consumes a card for a COMPUTER seat |
| unit/computer: hard/soft thresholds | Deterministic M2 policy and Ace handling | Treating soft 17 as a Hit or A,9,5 as bust |
| tableAutomation: consecutive computers / human pause | Ordered progression without skipping human | Automation silently makes the HUMAN decision or acts out of turn |
| tableAutomation: mixed outcomes / one dealer | Bust/Natural preserved; one shared comparison | Dealer redraws per player; dealer bust converts earlier player bust to win |
| tableAutomation: no comparison / S17 | No unnecessary draw; soft/hard 17 stand | Dealer draws after all outcomes known or accidentally uses H17 |
| tableAutomation: partial computer/dealer failure / frozen input | Diagnostic cards retained, no normal results, purity | Fault loses already-drawn cards, invents winners or mutates previous state |
| tableLifecycle: human/computer alone / full seven seats | Complete deterministic rounds, explicit expected results | Last computer never advances to dealer or seventh seat is dropped |
| tableLifecycle: two rounds and reconfiguration | Same shoe/cut; old snapshot survives | Each new round reshuffles or new occupancy rewrites old round |
| tableLifecycle: both cuts and minimum guards | Deferred replacement, exact 2*n+2 boundary | Cut crossing swaps shoe mid-round or full table uses four-card guard |
| tableLifecycle: real exhaustion / recovery / terminal rejection | Fault retirement; new shoe; immutable completed table | Retired shoe reused or repeated resolution discards twice |
| tableLifecycle: absent financial state | No wagers/credit/advanced-action data | A future milestone's wallet or Split state enters M2 unnoticed |
| Original M1 tests + verifyHarness | 155 unchanged tests; required failures still propagate | Multi-seat work regresses the one-seat API or masks a required check failure |

### Tradeoffs, evidence and learning state

M2 uses separate table orchestration to preserve the accepted M1 command API while sharing the rule primitives. Pure transitions copy small arrays; no state framework is needed at seven seats/312 cards. Participation snapshots are runtime-frozen, but arbitrary caller-owned state is not deeply frozen or validated as an import format. Low-level lifecycle functions are not permitted player commands. There is no production casino/security claim, optimal strategy claim, UI or network multiplayer.

T05 found a test-hook error: returning a spy from beforeEach unintentionally registered that throwing function as cleanup. Changing only the hook to return void made the 17 new cases pass with the RNG guard and all assertions retained. This illustrates why shared failure location matters before changing domain code.

Mechanical evidence: full harness 18 files / 233 tests PASS; original M1 tests/helpers unchanged and independent M1 run 12 files / 155 tests PASS. Final T06 evidence is in STATE/DEVELOPMENT_LOG. At the historical M2 handoff, fresh-session review was NOT RUN and M2 was NOT ACCEPTED. The explicit M3 contract subsequently ACCEPTED M2 at c9f7f35; no new independent M2 review is claimed here. User understanding: needs review / not assessed.

Topics the user can now study/explain: table versus seat versus hand; frozen participation; sparse two-pass dealing; decisions complete versus outcome known; human/computer routing; one dealer with many outcomes; cross-round shoe lifetime; integrity versus normal loss. Open learning questions can be discussed after independent review; understanding is not inferred from passing tests.

## 29. M3 — Implemented Credits and Settlement Learning Summary

### Units and ownership

One unit is half a credit. The initial 1000 credits are stored as 2000 units, not 1000.0. Every amount is a safe integer; original main stakes must be even, between 20 and 2000 units. The numeric type alias is descriptive, while runtime validation enforces the boundary. Never silently round an amount. This represents half-credit payouts exactly without decimal-money arithmetic.

Each of seven stable seats owns its bankroll for this local session. A controller label is not an account. Emptying/rejoining a seat or switching HUMAN/COMPUTER retains the same funds. A new session initializes bankrolls; no existing-session reset or transfer API is implemented. R06 allows a deliberate recorded between-round reset, but it is optional and deferred. This avoids introducing M6 spectator/account architecture.

### Available, reserved and pending

A 100-credit bet moves 200 units from available to reserved: 2000/0 becomes 1800/200. Only available can fund a new commitment. Pending is a calculated financial result, not spendable credit. If seat 1 has a Natural while seat 2 still plays, seat 1's gross return can be displayed but its available funds stay unchanged. Otherwise action order could allow early winners to spend current-round proceeds, and a later table VOID would require clawback.

Funding validates before returning a changed state. Reserving exact available funds is valid. An unaffordable request returns the same state reference with an explicit error; funds, cards, shoe, turn and RNG remain unchanged. Setting a target stake makes a repeated request harmless: 200 -> 200 changes nothing, 200 -> 300 reserves an additional 100, and 300 -> 200 releases 100. Cancellation is distinct from a zero-valued bet and is allowed only while OPEN.

### Betting and table lifecycle

CONFIGURING -> OPEN -> CLOSED -> COMMITTED or VOID -> CONFIGURING. Seat configuration freezes when betting opens; main wagers remain editable until betting closes. An occupied seat is not necessarily a funded participant. Both HUMAN and COMPUTER require explicit valid main wagers; an unfunded occupied seat gets no cards. Closing freezes the ordered funded set and stakes.

The thin financial layer calls the preserved M2 gameplay engine. It adapts participation internally while keeping the real seven-seat snapshot. M2 ROUND_COMPLETE means card play and discard are complete, while M3 CLOSED still locks the financial cycle until settlement. The caller invokes automation after deal/human decisions and explicitly invokes final settlement or VOID, then explicitly prepares another round. No automatic betting, replay or credit refill exists.

### Gross returns and one-time commit

Ratios describe profit, while gross includes returned stake. A 1:1 ordinary win returns 2*stake gross. A 3:2 Natural returns 5*(stake/2) gross. For stake 200 units: ordinary gross=400, Natural gross=500, push gross=200, loss gross=0. Starting from 2000 units, final available is respectively 2200, 2300, 2000 or 1800. Do not deduct the stake twice on a loss or return it twice on a win.

For a 25-credit bet, stake=50 units. Natural gross=125 units (62.5 credits), net=75 units (37.5 credits), and final available=2075 units. All intermediate stored values remain integers. A later whole-credit wager can leave one half-credit unit available without rounding it away.

settleMainWagers waits until the entire table is gameplay-complete, validates all participating reservations/results, then returns all updated bankrolls and frozen COMMITTED records together. A record identifies round and seat (one main wager/hand per seat), stake, hand outcome, gross return, net and status. Pending records are derived rather than stored twice. Explicit COMMITTED state rejects another settlement so there is no second credit or second record.

### VOID, idempotency and preservation

A normal loss consumes its stake with zero return. A genuine required-draw failure creates INTEGRITY_ERROR, clears normal hand outcomes and retires the shoe. Only that condition allows financial VOID: refund actual reserved stakes, with zero net, irrespective of apparent Natural/win/loss. No provisional proceeds became available, so no clawback is necessary. Repeated VOID and normal settlement after VOID reject unchanged; VOID cannot reverse a committed valid settlement. This is idempotency through explicit rejection.

The failed game/cards/fault remain diagnostic evidence. Preparing the next round preserves balances and shoe history; the retired shoe is replaced only at the next explicit funded deal. Callers retain prior immutable snapshots. This in-memory pure API requires the latest returned state; it is not a network transaction service protecting against concurrent or stale externally stored requests.

### Major regression groups and concrete bugs they detect

| Group | Evidence | Concrete bug detected if introduced |
| --- | --- | --- |
| Credit units / primitives | credits.test.ts: 2000 start, exact funds, one-unit-short, invalid units, repeated release | 1000 stored as units; rejecting exact funds by using >= instead of >; fractional units accepted; duplicate refund |
| Main betting | betting.test.ts: min/max/even increments, target changes, cancellation and snapshots | Accepting 21 units as an original stake; charging full 300 again on 200 -> 300; releasing funds on rejected increase |
| Funded participation / freeze | betting.test.ts: sparse 2/5/7, unfunded occupied skips, no-funded RNG guard | Auto-betting a computer; dealing to unfunded seat; reconfiguring a controller after OPEN |
| Pending / payout / commit | settlement.test.ts: early Natural, 50 -> 125, mixed seven-seat totals, duplicate commit | Crediting Natural mid-round; rounding away half a credit; paying 3:2 as gross rather than profit; deducting stake twice |
| VOID / ownership / recovery | financialLifecycle.test.ts: Natural plus bust then fault, exact refund, next shoe, leave/rejoin | Retaining provisional loss on VOID; refund plus normal payout; reusing retired shoe; minting a new bankroll on controller change |
| Funded M2 regression | fundedRegression.test.ts: HUMAN pause, all peek ranks, S17, cut boundaries, partial faults | Wrapper bypasses HUMAN input; cut replaces a shoe before completion; only partly dealt wagers are refunded |
| Original suites / harness | unchanged M1 155 and M2 78 tests, independently executed | Financial integration changes prior scoring/deal/secrecy or masks a required harness failure |

These are concrete regression failure modes, not fabricated reports of observed production defects. No M3 implementation/test failure required repair in T01–T05. Actual run evidence and cumulative ledgers are in STATE/DEVELOPMENT_LOG. The baseline sandbox ownership block was an execution-permission issue, not a gameplay bug.

### Learning and delivery state

Topics now available to study: exact unit accounting, occupied versus funded seats, delta reservation, all-or-nothing rejection, pending versus spendable returns, profit versus gross, table-level settlement, integrity versus normal loss, and idempotency. User understanding remains needs review / not assessed. The historical M3 suite had 23 files / 305 tests; its 40-case mapping remains in STATE at cca40d2. Independent review of d0d0a08 found a LOW stale status sentence, fixed by repair 2 at cca40d2. The user subsequently ACCEPTED M3 at that repaired HEAD. No unrecorded repaired-HEAD reviewer recheck or deployment is claimed. Current M4 evidence follows; no optimal computer-strategy or production security claim.

## 30. M4 implementation and learning checkpoint

### Seat, hand and wager lineage

A seat owns the session bankroll and controller. A hand owns cards, decisions, stake and its own result. One seat can have several ordered hands after Split, so a seat number alone is insufficient to identify a command target. M4 also requires the current stable hand ID. A stale command for a completed child cannot silently act on its sibling.

An original hand starts as a leaf. Split replaces it with two children: the parent supplies ancestry but no longer appears among settling leaves. IDs extend the parent path with .1/.2; root identity and original-card context remain available. Re-splitting replaces one leaf with two, increasing the leaf count by one. Settlement must iterate leaves because each can independently win, push or lose. Counting the removed parent would create an extra payout without matching reserved money.

For a 100-credit original wager split into two 100-credit leaves, win/loss produces gross 200+0 credits against 200 credits total reserved: net zero. If the winning leaf first Doubles to 200 credits, win/loss instead produces gross 400+0 against 300 reserved: net +100. Financial records identify round, seat and hand, so these outcomes remain attributable.

### Depth-first dealing and split value

Split first creates children retaining the first and second original physical cards respectively. Deal the first child's required second card, finish that child completely, then deal the second child's required second card. A re-split continues down the current branch before returning to its sibling. Every leaf for this seat finishes decisions before another seat acts.

Example: 8/8 splits; the next shoe cards are 2,3,4. Child 1 receives 2, Hits and receives 3, then Stands. Only then does child 2 receive 4. Pre-dealing both children would incorrectly give 3 to child 2 and 4 to child 1. Stable physical-card assertions detect that error even if both resulting totals happen to be legal.

Rank and splitting value differ. 10/J/Q/K are different ranks but all have splitting value ten: 10/K and J/Q may split. Numeric 2..9 require identical ranks; Ace pairs only with Ace. An A+K child is ordinary 21 because it came from a Split; two cards totaling 21 alone are insufficient to establish original Natural eligibility. It pays at most the ordinary 1:1 win, never 3:2.

### Double, DAS and atomic additional funding

Double is an eligible HUMAN hand's first decision with exactly two cards totaling below 21. It must reserve one full matching current wager from AVAILABLE funds, then double the settling stake, give that hand exactly one card and finish its decisions. A low resulting total cannot Hit again. Double After Split (DAS) uses the same rule on eligible non-Ace children. Split-Ace children are excluded.

Funding is checked before any card or turn effect. Available 200 units funds a matching 200-unit addition; 199 does not. Existing reserved stakes and pending wins are unavailable. A failed request returns the original state with no changed cards, shoe, RNG, current hand/seat or money. Original main-bet limits govern the initial bet, not the exposure after an accepted Double. Advancing after Double may also deal a waiting sibling's required second card, but the doubled hand itself gets exactly one.

### Four-leaf cap and Split Aces

One original seat may end with at most four leaves: three successful splits. Completed and busted leaves remain in that count. Otherwise finishing or busting a hand could incorrectly reopen capacity and allow a fifth leaf. The cap and funding are separate checks: ample funds do not bypass the cap, and remaining capacity does not supply funds.

Ace pairs split once into two ordered children. Each receives one additional card and immediately finishes decisions; no Hit, Double, Surrender or re-split is permitted, even if another Ace arrives. A+K is ordinary 21. Decision completion is distinct from a determined result: surviving Split-Ace totals still need comparison with the shared S17 dealer. Dealer draws can be skipped only when every outcome is already known, such as Natural, bust or surrender.

### Late versus Early Surrender

Late Surrender becomes possible only after dealer Natural is excluded. A 2..9 upcard makes Natural impossible; an Ace or ten-valued upcard requires the existing negative peek. Early Surrender would allow giving up before that exclusion and is not implemented. M4's immediate peek flow has no Insurance or Even Money window.

Only an original, unsplit, non-Natural two-card hand before Hit/Stand/Double/Split may surrender. It ends the hand without drawing or reserving more funds and returns half the original stake. A 50-unit original wager returns exactly 25 units, losing 25. Original wagers are even integer half-credit units, so no fractional-unit rounding is needed. A known dealer Natural prevents this choice.

### Pending settlement and advanced VOID

Gameplay completion and financial commit are separate. Each leaf's result can become known while other seats still play, but its return cannot fund another action. One final table commit validates leaf stakes against reserved money, adds gross returns and clears reservations once. Repeated commit rejects unchanged.

If a required Double, first/later split-child, re-split or dealer draw exhausts the shoe, the round enters integrity failure without inventing a card or shuffling mid-round. Normal pending outcomes are invalidated; diagnostic cards and the retired shoe remain. VOID refunds all ACTUAL reserved exposure once, including accepted additional actions. An unfunded rejected Split creates no extra refund. A later explicit funded round can replace the retired shoe; there is no automatic replay. Refund and normal settlement cannot both pay the same round.

### Regression groups and concrete defects they detect

| Group | Independent evidence | Concrete defect caught if introduced |
| --- | --- | --- |
| advancedFoundation | Stable IDs, current-hand routing, original eligibility context, public allowlist | Routing a completed child's command to its sibling; leaking physical IDs or hidden dealer data |
| advancedDouble | Exact/short funds, one-card change, forced completion and explicit win/loss/push amounts | Spending reserved money; rejecting equality; drawing twice; paying only the undoubled stake |
| advancedSplit | All ordered ten-value pairs, original card references, depth-first shoe sequence | Comparing ranks only; swapping original cards; pre-dealing a sibling; classifying split 21 as Natural |
| advancedResplit | Four leaves, completed/busted count, ordered Ace additions and restrictions | Allowing a fifth leaf after bust; re-splitting a new Ace; allowing Double on restricted Aces |
| advancedSettlement | Every upcard class, post-action exclusions, exact half return and mixed leaf payouts | Surrender before Natural exclusion; surrendering split cards; paying removed parent; releasing pending funds early |
| advancedIntegrity | Real exhausted-shoe fixtures with 312-card accounting; first/later child and partial dealer faults | Mid-round replacement; retaining provisional winnings on VOID; refunding only original exposure or refunding rejected actions |
| advancedRegression | Executable REG-M4-001..060 and exact unique-ID assertion | Missing a required acceptance case; modifying the bot to choose advanced actions; duplicate payout/refund |

These are failure modes protected by executed assertions, not fabricated reports of observed gameplay failures. Actual M4 repairs were a T01 documentation patch-context mismatch, a T03 test-format lint error, and the T07 recovered STATE heading encoding substitution. None changed gameplay semantics. The interruption itself is not a defect or repair.

Observed full suite: 30 files / 476 tests. Separately rerun original M1 12/155, M2 6/78 and M3 5/72 all passed; their original files remain unchanged. M4 adds seven files / 171 tests including 60 mapped scenarios. Full evidence and cumulative repair counts are in STATE/DEVELOPMENT_LOG. COMPUTER remains <17 HIT / >=17 STAND, not basic/optimal strategy. Insurance, Even Money, Pair/21+3 side bets, Bet Behind, Charlie, UI/network, real money and deployment remain absent.

At the historical M4 handoff, independent review was NOT RUN and M4 was NOT ACCEPTED. The explicit M5 contract subsequently records M4 fresh review NO FINDINGS and HUMAN ACCEPTED at a5c6a22dd833867a6a1eff357a7462bd06fe4e0b. Current M5 evidence follows; user understanding remains needs review / not assessed.

## 31. M5 implementation and learning checkpoint

### Why Ace timing changes

M4 has no Insurance decision, so its accepted API peeks immediately after dealing. M5 must wait: accepting Insurance after checking the hole card would allow a wager after its result was known. M5 therefore owns initial dealing and exposes decisionPhase INSURANCE, leaving embedded M4 gameplay dormant. HUMAN must purchase, decline or elect eligible Even Money; COMPUTER deterministically declines both. Only all-closed decisions trigger one peek. Ten-value upcards still peek immediately without Insurance; 2..9 cannot be Natural and need no peek. A negative peek reveals only that Natural is excluded, never the hole card identity.

### Insurance stake, profit and gross

Insurance is a separately funded wager equal to half the original MAIN, not half a later doubled or split total. MAIN 200 units means Insurance 100 units; MAIN 50 means Insurance 25. Units are half credits, so 25 units is valid and exact, with no rounding. Equality of available and required funds is affordable. Failed funding neither closes the decision nor reveals cards, draws, changes turn or changes the main stake.

Ratios describe profit. Winning Insurance 2:1 returns 3*stake gross: a 100-unit Insurance stake returns 300, net +200. Losing Insurance returns zero, net -100. It wins only on dealer two-card Natural, never a later three-card 21. The main result is independent. Purchasing/declining Insurance is not a gameplay action; eligible Late Surrender remains possible after a negative peek.

### Even Money is an election, not a second wager

An original unsplit Natural against Ace may select Even Money before peek. It needs no extra funds and fixes MAIN gross to 2*original stake. MAIN 200 returns 400 whether dealer is Natural or not. Ordinary declined Natural instead returns 200 on dealer Natural push or 500 on negative peek (3:2 profit). One closed decision makes Even Money and Insurance mutually exclusive and irreversible. There is no separate Even Money reserve or refund, and no additional 3:2 award. A computer Natural simply declines, following the explicit portfolio policy rather than any claim of optimal/basic strategy.

### Original snapshots and Pair rank/colour

Each side evaluates once using the player's original first two physical cards; three-card adds only dealer upcard. Later Hit, Split children, Double card, hole card and dealer Hit cards cannot replace those inputs. Frozen original arrays and fixed pending results make this invariant testable even after a parent becomes split leaves. Side stakes are never duplicated or doubled.

Pair requires equal ranks. K/Q and 10/J can Split under Blackjack value rules but lose the Pair wager. Same rank and suit from distinct physical deck copies is Perfect Pair, 25:1 profit/26x gross. Same rank/colour but different suits is Coloured Pair, 12:1/13x. Opposite colours is Mixed Pair, 6:1/7x. Clubs/spades are black; diamonds/hearts red. A repeated physical ID is invalid input, not a perfect pair.

### Three-card priority and Ace semantics

Pay only the first applicable category: suited trips (100:1 profit, 101x gross), straight flush (40:1, 41x), trips (30:1, 31x), straight (10:1, 11x), flush (5:1, 6x), or NONE (zero). Suited trips cannot also collect trips/flush; straight flush cannot collect straight/flush again. J/Q/K remain distinct ranks. A23 is Ace-low and QKA Ace-high; KA2 is neither and cannot wrap around, though all-same-suit KA2 still qualifies as flush.

### Pending and independent outcomes

Main losing, pushing, surrendering or facing dealer Natural does not invalidate an initial side winner. Example: MAIN 200 plus Pair 20 plus three-card 20, with opposite-colour player 8/8 and dealer upcard 8/hole 10. Mixed Pair gross=140 and trips gross=620; main 16 loses to 18. From initial 2000, available stays 1760 throughout play. Only final settlement changes it to 2520. Net records are main -200, Pair +120, three-card +600.

A pending 6200-unit trips return with currently zero available still cannot fund a Split/Double. Otherwise action order would create spendable early profits and VOID would need clawbacks. MAIN leaf, Surrender, Natural, Even Money, Insurance and sides all join one final table commit. Per-seat sum of actual record stakes must equal reserved, and safe-integer available+gross must validate for every seat before any update. Stable round/seat/hand/wager IDs preserve attribution without a database or event store.

### M5 whole-round VOID

A genuine required-draw fault invalidates every pending outcome and retires the shoe. Refund actual MAIN leaves including accepted Double/Split/re-split, plus accepted side and Insurance stakes, once. Even Money contributes zero additional exposure. Example: doubled leaf 400, sibling 200, Pair 20, three-card 20 and Insurance 100 -> actual refund 740, zero net on every record. Rejected funding contributes nothing. A partial initial-deal fault still refunds funded seats that have not received cards. Repeated VOID/settlement or normal settlement after VOID cannot credit again. Next round is explicit and retains funds; a retired shoe is replaced only when the next funded deal starts.

### Regression families and concrete bugs they detect

| Family | Executed evidence | Concrete regression detected if introduced |
| --- | --- | --- |
| optionalBetting / REG 001-013 | Explicit min/max/even units, exact funds, delta, cascade and frozen close | Treating total reserved as MAIN stake; charging full target twice; accepting late side edit; failing to refund a dependent side |
| sideBets / REG 014-027 | Explicit rank/suit/category and gross examples | Treating 10/J as Pair; mixing red/black suits; adding lower categories; permitting KA2 wraparound; paying profit as gross |
| optionalEvaluation / REG 028-032 | Initial result identity retained across Hit/Split/Double/dealer cards | Re-evaluating side from child/hit/hole cards; duplicating side stake; suppressing side win when main loses |
| optionalInsurance / REG 033-046,071 | Actual hole-containing evaluator call count, frozen rejection, odd units and public allowlist | Peeking before purchase; using doubled exposure; rounding half stake; leaking negative peek; winning Insurance on later dealer 21 |
| optionalEvenMoney / REG 047-058 | Explicit 400 versus 500/200 results, no reserve and illegal follow-up decisions | Funding an unnecessary second bet; stacking 1:1 and 3:2; accepting Insurance after election; losing Late Surrender eligibility |
| optionalSettlement / REG 059-070 | Exact bankroll/record sums, large pending return, real exhausted-shoe fixtures | Paying side proceeds early; settling removed split parent; refunding only original MAIN; retaining Even Money profit on VOID; double credit |
| optionalIntegrity | Partial deal, rejected Insurance, replacement shoe and 312-card accounting | Forgetting undealt funded seat; refunding hypothetical Insurance; reusing retired shoe or silently replaying |
| original M1-M4 suites / mapping completeness | Separate 155/78/72/171 tests, unchanged paths, exact unique 72 IDs | A new layer silently breaking accepted contracts or omitting a promised regression case |

These are concrete defects the tests detect if introduced, not fabricated reports of observed failures. No M5 implementation repair occurred through T06. Actual commands, dates and final document verification are in STATE/DEVELOPMENT_LOG. Full observed suite: 38 files / 644 tests. Passing counts do not establish independent review, human acceptance or user understanding.

### Delivery and understanding

M4 was explicitly HUMAN ACCEPTED at a5c6a22dd833867a6a1eff357a7462bd06fe4e0b after NO FINDINGS and requirements/REG-M4/preservation/documentation PASS. M5 is implemented and mechanically verified locally, with publication and final documentation gate recorded in STATE. Fresh M5 review is NOT RUN, M5 is NOT ACCEPTED, M6 NOT STARTED. No UI/network/real money/deployment. User understanding remains needs review / not assessed; explaining the examples above is a learning exercise, not something inferred from tests.

## 32. M6 — Participant-owned Bet Behind learning checkpoint

### Controller, bettor and follower

A controller decides how the cards are played. A bettor owns the money committed to a wager. A follower is a bettor attached to another controller's hand. These roles must not collapse into a seat number: moving a HUMAN from seat 1 to seat 3 must not create a fresh 2000-unit balance or transfer the dormant computer's balance. M6 stores available/reserved funds once on the participant, and uses a temporary adapter to preserve older seat-based APIs. A spectator is a HUMAN participant controlling no seat; it can still back qualifying funded seats.

One original back wager creates financial exposure to existing cards, not another hand or another draw. If a controller Hits, both MAIN and follower observe that same result. A follower cannot Hit/Stand/Double/Split/Surrender for the target. Pair/THREE_CARD still use only an own-seat MAIN, so no side-bet-behind path exists.

### One available pool across targets

New participant bankroll is 2000 units (1000 credits). Backing seat 1 for 1200 and seat 2 for 800 leaves available 0/reserved 2000. Another paid decision must fail even if one target already has a pending win. Increasing a target reserves only the delta; reducing/cancelling releases only the actual reduction. Cancelling target MAIN returns its dependent back wager in the same transition. Close freezes eligibility/stakes, so a follower cannot wait to see cards before adding an original wager.

### Double follow ADD and NO_ADD

Controller legality and its matching reserve are decided first. Then the follower chooses before the forced card exists. For 200 units attached: ADD costs another 200, making 400 exposure; NO_ADD costs zero and retains 200. On a doubled winning hand these pay gross 800 and 400 respectively. Controller Double does not grant a free doubled follower payout.

An unaffordable ADD cannot veto the controller. The funding subrequest rejects atomically and records an explicit error, while the decision transition applies NO_ADD and completes the already accepted Double. The card is exposed only after that final choice. This separates controller action success from follower purchase failure. Pending Natural/other proceeds remain unavailable.

### Split first-child fallback and depth-first timing

For 100 attached units, ADD reserves another 100 and creates 100 on each ordered child. NO_ADD follows only child 1, which retains the earlier-dealt parent card; child 2 gets zero exposure. A follower cannot later move the stake to the winning child.

Children are created with one original card each before the follow decision. Only afterward does child 1 receive its next card; it is fully played before child 2 receives its next card. Re-splitting a tracked child opens a new decision using that child's actual attached stake. Re-splitting an untracked child opens no follower decision. Lineage references distinguish descendants of the same original wager. Split Aces and the controller's four-leaf limit remain gameplay restrictions; follower funds cannot change them.

### Surrender, Insurance and Even Money independence

Controller Late Surrender returns half of the attached follower stake; there is no independent follower Surrender or veto. It reserves no additional money.

Against dealer Ace, the local HUMAN's own MAIN decision (if any) comes first, followed by original back decisions sorted by target seat. Only then may the dealer peek. Computers decline automatically. A 50-unit original back stake buys exactly 25 units of Insurance; odd insurance units are valid because all accounting uses integer half-credit units. Insurance draws on the shared available pool, independently of controller choice. A backed original Natural can instead elect Even Money with no additional reserve and gross 2x, whether the controller elects it or not. The choice excludes Insurance and the 3:2 return. No descendant/new Insurance window appears after Split. Negative peek does not expose the hole card.

### Actual exposure, independent settlement and VOID

Settlement pays the actual funded leaf: ordinary win 2x, push 1x, loss/bust zero, Surrender half, original Natural 2.5x unless elected Even Money 2x. Double NO_ADD still settles only its unchanged stake; Split NO_ADD only its first-child descendants. Insurance gross is 3x its own stake on dealer Natural. Each record identifies participant, round, target, hand, original wager/parent lineage, actual stake, result, gross, net and status. All controller/follower returns stay pending until one table commit validates every reservation.

Integrity VOID replaces all pending normal/Insurance/Even Money outcomes with refunds of actual original, accepted ADD and purchased Insurance exposure. Rejected ADD and NO_ADD create no extra refundable money. Even Money adds no reserve. Repeated VOID, settlement after VOID and VOID after committed settlement cannot credit again. Partial initial-deal failure still refunds backed funded targets whose cards were not reached.

### Major M6 suites and concrete regression bugs

| Suite | Concrete bug its assertions detect |
| --- | --- |
| behindOwnership | Moving/leaving/rejoining HUMAN resets funds, copies spendable seat funds, permits two seats, or changes controllers during a round |
| behindBetting | Target increase charges the full amount twice, combined targets overspend, MAIN cancellation strands follower funds, or backing consumes extra cards/RNG |
| behindOutcomes | Follower uses controller stake instead of its own, misses Natural/Surrender, controls the target, or spends a pending return |
| behindDouble | Forced card appears before choice, NO_ADD gets a free doubled payout, unaffordable ADD blocks controller, or pending Natural finances ADD |
| behindSplit | NO_ADD follows the later/winning child, second child's card appears early, an untracked re-split asks for funding, or follower money bypasses leaf/Ace restrictions |
| behindInsurance | Dealer evaluates its hole card before final back choice, choices couple to controller, odd half-stake rejects, or a negative peek leaks |
| behindSettlement | Mixed child returns collapse together, accepted follow stakes vanish from refunds, rejected ADD generates phantom money, or finalization credits twice |
| behindIntegrity | Partial initial deal loses undealt target refunds, committed outcome survives VOID, next-round recovery fails, cut boundaries change, or opposite independent Even Money choices couple |
| behindRegression | A specific REG-M6 requirement fails; exact 001..095 completeness detects missing/duplicate registrations rather than trusting a documentation count |

The mapping suite has 95 requirement tests plus one completeness assertion. Nine M6 files contribute 181 tests; all 38 prior files / 644 tests remain unchanged and were rerun by milestone. Full current harness: 47 files / 825 tests, PASS. Expected financial results are explicit fixture numbers, not derived only from production payout helpers.

### Reachability, preservation and delivery

One local HUMAN may back only computer seats, and the preserved policy is <17 HIT / >=17 STAND. Computers never choose advanced actions, buy Insurance/Even Money or follow. Thus advanced-follow rules are exercised by explicitly controlled owner-checked domain fixtures, not naturally by local computer play. They are not evidence of multiplayer or alternate bot strategy. This reachability boundary is a required fresh-review topic.

The optionalGame compatible seam delays Ace resolution only when M6 asks; default historical callers remain unchanged. A preservation check initially compared M1 source directly with current and found an already accepted M2 shoe extension. The corrected check compares current original executables to accepted M5, separately comparing each historical test set with its own milestone revision. This teaches why an accepted baseline and a historical learning snapshot serve different verification purposes. T07 repair 1 records that procedure correction; T01 repair 1 records the new fixture typing fix. Failed attempts remain in DEVELOPMENT_LOG.

M5 is HUMAN ACCEPTED at f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d after the reported fresh recheck closed LOW-01. M6 implementation/mechanical verification does not imply fresh review or acceptance: fresh review NOT RUN, M6 ACCEPTED NO, M7 NOT STARTED. User understanding is not tested or inferred by this document. Next step is findings-first review in a genuinely new Codex conversation, with no edits absent separate authorization.


## 33. M7 browser boundary, accessibility and E2E learning

### Why React does not own rules

A button's disabled state can be bypassed by direct calls or stale UI. The domain therefore owns legal timing, routing, matching funding, split restrictions and settlement. React stores only form values and sends a command. The browser controller keeps the latest returned immutable domain state, projects a fresh safe snapshot and notifies subscribers. Two rapid Hits must use two successive states; browserController tests catch stale-snapshot overwrite by expecting four exact cards.

Raw state contains the shoe, physical card identities, original-card lineage and dealer hole card. Public state has only visible rank/suit, safe status/amounts and stable public hand identity. Hiding raw secrets with CSS still puts them in DOM/ARIA/attributes or debugging output. The hole must be removed before data reaches React. The K-of-spades fixture verifies page content, all attributes, text and ARIA snapshot, then confirms the card appears only after authorized reveal. A card back has the accessible name Hidden dealer card without rank/suit.

An action selector explains why an action is currently available, while the handler enforces that rule at dispatch. Shared getAdvancedActionError prevents two drifting rule tables. Wager queries reuse non-drawing immutable handlers and discard their proposed states; they never probe card actions or consume RNG. Direct illegal Split/Double/wager tests confirm rejection leaves cards/funds unchanged. ES2023-only domain compilation plus AST import checks prevent accidental React/window/document dependencies from silently entering the engine.

### Determinism without a replay product

Random retries make browser tests unreliable and can mask unreachable screens. E2E-only named factories create real production-domain states with known inventory/commands. Normal browser mode creates a normal random session; production build strips test fixtures. Double/Split follower windows use real owner-checked computer controller primitives because the accepted automatic Hit/Stand policy never initiates those actions. The fixture tests domain timing/funding, not invented UI results. It is not a user-facing seed/replay tool, and does not authorize M8.

The VOID fixture moves remaining cards to accounted discard, then a real Hit reaches required-draw exhaustion. The controller invokes domain VOID and the screen shows interruption/refunds rather than Loss. This catches accidental normal-winner rendering after integrity failure.

### Usable controls and browser regressions

Native buttons/inputs/selects provide keyboard activation and focus order. Explicit label/id associations make Your seat and Bet Behind target unambiguous. During T08, exact label lookup failed although Chromium's role name was correct: wrapped select options enlarged the DOM label text. A targeted fix plus actual spectator flow caught the distinction between an accessible role snapshot and locator behaviour. Visible gold focus, a skip link and live status support the primary workflow; text identifies You/current/completed/results without relying on colour.

Playwright presses Tab/Enter through setup, wager, deal, Hit, Stand and Continue table, checking actual focus. It measures desktop/tablet/320px document width, local priority and mobile action targets >=44x44, and inspects reduced-motion mode. Screenshot inspection complements measurements: overflow checks cannot alone establish readable hierarchy or a complete accessibility audit. No animation/sound is necessary to understand the state.

### Evidence map and what tests catch

| Evidence | Concrete regression |
| --- | --- |
| REG-M7-001 plus domain compile | UI/framework/DOM dependencies enter authoritative domain |
| 004/010/031/044/046 | Hidden hole rank/suit/ID enters public snapshot, markup or accessibility |
| 006/007/021/024/025 | Stale state, duplicated legality, unfunded/terminal card mutation |
| 017/018/020 | Reserved/pending look spendable, query mutates funds, late wagers remain enabled |
| 026..030/049/050/064 | Split order/identity/independent stakes/Aces restrictions regress |
| 031..037/052/058..061 | Peek timing, optional choices, follower control/funding/first-child routing drift |
| 038/057/062 | Integrity treated as loss or next round falsely replaces/replenishes |
| 041..044 | Keyboard/focus, clipping/overflow/touch or secret accessible names break |
| Mapping completeness | A required UX/REG/E2E owner is missing, duplicated or skipped |

M7_MAPPING holds exact file/title ownership: 64 REG checks (40 Vitest +24 Chromium), 14 unique UX IDs and 15 required E2E scenario IDs. REG001..094 of M6 remain unchanged; 095 is historical accepted-M6 browser-absence evidence with separately verified current domain independence. Historical preservation runs each milestone's original suites independently.

Browser E2E complements domain tests: it catches event wiring, rendered controls/results, labels/focus and CSS overflow that pure domain tests cannot observe. Domain suites exercise financial/gameplay/secrecy/integrity invariants beyond the 24 browser scenarios. Passing one layer does not replace the other, fresh independent review or human acceptance. Current evidence counts/versions/timestamps/ledgers live in STATE and DEVELOPMENT_LOG; M7 is not accepted and no deployment/M8 is implied.

## 34. M8 - Profiles, deterministic replay, public audit and portfolio evidence

### Narrow profiles and Charlie precedence

A generic configurable casino-rules engine would hide fixed assumptions and expand the verification surface. These two frozen profiles vary only ID and Charlie flag: CLASSIC_6D_S17_V1_1 OFF and CHARLIE5_6D_S17_V1_1 ON. S17, six decks, side tables and accepted restrictions remain fixed. Select a new profile only at an explicit eligible session start; it never silently changes during play.

R16 awards exactly five total cards from a legal Hit at <=21, with normal 1:1 profit. Bust is checked first; fifth-card 21 is only Charlie, not Natural or a stacked award. Third/fourth-card 21 already auto-stops. Dealer Natural is resolved before Hit, and whole-round VOID has final precedence. Non-Ace split leaves qualify independently on actual child stakes; parents never settle. Split Aces cannot Hit; Double draws once and ends. Followers settle only tracked actual exposure, including ADD/NO_ADD. Pair/THREE_CARD/Insurance/Even Money remain independent.

A regression example: a card-count check placed before bust could award five-card 22. Explicit Charlie tests expect PLAYER_BUST/zero gross. Split follower tests independently expect first-child 50 stake/100 gross and second-child bust, or only the first leaf under NO_ADD. Classic five-card 20 remains playable and the current Classic browser never labels it Charlie.

### PRNG, seed and private state

MULBERRY32_REJECTION_V1 accepts unsigned 32-bit seeds only. Each call advances private state by 0x6d2b79f5 modulo 2^32, mixes with specified XOR shifts and Math.imul, then produces a uint32 sample. To choose bound n, reject samples >=floor(2^32/n)*n, return sample%n. Rejection sampling avoids simple modulo bias; it is an implementation choice, not security/fairness certification. Descending Fisher-Yates consumes the source, followed by the cut choice 219..249. Normal unseeded mode still uses its original adapter.

Seed initializes a sequence; current PRNG state is the changing position within it. Neither belongs in the active public projection. Known seed 1 uint32 vector is 2693262067,11749833,2265367787,4213581821,4159151403. Explicit vector/shuffle/cut tests catch a changed constant, integer truncation or consumption order; a throwing Math.random spy proves seeded mode has no random fallback. String seeds are deliberately unsupported to avoid undocumented hashing.

### Commands versus snapshots, versioning and digest

Replay v1 starts from explicit profile/seed/algorithm/2000-unit funds/HUMAN/fault permission and contiguous ordered intents. It configures seats, wagers and choices, then uses actual command handlers for Hit/Split/follow/settlement/NEXT. Loading a trusted mutated state would bypass eligibility, funding and integrity rules; no such restore exists. Developer owner-checked CONTROLLER commands demonstrate advanced follower paths without changing normal bot policy. The optional accounted draw-fault command requires explicit permission and a real subsequent unavailable draw before VOID, never automatic fault recovery.

Strict schema/version parsing rejects unknown fields/commands, malformed seeds, unsupported algorithm/version, non-contiguous sequences and illegal handler order. Failure identifies sequence/reason; it never silently skips. The package source is not mutated. Multi-round outcome archives and all own/follower result records participate in comparison.

Canonical JSON sorts object keys, keeps array order and omits undefined properties. fnv1a32-v1 applies uint32 FNV-1a to UTF-16 code units of selected terminal public/results/funds data. Timestamps are excluded because wall-clock observation is not game outcome. This deterministic fingerprint is not authentication: collisions are possible and a developer can construct packages. Replay computes actual outcomes again and rejects mismatch. Tests catch changed commands/results, version acceptance, source mutation and accidental clock-dependent equality.

Replay is local reconstruction, not persistence: there is no save/load service, database, cloud recovery or refresh restoration. Browser offers its own finalized session only; the domain parser is a validated developer engineering boundary. Exported seed information can reconstruct future/hidden cards, so full packages are separate from safe audit, accessible only COMMITTED/VOID through player UI. NEXT removes export/result display while a new round is active. Tests try both the controller boundary and DOM/ARIA, catching a hidden textarea/button or active seed attribute even if it is visually concealed.

### Audit sequence, timestamp and redaction

Audit v1 observes accepted/rejected before/result transitions; events do not drive authoritative state. A monotonically increasing sequence gives order. UTC runtime timestamps show when observed, but may be identical and cannot prove uniqueness. An injected clock makes tests deterministic. Command IDs attribute attempts; rejected commands retain original gameplay state and stay outside the accepted replay journal.

Frozen events contain only primitive/null allowlisted fields: schema/sequence/time/type/profile/round/actor/seat/hand/wager/command/amount/gross/outcome/status/reason. Exact human/computer/follower/dealer/system identity matters, especially when the target controller and funding owner differ. Split events identify child hand IDs, not physical cards. Settlement uses actual funded stakes; follow amounts describe affected exposure, with final records authoritative for funding. Prior event arrays remain frozen when later commands/NEXT append new events.

Redaction by constructing a small public schema is easier to verify than deleting fields from a large secret event. No ranks/suits/card objects, physical IDs, future order, hidden ownership, seed or PRNG state enter public audit. Tests independently look for a known hole identity, shoe/ID fields and seed, and retain archived arrays to detect mutation. Runtime clock validation rejects missing UTC. Audit is not an event-sourced database or a tamper-resistant compliance record.

### Invariants and statistical limits

Seven bounded checks use 256 fixed seeds. They count 312 unique physical IDs, unique full draws, cut range/stability, same-seed shoe equality and conserved card accounting. Three-round multi-seat sessions independently reconcile reserves, actual result stakes, nonnegative available funds, total funds/net outcomes, exactly-once finalization and replay equality. The fault batch has 256 attempts: already initial-terminal rounds settle normally; playable rounds exercise unavailable-draw VOID/refund once. Controlled profile/follower cases assert exact results separately.

Gross RNG sanity only checks that outputs/cuts/shuffles do not collapse to one result. It cannot establish uniformity, fairness, cryptographic quality, certified RNG or RTP/house edge. No such claims are made. Targeted invariants took approximately 3.85 seconds; full current Vitest about 8-12 seconds, Chromium about 30 seconds plus historical preservation reruns. Timings are environment-dependent and bounded for local portfolio use.

### Browser, harness and interview evidence

M8 browser tests catch in-round profile changes, incorrect fifth-card 21 Blackjack labels, unreproducible seeds, active replay disclosure, original result replacement, unordered/unattributed audit, keyboard failures and 320px overflow. Portfolio fixture screenshots use a fixed UTC clock only in E2E and public UI; repeat generation was byte-identical. A first recipe incorrectly attempted Insurance Decline for seed 21/dealer 4; the executed failure corrected the recipe/test, not gameplay. README commands and links are tested; images contain no private paths or secret information.

REG-M8-001..096 has96 unique executable owners (83Vitest/13Chromium), verified by TypeScript AST and exact documentation rows. Batch1 added cascade refunds092 and strengthened036/059/087; batch2 adds exact replay cap/atomic recorder093, browser reproduction094, defensive replay095 and current-document consistency096 without replacing coverage. Unnumbered completeness/portfolio checks add evidence without inflating the mapping. Current verification inventory: **66 Vitest files / 956 tests**, **1 Chromium project / 44 tests**. Actual execution status is in STATE/log. Independent accepted M1-M7 inventories/assertions remain preserved. Only authorized historical absence assertions are anchored to old commits; current gameplay/secrecy remains tested. Isolated harness tests inject a nonzero preservation exit or missing tool and prove no false PASS.

Harness Engineering means explicit task contracts, actual checked exits, evidence-based bounded repair cycles, reproducible mappings and separate VERIFIED/ACCEPTED gates. It does not make generated code trustworthy by itself. M7 human acceptance was recorded with substantive T01 work. Historical original fresh review/batch1/recheck1 and batch2 repair evidence remain in STATE/log. The reconstructed independent review at07dbcea77561c9a8dc30d4e8498f99ec2f8d3b54 closed MEDIUM-01..04 and LOW-01..03. The later complete-harness review closed LOW-04/05 and opened MEDIUM-05; repeated stability verification and independent recheck are separate gates. This implementation session stops after authorized publication without independent recheck. M8 acceptance NO and deployment NOT RUN. [M8_REVIEW_HANDOFF](M8_REVIEW_HANDOFF.md) defines the recheck; [PORTFOLIO](PORTFOLIO.md) supplies a factual walkthrough without private career material.

### Lessons from M8 review repair batch 1

A TypeScript cast cannot validate external data. Object.hasOwn coerces property keys, so an array containing a valid profile string can masquerade as that key. Check unknown input with a primitive-string guard first, then construct typed normalized fields. Tests include a recomputed-digest malformed package so fingerprint rejection cannot accidentally mask the decoder failure.

Audit observations must reflect actual actions. Card-count differences lose a Stand after Hits and confuse automatic Split supplements with HIT decisions. A minimal primitive observer in the real progression loop records the decisions without duplicating policy or changing gameplay. Cancellation audit compares authoritative before/after wager removals; MAIN/side/follower each retain owner, actual released stake and originating command ID. Observation never performs another financial mutation.

Configuration is not a wager outcome and may exist before a round. Independent seat/hand rendering and event-aware occupancy labels fix presentation without relaxing secrecy. Charlie means a legal Hit producing five total cards, usually the third Hit after the opening two cards. Current prose/test titles were corrected; the historical execution log preserves failed/incorrect wording with the repair entry explaining it. Public screenshot regeneration changed the audit image honestly; reproducibility hashes do not prove UI correctness.

The fixed256-seed x3-round/full-replay workload once exceeded Vitest's default5s wall-clock budget (5482ms); the mapping review repair gives only REG-070 an explicit15s bound, retaining every seed/round/assertion. An interrupted sandbox Playwright cleanup and fixture assertion mistakes are retained in DEVELOPMENT_LOG. Actual final checked exits, not rerunning until lucky or changing expected financial results, govern publication. M1-M7 ledgers and original assertions remain unchanged.

### Lessons from independent recheck #1 and repair batch 2

A decoder bound is also a live-session contract. The old recorder accepted10001 commands although replay v1 decoded at most10000. MAX_REPLAY_COMMANDS now governs recorder, exporter and decoder. Rejection occurs before any authoritative handler/RNG/audit/clock mutation, retains every prior entry and never truncates. Browser intents reserve two slots because ADVANCE or another successful intent may also invoke SETTLE/VOID. At the exact supported completed boundary, the full10000-entry package replays normally; the original9993-wager reproduction rejects ADVANCE at9999 entries before dealer/fund/audit changes. A capped unfinished memory-only demo requires refresh; no forced Stand, artificial VOID or payout change is introduced. Defensive ReplayError handling preserves original finances/audit and removes replay availability instead of exposing a failing result.

Current truth belongs at the document entry point as well as later sections. The stale LAB top statement fresh review NOT RUN survived batch1 despite later review evidence. REG-096 now checks all eight required current-status blocks plus LAB's top status and UX section36, separately from labelled historical records. Original review and failed attempts remain historical evidence; implementation PASS never means finding closure or human acceptance.

### Historical inventory and active-hand layout repairs (closed by later review)

LOW-04 updates current inventory paragraphs while retaining explicitly historical 38/43-test records. REG-096 counts literal executable Chromium test registrations with TypeScript AST, independently counts Vitest files, and compares the three original inventory locations plus eight current-status blocks and M8_MAPPING against the executed 66-file/956-test/44-Chromium inventory. It also retains review-status checks at the LAB entry point and UX section36. LOW-05 places the title and ACTIVE in wrapping normal flex flow; bounding rectangles at768x1024,1280x900 and320x720 are visible/disjoint with no horizontal page overflow, including Split. The new geometric test failed on the original overlapping layout before the repair. Only a genuinely fresh independent reviewer may close LOW-04/05; implementation verification is not acceptance.

## 35. Harness reproducibility under full-suite load

Fixed invariant workloads can spend more time constructing matchers than drawing cards. REG-067/069 retain all256 seeds/every draw/check but fail directly with seed/draw/card context. REG-070 stores one real replay and independently checks outcomes and digest, retaining256x3 rounds and all financial/card assertions. REG-093/094 retain the complete10000-command boundary with local15s/20s workload ceilings informed by reviewer load evidence; these are test allowances, not product performance guarantees. Global timeout and070's15s remain unchanged.

Await mandatory fixture cleanup after spawnSync completes. Node24.19.0 rmSync retry options failed an actual Windows handle probe; awaited fs/promises.rm retries known transient errors and propagates exhaustion. Real300ms/1500ms locks recover; a10s lock still fails after3137ms. Recursive retries do not imply a600ms total. Natural reviewer EPERM was not reproduced and its handle owner is unknown. [M8_HARNESS_STABILITY](M8_HARNESS_STABILITY.md) records every measured run and failed proposal. Repeated PASS is bounded evidence, not proof for every machine/load; MEDIUM-05 stays OPEN until independent recheck. M8 ACCEPTED NO; deployment NOT RUN.
