# HARNESS-H1 execution evidence

**HARNESS_H1_RESTORATION_MAINTENANCE_VERIFIED** — technical verification; human acceptance PENDING. H1 repair **1/10**, M15 remains **7/10**. Original `UNKNOWN/-4094/open` root cause **STILL UNKNOWN**. [Task/protocol/repair contract](../HARNESS_H1.md).

**Publication BLOCKED.** Local implementation commit `7802be29a9a21715a60c6980055913031453019a`; two normal origin/codex/harness-h1 pushes FAIL/1, both rejected by GitHub `Internal Server Error`; remote read PASS/0 confirms branch absent. No more attempts. [Publication receipt](publication-blocked.json), [commit log](primary-commit.txt), [first push failure](primary-push.txt), [intervening branch read](after-push-failure-remote.txt), [second push failure](primary-push-second.txt). Local docs-only checkpoint retains these failures without changing verified source. Publication/acceptance/integration are separate from technical verification.

| Verification | Status / exit | Evidence |
| --- | --- | --- |
| Original helper normal PNG/JSON reproduction | PASS / 0 | [Exact historical source](legacy-preserve-output.cjs), [record](legacy-reproduction.json), [native stdout](legacy-stdout.txt) |
| New focused fixture matrix, first run | PASS / 0, 18/18 | [Native output](focused-first.txt) |
| Scoped lint, first actual run | FAIL / 1, ten missing imports | [Original failure](lint-first.txt) |
| Repair1 focused fixtures | PASS / 0, 18/18 | [Native output](focused-repair1.txt) |
| Repair1 scoped lint | PASS / 0 | [Native output](lint-repair1.txt) |
| Existing harness before real restoration | PASS / 0, 3 files/11 cases | [Native output](existing-harness-tests.txt) |
| Real preflight | PASS / 0 | [22 targets/backup hashes, prior archives, preflight generated copies](real-preflight.json), [incoming-manifest differences](pre-restore-manifest-diff.json) |
| Real failed PNG and remaining outputs | PASS / 0, one attempt each | [Attempt guard](real-attempt.json), [result](real-result.json), [per-file completion](completed.jsonl), [native output](real-validation.txt) |
| Independent full historical/dirty-tree audit | PASS / 0 | [Audit source](audit-restoration.mjs), [receipt](final-integrity.json), [native output](final-integrity.txt) |
| Focused fixtures after real restoration | PASS / 0, 18/18 | [Native output](focused-final.txt) |
| Existing harness after real restoration | PASS / 0, 3 files/11 cases | [Native output](existing-harness-final.txt) |
| Final scoped lint including audit/one-shot runner | PASS / 0 | [Native output](lint-final.txt) |
| Syntax/product-scope/27local links/source and raw evidence hashes | PASS / 0 | [Prepublication receipt](prepublication-checks.json) |
| Aggregate raw-evidence whitespace | FAIL / 2, retained native CRLF/blank EOF only | [Exact failure](staged-raw-whitespace.txt), [classification](whitespace-classification.json) |
| Authored source/docs/attributes whitespace | PASS / 0 | [Scoped receipt](whitespace-classification.json) |
| Publication privacy over36files | PASS / 0, no findings/exclusions | [Native log](privacy-publication.txt), [receipt](privacy-publication.json) |
| M15 complete product gate / scripts/verify.ps1 | NOT RUN | Owner requires harness verification first; no product gate resumption |
| Genuinely fresh-session review | NOT RUN | Same-session review only; no fresh-session result claimed |
| Human acceptance / integration / deployment | NOT RUN | Separate explicit owner decisions required |

Historical protected outputs **16,475/16,475** match original SHA256. Original partial set **20/20** restored. This H1 restored **22** outstanding files (the failed PNG plus 21 later untouched outputs). All other **19,138** incoming files remain byte-identical, from [19,160-file incoming snapshot](incoming.json). Original 20 generated archives, new 22 archives and their preflight copies preserved; 41 distinct relevant backups checked; zero success-path temporary artifacts. Main HEAD/branch and private M15 launcher unchanged. No product/gameplay/asset/timeout/assertion changes.

Failed PNG original and final target SHA256: `fb82b174f93685467c0b0fe9ae60e05795dddbd4a9b461bbcb711551d10b68f4`. Pre-restore generated and preserved archive SHA256: `f437eb6cec0d03406a3f2df65cef66085c14d4b563a8d680603738c04c71279c`. [Original read-only failure record](original-failure-readonly.json) remains unchanged.

Archives/backups remain in the primary checkout's private `.git/m15` and `.git/harness-h1`; receipts record their exact paths/hashes. Disposable fixtures remain in the OS temporary directory for inspection. No evidence was discarded. Raw `.txt/.json/.jsonl` and the historical helper use local `-text` attributes so Git cannot normalize their bytes.

Operational failures retained: [App worktree long-path error](worktree-creation-failure.json); first lint launcher package-resolution error is recorded in the task contract/tool transcript. Command-local Git long-path support and identical primary ESLint config resolved those setup conditions without changing product/dependency/configuration bytes. Authored lint failure remains separate and counted as H1 repair1.

The [one-shot runner](validate-real.mjs) refuses a second real attempt. Do not invoke it to retry or resume M15. Await owner authorization to integrate H1 and resume M15 Repair7 validation. No M16/deployment.
