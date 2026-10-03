# M10 planning contract and evidence

Task ID: M10-PLANNING. Milestone: M10 — Casino Table Experience. Scope: formal presentation design/specification/task plan only. M10-T01 is a later implementation checkpoint and is **NOT STARTED**. Recommended model GPT Sol 6.1, effort High; available client tool metadata includes gpt-6.1-sol/High. Actual execution model/effort NOT VERIFIED / NOT VERIFIED. Model availability is not validation evidence.

## Baseline and authority

Execution timestamp 2026-10-03 12:17:20 +08:00: repository location confirmed by Get-Location; branch main; HEAD/main/origin/main `4e6cd7efdca91651633931edcd9445a401886bce`; ahead/behind 0/0; `git status --short --untracked-files=all` empty. Normal `git fetch origin main` PASS/0 reconfirmed live parity before writes. Remote is the existing `https://github.com/FrankieChan0312/casino-blackjack.git`; normal main push is explicitly authorized by the owner for this documentation task. No force push, deploy or implementation authorization.

Read AGENTS.md and repository SKILL.md, RULES/SPEC/DESIGN/PLAN/STATE/UX_UI, README, relevant M9 contract/evidence/review handoff and PA1 contract/independent review/preservation, replay documentation and official verification script. New M10 requirements are owner-authorized amendments; explicit SPEC/UX supersession avoids silently conflicting with the M9 fixed four-seat/immediate-table baseline. PA1_INDEPENDENT_REVIEW_ACCEPTED and PA1 ACCEPTED; M9 technical preservation review PASS and owner experience evaluation outstanding. M9 HUMAN ACCEPTED: NO. Prior accepted milestone and repair records remain historical, unchanged.

## Planning contract

Acceptance: baseline/live parity/clean tree confirmed; real player/count/deal/dealer/controller/replay architecture inspected; DESIGN covers all 20 requested subjects; SPEC defines P0/P1 and preservation AC; PLAN defines sequential T01..T11 contracts; STATE says PLANNED / NOT STARTED; Motion recommendation justified without install; required checks/diff/commit/push/parity recorded. No product code/tests/dependencies/assets/runtime settings may change.

Non-goals: M10 implementation (including T01), rule/domain changes, dependency install, asset generation, unrelated cleanup, acceptance of M9/M10, deployment. Stop conditions: authority conflict, unknown overlapping change, missing required validation tool, protected non-doc change, unsafe credentials/Git operation, unauthorized target publication, repeated no-progress repair or 10 cumulative failed repairs. Repairs initially 0/10; preserve prior task counters.

Step -> verification:

1. Read real authority/source and remote baseline -> checked Git exits, explicit architecture findings below.
2. Write scoped design/spec/UX/plan/current state -> P0-to-AC/task consistency, relative links, no protected file changes.
3. Review complete docs diff -> existing relevant documentation/portfolio tests, `git diff --check`, official `scripts/verify.ps1` with checked exit.
4. Record verification/review -> stage only intended docs, inspect staged diff/whitespace -> coherent docs commit and normal push/fetch -> exact parity/clean/untracked receipt.
5. Record actual publication hash in STATE/DEVELOPMENT_LOG -> factual receipt commit/push, final 0/0/clean -> stop for explicit human acceptance; never start T01.

## Inspected architecture and consequences

| Existing source | Observed fact | M10 consequence |
| --- | --- | --- |
| `src/domain/table.ts` | Exactly 7 seats, stable 1..7, at most 1 HUMAN, frozen activeSeats | Total range 1–7 includes local human; no second human/network feature |
| `src/domain/behindGame.ts` / `bettingGame.ts` | Participant-owned balances; configure only CONFIGURING; OPEN locks configuration; NEXT returns CONFIGURING after finalization | Choose count before Start; persistent session count; no fake occupancy or reopen/fund reset |
| `src/browser/controller.ts` | Constructor prepares HUMAN4/COMPUTER1,3,6; guest MAIN25 or smaller, sit out below 10; composite capacities assume 3 guests; invoke before publish | T02 moves preparation behind Start and calculates real capacity before mutation; default 4 command semantics preserved |
| `src/domain/optionalGame.ts` closeOptionalBetting | Actual production path freezes funded ascending seats and deals two passes, each players then dealer; originalCards retained; Ace human decisions before peek | Initial events use actual funded seat set and original two cards, not final ADVANCE state; insurance/secrecy preserved |
| `src/domain/advancedGame.ts` / `sessionCommand.ts` | ADVANCE resolves several HIT/STAND actions plus dealer atomically; ordered computerActions provided, dealer cards append; split activation may draw sibling supplements inside one action | Observe EACH result synchronously before coalesced React renders; use ordered actual observations/lineage, never timed ADVANCE |
| `src/domain/behindPublicView.ts` / controller project | Explicit safe snapshots; hole redacted before reveal, visible totals only; raw state stays private | Public allowlisted animation payloads, generic hidden slot; no raw snapshot/physical card IDs |
| `src/ui/App.tsx` / `Table.tsx` / styles.css | useSyncExternalStore; fixed lineup 1,3,6; occupied panels/cards instantly rendered; public card CSS/semantic labels; responsive guest details | Dynamic actual lineup/arc and staged public cursor; keep current legal controls/funds separate |
| `src/ui/CasinoPerson.tsx` / `src/presentation/characters.ts` | Independent dealer SVG,12 immutable 240x320 portraits, isolated chooser accepts up to 6 guests, stable collision exchange | Reuse assets, restrained 2D transforms; count expansion fits PA1 roster without new art/game RNG |
| `src/domain/replay.ts` / controller replayCompleted | Strict seeded command reconstruction, bounded journal, terminal result/export/digest; no animation timeline | Preserve terminal replay; optional isolated reconstruction observation produces presentation-only timeline, no schema change |
| `src/domain/audit.ts` / DESIGN | Outcome audit is timestamped/ordered and deliberately contains no card data | Separate transient public presentation feed; preserve existing audit fields/ordering |

For identical command/configuration fixtures, animation speed/preferences/skip/cancel must leave all authoritative results identical. Different player counts legitimately change draws/turns/results because actual participation changed; do not claim identical digest across different configurations.

## Motion investigation

At 2026-10-03 12:19:53 +08:00, read-only `npm.cmd view motion version peerDependencies engines license --json` PASS/0: motion 14.0.0, peers React/React DOM `^18.0.0 || ^19.0.0`, MIT; no engines field returned. Existing Node 24.19.0/npm 11.17.0 and React/React DOM19.3.0/Vite 8.3.1 confirmed. `npm.cmd view motion@14.0.0 dist.integrity repository.url --json` PASS/0, upstream motiondivision/motion. No package install/manifest or lockfile modification.

Official [installation](https://motion.dev/docs/react-installation), [bundle features](https://motion.dev/docs/react-reduce-bundle-size), and [reduced-motion hook](https://motion.dev/docs/react-use-reduced-motion) read on 2026-10-03. Supported React range/Vite integration justify a conditional Motion recommendation, not a proven integration. T05 must recheck/pin the then-selected version, build/typecheck/test it, measure actual gzip increase and correctly choose layout-capable features. No third-party game engine recommendation.

## Future verification strategy

Every executable task runs unified checked-exit verification. Preserve accepted M1–M8 assertions and current M9/RA1/PA1 suite. Explicit scripted cards/destinations/stakes/digests are independent expected fixtures. Test every count, noncontiguous seats and funded subsets; default 4 retains command behavior except explicitly authorized entry/layout/motion. For a fixed configuration compare motion-on/off/skip/toggle/resize/unmount/hidden-tab against immediate authority: RNG calls/bounds, shoe inventory/order, funds/results, journal JSON, digest and audit all equal. Exercise journal boundary with up to 6 guests, including rejection before mutation. Require domain-tree diff EMPTY; a necessary domain seam is a stop/separate-authorization event.

Use deterministic presentation scheduler and ordered completion checkpoints rather than sleep-based browser tests. Test coalesced publications, StrictMode duplicate prevention, old-session cancellation, card secrecy in queued payloads and DOM/ARIA, human decision pause, natural/Charlie/RSA/split/follower/dealer draw/VOID paths.21 count/viewports combinations,44px/focus/keyboard, enlarged text/fallback images/reduced mode, exact screenshots and moving sequence inspection accompany performance traces. Final M10-T11 requires a genuinely fresh independent review plus explicit owner visual acceptance; neither is simulated by this planning session.

## Executed planning checks

Baseline/source/library inspection PASS as recorded above. Documentation/link/P0 mapping/diff checks and full official verification NOT RUN at initial write; actual results will be appended with environment timestamps. Future M10 visual/performance/animation checks NOT RUN because implementation has not started. Motion integration NOT RUN. M10 independent review NOT RUN; human plan acceptance NOT RUN; deployment NOT RUN. These are not NOT APPLICABLE.

Final affected/evidence checks2026-10-03 12:35:53 +08:00 PASS/0:5 files/13 existing assertions; original historical documents retained, all links,20 subjects/4 P0/12 AC/11 NOT STARTED tasks, command literal, gzip hash/decode and restored baseline screenshot hash. Final diff/whitespace and exact baseline protected executable/test/tool/asset/dependency/runtime comparison PASS/0. Documentation VERIFIED; milestone remains PLANNED / NOT STARTED. Normal publication follows; no M10-T01 implementation.

### Executed results, 2026-10-03 (+08:00)

| Check | Execution evidence | Status |
| --- | --- | --- |
| Existing relevant documentation/portfolio assertions | Vitest start12:27:41,5 files/13 tests | PASS / 0 |
| Relative links/design topics/AC/task sequence/scoped paths |12:28:53,20 topics/12 AC/11 tasks | PASS / 0 |
| Unified `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1` |12:27:53..12:31:25,76 files/1031 Vitest,63 Chromium, all engineering gates | PASS / 0 |
| Independent preservation | M1 12/155,M2 6/78,M3 5/72,M4 7/171,M5 8/168,M6 9/181,M7 56/870+24 Chromium,M8 66/956+44 Chromium, same official run | PASS / 0 |
| New documentation literal scan |12:31:42,verify.ps1 path/remote name split by prose formatting | FAIL / 1 |
| Repair1 exact literal recheck |12:32:01,correct documented tool path and existing remote restored | PASS / 0 |
| Generated screenshot/baseline comparison and restoration |12:32:46,two wager-border pixels; restored only run-generated file; all baseline docs/images diff empty | PASS / 0 |

Repair1/10 CLOSED: prose-only spacing edit accidentally split technical literals; targeted restoration plus exact string checks fix the falsifiable cause. Failed scan messages were `documentation literals altered by numeric-spacing edit` with `verify.ps 1` (PLAN and planning contract) and `FrankieChan 0312` (remote receipt). No tests or executable changed. Prior failed-source-read and patch context mismatch caused no edits; neither is hidden or counted as a product repair. Historical ledgers unchanged.

Same-session review checked scope, all P0 mappings, actual7-seat/one-human range, command/event separation, journal-capacity boundary, hidden-card safety, atomic ADVANCE/split observations, Motion conditions and replay/reduced-motion/performance/visual gates. Fresh independent M10 review remains NOT RUN; owner acceptance remains NOT RUN.

[Lossless official output](M10_PLANNING_VERIFY.log.gz):37043 uncompressed bytes, raw SHA256 `850071f81afa824b3e6860cbed4fa0c1b9813e15d51cc8b371734affd52c0fd2`; gzip6274 bytes, SHA256 `4d8dd854f1b296b252214f1a1235784ad8acbac6060f4e5de31e9dd40e1fdbff`; gzip roundtrip equals original. Inspect raw public test/fixture/build/geometry output for sensitive data before publication: no credentials/secrets identified. [Screenshot comparison receipt](M10_PLANNING_SCREENSHOT_DIFF.json) records exact known two-pixel variation outside the portrait; generated PNG retained locally in TEMP, not included as a changed historical artifact. Final protected source/test/tool/asset/dependency/runtime comparison and affected-document check are required before commit. Final publication receipt is recorded in STATE/DEVELOPMENT_LOG and Git/final delivery, without attempting to embed a commit's own SHA in itself.
