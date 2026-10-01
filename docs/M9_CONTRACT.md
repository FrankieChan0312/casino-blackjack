# M9 — Player Experience / Casino Session Flow

Authorized baseline: M8 HUMAN ACCEPTED at `8f5aca327f41f1078fc4fef20b611fd9cd494492`. The owner supplied the genuinely fresh independent NO FINDINGS review and explicit “I accept M8.” on 2026-10-01. MEDIUM-05 CLOSED; all earlier findings remain CLOSED. M8 ledger remains `0,2,3,2,2,1,2,6,4`. The entry clarification was not a repair.

Every M9 task recommends GPT Sol 6.1 / High. Actual model and effort: NOT VERIFIED / NOT VERIFIED; no client switch is evidenced. Every task is capped at ten cumulative evidence-based repair cycles. No subagents are requested. Delivery stops after VERIFIED / COMMITTED / PUSHED, clean synchronized main, for genuinely fresh review. M9 ACCEPTED: NO; deployment NOT RUN.

## Product contract

The default is Player Mode: a Classic table, one local human at Seat 4 and three labelled computer guests at Seats 1, 3 and 6. This is a local illustrated simulation, not a live human dealer or remote players. Empty modelled seats remain supported in demo mode. A session prepares seating and opens betting automatically; the player sets only their own main wager. Each funded computer guest stakes 25 credits from its existing available funds, using whole credits up to 25 when fewer remain. Below the 10-credit minimum it sits out that round without replenishment. Occupancy never changes mid-round.

The browser issues existing CONFIGURE / OPEN / MAIN / CLOSE / ADVANCE / SETTLE / VOID / NEXT commands. Each automatic command uses the same authoritative handler, audit attribution, seed journal and capacity preflight. No accepted domain source, policy, paytable, payout, accounting, hole-card secrecy, replay schema or RNG changes are planned.

After Deal, explicit human Insurance / Even Money / follower decisions pause progression. Computer turns and shared dealer resolution otherwise proceed automatically, once per actionable snapshot, without a Continue table button in Player Mode. There is no timer on human choices, no auto Hit/Stand for the human, and no automatic deal of a subsequent round. Domain ADVANCE may resolve several computer actions or dealer draws atomically; M9 does not manufacture per-card state or timing.

Deal Again opens fresh betting and preserves bankrolls and the shoe. Repeat Bet is an explicit user action to validate and reserve the previous original human MAIN amount and deal. It does not repeat optional side/back/Insurance stakes, Double/Split exposure, or silently reduce an unaffordable human bet. A failed repeat explains the funding limit and leaves betting open. Result records remain separate and accurate. Optional side/back wagers remain available in secondary wagering controls. Session reset remains deliberate and labelled.

The composition uses felt, a restrained premium rail, central original illustrated female dealer in professional evening service attire, original seated evening-attire computer guests, and the player's large cards at the near edge. Figures are fictional code-native vector art, with no real-person references, copyrighted source artwork, explicit clothing, 3D engine, sound or asset service. Figures never obscure cards or controls. Desktop/tablet show the table and primary decisions together; narrow mobile uses compact guest summaries and prominent human cards/actions. Semantic cards, visible keyboard focus, live feedback, 44px controls, reduced motion and secret-free public projection remain mandatory.

Native collapsed Developer / demo tools contain configuration, manual progression, Seed / Profile, Replay and Audit. A deliberate manual demo remains available for all accepted workflows and fixtures; existing tests continue to exercise it with unchanged assertions. Production opens Player Mode. E2E bootstrap without a named fixture also opens Player Mode; historical named factories explicitly retain manual mode.

## Sequential task contracts and verification

All tasks exclude domain rule changes, M10, deployment, network, accounts, persistence, real money, dependencies, paid resources, copyrighted art and real likenesses. Stop affected work for authority conflicts, unknown overlapping changes, required tool unavailability, accepted domain changes, unsafe publication, or stalled repair count approaching ten. Each checkpoint: inspect full scoped diff -> run required checks with exit codes -> persist ledger/evidence -> normal commit/push origin main -> fetch/parity/clean receipt. T01 is documentation-only, using the previously executed unchanged baseline harness plus documentation regressions; later executable tasks run the unified harness.

| Task | Scope and success criteria | Step -> verification |
| --- | --- | --- |
| M9-T01 | Product contract, approved SPEC/DESIGN/UX additions, M8 acceptance and task ledger; AC-015 | Cross-authority consistency and scoped documentation diff -> existing documentation tests, diff --check |
| M9-T02 | Browser Player Mode session shell and production entry; AC-001/007 | Open into prepared own-seat table without setup -> controller/component checks and full harness |
| M9-T03 | Three guests, independent funded automatic MAIN each round; AC-004/005/006 | Real commands, minimum/low funds/no refill/boundary tests -> full harness |
| M9-T04 | Automatic computer/dealer progression, human-decision pauses; AC-008/013/014 | Deterministic human/Insurance/follower/terminal/cap checks -> full harness |
| M9-T05 | Near-edge human cards, center dealer, responsive table; AC-002/003/010/012 | Desktop/tablet/320px geometry, split labels/cards -> browser checks/full harness |
| M9-T06 | Original dealer/guest vector presentation and atmosphere; AC-003/004/010/011 | Figure presence/public-only asset inspection, screenshots/reduced motion -> full harness |
| M9-T07 | Human-only primary betting, Deal Again / Repeat Bet; AC-006/007 | Invalid/unfunded repeat, original amount, shoe/funds/results tests -> full harness |
| M9-T08 | Collapsed developer tools and deliberate manual demo; AC-009 | Keyboard/focus, collapsed initial tools, seed/replay/audit/manual preservation -> full harness |
| M9-T09 | E2E/AC mapping, screenshots, exact current docs, review/acceptance pack; AC-001..015 | All current checks plus independent accepted M1–M8 preservation, screenshots/inspection, final diff --check/status -> final full harness and publication |

## Acceptance mapping

| AC | Required outcome | Primary owners |
| --- | --- | --- |
| AC-M9-001 | Table opens before configuration | T02, T08 |
| AC-M9-002 | Dominant first-person human hand | T05 |
| AC-M9-003 | Central clearly present dealer | T05, T06 |
| AC-M9-004 | Computer guests present by default | T03, T06 |
| AC-M9-005 | No repeated computer count selection | T02, T03 |
| AC-M9-006 | No repeated computer wagering by player | T03, T07 |
| AC-M9-007 | Own wager and human decisions primary | T02, T07 |
| AC-M9-008 | Automatic computer/dealer resolution | T04 |
| AC-M9-009 | Secondary collapsed engineering tools | T08 |
| AC-M9-010 | Recognizable tasteful casino table | T05, T06; human judgment pending |
| AC-M9-011 | Original professional fictional characters | T06 |
| AC-M9-012 | Usable desktop/tablet/narrow mobile | T05, T09 |
| AC-M9-013 | Keyboard/focus/reduced motion/secrecy/accessibility | T04, T05, T08, T09 |
| AC-M9-014 | Accepted M1–M8 preserved | All executable tasks, T09 |
| AC-M9-015 | Accurate documentation and delivery states | T01, T09 |

Automated evidence does not answer “fun enough to casually play”, “feels like a game”, or “interviewer-ready” by itself. The final pack must provide a short human walkthrough and leave these judgments and acceptance to the owner after fresh review.
