# PA1 - Fantasy Character Presentation Pack

Authorized baseline: `main`, HEAD = origin/main = `e8e8e2e1586611473f0cdb94540ce995d9bd64e7`, ahead/behind 0/0, clean including untracked, captured at 2026-10-02 19:49:27 +08:00. Owner explicitly reports RA1 HUMAN ACCEPTED in the PA1 instruction. M1-M8 HUMAN ACCEPTED; M9 technically reviewed NO FINDINGS, HUMAN ACCEPTED: NO. PA1 HUMAN ACCEPTED: NO. Deployment NOT RUN. No M10.

Every task recommends GPT Sol 6.1 / High. Actual client model/effort NOT VERIFIED / NOT VERIFIED; available tools do not establish the selected runtime. Maximum ten cumulative repair cycles per task; the first implementation/validation does not count. Historical repair ledgers remain unchanged.

## Amendment boundary

PA1 supersedes only the M9 evening-attire guest presentation and historical UI non-goal of a local avatar selector. Dealer remains independent, in its existing presentation. This is a local character choice, without accounts or a social profile system.

Expected `src/domain` diff: EMPTY. House Rules v1.2, RSA, Charlie, S17, Double, Surrender, Bet Behind, cards, shoe, RNG, funds, wagers, settlement, replay gameplay semantics/digests, audit outcome semantics and computer decision policy are unchanged. No deployment, acceptance, M10, network, persistence, paid resources or history rewriting.

## Canonical roster

| ID | Name | Archetype |
| --- | --- | --- |
| elf_male | Caelan | Male Elf |
| elf_female | Elaria | Female Elf |
| knight_male | Roland | Male Human Knight |
| knight_female | Seraphine | Female Human Knight |
| mage_male | Alaric | Male Mage |
| mage_female | Nyra | Female Mage |
| noble_male | Lucien | Male Noble |
| noble_female | Celestine | Female Noble |
| halforc_male | Garruk | Male Half-Orc Warrior |
| halforc_female | Vesha | Female Half-Orc Warrior |
| dwarf_male | Borin | Male Dwarf |
| dwarf_female | Brynja | Female Dwarf |

## Player behavior and isolation

Normal Player Mode starts with Roland, without a blocking selection screen. Change Character uses native keyboard controls and does not send a game command, move funds, deal cards, reset the table, close a human decision or trigger automation. It remains available without interrupting a round. Names/archetypes accompany portraits; seat numbers and explicit Human/Computer/You ownership remain visible.

Computer guests automatically receive unique characters excluding the human. Assignment uses a separate presentation chooser with deterministic injection in tests. It never calls or imports gameplay RNG. Deal Again, Repeat Bet, automatic turns, sitting out and normal rounds preserve the lineup. Only an explicit new table/session may choose a new lineup. Changing the human to an occupied character must preserve uniqueness: exchange that guest's character with the previous human character, retaining all other guest identities. This explicit presentation change does not change occupancy or controller identity.

Character state and selection are excluded from replay commands, gameplay digests and outcome audit events. Public labels must never inspect the hidden dealer card, shoe order or private computer funds. Portraits do not obscure cards, results or primary controls; readable text supplies the same identity when images are unavailable.

## Source and production gate

Resumed T01 audit at 2026-10-02 21:26:00 +08:00 after the owner supplied the complete set and revoked the staging wait. Actual source files are `art/source/characters/PA1_character_sources/<canonical-id>.png`; no relocation or source modification. Continue the same T01 ledger. Complete individual audit receipts are in PA1_ASSET_AUDIT and PA1_SOURCE_AUDIT.json; the historical staging instruction below no longer blocks work after this source gate passes.

Owner staging instruction recorded at 2026-10-02 20:18:08 +08:00: authoritative source directory is `C:\Users\user\Documents\GitHub\casino-blackjack\art\source\characters`. Expected filenames are the twelve canonical IDs above, each with the `.png` extension. Preserve all current uncommitted T01 work. T01 remains BLOCKED / ASSET NOT READY while the owner stages the complete set; this availability gate is not a repair cycle. Do not start T02. STOP and wait for the owner to provide the assets, then resume the existing T01 audit.

Preserve supplied originals unchanged, with provenance and SHA256 receipts. Inspect each mechanically and visually before admitting it to production. Missing, opaque, text/logo/banner/scenery-bearing or inconsistently framed art is BLOCKED / ASSET NOT READY, never hidden by CSS. The known Noble concern requires explicit individual inspection, not a presumed pass.

T02 fixes output dimensions, framing, tool/version, alpha requirements, size budget and transformation parameters after inspecting source dimensions. Output must be a consistent transparent portrait, no text/logo/scenery, with production-appropriate resolution. The checked-in deterministic pipeline must reproduce identical output bytes from the preserved sources and record input/output hashes. Source generation, if authorized, is separate from deterministic production conversion. Replacement sources preserve the failed originals and audit history.

## Sequential task contracts

Shared stop conditions: authority conflict, unknown overlapping changes, unavailable required validation, asset gate failure, domain/gameplay change, stalled repairs or ten repairs, destructive Git/data actions, sensitive credentials, paid resources, unauthorized publication. Each verified checkpoint uses normal commit/push to the existing origin/main, then records SHA, push/fetch, parity and full status. No amend/rebase/reset/force push.

| Task | Scope / acceptance criteria | Step -> required verification |
| --- | --- | --- |
| PA1-T01 | Character contract, individual source audit, substantive recording of RA1 human acceptance | Cross-authority check -> locate/hash/read dimensions/alpha and visually inspect every source -> source gate -> scoped docs/tests/diff check |
| PA1-T02 | Deterministic production asset pipeline; preserved sources and consistent transparent output | Fix exact tool/parameters -> generate twice -> compare all bytes/hashes -> inspect all production portraits and gate failures |
| PA1-T03 | Presentation manifest/model and isolated chooser | Assert exact twelve independent roster literals, valid asset paths, unique human/guest assignment and deterministic chooser calls -> isolation checks/full harness |
| PA1-T04 | Non-blocking human avatar selection and automatic guest assignment | Deterministic normal-round/Repeat/Deal Again/reset/collision tests -> prove no game command or gameplay RNG consumption -> full harness |
| PA1-T05 | Seat portraits, names/archetypes and explicit controller identity | All twelve selectable and readable, dealer independent, cards/results visible -> component/browser checks/full harness |
| PA1-T06 | Responsive and accessibility preservation | Actual 1280x900, 768x1024 and 320x720 geometry, keyboard/focus/touch targets/reduced motion/secrecy -> browser checks/full harness |
| PA1-T07 | Regression, inspected screenshots, exact documentation and genuinely fresh independent review handoff | Full M1-M8/M9/RA1 preservation; domain diff EMPTY; baseline/current replay digests/RNG/policy unchanged -> official final harness, complete diff/status, normal publication -> handoff and STOP |

## Required final verification and delivery

Run and check exit codes of:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
git diff --check
git status --short --untracked-files=all
git diff e8e8e2e1586611473f0cdb94540ce995d9bd64e7 -- src/domain
```

Tests must use independent explicit expectations, controlled chooser/gameplay seams and frozen baseline evidence rather than deriving expected behavior only from the new production code. Do not disable/skip/weaken existing preservation checks. If historical fixed-inventory or source assertions need adaptation, record their scope/evidence before changing them and retain every historical assertion at its accepted baseline; current PA1 assertions must cover the amended presentation independently.

Use PASS / FAIL / NOT RUN / BLOCKED / NOT APPLICABLE truthfully. IMPLEMENTED, VERIFIED, COMMITTED, PUSHED, ACCEPTED and DEPLOYED are separate states. After T01..T07 are IMPLEMENTED / VERIFIED / COMMITTED / PUSHED, provide a handoff for a genuinely fresh independent session and STOP. This implementation session must not simulate that review or mark PA1/M9 ACCEPTED.
