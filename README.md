# Casino Blackjack

A headless TypeScript Blackjack portfolio project with deterministic tests, explicit state transitions and reproducible execution evidence.

**Simulation credits only: no real money, purchases, deposits, withdrawals, transfers or redemption.** M1-M4 are HUMAN ACCEPTED. The user explicitly accepted M3 at `cca40d2bed3b3964a9bfb47329d49bb553fe610e` after M3-T06 review repair 2; no unrecorded post-repair independent-review result is claimed. M4 was accepted at `a5c6a22dd833867a6a1eff357a7462bd06fe4e0b` after fresh review NO FINDINGS and requirements, REG-M4-001..060, M1-M3 preservation and documentation PASS. M5 T01-T07 are IMPLEMENTED and mechanically VERIFIED locally. **M5 independent fresh-session review is NOT RUN; M5 is NOT ACCEPTED.** Publication is explicitly authorized; checkpoint evidence is recorded in STATE and final SHA/parity in the delivery report. See [STATE](docs/STATE.md) for evidence and the 72-case mapping.

There is no UI, interactive CLI, network multiplayer or deployment. Bet Behind and Charlie remain unimplemented; M6 is NOT STARTED. This local portfolio library makes no production casino or gambling-certification claim.

## Implemented behaviour

- Seven stable EMPTY/HUMAN/COMPUTER seats, zero or one HUMAN, with sit-out configuration before betting opens. Each seat retains its session bankroll across controller changes and leaving/rejoining.
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

## M5 wagers and API

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

Import the current command surface from `src/domain/optionalGame.ts` and public projection from `optionalPublicView.ts`:

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

The harness runs typecheck, lint and all unit/integration suites, checking failure exits. Its historical final label says `M1 engineering verification`; discovery includes every milestone. Latest executed full suite: **38 files / 644 tests**, typecheck/lint/tests PASS. Separately rerun original suites: M1 **12/155**, M2 **6/78**, M3 **5/72**, M4 **7/171**, all PASS. M5 adds eight suites, including **72 executable REG-M5 scenarios** and exact unique-ID completeness. All original M1-M4 source/tests/helpers/harness/dependency/config paths remain unchanged; no assertions were weakened.

## Limits and review status

Amounts are safe integer half-credit units. This in-memory API has no authentication, database, persistence, wallet, event store, concurrent network transaction protection, replay product or reset API. Callers must use the latest returned state; old snapshots can branch local computation. Arbitrarily corrupted caller objects are not a validated import format. Public projection is a correctness boundary, not security against the process owner. Math.random is only a simulation adapter.

M6+ functionality, UI/network/real money and deployment remain absent. Browser/E2E is NOT APPLICABLE (no UI). Separate clean-machine npm ci reproduction and cross-platform portability are NOT RUN. No dependencies were added.

After the authorized publication and final parity/clean checks, STOP for a **genuinely new Codex conversation** following the [findings-first M5 handoff](docs/STATE.md#mandatory-m5-fresh-session-review-handoff). The reviewer independently inspects requirements/diff, reruns the harness and preserves M1-M4. It reports findings first and makes no edits without separate authorization. This implementation conversation does not perform that review or mark M5 ACCEPTED; M6 remains NOT STARTED.

## Documentation

[RULES](docs/RULES.md), [SPEC](docs/SPEC.md), [DESIGN](docs/DESIGN.md), [PLAN](docs/PLAN.md), [STATE](docs/STATE.md), [DEVELOPMENT_LOG](docs/DEVELOPMENT_LOG.md) and [LAB_MANUAL](docs/LAB_MANUAL.md) hold rules, scope, architecture, checkpoints, evidence and learning notes. [UX_UI](docs/UX_UI.md) remains forward M7 design. [AGENTS](AGENTS.md) and [SKILL](SKILL.md) govern work. No repository license has been selected.
