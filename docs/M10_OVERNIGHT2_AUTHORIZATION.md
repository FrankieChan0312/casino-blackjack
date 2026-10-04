# Casino Blackjack — Overnight Batch 2
# M10A-T10 → M10-T02 → M10-T03
# Owner-Authorized Conditional Progression

Repository:

C:\Users\user\Documents\GitHub\casino-blackjack

Branch:

main

Expected starting HEAD:

441d4515855cc106f410264ec767008a4ae99998

---

# 0. OWNER OVERNIGHT AUTHORIZATION

The owner will be unavailable and explicitly authorizes unattended execution of:

1. M10A-T10 — Final Regression + Consolidated Acceptance Closure
2. M10-T02 — Configurable Player Count
3. M10-T03 — Dynamic Semicircle Seat Mapping

Execution may proceed continuously from one task to the next ONLY when the preceding task
passes its complete technical/governance gate.

Routine non-destructive repo-local actions are pre-approved, including:

- reading repository files/history
- modifying in-scope source/test/docs
- running Vitest
- running Chromium/Playwright
- capturing screenshots/evidence
- bounded diagnosis
- ordinary repair cycles within each task's normal 10/10 limit
- documentation updates
- commit
- normal push
- local/remote parity verification
- proceeding to the next authorized task

Do NOT stop merely for routine approval.

---

# 1. NOT AUTHORIZED

This overnight authorization does NOT permit:

- repair 11/10 or any exceptional repair
- force push
- history rewrite
- deployment
- cloud/paid resource creation
- secret/credential changes
- destructive deletion of unknown work
- gameplay/domain semantic changes outside the explicitly authorized task
- M10-T04 implementation
- creation/generation/editing of Dealer artwork
- Motion installation
- animation implementation
- M10-T05+
- production deployment

If any of the above becomes necessary:

STOP the entire batch.

---

# 2. CURRENT HUMAN ACCEPTANCE STATE

The owner has visually reviewed and accepted:

M10A-T01 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T02 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T03 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T04 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T05 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T06 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T07 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T08 HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A-T09 HUMAN VISUAL ACCEPTANCE: ACCEPTED

Record T07/T08/T09 acceptance in repository documentation if not already recorded.

Do not invent new human acceptance.

---

# 3. GLOBAL STOP POLICY

Immediately stop the entire overnight batch if:

- current repository state is unexpectedly dirty
- unknown user work is found
- src/domain changes become necessary without explicit task authority
- protected gameplay behaviour changes
- any task reaches repair 10/10 and still fails
- full verification cannot be made green safely
- a BLOCKER/HIGH visual or functional regression is found
- T01–T09 accepted M10A presentation materially regresses
- deployment/external/destructive action becomes necessary

Do not skip a blocked task and continue to the next one.

---

# 4. GLOBAL PRESERVATION CONTRACT

Throughout the batch preserve unless the specific authorized task explicitly and narrowly
requires otherwise:

- Blackjack rules
- RNG
- shoe/card semantics
- wager/accounting semantics
- bankroll
- replay
- digest
- journal
- Dealer strategy
- computer strategy
- settlement
- PA1 assets/provenance
- canonical historical evidence
- accepted M10A-T01 through T09 presentation
- existing accessibility contracts

Expected wherever applicable:

src/domain diff = EMPTY

M10-T02/T03 should primarily use existing configuration/presentation/application-layer
interfaces.

If a genuine domain change appears necessary:

STOP and report the architectural blocker.

Do not silently widen scope.

---

############################################################
# PART A — M10A-T10
# FINAL REGRESSION + CONSOLIDATED CLOSURE
############################################################

# 5. T10 objective

Perform a fresh consolidated final review of M10A-T01 through M10A-T09.

M10A-T10 must NOT add new UI features.

Its job is to independently establish that the full M10A UI recomposition milestone is:

- internally consistent
- regression-safe
- responsive
- accessible
- evidence-complete
- correctly documented
- ready for formal milestone closure

---

# 6. T10 preflight

Confirm:

- repo path
- branch = main
- HEAD = 441d4515855cc106f410264ec767008a4ae99998
- origin/main
- ahead/behind 0/0
- clean working tree
- untracked 0

Read at minimum:

- AGENTS.md
- README.md
- docs/DESIGN.md
- docs/UX_UI.md
- docs/SPEC.md
- docs/PLAN.md
- docs/STATE.md
- docs/M10A_PLANNING.md
- docs/M10A_T01.md through docs/M10A_T09.md
- docs/M10A_OVERNIGHT_HANDOFF.md
- docs/DEVELOPMENT_LOG.md
- docs/LAB_MANUAL.md
- scripts/verify.ps1

---

# 7. T10 fresh-session principle

Treat previous PASS results as claims to re-establish.

Do not merely trust earlier summaries.

Independently re-run the required final matrix.

---

# 8. T10 consolidated visual matrix

Review representative states covering the entire M10A milestone.

At minimum:

## Normal gameplay
- betting open
- player turn
- Dealer hidden hole card
- Dealer revealed/complete
- round complete

## Player UI
- normal two-card hand
- five-card hand
- Split
- four-leaf Split

## Decisions
- Insurance
- Even Money where eligible
- unavailable action states

## Financial HUD
- normal credits
- reserved exposure
- pending return
- low funds
- round-result state

## Responsive
- desktop
- tablet
- mobile

## Accessibility
- keyboard/focus
- 200% text
- native browser 200% zoom
- contrast
- touch target requirements
- no horizontal overflow

---

# 9. T10 preservation

Re-establish:

- src/domain protected state
- RNG
- shoe/cards
- accounting
- replay/digest/journal
- Dealer/computer strategies
- PA1 assets
- canonical evidence
- M10 geometry

No feature implementation.

---

# 10. T10 verification

Run:

- full Vitest
- full Chromium
- M1–M8 preservation
- PA1
- RA1 where repository convention requires
- M9
- M10-T01
- M10A-T01 through T09
- documentation validation
- .\scripts\verify.ps1

Required:

PASS
exit 0

Preserve first failures.

Do not silently retry until green.

---

# 11. T10 acceptance closure

If everything passes:

record:

M10A-T10 IMPLEMENTED / VERIFIED
M10A HUMAN VISUAL ACCEPTANCE: ACCEPTED
M10A MILESTONE: ACCEPTED / CLOSED

This closure is justified because the owner already explicitly human-accepted T01–T09.

T10 is consolidating those owner decisions plus fresh independent regression.

Do not claim acceptance of future M10 tasks.

---

# 12. T10 Git

Update required docs/evidence.

Commit and push.

Confirm:

- local == remote
- ahead/behind 0/0
- clean
- untracked 0

Only then proceed to M10-T02.

---

############################################################
# PART B — M10-T02
# CONFIGURABLE PLAYER COUNT
############################################################

# 13. T02 objective

Implement:

M10-T02 — Configurable Player Count

The user must be able to configure the number of table players before starting a session.

Planned model:

1 local human
+
0–6 computer players

Total table occupancy:

1–7 players

Use the existing accepted architecture and planning documents as authority.

Do not assume a different range unless current repository docs explicitly require it.

---

# 14. T02 configuration boundary

The player-count setting must affect the ACTUAL game/session configuration.

It must NOT be a UI-only visual filter.

Required conceptual flow:

player-count selection
→ session/table configuration
→ actual active player set
→ computer-player count
→ seat occupancy input
→ gameplay turn/deal population

Do not fake player removal only in CSS.

---

# 15. T02 setup UI

Add an accessible pre-session/table setup control for player count.

Possible presentation:

Players
[1] [2] [3] [4] [5] [6] [7]

or equivalent consistent with DESIGN.md.

Requirements:

- clear current selection
- keyboard usable
- touch usable
- accessible label
- default matches existing documented behaviour
- no ordinary casino-dashboard feel regression

Do not over-design; T02 is configuration functionality.

---

# 16. T02 session timing

Player count must be selected at the appropriate lifecycle boundary.

Prefer:

before starting a new table/session

Do NOT allow unsafe mid-hand seat destruction.

Inspect current lifecycle.

If changing count during an active round is not safe:

disable/defer appropriately.

Do not invent destructive round-reset semantics.

---

# 17. T02 computer players

For selected total occupancy N:

- exactly 1 local human
- remaining N-1 players are computer-controlled

Preserve existing computer strategy.

Do not modify strategy logic.

Do not expose unavailable computer-accounting internals.

---

# 18. T02 identity assignment

Use existing roster/assignment mechanisms.

Do not:

- duplicate one character across two occupied player seats
- use the future Dealer identity as player if existing planning prohibits it once Dealer
  assignment exists

However:

M10-T04 Dealer identity is not implemented yet.

Do not create Dealer selection logic now.

Only preserve future compatibility.

---

# 19. T02 geometry boundary

M10-T02 determines:

WHO exists / HOW MANY players exist.

M10-T03 determines:

WHERE those occupied players map within the semicircle.

Do not absorb final seat remapping into T02 beyond the minimum needed for correctness.

If current UI temporarily uses the existing mapping until T03 immediately follows,
document that clearly.

---

# 20. T02 domain protection

Prefer application/config/session-layer changes.

If current domain architecture already accepts player collections/configuration, use it.

If supporting 1–7 requires modifying protected domain semantics rather than configuration:

STOP.

Report blocker.

Do not redesign game engine overnight.

---

# 21. T02 behaviour verification

Verify player counts:

1
2
3
4
5
6
7

For each where practical:

- active player count correct
- exactly one human
- expected AI count
- gameplay can start
- turns operate
- initial dealing population correct at the authoritative level
- round completes
- replay remains valid

Do not implement animated dealing yet.

---

# 22. T02 tests

Add meaningful tests for:

- default count
- min count
- max count
- each supported count
- configuration persistence within intended session
- no unsafe mid-round reconfiguration
- human count exactly one
- AI count N-1
- existing 4-player baseline remains valid

---

# 23. T02 visual evidence

Capture at minimum:

- 1-player setup
- 2-player setup
- 4-player setup
- 7-player setup

Human Visual Acceptance for T02:

PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION

Do not self-accept T02.

---

# 24. T02 repair accounting

M10-T02 starts:

0/10

Ordinary repairs up to 10/10 are authorized.

No repair 11.

---

# 25. T02 full gate

Focused configuration tests first.

Then:

- full Vitest
- full Chromium
- preservation
- replay/digest checks
- verify.ps1

Required:

PASS / exit 0

Then:

- docs
- commit
- push
- local=remote
- clean
- untracked 0

Only then proceed to T03.

---

############################################################
# PART C — M10-T03
# DYNAMIC SEMICIRCLE SEAT MAPPING
############################################################

# 26. T03 objective

Implement:

M10-T03 — Dynamic Semicircle Seat Mapping

Map the actual active player set from T02 onto the existing 1–7 seat geometry so every
supported player count produces a balanced casino-table composition.

T02 answers:

how many / who

T03 answers:

where

---

# 27. Preserve geometry foundation

Reuse the existing centrally defined M10-T01 seat-anchor architecture.

Do not introduce:

.player1
.player2
.player3

with unrelated magic CSS.

Use central geometry/mapping logic.

---

# 28. Required seat mapping principle

The local human remains the strongest lower-centre anchor where consistent with accepted
design.

Computer seats distribute symmetrically/balanced around the semicircle.

Conceptually:

1 player:
human centred

2 players:
AI + human balanced according to DESIGN.md

3 players:
balanced arc

4 players:
preserve accepted existing composition where appropriate

5–7:
progressively use outer/intermediate anchors

Do not infer mapping from this conceptual text if DESIGN.md defines exact canonical mapping.

Repository design docs are authoritative.

---

# 29. T03 requirements for every count

Verify:

1
2
3
4
5
6
7

For each:

- no duplicate seat
- no overlap
- no phantom empty SeatUnit unless intentionally designed as felt marking
- Dealer remains clear
- LocalPlayerHud remains clear
- action controls remain usable
- accounting HUD remains secondary
- no horizontal overflow
- visual balance reasonable

---

# 30. Dynamic table composition

Seat occupancy should derive from active player configuration.

Do NOT:

- hard-code four player components and hide extras
- leave inactive computer players in DOM as active gameplay participants
- create fake placeholders that affect turn semantics

Presentation must reflect actual configured participants.

---

# 31. Identity / seat consistency

Maintain consistent association between:

- participant ID
- avatar identity
- logical player order
- seat
- hand
- turn

Do not let presentation remapping change authoritative turn order.

Seat position is presentation.

Turn order remains authoritative gameplay data.

---

# 32. Initial deal compatibility

The future M10-T06 round-robin deal animation will need a stable ordered mapping.

T03 should expose/retain a deterministic presentation seat order usable later.

Do NOT animate.

Do NOT make visual seat order consume RNG.

Do not change card draw.

---

# 33. Responsive mapping

Desktop:
- use full intended semicircle

Tablet:
- compact mapping
- maintain ownership/readability

Mobile:
- deliberate responsive adaptation
- maintain logical seat identity
- no horizontal overflow
- do not render 7 full desktop-size cards/panels simultaneously if DESIGN.md defines a
  compact treatment

Do not turn mobile into a disconnected generic list unless already approved by design.

---

# 34. Edge cases

Verify dynamic mapping with:

- long names
- five-card remote hand
- local Split
- Insurance decision
- round complete
- 7-player configuration

T09/M10A edge-case work must not regress.

---

# 35. T03 accessibility

Semantic player order and visual position can differ, but accessibility must remain understandable.

Preserve:

- seat labels
- player identity
- logical reading order
- keyboard/focus
- active player/hand semantics

Do not create inaccessible CSS-only reordering.

---

# 36. T03 tests

Add tests for:

- canonical seat selection for each player count
- stable deterministic mapping
- local-player anchor
- unique seat assignment
- active participants only
- 1 through 7
- resize behaviour
- no horizontal overflow
- no gameplay turn-order mutation

---

# 37. T03 visual evidence

Capture desktop for:

- 1 player
- 2 players
- 3 players
- 4 players
- 5 players
- 6 players
- 7 players

Also capture:

- tablet 7-player
- mobile representative high-density state

Human Visual Acceptance:

PENDING — OWNER REVIEW DEFERRED BY EXPLICIT OVERNIGHT AUTHORIZATION

Do not self-accept.

---

# 38. T03 repair accounting

M10-T03 starts:

0/10

Ordinary repairs up to 10/10 authorized.

No exceptional extension.

---

# 39. T03 full gate

After focused mapping tests pass:

- full Vitest
- full Chromium
- M1–M8
- PA1 / RA1 / M9
- M10-T01
- M10A closed milestone preservation
- M10-T02
- M10-T03
- replay/digest
- verify.ps1

Required:

PASS / exit 0

Then:

- docs
- commit
- push
- local=remote
- 0/0
- clean
- untracked 0

---

############################################################
# STOP BEFORE M10-T04
############################################################

# 40. T04 boundary

After successful M10-T03:

STOP.

Do NOT start:

M10-T04 — Dealer Avatar + Formal Attire

Reason:

T04 contains visually consequential artwork/identity decisions requiring owner review.

Do not:

- generate Dealer art
- edit avatar art
- choose Dealer identity
- create formal-attire variants
- call image-generation tools
- install Motion
- begin animation infrastructure

---

# 41. OVERNIGHT HANDOFF

Create/update:

docs/M10_OVERNIGHT2_HANDOFF.md

Include:

## M10A-T10
- final closure status
- acceptance
- test counts
- commit / HEAD
- evidence

## M10-T02
- status
- repair count
- exact supported range
- implementation commit
- test counts
- screenshots 1/2/4/7 players
- Human Acceptance PENDING

## M10-T03
- status
- repair count
- mapping table for 1–7
- implementation commit
- test counts
- desktop 1–7 screenshots
- tablet/mobile evidence
- Human Acceptance PENDING

## Preservation
- domain
- RNG
- replay/digest
- accounting
- strategies
- assets
- M10A milestone

## Morning-review list

Provide an ordered list of the most useful screenshots:

1. 1-player desktop
2. 2-player desktop
3. 4-player desktop
4. 7-player desktop
5. 7-player tablet
6. high-density mobile
7. active normal round with non-default player count
8. round complete with non-default player count

---

# 42. FINAL BATCH STATUS

If all three tasks succeed:

M10_OVERNIGHT_BATCH2_COMPLETE

If blocked:

M10_OVERNIGHT_BATCH2_STOPPED_AT_M10A_T10

or

M10_OVERNIGHT_BATCH2_STOPPED_AT_M10_T02

or

M10_OVERNIGHT_BATCH2_STOPPED_AT_M10_T03

Do not continue after a blocker.

---

# 43. FINAL RESPONSE FORMAT

## STATUS

`M10_OVERNIGHT_BATCH2_COMPLETE`

or appropriate STOPPED status

## STARTING BASELINE

- SHA
- branch
- Git state

## M10A-T10

- final status
- M10A milestone closure
- verification
- commit / HEAD

## M10-T02 — PLAYER COUNT

- implementation
- supported range
- behaviour
- repair count
- verification
- Git
- Human Visual Acceptance = PENDING

## M10-T03 — DYNAMIC SEATING

- mapping architecture
- 1–7 mapping summary
- repair count
- verification
- Git
- Human Visual Acceptance = PENDING

## PRESERVATION

- src/domain
- RNG
- shoe/cards
- accounting
- replay/digest/journal
- strategies
- PA1 assets
- canonical evidence
- M10A

## FINAL GIT STATE

- HEAD
- remote HEAD
- ahead/behind
- clean/dirty
- untracked

## OWNER MORNING REVIEW

List the 8 key screenshots.

## NEXT ACTION

`M10-T04 NOT STARTED — WAITING FOR OWNER REVIEW OF M10-T02/T03`

Also state:

`DEALER ARTWORK NOT STARTED`
`MOTION NOT INSTALLED`
`ANIMATION NOT STARTED`
`DEPLOYMENT NOT RUN`

STOP.