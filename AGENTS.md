# AGENTS.md

Repository: `C:\Users\user\Documents\GitHub\casino-blackjack`  
Project: Casino Blackjack portfolio project  
User discussion language: Traditional Chinese  
Repository-facing text: English

## 1. Mission

Build an understandable, verifiable, reproducible Blackjack portfolio project.

Use this bounded engineering loop:

1. clarify intent and assumptions;
2. confirm scope and acceptance criteria;
3. make the smallest complete change;
4. run mechanical verification;
5. repair from evidence when necessary;
6. review;
7. wait for explicit human acceptance.

Generated code, model confidence, or the existence of tests is never proof of completion.

## 2. Repository boundary

These instructions apply only to:

`C:\Users\user\Documents\GitHub\casino-blackjack`

Do not mix paths, files, branches, credentials, data, deployment settings, or state from another repository.

Repository files, Git state, and executed evidence are authoritative. Chat memory is not.

## 3. Required reading and authority

Before implementation, read the relevant files in this order:

1. `AGENTS.md`
2. `SKILL.md`
3. `docs/RULES.md`
4. `docs/SPEC.md`
5. `docs/DESIGN.md`
6. `docs/PLAN.md`
7. `docs/STATE.md`
8. `docs/UX_UI.md` when the task affects player interaction or presentation

Supporting records:

- `docs/DEVELOPMENT_LOG.md` — timestamped execution evidence
- `docs/LAB_MANUAL.md` — learning and interview notes

Authority by subject:

- `RULES.md` — Blackjack and wagering rules
- `SPEC.md` — scope, non-goals, acceptance criteria, milestone boundaries
- `DESIGN.md` — approved implementation approach
- `UX_UI.md` — player-facing behaviour and presentation
- `PLAN.md` — task IDs, dependencies, milestone order
- `STATE.md` — current truth, blockers, repair counts, latest verification

If authoritative files conflict, stop the affected implementation and report the conflict. Do not silently choose an interpretation.

## 4. Coding behaviour

Follow `SKILL.md`.

In particular:

- surface assumptions and ambiguity;
- prefer the simplest solution that satisfies the task;
- do not build speculative future flexibility;
- make surgical changes only;
- do not refactor unrelated code;
- every changed line must trace to the task;
- define verifiable success criteria;
- use `step -> verification` planning for multi-step work.

Model strength or reasoning effort never substitutes for evidence.

## 5. Baseline before implementation

Before modifying files, capture the real baseline:

```powershell
Get-Location
git branch --show-current
git rev-parse HEAD
git status --short
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
```

Also confirm:

- current task ID and milestone;
- relevant rules/spec/design;
- existing user changes;
- known failures/blockers;
- required validation commands and tools.

For a new repository or repository without a commit, record the actual condition. Do not invent a baseline.

Do not overwrite, discard, stash, clean, reformat, or reorganize unknown user changes.

If unknown changes overlap the task, stop the affected edit and report them.

## 6. Task contract

Every implementation task must state:

- task ID;
- scope;
- non-goals;
- acceptance criteria;
- required verification;
- stop conditions.

Keep tasks small, complete, testable, and reviewable.

Do not implement future milestones merely because they are described in `RULES.md` or `SPEC.md`.

For M1, the scope and non-goals in `docs/SPEC.md` are binding.

## 7. Implementation rules

Prefer minimum working code over speculative abstractions.

For M1:

- keep the engine headless;
- keep domain logic independent of React, DOM, database, network, and cloud;
- preserve deterministic test seams for randomness;
- keep dealer hole-card internal state separate from public state;
- treat integrity failures separately from normal gameplay outcomes;
- do not add generic casino frameworks or future-rule engines.

Create or update tests when required by the task.

Core expected results must not be derived only by calling the same production logic under test. Use explicit examples, invariants, independent counts, or deterministic fixtures.

## 8. Verification

`scripts/verify.ps1` is the unified local verification entry point once it exists.

Every required command must actually run and its exit code must be checked.

Use these statuses exactly:

- `PASS` — executed and passed
- `FAIL` — executed and failed
- `NOT RUN` — not executed
- `BLOCKED` — could not execute
- `NOT APPLICABLE` — genuinely not applicable, with a reason

Never convert `NOT RUN` or `BLOCKED` into `NOT APPLICABLE`.

Never pass validation by disabling regression tests, weakening assertions, swallowing errors, fabricating output, or rerunning unstable tests until they happen to pass.

If a test or specification appears wrong, record the evidence and impact before changing it.

## 9. Repair cycles

Each task has at most **10 repair cycles**.

The first implementation and first validation do not count.

One repair cycle is:

1. inspect failure evidence;
2. state a falsifiable cause hypothesis;
3. make a targeted fix;
4. rerun the affected verification.

Persist the cumulative count and evidence in `docs/STATE.md` or a linked record.

Changing session, model, agent, branch, or task label does not reset the count for the same substantive failure.

Stop early when repeated attempts produce no new evidence or progress.

At 10 failed cycles, stop and report the blocker. Additional cycles require explicit user authorization.

## 10. Timestamped evidence

Use timestamps from the execution environment:

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
```

Record meaningful events in `docs/DEVELOPMENT_LOG.md`, including:

- task start and baseline;
- design decisions or assumptions;
- files changed;
- validation commands/results;
- repair cycles;
- review result;
- commit hash;
- push result.

Do not invent timestamps.

Before publishing raw AI/session records, inspect them for secrets, credentials, personal data, and other sensitive material. Preserve failed attempts rather than rewriting history to look cleaner.

## 11. Documentation

Keep documentation aligned with actual behaviour.

Normally update:

- `STATE.md` when implementation/verification/blocker/repair state changes;
- `DEVELOPMENT_LOG.md` for timestamped evidence;
- `PLAN.md` when task status or milestone sequencing changes;
- `LAB_MANUAL.md` at meaningful learning or milestone checkpoints;
- `README.md` when externally visible project truth changes.

Change `RULES.md`, `SPEC.md`, `DESIGN.md`, or `UX_UI.md` only for an authorized requirement/design change.

Do not change a specification merely to match an accidental implementation.

## 12. Git and GitHub

Implementation, verification, commit, push, review, acceptance, and deployment are separate events.

Before commit:

- inspect the task diff;
- confirm no unrelated files changed;
- run required verification for the exact version;
- update persistent state/evidence.

Use clear English commit messages.

The intended workflow is one coherent commit and GitHub push per verified task/checkpoint.

Push only when authorization for the target repository, remote, branch, and operation is valid. Do not create a public repository, change visibility, force-push, rewrite history, merge, release, or deploy without the required authorization.

After push, record branch and commit hash in `STATE.md` and `DEVELOPMENT_LOG.md`.

If code/tests/dependencies/runtime settings change after verification, rerun affected checks and required final verification.

## 13. Review and delivery states

Important milestones require fresh-session review of the specification, design, diff, tests, and real evidence.

If a genuinely fresh session is unavailable, record the review as not completed.

Use delivery states precisely:

- `IMPLEMENTED` — code changed
- `VERIFIED` — exact version passed all required checks
- `ACCEPTED` — user explicitly accepted it
- `DEPLOYED` — specified version was actually deployed and post-deployment checks passed

Never treat one state as proof of another.

## 14. Stop conditions and safety

Stop affected work and report when there is:

- a rules/spec/design conflict;
- an unknown overlapping user change;
- an unavailable required validation tool;
- the repair-cycle limit;
- destructive Git/data work;
- credential or sensitive-data handling;
- paid cloud-resource changes;
- real-money transactions;
- push/merge/release/deployment outside authorized scope.

Never commit API keys, tokens, passwords, private keys, customer data, or former-employer confidential information.

This portfolio uses simulated credits only.

## 15. Codex task settings

Every Codex implementation task must state:

- recommended model;
- recommended reasoning/effort;
- scope;
- acceptance criteria;
- verification;
- stop conditions.

Current user preference:

- Recommended model: `GPT Sol 6.1`
- Recommended reasoning/effort: `High`

Confirm actual client availability at execution time. Distinguish recommended settings from confirmed runtime settings and never claim a model/effort was used without evidence.

Model choice is not validation evidence.
