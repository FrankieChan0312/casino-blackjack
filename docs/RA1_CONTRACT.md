# RA1 — House Rules v1.2 / Re-split Aces

Owner-authorized amendment after the reviewed M9 SHA `8326f846ad753b79fd8d35f76b00f28854e2f448`. M1-M8 HUMAN ACCEPTED. M9 IMPLEMENTED / VERIFIED; genuinely fresh independent review NO FINDINGS; HUMAN ACCEPTED: NO. RA1 ACCEPTED: NO. Deployment NOT RUN. No M10.

All tasks recommend GPT Sol 6.1 / High. Actual model/effort NOT VERIFIED / NOT VERIFIED: no independent runtime/client evidence is available. Model settings are not verification evidence.

Scope: four immutable supported profiles, version-aware RSA, Classic V1.2 normal Player Mode, depth-first one-card supplements, SPLIT/STAND choice, cap/funding atomicity, Bet Behind/replay/audit/Charlie preservation, complete regression and fresh-session handoff. Non-goals: any other game rule, paytable, limits, S17/H17 change, Insurance/Even Money, cut-card changes, redesign, network multiplayer, real money, new dependencies, M10 or deployment.

| Task | Scope / acceptance | Step -> verification |
| --- | --- | --- |
| RA1-T01 | RULES R01/R10/R16/R18/R19, explicit historical profiles, new immutable V1.2 IDs, minimum authority/evidence updates | Profile contract -> typecheck, profile/historical assertions, official harness |
| RA1-T02 | Version-aware current-hand RSA, depth-first ordered leaves, one supplement, decline/forced completion, restrictions/ordinary payouts, four leaves and atomic funding | Authoritative transition -> RSA-001..021 explicit domain fixtures, complete historical harness |
| RA1-T03 | Normal Player Mode Classic V1.2, only legal Split/Stand on RSA, understandable decline, unchanged configuration/dashboard/keyboard/responsive flow | Browser wiring -> RSA-030 and Chromium RSA workflow/layout checks, M9 preservation |
| RA1-T04 | ADD/NO_ADD/fallback/new descendant windows, historical and V1.2 deterministic packages, unchanged schema/digest, audit identities | Adapters -> RSA-022..029 exact exposure/timing/digest checks |
| RA1-T05 | Full regression, current docs/inventory/mapping/lab/replay, publication receipts, fresh-session handoff | Official verify.ps1 -> diff/check/status -> normal commit/push/fetch -> main parity 0/0 and clean -> STOP |

Required final command: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1`, followed by `git diff --check`, full untracked status and complete diff from the baseline. Check every exit. Each verified checkpoint uses normal commit/push to the existing origin/main, never amend/rebase/reset/force-push. Record receipts after publication in a subsequent evidence checkpoint; the final documentation commit identifies itself through Git/final delivery to avoid self-reference.

Stop affected work on V1.1 replay incompatibility, unrelated rule change, material authority conflict, unknown overlapping changes, unavailable required validation, 10 repairs per task, stalled repair, destructive Git, secrets/paid resources/deployment or publication outside authorization. First implementation/validation does not count; later repairs require failure -> falsifiable hypothesis -> targeted fix -> rerun. Ledger persists in STATE/RA1_EVIDENCE.

## Preservation boundary

All accepted M1-M8 gameplay assertions run against current production handlers. V1.1 profile objects and default historical domain APIs retain their original shape/semantics. V1.2 adds `resplitAces: true`; `allowsResplitAces(id)` explicitly returns false for V1.1 without changing its serialized object shape. Existing CLASSIC/CHARLIE constants keep V1.1 identity. Normal Player Mode explicitly selects CLASSIC_V1_2. Replay stays replayVersion=1 because commands/configuration schema, RNG and digest remain compatible.

The old M8 source-immutability gate cannot hold for this authorized domain amendment. Replace only that gate with a three-module allowlist (profile.ts, advancedGame.ts, behindController.ts); retain byte-for-byte comparison of accepted assertions. M8 fixed inventory excludes only RA1's new registrations. M9 delivery-document/inventory checks use the reviewed Git snapshot with every original assertion retained; current RA1 inventory gets its own check. M9 runtime/browser scenarios continue against current code. These are explicit milestone-boundary adaptations, not disabled coverage.

Before any behavior change, actual V1.1 seeded Split-Ace packages/outcomes were captured from the baseline production handlers: seed 4689, Classic digest `fnv1a32-v1:9ecbae88`, Charlie5 digest `fnv1a32-v1:e22e082f`. Fixtures record their originating SHA. They include an A+A Split-Ace child that V1.1 completes.

## RSA executable ownership

RSA-001..021: `tests/ra1/domain.test.ts`; RSA-022..026: `tests/ra1/preservation.test.ts`; RSA-027..029: the same preservation suite; RSA-030: `tests/ra1/browser.test.ts`. Additional Chromium scenarios in `tests/browser/ra1.spec.ts` verify production wiring and keyboard/layout. Registration mapping/completeness and current inventory are checked independently. See RA1_EVIDENCE for actual execution; this contract does not claim PASS.
