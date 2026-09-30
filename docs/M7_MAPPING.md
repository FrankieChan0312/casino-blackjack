# M7 executable verification mapping

REG-M7-001..064: exactly 64 independently registered checks (40 Vitest architecture/controller/component checks and 24 Chromium scenarios). Each tagged test owns one REG ID; UX-01..14 each has one exact tagged executable owner. E2E-01..15 are scenario tags in the mapped Chromium tests. Additional assertions within a test do not inflate the ID count. The mapping completeness test independently parses test registrations and rejects missing, duplicated or skipped IDs.

| REG ID | UX ID | Executable file | Exact scenario title (after mapping tags) |
| --- | --- | --- | --- |
| REG-M7-001 | — | [tests/unit/domainBoundary.test.ts](../tests/unit/domainBoundary.test.ts) | current authoritative domain imports only domain modules and contains no rendering files |
| REG-M7-002 | UX-14 | [tests/unit/browserShell.test.tsx](../tests/unit/browserShell.test.tsx) | browser shell identifies the product and non-redeemable simulation credits |
| REG-M7-003 | — | [tests/integration/browserController.test.ts](../tests/integration/browserController.test.ts) | normal bootstrap exposes a seven-seat public session without raw state |
| REG-M7-004 | — | [tests/integration/browserController.test.ts](../tests/integration/browserController.test.ts) | injected real-domain bootstrap has exact public cards and hides known hole identity |
| REG-M7-005 | — | [tests/integration/browserController.test.ts](../tests/integration/browserController.test.ts) | rejected wager preserves the latest cards and funds with safe feedback |
| REG-M7-006 | — | [tests/integration/browserController.test.ts](../tests/integration/browserController.test.ts) | sequential commands retain the latest state rather than overwriting with stale snapshots |
| REG-M7-007 | UX-03 | [tests/integration/browserController.test.ts](../tests/integration/browserController.test.ts) | read-only action queries consume neither cards nor randomness and reject the same illegal direct action |
| REG-M7-008 | — | [tests/integration/browserController.test.ts](../tests/integration/browserController.test.ts) | subscribers see fresh safe snapshots and can unsubscribe |
| REG-M7-009 | UX-01 | [tests/unit/browserTable.test.tsx](../tests/unit/browserTable.test.tsx) | renders seven seats and explicit local/computer/empty identities |
| REG-M7-010 | — | [tests/unit/browserTable.test.tsx](../tests/unit/browserTable.test.tsx) | pre-reveal DOM and accessibility metadata contain only public dealer cards |
| REG-M7-011 | — | [tests/unit/browserTable.test.tsx](../tests/unit/browserTable.test.tsx) | one bust leaves another seat active and the dealer hidden until authorized reveal |
| REG-M7-012 | UX-05 | [tests/unit/browserTable.test.tsx](../tests/unit/browserTable.test.tsx) | sitting out and configuration/betting transitions have readable text |
| REG-M7-013 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | seat setup supports local seat selection, computer configuration and spectator mode |
| REG-M7-014 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | seated player can reserve MAIN and independent side wagers |
| REG-M7-015 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | spectator can back a funded computer seat without owning cards |
| REG-M7-016 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | own-target wager query and handler reject without changing funds |
| REG-M7-017 | UX-07 | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | available/reserved/pending remain separate and half credits render exactly |
| REG-M7-018 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | funding query does not mutate latest state and unfunded handler also rejects |
| REG-M7-019 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | cancel/change moves only actual delta and MAIN cancellation refunds sides |
| REG-M7-020 | — | [tests/unit/browserBetting.test.tsx](../tests/unit/browserBetting.test.tsx) | closed betting hides wager forms and direct late wagers reject |
| REG-M7-021 | UX-02 | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | current actions use authoritative availability and direct invalid Split remains rejected |
| REG-M7-022 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Hit displays exactly one new card and leaves a sub-21 hand active |
| REG-M7-023 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Stand ends local decisions without a card and keeps dealer advance distinct |
| REG-M7-024 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Double displays matching stake, adds one card, ends hand and prevents later Hit |
| REG-M7-025 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | insufficient Double is unavailable and rejection leaves funds/cards unchanged |
| REG-M7-026 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Split keeps ordered child hands visible with independent wagers |
| REG-M7-027 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Re-split labels remain stable for the existing sibling and match depth-first order |
| REG-M7-028 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Split Aces get exactly one added card each, ordinary 21 and no subsequent controls |
| REG-M7-029 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | Surrender shows returned half and lost half rather than full loss |
| REG-M7-030 | — | [tests/unit/browserActions.test.tsx](../tests/unit/browserActions.test.tsx) | terminal 21 protects cards while another computer seat can continue |
| REG-M7-031 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | Ace opens a dedicated pre-peek screen without known hidden rank/suit/ID |
| REG-M7-032 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | Insurance is funded independently and disappears after peek |
| REG-M7-033 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | eligible Even Money is distinct and adds no reserve |
| REG-M7-034 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | controlled Double follower screen uses real funded domain window, with no target gameplay controls |
| REG-M7-035 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | controlled Split NO ADD clearly tracks only first ordered child |
| REG-M7-036 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | controlled Split ADD funds both ordered children |
| REG-M7-037 | UX-13 | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | side results remain separate from main result |
| REG-M7-038 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | real required-draw failure becomes VOID/refund and never normal player loss |
| REG-M7-039 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | completed next-round preparation retains funds and existing shoe semantics |
| REG-M7-040 | — | [tests/unit/browserDecisions.test.tsx](../tests/unit/browserDecisions.test.tsx) | CLASSIC five-card hand remains actionable and never shows Charlie |
| REG-M7-041 | UX-11 | [tests/browser/accessibility.spec.ts](../tests/browser/accessibility.spec.ts) | [E2E-12] keyboard-only setup, wager, Hit/Stand and completion with visible focus |
| REG-M7-042 | — | [tests/browser/accessibility.spec.ts](../tests/browser/accessibility.spec.ts) | desktop has no horizontal overflow and primary controls meet touch height |
| REG-M7-043 | UX-12 | [tests/browser/accessibility.spec.ts](../tests/browser/accessibility.spec.ts) | [E2E-13] 320px mobile prioritizes the local hand without page horizontal overflow |
| REG-M7-044 | — | [tests/browser/accessibility.spec.ts](../tests/browser/accessibility.spec.ts) | reduced-motion still exposes controls, semantic names and secret-free card back |
| REG-M7-045 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-01] start a round and complete exact Hit/Stand flow |
| REG-M7-046 | UX-04 | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-02] known hidden rank/suit/physical ID absent from DOM and accessibility until reveal |
| REG-M7-047 | UX-06 | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-03] completed hand has no further gameplay controls |
| REG-M7-048 | UX-08 | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-04] insufficient available credits disable Double with a reason |
| REG-M7-049 | UX-09 | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-05] Split displays two ordered hands and activates the sibling after Stand |
| REG-M7-050 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-06] Split Aces have one added card each and no Hit/Double/Surrender |
| REG-M7-051 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-07] Surrender shows exact half returned and half lost |
| REG-M7-052 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-08] Ace choices are before peek and eligible Even Money is distinct |
| REG-M7-053 | UX-10 | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-09] one seat busts while another remains active and hole card stays hidden |
| REG-M7-054 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-10] independent side result survives a main loss |
| REG-M7-055 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-11] spectator follower cannot control target hand |
| REG-M7-056 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-14] CLASSIC five-card hand is not Charlie and can continue |
| REG-M7-057 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | [E2E-15] required-draw fault is interruption/VOID/refund with no normal winner |
| REG-M7-058 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | controlled Double follow ADD has exact funded exposure and matching result |
| REG-M7-059 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | controlled Split follow NO ADD tracks only ordered first child |
| REG-M7-060 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | unfunded follow ADD is disabled without vetoing NO ADD continuation |
| REG-M7-061 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | Insurance is separate and unavailable after peek; unfunded choice remains disabled |
| REG-M7-062 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | next round retains available funds and truthfully continues the same shoe |
| REG-M7-063 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | spectator setup places a real Bet Behind without an own MAIN or side bets |
| REG-M7-064 | — | [tests/browser/gameplay.spec.ts](../tests/browser/gameplay.spec.ts) | Re-split retains depth-first stable hand identities and completed leaves |
