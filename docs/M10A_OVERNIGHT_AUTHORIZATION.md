# Casino Blackjack — M10A Overnight Batch
# T07 → T08 → T09
# Owner-Authorized Conditional Progression

Repository:

C:\Users\user\Documents\GitHub\casino-blackjack

Branch:

main

Expected starting HEAD:

adf52caf4329060c14a2117147f7e38a6408338e

---

# 0. OWNER OVERNIGHT AUTHORIZATION

The owner will be unavailable and explicitly authorizes continuous unattended execution of:

M10A-T07
→ M10A-T08
→ M10A-T09

under the constraints below.

This authorization covers ordinary non-destructive repository-local actions required to:

- inspect files/history
- modify in-scope product/test/documentation files
- run tests
- run Playwright/Chromium
- capture screenshots/evidence
- perform bounded diagnosis
- perform ordinary repair cycles within each task's normal 10/10 limit
- update documentation
- commit each successful task
- push normally
- continue automatically to the next authorized task

Do NOT stop merely to ask for routine approval.

However, this authorization does NOT allow:

- repair 11/10 or any exceptional repair beyond normal limit
- force push
- history rewrite
- deployment
- paid/cloud resource creation
- secret/credential changes
- destructive deletion of unknown user work
- domain/gameplay semantic changes
- starting M10A-T10
- starting M10-T02
- starting M10-T04 Dealer artwork implementation
- installing/implementing Motion or gameplay animation

If any prohibited or genuinely scope-expanding action becomes necessary:

STOP the entire overnight batch.

---

# 1. HUMAN ACCEPTANCE GOVERNANCE

M10A-T06 has now been reviewed by the owner.

Record:

M10A-T06 HUMAN VISUAL ACCEPTANCE: ACCEPTED

Rationale:

The normal player action dock remains accepted.
Insurance / Even Money and Round Complete now read as compact casino-game
decision/control surfaces integrated with the Local Player HUD and table scene rather
than detached web-style panels. Behaviour and accessibility remain preserved.

For T07, T08 and T09:

DO NOT self-declare human visual acceptance.

The owner explicitly authorizes overnight progression WITHOUT intermediate human review.

Therefore, after a technically successful task, record:

HUMAN VISUAL ACCEPTANCE:
PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION

This status does NOT mean rejected.

It means technical progression to the next overnight-authorized task is permitted while
final visual approval is deferred until the owner returns.

---

# 2. BATCH STOP POLICY

Proceed:

T07 → T08 → T09

ONLY while every completed task satisfies its full technical gate.

Immediately STOP the entire batch if:

- task becomes BLOCKED
- src/domain change appears necessary
- protected gameplay semantics would change
- unexpected user work is found
- a task reaches repair 10/10 and still fails
- full verification fails without a safe in-scope repair
- visual self-review identifies a BLOCKER/HIGH regression
- existing accepted T01–T06 work materially regresses
- any destructive/external/production action becomes necessary

Do not skip a failed task and continue to the next one.

---

# 3. GENERAL PRESERVATION CONTRACT

Throughout T07–T09 preserve:

- src/domain/**
- Blackjack rules
- RNG
- shoe/cards
- turn semantics
- Dealer strategy
- computer strategy
- accounting semantics
- bankroll calculations
- replay
- digest
- journal
- settlement behaviour
- PA1 assets/provenance
- canonical historical evidence
- M10-T01 geometry
- human-accepted M10A-T01 through T06 presentation

Expected:

src/domain diff = EMPTY

Do not weaken tests to obtain PASS.

---

# 4. STARTING PREFLIGHT

Before T07:

Confirm:

- repo path
- branch = main
- HEAD = adf52caf4329060c14a2117147f7e38a6408338e
- origin/main
- ahead/behind = 0/0
- clean working tree
- untracked = 0

Read at minimum:

- AGENTS.md
- README.md
- docs/DESIGN.md
- docs/UX_UI.md
- docs/SPEC.md
- docs/PLAN.md
- docs/STATE.md
- docs/RULES.md
- docs/M10A_PLANNING.md
- docs/M10A_T01.md through docs/M10A_T06.md
- docs/DEVELOPMENT_LOG.md
- docs/LAB_MANUAL.md
- scripts/verify.ps1

If preflight differs unexpectedly:

STOP batch.

---

############################################################
# M10A-T07 — CREDITS / ACCOUNTING HUD
############################################################

# 5. T07 objective

Implement:

M10A-T07 — Credits / Accounting HUD

Current authoritative financial information includes concepts such as:

- Available
- Reserved / current exposure
- Pending return
- local credits / bankroll information already safely exposed
- current wager
- round net result where already authoritative

Transform these from a spreadsheet/dashboard-like footer into a compact,
secondary casino-game HUD.

The accounting information must remain:

- exact
- readable
- discoverable
- accessible

but must NOT visually dominate:

- cards
- Dealer
- LocalPlayerHud
- action controls

---

# 6. T07 design target

Prefer a compact secondary HUD conceptually like:

CREDITS
Available 975
Reserved 25
Pending 0

rather than a wide dashboard row with multiple independent columns.

Possible placement:

- compact lower status strip
- local-player-adjacent secondary HUD
- compact table-edge readout

Choose based on existing DESIGN/UX_UI.

Do not create another large panel.

---

# 7. T07 accounting safety

Critical:

Do NOT recalculate accounting in presentation code.

Do NOT expose internal domain objects merely to enrich UI.

Use only approved presentation data.

The known planning issue remains:

computer-player balances do not currently have an independently approved safe public
presentation interface.

Therefore:

DO NOT add computer-player bankroll/balance.

Do not block T07 because those balances are absent.

T07 concerns approved local/global accounting presentation.

---

# 8. T07 preservation

Preserve T06:

- normal action dock
- betting controls
- Insurance/Even Money dock
- Round Complete dock

Do not absorb control redesign into T07.

The accounting HUD may visually align with them but must remain a separate semantic concern.

---

# 9. T07 required scenarios

Verify:

- betting open
- active local hand
- Insurance reservation
- Double / Split exposure where fixtures support it
- pending return
- round complete
- low funds
- normal funds

Values must remain exact before/after visual refactor.

---

# 10. T07 responsive/accessibility

Verify:

- desktop
- tablet
- mobile
- 200% text
- native 200% zoom
- keyboard/focus
- contrast
- no horizontal overflow

Accounting values must not become illegible simply because they are visually subordinate.

---

# 11. T07 tests

Add/update tests for:

- exact Available
- exact Reserved/current exposure
- exact Pending return
- semantic accounting region
- appropriate labels
- no new computer-player balance
- Insurance reservation state
- round completion
- mobile/zoom presence

Do not duplicate accounting calculation logic.

---

# 12. T07 repair accounting

M10A-T07 starts:

0/10

Normal bounded repairs are pre-authorized up to 10/10.

No exceptional extension.

---

# 13. T07 full gate

After focused checks pass, run:

- full Vitest
- full Chromium
- all required preservation
- verify.ps1

Required:

PASS / exit 0

Only then:

- update docs
- commit T07
- push
- confirm local=remote
- clean tree
- untracked 0

Record:

M10A-T07 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED

Human acceptance:

PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION

Then proceed automatically to T08.

---

############################################################
# M10A-T08 — RESPONSIVE RECOMPOSITION
############################################################

# 14. T08 preflight

After T07 push:

Confirm:

- local HEAD == origin/main
- ahead/behind 0/0
- clean tree
- untracked 0

Use the new T07 HEAD as T08 baseline.

If not clean:

STOP batch.

M10A-T08 starts:

0/10

---

# 15. T08 objective

Implement:

M10A-T08 — Responsive Recomposition

This task is NOT a general visual redesign.

Desktop T01–T07 composition is already substantially established.

T08 should deliberately adapt the accepted game scene for:

- desktop
- tablet
- mobile
- text scaling
- browser zoom

while preserving the same gameplay hierarchy.

---

# 16. T08 responsive principle

Every viewport should still read as:

one Blackjack game scene

not:

desktop = game
tablet/mobile = stacked website cards

Preserve hierarchy:

1. current hand/cards
2. local gameplay controls
3. Dealer
4. active remote seats
5. accounting/supporting information

Adjust scale/reflow deliberately.

---

# 17. Desktop

Do not unnecessarily redesign desktop.

Preserve accepted composition unless a responsive architecture defect requires a minimal change.

Maintain existing desktop contracts such as:

- Stand bottom <= 900px where still applicable
- local HUD/control relationship
- current scene density

---

# 18. Tablet

Optimise intentionally for tablet.

Requirements:

- Dealer remains clear
- remote seats remain understandable
- local HUD cards readable
- controls easily tappable
- accounting HUD compact
- no collisions
- no unnecessary horizontal scrolling

Do not merely scale desktop down.

---

# 19. Mobile

Mobile requires deliberate recomposition.

Must retain:

- Dealer identity/state
- local active hand
- local player identity
- action controls
- round/decision state
- essential accounting

Remote seat presentation may compress according to DESIGN.md.

Do not hide critical game state.

No page-level horizontal overflow.

Avoid generic disconnected dashboard cards.

---

# 20. T08 touch/accessibility

Verify:

- appropriate touch targets
- semantic order matches visual order
- keyboard remains usable
- screen-reader labels preserved
- 200% text
- native 200% zoom
- contrast
- focus visibility

Do not solve mobile by visually reordering elements while DOM/focus order becomes nonsensical.

---

# 21. T08 scenarios

At minimum verify at desktop/tablet/mobile as appropriate:

- betting open
- normal player turn
- Insurance/Even Money
- Split
- five-card hand
- round complete
- Dealer multi-card
- T07 accounting HUD

---

# 22. T08 tests/evidence

Add meaningful responsive tests without excessive fragile pixel assertions.

Capture consistent screenshots for:

- desktop
- tablet
- 320px mobile
- normal hand
- Split
- decision state
- round complete

Also verify real browser zoom.

---

# 23. T08 full gate

Focused responsive tests first.

Then:

- full Vitest
- full Chromium
- preservation
- verify.ps1

Required:

PASS / exit 0

Then:

- update docs
- commit
- push
- local=remote
- clean
- untracked 0

Record:

M10A-T08 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED

Human acceptance:

PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION

Then proceed automatically to T09.

---

############################################################
# M10A-T09 — EDGE-CASE LAYOUT POLISH
############################################################

# 24. T09 preflight

After T08 push:

Confirm:

- local=remote
- ahead/behind 0/0
- clean working tree
- untracked 0

Use new T08 HEAD as baseline.

M10A-T09 starts:

0/10

If not clean:

STOP batch.

---

# 25. T09 objective

Implement:

M10A-T09 — Edge-Case Layout Polish

This task hardens already-accepted composition against difficult but legitimate UI states.

It must NOT become another redesign milestone.

Fix only demonstrated layout/readability problems.

---

# 26. T09 required edge cases

At minimum inspect and verify:

## Player hands
- normal two-card
- three-card
- four-card
- five-card

## Split
- two hands
- active first hand
- active second hand
- up to existing four Split leaves

## Dealer
- hidden hole card
- revealed
- 3+ cards
- five-card Dealer fixture where existing tests support it

## Names / text
- longest realistic existing player/character names
- role/race text
- result labels

## Financial states
- low available credits
- reserved exposure
- pending return
- Insurance amount
- round result

## Decisions
- Insurance only
- Insurance + Even Money
- disabled action combinations

## Viewports
- desktop
- tablet
- mobile
- 200% text
- native 200% zoom

---

# 27. T09 polish principles

Allowed:

- local wrapping improvements
- compact spacing
- responsive gaps
- overflow containment
- card fan/grid adjustment
- label wrapping
- status positioning
- min/max sizing
- small typography hierarchy refinement

Not allowed:

- changing gameplay
- redesigning accepted components for taste alone
- changing camera direction
- introducing animations
- exposing new domain data

---

# 28. Long-name behaviour

No important text may:

- overlap cards
- push player content into neighbouring seats
- become inaccessible

Use:

- sensible wrap
- max-width
- accessible truncation only when necessary

If visually truncated, full accessible text must remain available.

---

# 29. Four-leaf Split

This is a mandatory hard case.

Verify:

- ownership remains clear
- active leaf obvious
- cards readable
- wager/result association correct
- controls still target current hand
- mobile/tablet remain usable
- no page-level horizontal overflow

Do not change Split semantics.

---

# 30. T09 evidence discipline

Do not manufacture edge cases through unsafe production changes.

Use existing fixtures/test harnesses.

Keep fixture-only data out of production state.

Preserve representative screenshots for hard cases.

---

# 31. T09 repair accounting

M10A-T09:

0/10

Ordinary bounded repairs pre-authorized.

No repair 11.

At 10/10 if still failing:

STOP entire batch.

---

# 32. T09 full gate

After focused edge-case validation passes:

Run:

- full Vitest
- full Chromium
- M1–M8 preservation
- PA1
- RA1 where required
- M9
- M10-T01
- M10A-T01 through T09 preservation
- verify.ps1

Required:

PASS / exit 0

Then:

- update documentation
- commit
- push
- confirm local=remote
- ahead/behind 0/0
- clean tree
- untracked 0

Record:

M10A-T09 IMPLEMENTED / VERIFIED / COMMITTED / PUSHED

Human acceptance:

PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION

---

############################################################
# DO NOT RUN T10
############################################################

# 33. T10 boundary

After successful T09:

STOP.

Do NOT start M10A-T10.

T10 contains the final regression / consolidated visual acceptance gate and must wait
for the owner to review the overnight output.

Do NOT mark M10A complete.

Do NOT mark T07/T08/T09 Human Visual Acceptance ACCEPTED.

---

# 34. Overnight consolidated handoff

Create/update:

docs/M10A_OVERNIGHT_HANDOFF.md

Include:

## Starting baseline
- original starting HEAD

## T07
- status
- repair count
- implementation commit
- final receipt/HEAD
- test counts
- visual evidence paths
- human acceptance PENDING

## T08
Same fields.

## T09
Same fields.

## Preservation
- src/domain diff
- RNG
- shoe/cards
- accounting
- replay/digest/journal
- strategy
- assets
- canonical evidence

## Final Git state
- HEAD
- origin/main
- ahead/behind
- working tree
- untracked

## Owner morning review
Provide a short ordered screenshot list:

1. T07 accounting HUD desktop
2. T07 accounting HUD mobile
3. T08 tablet
4. T08 mobile
5. T09 five-card
6. T09 Split
7. T09 four-leaf Split
8. T09 Insurance
9. T09 round complete

Do not claim owner acceptance.

---

# 35. Final batch status

If T07, T08 and T09 ALL succeed:

Return:

M10A_OVERNIGHT_BATCH_T07_T09_COMPLETE

If any task blocks:

Return:

M10A_OVERNIGHT_BATCH_STOPPED_AT_<TASK>

and do NOT continue further.

---

# 36. Final response format

## STATUS

`M10A_OVERNIGHT_BATCH_T07_T09_COMPLETE`

or

`M10A_OVERNIGHT_BATCH_STOPPED_AT_T07`
`M10A_OVERNIGHT_BATCH_STOPPED_AT_T08`
`M10A_OVERNIGHT_BATCH_STOPPED_AT_T09`

## STARTING BASELINE

- SHA
- branch
- starting Git state

## T07 — ACCOUNTING HUD

- result
- repair count
- verification
- commit / final HEAD
- evidence
- Human Visual Acceptance = PENDING

## T08 — RESPONSIVE

Same structure.

## T09 — EDGE CASES

Same structure.

## PRESERVATION

- src/domain
- RNG
- shoe/cards
- accounting
- replay/digest/journal
- strategies
- PA1 assets
- canonical evidence
- accepted T01–T06 presentation

## FINAL VERIFICATION

Summarize latest:

- Vitest
- Chromium
- preservation
- verify.ps1

## FINAL GIT STATE

- HEAD
- remote HEAD
- ahead/behind
- working tree
- untracked

## OWNER MORNING REVIEW

List the 9 most important screenshots in review order.

## NEXT ACTION

If successful:

`M10A-T10 NOT STARTED — WAITING FOR OWNER REVIEW OF T07/T08/T09`

Also:

`M10-T02 NOT STARTED`
`M10-T04 IMPLEMENTATION NOT STARTED`
`ANIMATION NOT STARTED`
`DEPLOYMENT NOT RUN`

Do not continue.