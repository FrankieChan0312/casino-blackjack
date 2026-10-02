# PA1 genuinely fresh independent review handoff

Status: prepared for a NEW session with an independent reviewer. Review NOT RUN here. This implementation session cannot provide its own fresh review; no subagent or same-session reread is presented as independent review. Owner acceptance remains separate: M1-M8 and RA1 HUMAN ACCEPTED; M9 HUMAN ACCEPTED: NO; PA1 HUMAN ACCEPTED: NO. Deployment NOT RUN. No M10.

Repository only: `C:\Users\user\Documents\GitHub\casino-blackjack`; branchmain, existing origin `https://github.com/FrankieChan0312/casino-blackjack.git`. Compare against pre-PA1 `e8e8e2e1586611473f0cdb94540ce995d9bd64e7`. Review target is the FINAL published main/origin HEAD named in STATE's publication receipt and final delivery, including any normal evidence-only receipt after the substantive T07 checkpoint. Before review record actual branch/HEAD/origin/status; require0/0 and clean including untracked. Do not review an unnamed moving branch.

Recommended GPT Sol6.1 / High; confirm actual client availability separately. Implementation runtime model/effort NOT VERIFIED / NOT VERIFIED. Repair ledger T01..T07 `1,1,2,3,2,0,2` (each/10); historical M8/M9/RA1 ledgers unchanged. Source availability was not a repair. T07 repair1 fixes Windows inline-command quoting with a read-only asset-check script; repair2 restores the README regression-range fact required by unchanged accepted portfolio tests. No history rewrite.

## Read before conclusions

Read AGENTS.md, SKILL.md, docs/RULES.md, SPEC.md, DESIGN.md, PLAN.md, STATE.md and UX_UI.md in that order. Then PA1_CONTRACT, PA1_ASSET_AUDIT, PA1_SOURCE_AUDIT.json, PA1_ASSET_PIPELINE, PA1_PRESERVATION, PA1_MAPPING, PA1_EVIDENCE, PA1_SCREENSHOTS and DEVELOPMENT_LOG. Inspect the actual baseline-to-target diff, not only this summary. Earlier status blocks are historical; retain failed attempts. The owner supplied complete originals beneath authoritative `art/source/characters/PA1_character_sources`; no relocation or source edit occurred.

## Review priorities

1. Independently inspect ALL12 original PNGs and ALL12 production portraits. Confirm RGBA/material transparency, readable decode, exact identity/filename/dimensions/hash/no duplicates/unexpected text metadata; no baked background/scenery/text/logo/frame/nameplate/banner; clear face/bust/quality. Especially verify new Lucien/Celestine replacements. T01 preserves original C2PA metadata but does not claim cryptographic provenance verification. Do not admit a failed source through CSS.
2. Rerun pinned exact-byte production reproduction. Sources/receipts and committed outputs must match. Nodev24.19.0, Playwright1.63.0, bundled Chromium153.0.8010.12; fail on mismatch instead of silently upgrading or regenerating receipts.
3. Read presentation chooser/model and UI state. Confirm production crypto never consumes gameplay RNG; default Roland; guest uniqueness/human exclusion; collision exchange affects only collided guest; stable normal rounds/Repeat/Deal Again; explicit successful reset permitted. Confirm native selector remains secondary and cannot issue a game command or move funds.
4. Confirm domain diff EMPTY and full controller equality after ONLY the three presentation-session-marker inserts. Review marker exclusion from gameplay journal/digests/audit, existing computer decisions, all replay golden fixtures and PA1-E02 full JSON equality. Review historical test-input adapters against PA1_PRESERVATION; retain all original assertions and the two narrowly authorized portrait-query label changes.
5. Inspect actual desktop/tablet/mobile and all avatar screenshots; keyboard focus/44px/reduced-motion/card secrecy. Reproduce failed-image/enlarged-root-text checks. This is bounded Chromium coverage, not comprehensive assistive-technology/WCAG certification; older decorative card corners/pips can extend with enlarged text while primary rank/suit stays visible.
6. **Unresolved execution history:** T05 first official run exitedFAIL/1 at23:05:30; failing current-browser detail was lost through output truncation and later preservation reports. Cause NOT ESTABLISHED, no host explanation claimed. Targeted RA1/current61-case diagnostics and the fully captured T05 official run passed unchanged; T06 full63-case official run passed. Preserve the initial failure and independently run the final official harness with complete retained output. Do not infer universal stability or erase failure from later PASS. T02 confirmed host standby and T03 failed/assisted cleanup attempts are separately recorded; do not conflate them with T05.

## Required commands and actual exit checks

```powershell
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git rev-list --left-right --count HEAD...origin/main
git status --short --untracked-files=all
node scripts/audit-character-sources.mjs
node scripts/build-character-assets.mjs --check
node scripts/verify-character-assets.mjs
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
git diff --check
git diff e8e8e2e1586611473f0cdb94540ce995d9bd64e7 -- src/domain
git diff e8e8e2e1586611473f0cdb94540ce995d9bd64e7 -- src/browser/controller.ts
git status --short --untracked-files=all
```

Git ownership in the implementation sandbox required a per-command `-c safe.directory=C:/Users/user/Documents/GitHub/casino-blackjack`; no permanent configuration change was made. Review can use normal owner-context Git. Official harness includes independent M1-M8 preservation; current M9 and RA1 tests remain in full Vitest/Chromium. Expected current inventory76/1031/63; inventory is not evidence. If ANY failure occurs, retain complete output/artifacts and diagnose before repairs; never disable assertions or retry an unexplained unstable case until it happens to pass.

Report targetSHA, actual commands/exits, findings with severity/file/line/reproduction/impact, asset disposition and preservation results. A NO FINDINGS technical result does not accept PA1/M9 or deploy. STOP after the review report; owner alone decides acceptance. Do not start M10.
