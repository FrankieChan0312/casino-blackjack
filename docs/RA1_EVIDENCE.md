# RA1 execution evidence

Baseline 2026-10-01 23:45:00 +08:00: main=HEAD=origin/main=`8326f846ad753b79fd8d35f76b00f28854e2f448`; ahead/behind 0/0; clean/full untracked empty. Read-only owner-context Git overcame sandbox ownership mismatch without Git config changes. Origin is the existing casino-blackjack GitHub repository. Recommended GPT Sol 6.1 / High; actual NOT VERIFIED / NOT VERIFIED.

Official baseline harness FAIL/1, inspected 2026-10-01 23:53:25 +08:00: 68 Vitest files, 977 PASS / 1 FAIL of 978; M9-016 failed at session.test.ts:48 (expected mode switch false, got true). All 55 Chromium PASS; typecheck/lint/domain/build and complete M1-M8 preservation PASS (M8 956 Vitest/44 Chromium).

RA1-T05 repair 1/10 hypothesis: MODE discards the seeded recorder, then the test uses uncontrolled randomness; an initial Natural legitimately reaches COMMITTED, making a mode switch legal. Fix only the test RNG to retain a known non-natural reset shoe; all assertions/product code unchanged. Targeted verification pending. This is a pre-existing baseline defect; historical M9/M8 ledgers are unchanged.

2026-10-01 23:55:26 +08:00: baseline production capture created two immutable historical packages/outcomes at seed 4689 before profile/domain changes. Digests: Classic `9ecbae88`, Charlie5 `e22e082f`, both fnv1a32-v1. Capture tool is removed; fixtures contain simulated game data only.

2026-10-02 00:00:55 +08:00: targeted profile/M9 session tests PASS/0, 2 files/20 tests, including the deterministic M9-016 repair. Typecheck FAIL/2: historical documentation read wrapper overload return inference mismatch (TS2394). RA1-T01 repair 1/10 hypothesis: implementation inferred a narrower Buffer generic than the overload; explicit string | Buffer return resolves the overload without changing runtime behavior. Reverification at 2026-10-02 00:01:49 +08:00: typecheck PASS/0; 4 affected files/27 tests PASS/0. Source preservation check follows.

RA1-T01 IMPLEMENTED; official verification pending. Repairs T01..T05: `1,0,0,0,1` (each /10). Fresh RA1 independent review NOT RUN. RA1 ACCEPTED: NO. M9 ACCEPTED: NO. Deployment NOT RUN.

RA1-T01 repair 2/10: task-diff check found three modified Markdown hard-break lines with trailing whitespace in RULES/SPEC. Hypothesis: retaining the old two-space hard-break style violates git diff --check on changed lines. Removed only those three trailing spaces; recheck required. No executable change.

2026-10-02 00:06:47 +08:00 — RA1-T01 official verify.ps1 PASS/0: 69 Vitest files/979 tests; 55 Chromium; typecheck/lint/domain/build/fixture exclusion and all independent M1-M8 preservation PASS. Same-session task diff reviewed; no unrelated changes. Historical test assertions retained. Final whitespace recheck follows; no executable changes after harness. Normal publication authorized to origin/main.

2026-10-02 00:11:24 +08:00 — T01 publication PASS/0: 68172e89db45fcdb61d04e977267cae22518a372 on main, normal push/fetch, HEAD=origin/main,0/0,clean/full untracked empty. T02 begins from this verified checkpoint; shared pure Ace eligibility and authoritative Hit/Stand/Split validation are the only domain changes. Explicit RSA-001..021 plus funding/turn examples added.

2026-10-02 00:17:46 +08:00 — T02 official verify.ps1 PASS/0: 70 files/1002 Vitest tests, 55 Chromium, all typecheck/lint/domain/build and independent M1-M8 preservation PASS. 23 domain RSA tests PASS on first validation (T02 0/10). Task diff and whitespace PASS. Only advancedGame.ts behavior changed; normal publication follows.
