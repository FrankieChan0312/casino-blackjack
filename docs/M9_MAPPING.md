# M9 acceptance and executable evidence

M9 NOT ACCEPTED; genuinely fresh review and human judgment remain separate gates. The current suite has **68 Vitest files / 978 tests**, **1 Chromium project / 55 tests**. M9 owns 19 controller/component examples, 3 document/coverage checks and 11 Chromium scenarios. Execution status is in [M9_EVIDENCE](M9_EVIDENCE.md).

| AC | Evidence and outcome |
| --- | --- |
| AC-M9-001 | [M9-001/003, session.test.ts](../tests/m9/session.test.ts), [E07, m9.spec.ts](../tests/browser/m9.spec.ts): real default opens prepared Player Mode table before configuration |
| AC-M9-002 | [E01/E09, m9.spec.ts](../tests/browser/m9.spec.ts): own cards larger, near edge, below guests; split children remain distinct |
| AC-M9-003 | [E01/E02, m9.spec.ts](../tests/browser/m9.spec.ts): dealer horizontally centered, original professional female illustration present |
| AC-M9-004 | [M9-003/004](../tests/m9/session.test.ts), [E02/E07](../tests/browser/m9.spec.ts): three visible original evening-attire computer guests |
| AC-M9-005 | [M9-005/014](../tests/m9/session.test.ts), [E03/E07](../tests/browser/m9.spec.ts): initial/next round automatically prepare the same seats |
| AC-M9-006 | [M9-003/004/011](../tests/m9/session.test.ts), [E03/E07](../tests/browser/m9.spec.ts): independently funded guest wagers, human-only primary form |
| AC-M9-007 | [M9-011..015/019](../tests/m9/session.test.ts), [E03/E06/E11](../tests/browser/m9.spec.ts): one-step own Deal, original MAIN repeat, optional stakes separate, insufficient funding clear |
| AC-M9-008 | [M9-006..010](../tests/m9/session.test.ts), [E03/E08/E10](../tests/browser/m9.spec.ts): automatic guests/dealer, explicit human/Insurance/follower pause, exactly-once terminal settlement/VOID |
| AC-M9-009 | [M9-016/017](../tests/m9/session.test.ts), [E04/E05/E07](../tests/browser/m9.spec.ts): outer native tools closed by default, explicit safe manual mode, seed/replay/audit reachable |
| AC-M9-010 | [E01/E02/E07](../tests/browser/m9.spec.ts), [screenshots and human checklist](M9_VISUAL_CHECKLIST.md): felt/rail, dealer, seated guests, near-edge own hand; human aesthetic judgment NOT RUN |
| AC-M9-011 | [CasinoPerson.tsx](../src/ui/CasinoPerson.tsx), [E02](../tests/browser/m9.spec.ts): original code-native SVG, professional fictional figures, no external art or identifiable-person reference; source inspected |
| AC-M9-012 | [E01/E02/E09](../tests/browser/m9.spec.ts): 1280/768/320 geometry, no horizontal overflow, desktop/tablet decisions visible; narrow mobile vertical scroll/expandable guest cards |
| AC-M9-013 | [E02/E04/E06/E08](../tests/browser/m9.spec.ts), [M9-006/008/015/018](../tests/m9/session.test.ts): semantic cards, hidden hole identity, reduced motion, live feedback, visible keyboard focus and safe command/reset boundaries |
| AC-M9-014 | [verify-preservation.ps1](../scripts/verify-preservation.ps1), [check-m8-preservation.mjs](../scripts/check-m8-preservation.mjs): independent accepted M1-M8 reruns and original assertion/source comparison, domain diff empty |
| AC-M9-015 | [documentation.test.ts](../tests/m9/documentation.test.ts), [M9 evidence](M9_EVIDENCE.md): current acceptance/inventory, real ledgers, AC/link/screenshot checks and review handoff |

## Preservation boundary

Accepted M8 SHA is `8f5aca327f41f1078fc4fef20b611fd9cd494492`. All original assertions remain; no skip/retry/timeout weakening. REG-M8-096 historically asserts pre-acceptance status/inventory. Only its document inputs now read this immutable Git snapshot, and its inventory excludes added M9 files. Its original test title remains for the accepted exact-ID mapping. The preservation checker removes only these explicit input adapters and requires the entire original source to match byte-for-byte (normalized line endings). Every other accepted test/spec source matches directly. Current M9 document/inventory checks operate on current files, so stale present-day status cannot be hidden by that historical boundary. Domain source must match accepted M8 exactly. The complete accepted M8 956 Vitest / 44 Chromium inventory executes independently in the official harness, after M1-M7 preservation.

All scenarios use real domain handlers; deterministic fixtures specify known ranks/explicit returns and preserve physical six-deck accounting. Browser fixtures remain excluded from production builds. Automation expands real commands without artificial timing or fabricated cards.
