# Casino Blackjack — Lab Manual

Document date: 2026-09-28  
Document task: LAB-1.0  
Intended repository location: `docs/LAB_MANUAL.md`  
Repository target: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Current milestone: `M1 — Headless Blackjack Core`  
Status: learning manual prepared before implementation. Planned material is not evidence of implementation or verification.

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

Planned capabilities across later milestones include:

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

The following sections are learning targets only until their milestone becomes active.

## 16. M2 — Multi-seat Table

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

Before M1-T01 execution:

- House Rules v1.1: discussed and defined.
- M1 scope: defined.
- M1 design: defined.
- M1 task plan: defined.
- Repository execution: not started.
- M1 code: not implemented.
- Automated verification: not run.

The first hands-on lab is:

`M1-T01 — Repository Bootstrap and Engineering Harness`
