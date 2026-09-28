# Casino Blackjack — Lab Manual

Document date: 2026-09-28  
Document task: LAB-1.0  
Intended repository location: `docs/LAB_MANUAL.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Current milestone: `M3 — Credits, Main Betting, and Settlement`
Status: M1 and M2 are ACCEPTED. M3 is implemented and mechanically verified; independent review is NOT RUN and M3 is NOT ACCEPTED. Current M3 learning notes are in section 29; M4+ remains planned.

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

M2 and M3 are implemented as explained in sections 28 and 29. The original targets below are retained for learning context; M4+ remains planned.

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

## 20. M6 — Bet Behind

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

The user can now review/explain identity versus value, shoe versus round lifetime, injected randomness, natural precedence, visibility, legal transitions and integrity versus gameplay outcomes. User understanding: **needs review / not assessed**. Mechanical verification: 12 files / 155 tests PASS at the T09 checkpoint, with final T10 verification recorded in STATE/DEVELOPMENT_LOG. Fresh-session review: **NOT YET COMPLETED at that historical T10 checkpoint**. M1 is now **ACCEPTED** at d1d8966fe55af1bc2b9348e305135952b7723b70 under the explicit M2 contract. M2 implementation is described below; M3+ remains unimplemented.


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

Topics now available to study: exact unit accounting, occupied versus funded seats, delta reservation, all-or-nothing rejection, pending versus spendable returns, profit versus gross, table-level settlement, integrity versus normal loss, and idempotency. User understanding remains needs review / not assessed. M3 is IMPLEMENTED / mechanically VERIFIED; independent fresh-session review is NOT RUN; M3 is NOT ACCEPTED or DEPLOYED. Full suite has 23 files / 305 tests; the 40-case mapping is in STATE. No optimal computer-strategy or production security claim.
