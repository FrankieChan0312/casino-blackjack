# Casino Blackjack — Project State

Document date: 2026-09-28
Repository: `C:\Users\user\Documents\GitHub\casino-blackjack`
Milestone: M1 — Headless Blackjack Core
Current task: M1-T08 — Dealer S17 and Outcome Resolution

## Current truth

M1-T08 is IMPLEMENTED / VERIFIED; full harness and complete task review PASS. M1-T09/T10 are NOT STARTED. M1 is not ACCEPTED and fresh-session review is NOT YET COMPLETED. Actual model: NOT VERIFIED. Actual reasoning/effort: NOT VERIFIED; recommended GPT-6 Astra / High.

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
| M1-T08 | 0/10 | IMPLEMENTED / VERIFIED; not ACCEPTED |
| M1-T09 | 0/10 | NOT STARTED |
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
| T09 full AC/regression mapping and harness failure test | NOT RUN | Next task |
| Fresh-session milestone review | NOT RUN | NOT YET COMPLETED; mandatory after T10 push |
| Browser/E2E | NOT APPLICABLE | M1 has no browser UI |

T08 tests cover hard/soft 16 and 17, repeated dealer draws, bust, explicit higher/lower/equal outcomes, ordinary 21, no unnecessary draws after terminal outcomes, all-command terminal rejection, partial dealer exhaustion, accounting, public reveal and input purity. No requirement or assertion was weakened.

## Git / next action

T08 base commit: `1f1e8fabd0d978e1b8b706e9009e4ceaa501eed5`. T08 changes are not yet committed/pushed. Complete final verification/diff review, commit `feat: add dealer resolution and outcomes`, push origin/main, fetch and verify parity/clean tree, then begin T09. Record that publication in the T09 baseline rather than a metadata-only commit.

## Limitations / blockers

No implementation blocker is known. M1 acceptance and fresh review remain outstanding. Public projection is a local correctness boundary, not server security. Production randomness adapts Math.random and makes no cryptographic/casino-certification claim. Browser/E2E, deployment and financial settlement do not apply to M1. Separate clean-machine npm ci reproduction has not run.
