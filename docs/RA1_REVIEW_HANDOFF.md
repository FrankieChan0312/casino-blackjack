## Current RA1 delivery

House Rules v1.2 / Re-split Aces: [contract](RA1_CONTRACT.md), [mapping](RA1_MAPPING.md), [evidence](RA1_EVIDENCE.md), [fresh-session handoff](RA1_REVIEW_HANDOFF.md). M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS at `8326f846ad753b79fd8d35f76b00f28854e2f448`; M9 ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

RA1-T01..T05 IMPLEMENTED / VERIFIED. T01..T03 COMMITTED / PUSHED; T04..T05 normal final checkpoint publication pending. Official final harness PASS/0 at 2026-10-02 00:47:18 +08:00; complete Vitest/Chromium and accepted M1-M8 preservation PASS. Same-session task diff reviewed; genuinely fresh independent review remains pending. RA1 repair ledger T01..T05 `2,0,2,1,1` (each /10); historical M8 `0,2,3,2,2,1,2,6,4` and M9 `0,2,1,1,3,0,2,1,5` unchanged. Recommended GPT Sol 6.1 / High; actual model/effort NOT VERIFIED / NOT VERIFIED. RA1 fresh independent review NOT RUN.

Current inventory: **73 Vitest files / 1020 tests**, **1 Chromium project / 58 tests**; **30 uniquely mapped RSA regressions** plus additional preservation/contract/UI checks. Inventory is not execution evidence; checked results are in RA1_EVIDENCE. Default normal Player Mode: CLASSIC_6D_S17_V1_2. Supported: CLASSIC_6D_S17_V1_1, CHARLIE5_6D_S17_V1_1 (RSA OFF), CLASSIC_6D_S17_V1_2, CHARLIE5_6D_S17_V1_2 (RSA ON). Replay schema/RNG/digest/audit versions unchanged.

Records below preserve their historical versions, inventories, review boundaries and failed attempts; earlier M9 fresh-review NOT RUN statements are superseded by the supplied NO FINDINGS review at the baseline. They do not describe RA1 behavior or accept M9/RA1.

<!-- END CURRENT RA1 -->

# RA1 fresh-session review handoff

Review checkout: final published main HEAD identified by the final delivery SHA and Git publication receipts. Baseline for the complete diff is `8326f846ad753b79fd8d35f76b00f28854e2f448`. This implementation session has not performed genuinely fresh independent review. Review status NOT RUN; RA1 ACCEPTED: NO; M9 ACCEPTED: NO; deployment NOT RUN. M1-M8 remain HUMAN ACCEPTED. M9 had genuinely fresh independent review NO FINDINGS at the baseline; RSA did not exist in that build.

Read AGENTS, SKILL, RULES, SPEC, DESIGN, PLAN, STATE, UX_UI in order, then RA1_CONTRACT, RA1_MAPPING, RA1_EVIDENCE, REPLAY and AUDIT. Review findings first; do not make changes without a separate repair authorization. The owner alone accepts milestones. Stop at this review gate; no M10/deployment.

## Verification and publication

```powershell
Get-Location
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git rev-list --left-right --count origin/main...HEAD
git status --short --untracked-files=all
git diff 8326f846ad753b79fd8d35f76b00f28854e2f448..HEAD
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
git diff --check
```

Require main=origin/main,0/0,clean including untracked. Mechanical evidence and exact checked exits/repairs are in RA1_EVIDENCE/log; final verification must precede normal commit/push. No amend/rebase/reset/force-push. The final evidence-only commit cannot embed its own hash; final delivery/Git identify it.

## Concrete review targets

- Four exact immutable IDs. V1.1 objects/default domain constants retain original shape and RSA OFF. V1.2 Classic Charlie OFF/RSA ON; Charlie5 Charlie ON/RSA ON. Normal Player Mode default is CLASSIC_6D_S17_V1_2; explicit historical sessions remain available.
- Activation checks exact A,A, current traversal, finished-leaf cap and actual controller funds. Non-Ace/blocked-Ace child forced complete after one supplement. Legal A,A has only Split/Stand; Stand retains Soft12. No forced re-split, illegal Hit/Double/Surrender or redundant Stand. Verify ordered original physical cards/descendants/stakes.
- Original and RSA A,K are ordinary21. Split-Ace restrictions survive Charlie. S17, six decks, American hole card, 3:2 original Natural, any eligible two-card Double below21/DAS, Late Surrender, R15, side paytables, Insurance/Even Money, cut policy and bankroll limits are unchanged.
- Atomic handler funds/cap/ownership validation before reserve/replacement/draw/turn. Exact funding passes, 199 units cannot fund200. Frozen state/card-source checks and rejected recorder attempts preserve later deterministic outcomes/journal, permitting only rejected audit evidence.
- Controller reserve precedes the existing fresh Split follow window; follower ADD uses attached stake, NO_ADD first child only. Insufficient ADD does not veto controller or invent refundable exposure. No new child supplement is visible until closure, including descendant windows.
- Replay stays version1. Captured baseline fixtures in tests/ra1/fixtures include real V1.1 A+A completion, full outcomes and known digests9ecbae88/e22e082f. Seed4689 V1.2 RSA has three ordinary leaves A4/A4/AK versus dealer21, gross0/0/200 and final1600; known digests5c1e4984/0f67b47b. Both profiles are independently replayed. Audit uses existing parent Split and ordered SPLIT_CHILD/settlement identities, without cards/seed/order.
- All original M1-M8 gameplay assertions and M9 flow remain executable on current handlers. Inspect only historical fixed-inventory/source-immutability adaptations, exact normalized source checks, 30 unique RSA owners and current inventory. Baseline M9-016 RNG repair retains every assertion; authorized default-profile expectation is the other intentional M9 session-test edit.
- No CSS redesign/dependency/runtime/deployment work. Native RSA explanation describes Soft12; keyboard/44px/1280/768/320 checks pass only with actual execution. m9-tools.png is regenerated current V1.2 UI; baseline image/review receipts stay in Git. Known public artifact hash is4cfecbfb580871d4533e018200817d824ebe016a198396f18594f732c5ac6a00.

## Known limits

One local human, memory-only local demo, Chromium-only browser matrix, bounded accessibility automation rather than full assistive-technology certification. Bots keep Hit<17/Stand>=17 and never choose advanced Split; controlled follower fixtures cover RSA mechanics without extending that policy. Seed/fingerprint are comparison tools, not cryptographic/fairness certification. No persistence/accounts/network multiplayer/real money/cloud/deployment. Actual model/effort NOT VERIFIED / NOT VERIFIED; recommended GPT Sol6.1/High.
