# M10-T04B delivery — implemented / verified

Recorded 2026-10-05 12:44:02 +08:00.

## STATUS

M10-T04B_IMPLEMENTED_VERIFIED. Former missing-asset and CB09 runner-timeout blockers resolved. Owner human visual acceptance remains PENDING.

## BASELINE

Original asset resume: main/e5cb332bcab72786c17be201db4dab4ccdfcb856=origin/live,0/0,CLEAN/untracked0; original cumulative5/10 preserved. Exceptional-repair resume: same HEAD, known23 modified/438 untracked,staged0; every known path/status/hash checked against persisted receipt. Recommended GPT-6.1 Sol/Max supported by client metadata; actual runtime selection NOT VERIFIED.

## APPROVED DEALER POOL

Celestine/noble_female -> Seraphine/knight_female -> Nyra/mage_female -> Elaria/elf_female -> Vesha/halforc_female.

## ASSET VALIDATION

Owner ZIP/MANIFEST.json authoritative; copied unchanged, no generation/substitution/resizing. Source1086x1448/runtime240x320, transparentRGBA8/3:4/alpha0..255/meaningful nonblank subject/CRC/decoded hashes PASS for each. Owner-provided/approved project input; manifest generation statement retained, generation/licensing/resize method not independently verified. Same-session identity/DealerZone review PASS; human acceptance PENDING.

### Celestine / noble_female

Source: art/source/dealers/noble_female/formal.png,1086x1448,SHA256 cfd6a5aff817b19c38363bdefd52ed6a18993b6eb57d5619a7155daad5af8beb.

Runtime: public/characters/dealer/noble_female/formal.png,240x320,SHA256 73a1409d5db2e4565e294bebbef1c61f729b063f94e3c4afbc4bd46434dbddab.

Alpha/transparent3:4/decode/identity/live visual result PASS.

### Seraphine / knight_female

Source: art/source/dealers/knight_female/formal.png,1086x1448,SHA256 09d869cc5ec6fe8160526832a77e5aaf09bebb623a488800bf9db43f67931a9c.

Runtime: public/characters/dealer/knight_female/formal.png,240x320,SHA256 8b4a4566ff56a135a8109549c93c3714b0c5f62bde1c8a3de21a5b52355a2b3d.

Alpha/transparent3:4/decode/identity/live visual result PASS.

### Nyra / mage_female

Source: art/source/dealers/mage_female/formal.png,1086x1448,SHA256 e5f1bb09cddede5e25b6c89217bc1554a5db0b7a13a698a0403158cdbb92604b.

Runtime: public/characters/dealer/mage_female/formal.png,240x320,SHA256 aaf123b256a272be9a13091ece2bbff4bcd6f17bd0cf5090ec003aa8bb7b63ed.

Alpha/transparent3:4/decode/identity/live visual result PASS.

### Elaria / elf_female

Source: art/source/dealers/elf_female/formal.png,1086x1448,SHA256 dce9191837a86c49582535010c8321e63d8eeb76ae653a9c84743a0ec48909d6.

Runtime: public/characters/dealer/elf_female/formal.png,240x320,SHA256 6145c299ec6abf5d4071b7f8d47e5a80173f42a949166ad1951d078b8d56f0f9.

Alpha/transparent3:4/decode/identity/live visual result PASS.

### Vesha / halforc_female

Source: art/source/dealers/halforc_female/formal.png,1086x1448,SHA256 fb9b9ec828ec1ee6bb50cbb2e19b2239953644fb1e40697d071f79b8119f7998.

Runtime: public/characters/dealer/halforc_female/formal.png,240x320,SHA256 ccc53b5417a0d071d859e8e97d5e0dcf84c2ac4fec10581f36397dfafc9122a6.

Alpha/transparent3:4/decode/identity/live visual result PASS.

## ROTATION POLICY

Celestine initial preference; existing presentationSession ordinal chooses cyclic start modulo5 and scans all seated identities, including Sitting Out. No eligible identity -> null/non-roster generic Dealer. Stable through NEXT/REPEAT/avatar/resize/commands. Successful existing NEW_TABLE/new demo/MODE reset advances; rejected resets do not; new controller/reload ordinal0. No extra gameplay RNG, wall clock, storage or controller commands.

## PRESENTATION STATES

IDLE,DEALING,WAITING_PLAYER,REVEALING,DRAWING,SETTLING retained. STATIC FORMAL PORTRAIT USED FOR ALL SIX STATES. ANIMATION NOT IMPLEMENTED.

## GAMEPLAY PRESERVATION

Empty src/domain and src/browser diff. RNG/shoe/cards/replay/digest/journal/turn order/strategies/accounting/settlement unchanged; exact seeded rendering comparison and independent M1–M8 PASS. T02/T03 real1–7 and seat mapping focused/final cases PASS. CSS/seat geometry/dependencies/settings unchanged.

## PA1 PRESERVATION

All12 original source/player assets and provenance unchanged, including the five female references; original/output hash/decoded and12 byte reproduction PASS. New separate Dealer directory only; canonical strict file/hash assertions retained.

## VERIFICATION

Asset validation/rotation/collision/exhaustion/zero-RNG/1–7/focused40/native200/desktop1280/tablet768/mobile320/text200/keyboard/focus/public hidden/revealed/result checks PASS. Typecheck/lint/domain/build PASS; Vitest91 files/1164 PASS. Full Chromium142/142 PASS; exceptional CB09 three viewport cases PASS, all original outcomes/assertions retained and low-funds at each width. Full final verify.ps1 2026-10-05 12:28:00 +08:00 to 2026-10-05 12:42:40 +08:00 PASS/0, including all independent M1–M8 preservation. Same-session review PASS; fresh separate-session review NOT COMPLETED. [Actual gate receipt](technical-gate.json).

## REPAIR COUNT

M10-T04:11/11 — OWNER-AUTHORIZED EXCEPTION. Prior5 preserved; repairs6–11 CLOSED. Repair11 only moves CB09 viewport loop/header; exact inverse equality PASS,30000ms runner budgets unchanged,zero retries; repair12 NOT AUTHORIZED. [Ledger](repair-ledger.json). First full standalone timed-out traces auto-cleared; raw logs/failed source retained. Latest final-blocker20 artifacts captured before clearing.

## FILES CHANGED

Ten new source/runtime formal PNGs; original manifest and art/dealer-assets.json; formal registry/assignment/main/App/avatar integration; read-only asset audit/PA1 directory adapter; formal tests and explicit historical generic input adapters/three matrix viewport parameterizations (CB10,T08-B02 previously; CB09 exceptional repair11); authorized docs and task evidence. [Exact scoped list](scope.json); no unrelated files or semantic/core changes.

## GIT STATE

Implementation commit/push NOT RUN at gate completion; final Git publication receipt will be added after authorized normal main commit/push.

## EVIDENCE

[All five identities/canonical comparison](identity-comparison.png); [five live portraits](live-portraits-1.png); [collision to Seraphine](screenshots/collision-Celestine-to-Seraphine.png); [all seated generic fallback](screenshots/all-pool-seated-7-generic.png); [7-player desktop](screenshots/formal-table-7-1280.png); [Vesha tablet](screenshots/formal-Vesha-7-768-active.png); [7-player mobile](screenshots/formal-7-mobile-active.png); [native200](visuals/zoom200.json); [latest failed trace/screenshots/context](final-blocker/index.json).

## HUMAN ACCEPTANCE

PENDING. Owner-approved artwork input is separate from acceptance of the integrated table.

## NEXT ACTION

STOP after authorized verified publication for owner human visual acceptance. Exceptional repair11 explicitly authorized/applied/verified; original proposal and blocked receipts remain historical evidence. Repair12 NOT AUTHORIZED.

M10-T05 NOT STARTED — WAITING FOR OWNER HUMAN VISUAL ACCEPTANCE. MOTION NOT INSTALLED. ANIMATION NOT STARTED. DEPLOYMENT NOT RUN.
