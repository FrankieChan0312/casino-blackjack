# Casino Blackjack

A headless TypeScript Blackjack portfolio project with deterministic tests, explicit state transitions and reproducible execution evidence.

**Simulation credits only: no real money, purchases, deposits, withdrawals, transfers or redemption.** M1-M5 are HUMAN ACCEPTED. M5 was accepted at `f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d` after the fresh recheck reported NO FINDINGS, LOW-01 CLOSED and requirements/regression/documentation/prior-preservation PASS. M6 T01-T08 form the mechanically verified Bet Behind implementation/review package. **M6 fresh independent review is NOT RUN; M6 is NOT ACCEPTED.** See [STATE](docs/STATE.md) for exact verification, checkpoint/publication evidence and the fresh-session handoff.

There is no UI, interactive CLI, network multiplayer or deployment. Five-Card Charlie remains unimplemented; M7 is NOT STARTED. This local portfolio library makes no production casino or gambling-certification claim.

## Implemented behaviour

- Seven stable EMPTY/HUMAN/COMPUTER seats, zero or one HUMAN, with sit-out configuration before betting opens. In M6, participant-owned bankroll persists through seat changes; the preserved M3-M5 APIs retain their historical seat-owned funds.
- Starting balance: **2000 integer half-credit units = 1000 credits**. Original main wagers: **20..2000 units**, even increments (10..1000 whole credits). No floating-point financial amounts or automatic replenishment.
- OPEN betting permits explicit wager placement/change/cancellation. Closing freezes funded participants. Computers receive no automatic bets. Reserved funds and pending returns cannot fund another action; exact available funds suffice.
- Shared six-deck shoe/dealer and ascending initial deal passes. M5 Ace upcard opens an Insurance/Even Money decision window before peek. Ten-value upcards peek immediately without that window; 2..9 require no peek. Every hand for one seat finishes decisions before the next seat acts.
- HUMAN Hit/Stand plus **Double**, **Double After Split**, **Split**, **Re-split** and **Late Surrender**. Stable round-local hand IDs identify the current hand and each settling leaf.
- Double requires two cards, total below 21, first decision, no Split-Aces restriction and matching available funds. It reserves exactly the existing stake, doubles settling exposure, draws exactly one card to that hand and ends decisions. No Double-for-less; original main-bet maximum does not cap doubled exposure.
- Split requires a first-decision pair of equal Blackjack value: A/A, identical 2..9, or any 10/J/Q/K combination. It reserves one matching stake and replaces the parent with two ordered children. First child receives its added card and is fully played before the second receives its added card. Advancing a finished hand may therefore deal the next child's required card in the same command.
- Non-Ace re-split preserves depth-first order, with at most four leaves per original seat. Completed/busted leaves still count. Split Aces can split once: each of two children receives exactly one additional card, then no Hit/Double/Surrender/re-split. Split A+K is ordinary 21, never Natural.
- Late Surrender requires an original, unsplit, non-Natural two-card hand before its first decision and after dealer Natural has been excluded. Gross return is exactly half the original stake, without another reserve or draw.
- Computer policy remains deliberately simple and non-optimal: total <17 -> HIT; total >=17 -> STAND. Computers never choose advanced actions and always decline Insurance/Even Money. This is a simple portfolio policy, not basic strategy. The shared dealer follows S17 once, drawing only when an ordinary result requires comparison.
- Each leaf settles independently: ordinary win gross=2*stake; unconverted original Natural gross=(stake/2)*5; push=stake; surrender=stake/2; loss/bust=0. Doubled leaves use their full stake. Parents never settle. All returns stay pending until one table-wide commit.
- Records identify round, seat, wager ID/type, hand where applicable, stake, outcome/category, gross, net and status. Commit validates all per-seat MAIN leaf, Insurance and side exposure against actual reservation. Repeated settlement rejects unchanged.
- Required-draw integrity failure retires the shoe, preserves diagnostics and invalidates normal results. Whole-round VOID refunds every actual reservation, including accepted Double/Split/re-split, Insurance and side exposure, exactly once. Even Money has no additional stake to refund. Rejected hypothetical funding is never refunded.
- Healthy shoes persist. Crossing cut position 219..249 defers replacement until the next explicit funded deal; no mid-round reshuffle or automatic replay.
- Public multi-hand projection exposes rank/suit only, hides the hole card during INSURANCE/PLAYER_TURN/INTEGRITY_ERROR and excludes physical IDs, shoe order, cut position and internal lineage cards.

## M6 participant-owned Bet Behind

Use `behindGame.ts` for the M6 session and `getPublicBehindView` from `behindPublicView.ts` for visible state. A stable local-human participant may control one seat or remain a spectator. Funds persist when moving/leaving/rejoining seats between finalized rounds. Separate computer owners retain their own funds; no spendable seat copy duplicates HUMAN money.

Original back wagers target another occupied, active seat with funded MAIN, one per target, **20..2000 even units**. A spectator needs no own MAIN. Multiple targets, own MAIN/sides and optional decisions share one participant AVAILABLE pool. OPEN-only target-stake changes reserve/release the delta; target MAIN cancellation atomically refunds dependent back stakes. Close freezes originals without adding cards or hands. Side bets cannot be placed behind another seat.

Controller owns Hit/Stand/Double/Split/Re-split/Surrender and cards. Follower owns its stake, follow funding and Insurance/Even Money. Controller Surrender returns half the attached follower stake without follower veto. Other results use the same controller hand and the follower's actual exposure.

Controller-funded Double/Split pauses **before new cards** for ADD/NO_ADD. Double ADD matches the follower stake; NO_ADD retains its original exposure. Split ADD places equal stakes on ordered children; NO_ADD follows only the child retaining the earlier-dealt card. Re-split applies anew only on a tracked descendant. Insufficient ADD records funding rejection and irrevocable NO_ADD, then continues the accepted controller action. Pending returns cannot fund additions. Depth-first child play, Split Aces and the four-leaf cap are preserved.

Against dealer Ace, own HUMAN MAIN decisions precede back decisions ordered by target seat; peek waits for all. Each original back wager independently chooses Insurance for exactly half its original stake (odd units legal), decline, or Natural Even Money without extra reserve. Even Money excludes Insurance and 3:2, fixing gross 2x original. Controller choices do not force follower choices.

One table commit settles all actual exposures independently: ordinary win 2x, push 1x, loss/bust 0, Surrender 0.5x, original Natural 2.5x or elected Even Money 2x. Insurance pays gross 3x its own stake on dealer Natural. Records attribute round, owner, target, hand/lineage, original wager, actual stake, result/gross/net/status. Whole-round integrity VOID overrides pending outcomes and refunds only actual original, accepted follow and Insurance stakes once. Repeated or opposite finalization has no second effect.

| M6 command | Purpose |
| --- | --- |
| `createBehindGame`, `configureBehindSeats`, `openBehindBetting` | Participant/session and pre-betting configuration |
| `setBehindMainWager`, `cancelBehindMainWager` | Explicit controller MAIN funding/cascade |
| `setBackWager`, `cancelBackWager` | Local HUMAN original back target stake |
| `setBehindSideWager`, `cancelBehindSideWager` | Own-seat Pair/THREE_CARD only |
| `closeBehindBetting` | Freeze/deal and enter any Ace window |
| `decideBehindMainInsurance`, `electBehindMainEvenMoney` | Own HUMAN MAIN choice |
| `decideBackInsurance` | Target original DECLINE/INSURANCE/EVEN_MONEY |
| `actBehindHand`, `advanceBehindTable` | Own HUMAN action or fixed computer/dealer progression |
| `getBackResults`, `settleBehindWagers`, `voidBehindRound` | Pending results and one final settlement/refund |
| `prepareNextBehindRound` | Explicit next cycle, preserving participant funds |

`behindController.ts` provides owner-checked domain Double/Split/Stand primitives and `decideDoubleFollow` / `decideSplitFollow`. **Local reachability limit:** with at most one HUMAN, all legal local backed targets are COMPUTER. The accepted <17 HIT / >=17 STAND policy never initiates advanced actions. Advanced-follow mechanics therefore use labelled controlled domain fixtures; normal local computer play does not trigger those windows. Owner IDs are correctness routing, not authentication or a multiplayer service.

Use the matching orchestration API for its state; direct legacy calls bypass M6 follower timing/funding. Retain returned states. An accepted controller action can lead to an integrity fault; inspect resulting phase. Failed follow funding can resolve the overall decision successfully as NO_ADD with an explicit funding error. Raw state must never substitute for the public projection.

## Preserved M5 wagers and API

Pair and THREE_CARD stakes are 2..200 even units (1..100 whole credits). Each requires a funded own-seat MAIN wager on an occupied, non-sitting-out seat. OPEN permits placement, delta changes and cancellation; cancelling MAIN refunds its dependent sides atomically. Closing freezes all original wagers. Computers get no automatic bets.

Each side evaluates once from immutable original cards, independently of main loss/push/surrender/dealer Natural. Pair uses the player's first two cards and requires equal **rank**, not Blackjack value. Three-card uses those two plus only dealer upcard. Hit, Split, Double and later dealer cards never change the original side stake/result.

| Wager/category | Profit ratio | Gross multiplier |
| --- | --- | --- |
| Pair: Perfect / Coloured / Mixed | 25:1 / 12:1 / 6:1 | 26 / 13 / 7 |
| Three-card: Suited trips / Straight flush / Trips | 100:1 / 40:1 / 30:1 | 101 / 41 / 31 |
| Three-card: Straight / Flush | 10:1 / 5:1 | 11 / 6 |
| Insurance WIN | 2:1 | 3 |
| Even Money MAIN | 1:1 | 2 |

Only the highest side category pays; NONE returns zero. Pair colours are clubs/spades black and diamonds/hearts red. Distinct physical copies permit perfect pairs and suited trips. Three-card permits A23 and QKA straights, never KA2 wraparound; same-suit KA2 can still be a flush.

Insurance reserves exactly half the **original** MAIN stake from AVAILABLE funds, including odd half-credit units (50-unit main -> 25-unit Insurance). Exact funds suffice; insufficient requests change nothing. It wins only on dealer Natural, not a later three-card 21. An original Natural may instead elect Even Money without additional reserve, locking 2x original gross for either peek outcome. Insurance and Even Money are mutually exclusive and irreversible. Taking/declining Insurance does not consume the first gameplay action or disqualify otherwise-legal Late Surrender. Every return remains pending until one table settlement; VOID overrides all results.

For historical M5 sessions, import the command surface from `src/domain/optionalGame.ts` and public projection from `optionalPublicView.ts`:

| API | Purpose |
| --- | --- |
| `createOptionalGame(shoeId, random)` | Create session, bankrolls, table and shoe |
| `configureOptionalSeats(state, updates)` / `openOptionalBetting(state)` | Configure then lock seats/open betting |
| `setOptionalMainWager(state, seatNumber, stakeUnits)` / `cancelOptionalMainWager(state, seatNumber)` | MAIN target/cascade cancellation |
| `setSideWager(state, seatNumber, type, stakeUnits)` / `cancelSideWager(state, seatNumber, type)` | PAIR or THREE_CARD target/cancellation |
| `closeOptionalBetting(state, replacementShoeId, random)` | Freeze, deal, evaluate initial sides; pause for Ace HUMAN decision |
| `decideInsurance(state, seatNumber, purchase)` | Purchase exact half, or decline both choices |
| `electEvenMoney(state, seatNumber)` | Eligible Natural elects fixed MAIN return |
| `hitOptionalHand` / `standOptionalHand` / `doubleOptionalHand` / `splitOptionalHand` / `surrenderOptionalHand` | State, current HUMAN seat number and current hand ID |
| `advanceOptionalTable(state)` / `resolveOptionalDealer(state)` | Run computers/dealer; pause at HUMAN decisions |
| `getOptionalMainResults(state)` / `getOptionalWagerResults(state)` | Pending/final records without crediting funds |
| `settleOptionalWagers(state)` / `voidOptionalRound(state)` | One final commit or actual-fault refund |
| `prepareNextOptionalRound(state)` | Explicit next cycle after COMMITTED/VOID |
| `getPublicOptionalView(state)` | Visible cards and decision choices, excluding secrets |

Retain every returned state; rejected commands return the same reference and error. `ok=true` may still report an accepted action followed by required-draw integrity failure. Flow: configure -> open -> fund MAIN/sides -> close/deal -> Ace decisions if needed -> gameplay -> settle or integrity VOID -> prepare next. Gameplay completion does not release money.

M1 `game.ts`, M2 `tableGame.ts`, M3 `bettingGame.ts` and M4 `advancedGame.ts` remain unchanged historical APIs. M5 reuses advanced actions after its own delayed initial resolution. Use M5 commands for M5 states: direct legacy calls bypass its Insurance guard/financial contract. The outer `decisionPhase` is authoritative while Insurance is open; the embedded M4 gameplay state is dormant. Never serialize raw internal state as a public view.

## Verification

Use Node 24 (>=24.19.0), npm and Windows PowerShell 5.1:

```powershell
npm.cmd ci
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The harness runs typecheck, lint and all unit/integration suites, checking failure exits. Its historical final label says `M1 engineering verification`; discovery includes all milestones. Latest executed full suite: **47 files / 825 tests**, typecheck/lint/tests PASS. Original M1 **12/155**, M2 **6/78**, M3 **5/72**, M4 **7/171**, M5 **8/168** separately rerun PASS. M6 adds nine suites / 181 tests, including **REG-M6-001..095** and exact unique-ID completeness. Original tests remain unchanged; the only accepted executable extension is the default-false deferred-Ace seam in optionalGame.ts. See STATE for timestamps and exact inventory.

## Limits and review status

Amounts are safe integer half-credit units. This in-memory API has no authentication, database, persistence, wallet, event store, concurrent network transaction protection, replay product or reset API. Callers must use the latest returned state; old snapshots can branch local computation. Arbitrarily corrupted caller objects are not a validated import format. Public projection is a correctness boundary, not security against the process owner. Math.random is only a simulation adapter.

M7/M8 functionality, UI/network/real money and deployment remain absent. Browser/E2E is NOT APPLICABLE (no UI). Separate clean-machine npm ci reproduction and cross-platform portability are NOT RUN. No dependencies were added.

After authorized publication and parity/clean checks, STOP for a **genuinely new Codex conversation** following the [findings-first M6 handoff](docs/STATE.md#mandatory-m6-fresh-session-review-handoff). The reviewer independently inspects requirements/diff/REG mapping, reruns the harness and verifies M1-M5 preservation. It reports findings first and makes no edits without separate authorization. This implementation conversation does not conduct that review or mark M6 ACCEPTED; M7 remains NOT STARTED.

## Documentation

[RULES](docs/RULES.md), [SPEC](docs/SPEC.md), [DESIGN](docs/DESIGN.md), [PLAN](docs/PLAN.md), [STATE](docs/STATE.md), [DEVELOPMENT_LOG](docs/DEVELOPMENT_LOG.md) and [LAB_MANUAL](docs/LAB_MANUAL.md) hold rules, scope, architecture, checkpoints, evidence and learning notes. [UX_UI](docs/UX_UI.md) remains forward M7 design. [AGENTS](AGENTS.md) and [SKILL](SKILL.md) govern work. No repository license has been selected.
