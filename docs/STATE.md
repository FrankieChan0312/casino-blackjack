# Casino Blackjack — Project State

Document date: 2026-09-28
Repository: `C:\Users\user\Documents\GitHub\casino-blackjack`
Milestone: M1 — Headless Blackjack Core
Current task: M1-T09 — Full M1 Regression and Harness Completion

## Current truth

M1-T08 is VERIFIED / COMMITTED / PUSHED. M1-T09 is IMPLEMENTED / VERIFIED; full regression and task review PASS. M1-T10 is NOT STARTED. M1 is not ACCEPTED and fresh-session review is NOT YET COMPLETED. Actual model: NOT VERIFIED. Actual reasoning/effort: NOT VERIFIED; recommended GPT-6 Astra / High.

Batch entry baseline at 2026-09-28 22:53:54 +08:00: main, HEAD and origin/main both `1f1e8fabd0d978e1b8b706e9009e4ceaa501eed5`, ahead/behind 0/0, working tree clean. Public `git ls-remote origin refs/heads/main` independently confirmed that same SHA before implementation. Origin: `https://github.com/FrankieChan0312/casino-blackjack.git`.

M1-T07 was explicitly ACCEPTED, committed at 2026-09-28 22:47:17 +08:00 as `feat: add blackjack player actions`, and published as verified by this entry baseline. Its committed documents describe the earlier pre-acceptance snapshot; this entry supersedes that stale status without a separate metadata commit.

The user authorizes separate verified T08, T09 and T10 commits and pushes to origin/main, with parity and clean-tree checks between tasks. No task becomes ACCEPTED from a push. Stop after T10 for a genuinely new-session review. No M2+, history rewrite, deployment, visibility change, paid resource or credential handling is authorized.

## Implemented scope

- Physical cards, six-deck inventory, injected shuffle/cut selection and persistent shoe accounting.
- Pure Ace-aware hand evaluation and explicit original-hand natural eligibility.
- Initial deal/peek/naturals, public redaction, Hit/Stand and terminal protection.
- T08: pure S17 policy, ordinary outcome helper and resolveDealer command. Dealer draws below 17, stands on soft/hard 17+, completes discard exactly once, and preserves partial dealer cards on integrity failure.
- Public reveal remains authorized at DEALER_TURN and ROUND_COMPLETE per DESIGN section 12; errors do not expose additional secret data.
- No wagers, seats/bots, advanced actions, UI, transport, persistence, replay product or deployment.

## Task ledger

| Task | Repairs used / limit | Delivery state |
| --- | --- | --- |
| M1-T01 | 2/10 | VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T02 | 1/10 | VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T03 | 0/10 | VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T04 | 0/10 | VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T05 | 1/10 | VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T06 | 0/10 | VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T07 | 1/10 | IMPLEMENTED / VERIFIED / ACCEPTED / COMMITTED / PUSHED |
| M1-T08 | 0/10 | IMPLEMENTED / VERIFIED / COMMITTED / PUSHED; not ACCEPTED |
| M1-T09 | 0/10 | IMPLEMENTED / VERIFIED; not ACCEPTED |
| M1-T10 | 0/10 | NOT STARTED |

No repair count is reset or transferred. Full historical timestamps, checkpoints, failures and repair hypotheses remain in DEVELOPMENT_LOG.md and Git history; this current-state summary replaces obsolete bootstrap/pending-action prose.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| T08 first full harness | PASS | 2026-09-28 22:57:33–22:57:40 +08:00; exit 0 |
| Typecheck / lint | PASS | npm run typecheck; npm run lint |
| Unit / integration tests | PASS | npm run test; 10 files / 139 tests, including all 119 earlier tests |
| T08 new cases | PASS | 7 pure policy/comparison cases; 13 dealer-resolution integration cases |
| Complete task diff / whitespace | PASS | Reviewed 2026-09-28 23:00:12 +08:00; nine intended paths only |
| T09 first full harness / AC mapping | PASS | 2026-09-28 23:04:17–23:04:32 +08:00; typecheck/lint, 12 files / 155 tests |
| T09 failure propagation | PASS | 23:04:56–23:05:07 +08:00 real type error returned exit 2; temporary probe removed; five wrapper fault tests also PASS |
| T09 complete diff / whitespace | PASS | 2026-09-28 23:07:06 +08:00; six intended paths, no production change |
| Fresh-session milestone review | NOT RUN | NOT YET COMPLETED; mandatory after T10 push |
| Browser/E2E | NOT APPLICABLE | M1 has no browser UI |

T08 tests cover hard/soft 16 and 17, repeated dealer draws, bust, explicit higher/lower/equal outcomes, ordinary 21, no unnecessary draws after terminal outcomes, all-command terminal rejection, partial dealer exhaustion, accounting, public reveal and input purity. No requirement or assertion was weakened.

## Git / next action

T09 baseline at 2026-09-28 23:01:45 +08:00: T08 commit `a02e0135098f7f398f0bcac607e6eb4dd0e73334` pushed to origin/main; fetch succeeded, main=origin/main, ahead/behind 0/0, clean. T08 final harness at 23:00:40–23:00:46 passed 139 tests. Complete T09 final verification/review, commit `test: complete M1 blackjack regression coverage`, push/fetch and verify clean parity before T10. No gameplay source change was needed in T09.

## Limitations / blockers

No implementation blocker is known. M1 acceptance and fresh review remain outstanding. Public projection is a local correctness boundary, not server security. Production randomness adapts Math.random and makes no cryptographic/casino-certification claim. Browser/E2E, deployment and financial settlement do not apply to M1. Separate clean-machine npm ci reproduction has not run.

## M1 acceptance and regression evidence (T09)

All rows below are executed local checks, not model confidence. Paths are relative to tests/. AC-M1-020 local documentation/evidence review is PASS; the separate mandatory fresh-session gate remains NOT YET COMPLETED. M1 is not represented as fully reviewed or ACCEPTED. SPEC requirements are unchanged.

| AC-M1 | Local result | Executed evidence / independently asserted facts | REG-M1 |
| --- | --- | --- | --- |
| 001 | PASS | unit/card.test.ts: exact 312 IDs, explicit rank/suit sets and six copies | 001 |
| 002 | PASS | unit/shoe.test.ts, helpers/shoeFixture.ts independent IDs; integration roundLifecycle and dealerResolution check every transition/discard | 005, 006 |
| 003 | PASS | unit/random.test.ts scripted exact permutation; roundLifecycle repeated creation/deal asserts explicit IDs and cut 249 | 024 |
| 004 | PASS | random.test.ts both endpoints/all 31 outputs/invalid offsets; roundLifecycle both endpoint lifetimes | 002, 003, 004 |
| 005 | PASS | roundLifecycle: Hit reaches 219/249, dealer completes with same shoe/cut, next start replaces | 005 |
| 006 | PASS | roundLifecycle parameterized 0/1/2/3 replace before dealing; 4 starts using same shoe | 007 |
| 007 | PASS | game.test.ts failure after 0..3 initial draws; playerActions empty Hit; dealerResolution failure after 0/1 dealer draws and roundLifecycle recovery | 008 |
| 008 | PASS | unit/hand.test.ts explicit totals/soft/bust/21, all ranks and multiple Aces | 009, 010, 011 |
| 009 | PASS | hand.test.ts A+10/J/Q/K original eligibility, three-card ordinary 21 and false eligibility | 012, 013 |
| 010 | PASS | game.test.ts explicit P/up/P/hole IDs; publicView.test.ts serialization, substituted hidden cards, no IDs/shoe/hidden totals | 023 |
| 011 | PASS | game.test.ts natural matrix and all peek/no-peek upcards; terminal actions rejected | 016 |
| 012 | PASS | playerActions.test.ts 15+3=18, repeated Hit, 15+6=21, 18+7 bust with no dealer draw | 021 |
| 013 | PASS | playerActions Stand only phase changes; wrong-phase actions reject unchanged | 022 |
| 014 | PASS | unit/dealer.test.ts explicit threshold facts; dealerResolution hard/soft 16 Hit, hard/soft 17 Stand | 014, 015 |
| 015 | PASS | dealer.test.ts and dealerResolution: 20/19, 19/20, 20/20 and dealer bust | 018, 019, 020 |
| 016 | PASS | roundLifecycle natural result retained when next dealer card would make 7+7+7=21; no unnecessary draw | 017 |
| 017 | PASS | playerActions and dealerResolution reject Hit/Stand/resolveDealer with original reference and unchanged complete snapshots | 022 |
| 018 | PASS | roundLifecycle two complete ordinary rounds reuse shoe/cut and consume later cards; previous terminal snapshot intact | 006 |
| 019 | PASS | scripts/verify.ps1 full runs; verifyHarness.test.ts isolated actual wrapper with all success, each required failure and unavailable npm; real type-error probe exit 2 | harness |
| 020 | PASS (local review) | Authority/source/test/doc diff review and timestamped log; fresh-session portion deliberately deferred to mandatory post-T10 gate | documentation |

REG-M1-017 is checked as precedence without creating an illegal engine flow: initial player natural ends the round before a third dealer card. The fixture independently proves that the next card would form ordinary 21 and verifies that resolution cannot consume it or overwrite PLAYER_BLACKJACK. Ordinary 21 versus ordinary 21 is separately tested as PUSH. No product replay or impossible extra natural-dealer draw is implemented.
