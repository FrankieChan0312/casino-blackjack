# Casino Blackjack — Project State

## Current truth: M2-T04

M1 at d1d8966fe55af1bc2b9348e305135952b7723b70 is ACCEPTED by the explicit M2 batch contract. Earlier pending M1 review/acceptance statements in historical notes are superseded; no new independent review was performed here. Baseline at 2026-09-28 23:57:30 +08:00: main=origin/main, 0/0, clean. Origin is the authorized FrankieChan0312/casino-blackjack repository.

T01 checkpoint 7824e57e792db6c83ce874d8324538ae24b281a1 pushed to origin/main with fetch 0/0 and clean at 2026-09-29 00:07:52 +08:00. T02 adds shared initial deal, per-seat naturals and public projection. Full verify.ps1 PASS/0 at 00:10:55–00:11:27 +08:00: typecheck/lint and 14 files / 184 tests; source/test diff review PASS. No new dependencies. Recommended model/effort GPT-6 Astra / High; actual model NOT VERIFIED; actual reasoning/effort NOT VERIFIED.

| M2 task | Repair count | Status |
| --- | --- | --- |
| T01 | 1/10 | VERIFIED / COMMITTED / PUSHED: 7824e57; 0/0 clean |
| T02 | 0/10 | VERIFIED / COMMITTED / PUSHED: e0f7b36; 0/0 clean |
| T03 | 0/10 | VERIFIED / COMMITTED / PUSHED: 710b87d; 0/0 clean |
| T04 | 0/10 | IMPLEMENTED / VERIFIED; checkpoint pending |
| T05 | 0/10 | NOT STARTED |
| T06 | 0/10 | NOT STARTED |

M1 repair ledger T01..T10: **2,1,0,0,1,0,1,0,0,1**, each /10. Historical verification/AC mapping is preserved in Git at the accepted M1 SHA and DEVELOPMENT_LOG.md; no count is reset.

M2 scope: seven seats, zero/one human, computers, sitting out, frozen participation, shared shoe/dealer, deal/turn ordering, Hit/Stand, independent outcomes, public redaction and deterministic computer total<17 HIT / >=17 STAND. No wager/credit/advanced action/UI/network/server/replay product or casino-certification claim. HUMAN actions, ascending turns, deterministic computer automation and one shared S17 dealer comparison are implemented. Required checks for every task: full verify.ps1, diff --check, complete task diff and status; commit/push/fetch only on PASS. No known implementation blocker.

Latest baseline: main=origin/main=e0f7b366c69f2980aa53283a5f37324ff89d2928 at 2026-09-29 00:12:43 +08:00, 0/0 clean. T03 full harness PASS/0 at 00:14:30–00:14:52: 15 files / 195 tests, typecheck/lint and diff review PASS. T04 baseline at 2026-09-29 00:15:48 +08:00: main=origin/main=710b87d41964bca04b8114a26931f2624305e45c, 0/0 clean. Latest T04 full harness PASS/0 at 00:18:03–00:18:23: 17 files / 216 tests, typecheck/lint and diff review PASS. Next: publish T04 checkpoint then automatically begin T05. Final M2 fresh-session review NOT RUN; M2 and every M2 task NOT ACCEPTED. Stop after T06 for a genuinely new findings-first reviewer, who reruns the harness and inspects M1 preservation without editing unless separately authorized. Browser/E2E NOT APPLICABLE: no UI. Deployment NOT RUN and not authorized. Clean-machine npm ci reproduction NOT RUN.
