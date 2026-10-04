# M10A-T01 Human Visual Repair 1 — BLOCKED at10/10

Owner review rejected the correct published8ae9ff2 scene. Human Visual Acceptance = NOT ACCEPTED / PENDING. This working-tree repair is IMPLEMENTED, not fully VERIFIED or published. No current repair commit/push/deployment. M10A-T02, M10-T02 and M10-T04 implementation remain NOT STARTED.

## Blocking evidence

[contrast.json](contrast.json) records FAIL/exit1: BLACKJACK PAYS3:2 foreground rgb(226,210,164) over the brightest sampled actual felt background rgb(43,102,82), ratio4.476153734022139 < required4.5. Eleven other normal-text checks and keyboard focus pass; focus ratio5.505122929235555, solid3px outline. The threshold is retained. No rerun for luck, colour correction beyond10/10, or complete verification claim. [Contrast screenshot](contrast-sample-1280.png), [actual driver](contrast-driver.txt), [stdout record](contrast.log.gz). The failing stderr was shown in the session; no reconstructed stderr is published.

The likely bounded next correction is a brighter desktop inscription colour, followed by the affected contrast/focused checks and all remaining required gates. It is NOT IMPLEMENTED / NOT VERIFIED and requires explicit authorization for an additional repair cycle. AGENTS.md and the owner's normal10-cycle cap require stopping here.

## Comparable composition evidence

Both direct capture pairs use the same1280x900 player fixture and100-credit native input. Before is the untouched owner-rejected8ae9ff2; final is the current repair10 working tree. [Capture driver](final-capture-driver.txt), [before dimensions/hashes](before-composition.json), [final dimensions/hashes](final-composition.json).

| State | Before | Current repair10 |
| --- | --- | --- |
| Betting/open | [Before desktop](camera-before-open-1280.png) | [Current desktop](camera-final-open-1280.png) |
| Dealt | [Before desktop](camera-before-dealt-1280.png) | [Current desktop](camera-final-dealt-1280.png) |

[Tablet768x1024 dealt](camera-dealt-768.png), [mobile320x720 dealt](camera-dealt-320.png). The final focused browser receipt retains14 inspected normal/stress/200%-text images under generated paths. Historical evidence remains immutable.

Actual desktop visual footprints: temporary Dealer116x144 ->180x220; occupied portraits54x72 ->84x112; local portrait54x72 ->72x96; local cards76x98 ->100x132; hand-to-dock gap12 ->6px. The normalized1–7 anchor implementation and physical1/3/4/6 mapping are unchanged. Guest metadata uses existing DOM beside existing cards; local identity remains above its cards. There are no final Seat Unit/HUD components, new public values or controller actions.

The visible-image/card bounding-box coverage proxy rises from approximately6.15% to11.72% in the dealt direct captures. This is a bounded layout proxy, not painted-pixel coverage or owner visual acceptance. Scene width remains1248px; scene height is not materially reduced. Do not claim that a smaller table container solved the issue. Real content sizing, central arc-depth spacing, compact status/dock spacing, quieter header and native round wager/chip/Deal styling drive the change. The outer outline remains visible; it was not prioritized over content. No whole-scene transform or CSS zoom is used.

## Executed checks and remaining gates

| Gate | Status | Evidence |
| --- | --- | --- |
| Final affected UI | PASS/exit0,8 files/46 tests | [repair10-focused-ui.json](repair10-focused-ui.json) |
| Final M10/M10A/M9/PA1 Chromium | PASS/exit0,22 tests | [repair10-focused-browser.json](repair10-focused-browser.json) |
| Typecheck and lint | PASS/exit0 | [typecheck](typecheck.json), [lint](lint.json) |
| Read-only PA1 source/production reproduction | PASS/exit0 | [asset stdout](assets.log.gz), protected hashes |
| Desktop/tablet/mobile, no page overflow,44px targets, native wager/funds/action/result/wager-focus | PASS in focused cases | Original assertions retained; new M10A-E02 appended |
| 200% text, failed portraits,5 cards/4 split leaves | PASS in focused cases; inspected | Final focused captures and receipts |
| Native browser200% zoom/keyboard | PASS/exit0 | [zoom200.json](zoom200.json),9 viewport clips inspected |
| Contrast | FAIL/exit1 | Inscription4.476:1; no threshold weakening |
| Full Vitest | NOT RUN | Stopped before full regression; expected79/1050 unchanged |
| Full Chromium | NOT RUN | Expected69 = incoming68 + one appended case; not an executed result |
| Independent M1–M8 preservation | NOT RUN | Current full historical harness not executed |
| Final scripts/verify.ps1 | NOT RUN | Required contrast gate failed at repair limit |
| Same-session scope/protected review | PASS when recorded | [protected.json](protected.json); never a fresh review |
| Fresh independent review / deployment | NOT RUN / NOT RUN | No delegation or deployment |

Native zoom uses actual chrome.tabs.setZoom/getZoom2.0: observed CSS viewport1280x723 ->640x361, DPR1.5 ->3, root font16px/CSS zoom1 unchanged. The native desktop screen constrains its viewport;1280x900 primary control visibility is separately proven by focused Chromium (Stand bottom890.71875 <=900).

## Cumulative ledger — no reset

| Cycle | Evidence / falsifiable cause / change | Outcome |
| --- | --- | --- |
| Incoming1–3 | Previously published evidence-tool repairs | Retained unchanged;3/10 incoming |
| 4 | Owner visual rejection; enlarge real footprints and reduce detached native-form appearance | UI8/46 PASS; first Chromium16 PASS/6 FAIL; seat intersection/local identity order/wrong new locator; historical atomic restore FAIL |
| 5 | Narrow guest shell4px, retain local identity above cards, compact existing guest metadata, fix only appended locator; native restore attempts | Native known-byte24/25 restore succeeded; final mapped M9 file rejected truncation; no historical bytes discarded |
| 6 | Recover final M9 file by checked atomic replacement; route only25 known historical output destinations into owned run-scoped storage | Recovery PASS; preload FAIL before browser launch (backslashes consumed); stale collected outputs explicitly qualified |
| 7 | Use forward slashes in NODE_OPTIONS; no product change | Historical25 hashes unchanged; Chromium18 PASS/4 FAIL, Stand937.625 >900 |
| 8 | Explicitly bind guest metadata rows to eliminate Grid auto-placement space | Chromium20 PASS/2 FAIL, Stand904.71875 >900 |
| 9 | Remove status padding/bottom margin without changing text/buttons | UI8/46 and Chromium22 PASS; screenshot inspection found200%-text inscription/identity overlap and pale hover chip |
| 10 | Move existing desktop inscription under enlarged text; retain dark hover background; append independent contrast and text-overlap assertions | UI8/46/Chromium22/type/lint/native zoom PASS; general scene contrast FAIL4.476 <4.5; STOP |

Cycles4/5/8/9/10 concern product presentation; cycles1/2/3/6/7 concern evidence tools. Repairs remain10/10; planning2/10 CLOSED and historical M10-T0111/11 OWNER-AUTHORIZED EXCEPTION remain separate. There is no authorization for cycle11.

The repair10 cause probe's hover sample was taken during the original150ms background transition and returned6.1905 PASS; it is not a failed settled-hover measurement. The same probe independently proved the200%-text intersection and returned FAIL/exit1. Final M10A-E02 uses reduced motion and independently checks settled chip contrast >=4.5 at all three sizes. Failed source snapshots/logs/traces and original administrative failures remain retained.

## Evidence handling

[before.json](before.json) snapshots870 incoming tracked paths. Only CSS, one appended browser case and six current documentation files are allowed to change. Domain/controller/RNG/shoe/cards/accounting/turn order/replay/digest/journal/strategy, PA1 sources/production/provenance, all17 canonical PA1 PNGs, pure geometry and all101 prior M10A evidence files match incoming hashes. The final executable inventory is frozen in [executables-pre-final.json](executables-pre-final.json).

The first focused run still used original historical writers; originals were retained before native recovery. Later runs preload [evidence-route-driver.txt](evidence-route-driver.txt), matching only25 exact absolute historical M9/M10 output paths and routing those writes/copies into an owned .git run directory. Original source tests/assertions and canonical PA1 are unchanged; fresh outputs are retained by hash after server exit. [verification-runner.txt](verification-runner.txt) checks child and administrative exits separately. This does not establish the unknown Windows handle owner/root cause. A Vite watch EBUSY encountered while adding a new source snapshot is also retained; later native captures use owned .git output while the server runs.

Raw logs are losslessly gzipped with verified round trips. Failed source versions, traces, generated images and diagnostic receipts are preserved, including partial/stale collection qualifications. The bounded privacy review checks changed/new text/log records for credential patterns; controlled public fixture screenshots contain simulated values only. No raw private session records or secrets are introduced.
