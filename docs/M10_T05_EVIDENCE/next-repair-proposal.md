# Unapplied repair11 proposal

Owner authorization is REQUIRED. T05 cumulative repair count is10/10; no repair11 is authorized or executed. Do not relabel the same failure or reset the count.

The final unified run failed only because existing M9-E01 tried to write `docs/images/m9-table-768.png` and Windows returned `UNKNOWN: open`. This is not proof of a gameplay failure, nor proof of which process/handle caused it. Full148/149 Chromium and all1193 Vitest passed; complete M1–M8 preservation passed. The complete gate remains FAIL/1.

The repository's previous task already retained a scoped Node evidence-write router. The attached [unapplied source](next-repair-route.cjs.txt) copies that mechanism with a task-specific configuration name; [configuration template](next-repair-route-config.json) lists only the25 known historical screenshot/geometry destinations. Source reads and every other write remain unchanged. New captures go to a fresh task-specific evidence directory, preserving both current evidence and original historical bytes. This is a proposed artifact-write workaround; Windows root cause is NOT PROVEN.

Final blocked-status documentation checks also FAIL (12/13 passed): the new README paragraph contains M8 preservation PASS followed by T06 NOT STARTED on the same line, triggering the existing broad stale-status regex. [Exact failure/source](blocked-document-failure.json) and [unapplied paragraph-only patch](next-repair-readme.patch). Separate the T06 paragraph without changing facts or the original regex/assertion. This additional documented blocker is included in the requested authorization scope; no fix or rerun has been applied.

After explicit repair11 authorization:

1. Confirm main/current SHA and all known T05 changes; preserve the current blocked receipt and exact runtime hashes.
2. Create a task-specific router/configuration outside runtime and use a per-command NODE_OPTIONS require for that router. Restore the prior environment in finally; do not leave a global setting. Inspect the25 exact resolved targets and record every routed write.
   Apply only the attached README paragraph separation and run the unchanged five-file documentation check; native exit must pass.
3. Run unchanged M9-E01 first: `npm.cmd run test:e2e -- tests/browser/m9.spec.ts --grep M9-E01`. Check native exit; verify all three original viewport assertions and actual screenshot files/dimensions. No retry, assertion, timeout, test-source or product change.
4. If affected verification passes, run the complete unchanged `scripts/verify.ps1`, retain failures as well as successes, verify all incoming protected bytes and exact runtime hashes, inspect/privacy-check new evidence and review the actual diff.
5. Commit/push only after the complete required gate PASS/0 and review. Otherwise stop; no repair12 is authorized by this proposal.

No installation, environment mutation, rerun, commit, push or deployment has been performed for this proposal. M10-T06 remains NOT STARTED — WAITING FOR OWNER APPROVAL.
