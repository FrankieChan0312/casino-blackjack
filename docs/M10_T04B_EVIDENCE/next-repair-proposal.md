# Proposed repair11 — not applied

Prepared 2026-10-05 12:02:21 +08:00; requires explicit owner authorization under AGENTS section9. No repository source/test change is made by this proposal.

Hypothesis: CB09 accumulates three viewports x three win/loss/push fixtures, repeated settlement/disclosure/NEXT/REPEAT/focus interactions and final low-fund checks within one30s test. The first full run passed28.1s; final run times out31.5s. Partition by viewport while retaining every fixture/assertion and unchanged30000ms per-case timeout. Timing beyond this observed aggregate budget is not independently proven.

Concrete patch:

```diff
-test('[M10A-CB09] compact terminal win/loss/push preserves results, credits, native disclosure, next/repeat and low-fund disabled behavior', async ({ page }, info) => {
+for (const viewport of viewports) test(`[M10A-CB09-${viewport.width}] compact terminal win/loss/push preserves results, credits, native disclosure, next/repeat and low-fund disabled behavior`, async ({ page }, info) => {
-  for (const viewport of viewports) for (const [fixture, net, available, result] of [
+  for (const [fixture, net, available, result] of [
```

All remaining source/scenario/assertion body bytes retained, with exact inverse-transformation proof. The existing final low-fund block remains inside each parameterized test and runs at all three selected widths. Case inventory140 ->142. No production/artwork/CSS/controller/dependency/settings change; no timeout increase, skip or retry-until-green.

If authorized: apply once -> affected CB09 three cases -> full verify.ps1 (Vitest91/1164,Chromium142,independent M1–M8) -> scoped diff/hash/privacy review -> commit/push only if entire gate PASS -> stop for owner human visual acceptance. Authorization is for one additional repair cycle, not unlimited repairs or acceptance/Motion/T05/deployment.
