# Casino Blackjack — Project State

## Current truth: M2-T02

M1 at d1d8966fe55af1bc2b9348e305135952b7723b70 is ACCEPTED by the explicit M2 batch contract. Earlier pending M1 review/acceptance statements in historical notes are superseded; no new independent review was performed here. Baseline at 2026-09-28 23:57:30 +08:00: main=origin/main, 0/0, clean. Origin is the authorized FrankieChan0312/casino-blackjack repository.

T01 checkpoint 7824e57e792db6c83ce874d8324538ae24b281a1 pushed to origin/main with fetch 0/0 and clean at 2026-09-29 00:07:52 +08:00. T02 adds shared initial deal, per-seat naturals and public projection. Full verify.ps1 PASS/0 at 00:10:55–00:11:27 +08:00: typecheck/lint and 14 files / 184 tests; source/test diff review PASS. No new dependencies. Recommended model/effort GPT-6 Astra / High; actual model NOT VERIFIED; actual reasoning/effort NOT VERIFIED.

| M2 task | Repair count | Status |
| --- | --- | --- |
| T01 | 1/10 | VERIFIED / COMMITTED / PUSHED: 7824e57; 0/0 clean |
| T02 | 0/10 | IMPLEMENTED / VERIFIED; checkpoint pending |
| T03 | 0/10 | NOT STARTED |
| T04 | 0/10 | NOT STARTED |
| T05 | 0/10 | NOT STARTED |
| T06 | 0/10 | NOT STARTED |

M1 repair ledger T01..T10: **2,1,0,0,1,0,1,0,0,1**, each /10. Historical verification/AC mapping is preserved in Git at the accepted M1 SHA and DEVELOPMENT_LOG.md; no count is reset.

M2 scope: seven seats, zero/one human, computers, sitting out, frozen participation, shared shoe/dealer, deal/turn ordering, Hit/Stand, independent outcomes, public redaction and deterministic computer total<17 HIT / >=17 STAND. No wager/credit/advanced action/UI/network/server/replay product or casino-certification claim. Player actions, computer execution and table dealer comparison are not yet implemented. Required checks for every task: full verify.ps1, diff --check, complete task diff and status; commit/push/fetch only on PASS. No known implementation blocker.

Next: publish T02 checkpoint then automatically begin T03. Final M2 fresh-session review NOT RUN; M2 and every M2 task NOT ACCEPTED. Stop after T06 for a genuinely new findings-first reviewer, who reruns the harness and inspects M1 preservation without editing unless separately authorized. Browser/E2E NOT APPLICABLE: no UI. Deployment NOT RUN and not authorized. Clean-machine npm ci reproduction NOT RUN.
