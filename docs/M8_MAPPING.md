# M8 executable regression mapping

REG-M8-001..096: 83 Vitest requirements and 13 real Chromium scenarios. Every ID has one literal executable owner; m8Regression verifies exact range, uniqueness, non-skipped registrations and exact document rows. REG-092 adds cascade refund audit;093..096 add bounded replay/atomic browser/defensive replay/current-document requirements. Existing owners retain their semantic coverage; REG-036 and REG-059 are strengthened. Mechanical mapping is not independent review.

Profiles/RNG 001..007; Charlie 008..024; replay 025..042; audit 043..059; browser controller 060..066; seeded invariants 067..073; contracts 074..076; harness failure propagation 077..078; browser UX/secrecy/keyboard/mobile 079..091; cascade cancellation audit092; replay cap093; browser atomic cap094; replay validation defense095; current-document consistency096.

Full harness also preserves M1-M7 independently through verify-preservation.ps1, current domain isolation and production fixture exclusion. Historical M7 REG-002/003 absence is anchored to accepted da6f068f; all current gameplay/secrecy assertions and accepted browser cases still execute. T08 adds separate portfolio links/command/privacy tests and reproducible public screenshot generation without manufacturing duplicate REG owners. Expanded current inventory: 66 Vitest files/956 tests and 38 Chromium (including 24 accepted M7, 13 M8, 1 portfolio scenario); actual checked execution status is in STATE/log. Independent reviewer recheck is a separate fresh-session gate in M8_REVIEW_HANDOFF.md.

| ID | Executable file | Exact test title |
| --- | --- | --- |
| REG-M8-001 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | two immutable narrow profiles identify Classic OFF and Charlie ON |
| REG-M8-002 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | default Classic and explicit Classic create identical sessions |
| REG-M8-003 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | Mulberry32 uint32 known vector seed 1 |
| REG-M8-004 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | same seed repeats and different seeds give different controlled sequences |
| REG-M8-005 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | seed validation rejects non uint32 values, bounds validate before consuming |
| REG-M8-006 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | seeded shuffle has explicit small vector and identical full shoe/cut |
| REG-M8-007 | [tests/unit/profileRandom.test.ts](../tests/unit/profileRandom.test.ts) | seeded mode never uses Math.random and public projection contains no RNG state |
| REG-M8-008 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Classic five-card 20 is ordinary and remains playable |
| REG-M8-009 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Charlie five-card 20 is fixed, terminal and pays actual stake 1:1 exactly once |
| REG-M8-010 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | fifth-card 21 is only Charlie, never Natural or stacked award |
| REG-M8-011 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | fifth-card 22 bust precedes Charlie |
| REG-M8-012 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | exactly four cards below 21 are active without Charlie |
| REG-M8-013 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | three-card 21 stops before any Charlie chase |
| REG-M8-014 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | four-card 21 stops before any Charlie chase |
| REG-M8-015 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Dealer Natural resolves before player Hit in Charlie profile |
| REG-M8-016 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | fixed Charlie requires no dealer draws or total comparison |
| REG-M8-017 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | non-Ace split child Charlie and sibling independent in depth-first order |
| REG-M8-018 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Split Aces restrictions prevent Charlie chase |
| REG-M8-019 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Double draws one card then ends, never Charlie chase |
| REG-M8-020 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Bet Behind Charlie uses follower actual stake and side results remain independent |
| REG-M8-021 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | Pair and Three-card records remain identical after Charlie Hits |
| REG-M8-022 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | whole-round draw fault clears fixed Charlie and VOID refunds every actual stake once |
| REG-M8-023 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | split follower ADD pays Charlie on first actual child and independent second-child bust |
| REG-M8-024 | [tests/integration/charlie.test.ts](../tests/integration/charlie.test.ts) | split follower NO_ADD receives only first-child Charlie on original actual stake |
| REG-M8-025 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | Classic package repeats final public state and exact result records |
| REG-M8-026 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | Charlie replay reproduces a legal Hit producing the fifth card with exact 1:1 outcome |
| REG-M8-027 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | split replay routes real handlers and preserves leaf records |
| REG-M8-028 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | Insurance replay records real independent purchase and result |
| REG-M8-029 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | Bet Behind replay retains separate actual follower stake |
| REG-M8-030 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | follower ADD replay uses owner-checked Split and actual two child stakes |
| REG-M8-031 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | follower NO_ADD replay tracks only first child |
| REG-M8-032 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | explicit developer draw-fault evidence reproduces real VOID and refund once |
| REG-M8-033 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | demo fault is rejected by default and changes no state |
| REG-M8-034 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | multiple rounds replay preserves ordered archived results and persistent shoe |
| REG-M8-035 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | unsupported replay version is explicitly rejected |
| REG-M8-036 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | malformed JSON, missing schema, unsafe snapshot keys and invalid seed reject |
| REG-M8-037 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | unknown command rejects at exact sequence |
| REG-M8-038 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | invalid authoritative command sequence fails with number and reason |
| REG-M8-039 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | replay neither mutates frozen source package nor restores a state snapshot |
| REG-M8-040 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | canonical fingerprint has known vector, sorted keys and preserved array order |
| REG-M8-041 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | tampered outcome fingerprint rejects; replay packages have no timestamp dependency |
| REG-M8-042 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | pre-terminal public state has no seed/shoe order/IDs; export requires financial terminal |
| REG-M8-043 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | audit sequence is contiguous and authoritative even for identical injected UTC times |
| REG-M8-044 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | audit clock rejects timestamps without explicit UTC |
| REG-M8-045 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | accepted Hit carries actor round seat hand wager action ID and stake |
| REG-M8-046 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | rejected Split appends diagnostic without gameplay mutation |
| REG-M8-047 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Split attributes parent action and each ordered child separately |
| REG-M8-048 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Stand and Surrender record the exact human action |
| REG-M8-049 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Double attribution and settlement use actual funded doubled exposure |
| REG-M8-050 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Bet Behind follower ADD has follower actor, affected hand and original wager |
| REG-M8-051 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Insurance audit has independent decision, actor, amount and result |
| REG-M8-052 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Even Money audit is a main election with no extra funded stake |
| REG-M8-053 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | Charlie event is attributable and distinct from final settlement |
| REG-M8-054 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | VOID records actual integrity reason and attributed zero-profit refund |
| REG-M8-055 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | prior frozen events and next-round archive remain unchanged and sequence continues |
| REG-M8-056 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | public audit includes no hole, shoe order, physical card IDs or active seed/state |
| REG-M8-057 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | clock changes audit evidence without affecting replay digest or terminal equality |
| REG-M8-058 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | explicit replay audit boundaries retain ordering without changing gameplay |
| REG-M8-059 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | actual computer HIT/HIT/STAND is complete and Split supplements are not HIT decisions |
| REG-M8-060 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | new demo API exposes methods but no raw domain state or seed |
| REG-M8-061 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | profile cannot change in active round and invalid seed rejects atomically |
| REG-M8-062 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | full replay package is inaccessible until real final settlement |
| REG-M8-063 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | browser replay reproduces original results without changing original archive |
| REG-M8-064 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | next round removes replay result and export availability while preserving prior audit |
| REG-M8-065 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | seeded browser sessions reproduce cards and results; deliberate reset restores credits with event |
| REG-M8-066 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | unseeded demo keeps normal randomness and rejects early package requests |
| REG-M8-067 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | 256 seeded shoes contain 312 distinct IDs and every draw is without replacement |
| REG-M8-068 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | 256 seeds reproduce shoe and cut, all cuts stay 219..249 and outcomes do not collapse |
| REG-M8-069 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | cut crossing preserves shoe identity and position throughout seeded draws |
| REG-M8-070 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | 256 three-round sessions conserve cards/funds/reservations, settle once and replay equally |
| REG-M8-071 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | 256 explicit fault sessions conserve actual stakes and VOID exactly once with replay equality |
| REG-M8-072 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | controlled legal Hit producing the fifth card across both profiles: exact Charlie eligibility/payout/terminal and no stacked Natural |
| REG-M8-073 | [tests/integration/m8Invariants.test.ts](../tests/integration/m8Invariants.test.ts) | Charlie follower result retains actual exposure through seeded replay |
| REG-M8-074 | [tests/unit/m8Contract.test.ts](../tests/unit/m8Contract.test.ts) | M8 profile RNG replay audit and UX documentation matches implemented identifiers and safe boundary |
| REG-M8-075 | [tests/unit/m8Contract.test.ts](../tests/unit/m8Contract.test.ts) | runtime source and package have no network persistence auth payment or deployment capability |
| REG-M8-076 | [tests/unit/m8Contract.test.ts](../tests/unit/m8Contract.test.ts) | public project text makes no affirmative RTP house-edge certification or production gambling claims |
| REG-M8-077 | [tests/unit/m8Harness.test.ts](../tests/unit/m8Harness.test.ts) | full project harness propagates independent preservation failure instead of claiming PASS |
| REG-M8-078 | [tests/unit/m8Harness.test.ts](../tests/unit/m8Harness.test.ts) | full project harness BLOCKED when required preservation tool is missing |
| REG-M8-079 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | Classic five-card hand has no Charlie result and can continue |
| REG-M8-080 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | Charlie profile is selected explicitly before seeded play |
| REG-M8-081 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | five-card Charlie presents normal 1:1 return and ends actions |
| REG-M8-082 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | fifth-card 21 says Charlie Win rather than Blackjack |
| REG-M8-083 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | profile and seed controls cannot change during active hidden-card round |
| REG-M8-084 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | same seeded browser run reproduces public cards and terminal return |
| REG-M8-085 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | replay JSON is available only at finalized seeded boundary and removed on next round |
| REG-M8-086 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | completed replay reproduces result, is clearly marked and preserves original |
| REG-M8-087 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | public audit displays ordered attribution UTC amounts refunds and pre-round seat occupancy |
| REG-M8-088 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | active audit leaks no known hole identity, physical ID, seed or future shoe |
| REG-M8-089 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | active seeded DOM and accessible output omit seed value and replay package |
| REG-M8-090 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | M8 tools and replay JSON remain usable at 320px without overflow |
| REG-M8-091 | [tests/browser/m8.spec.ts](../tests/browser/m8.spec.ts) | keyboard opens advanced settings, chooses profile and starts seeded session |
| REG-M8-092 | [tests/integration/audit.test.ts](../tests/integration/audit.test.ts) | MAIN cancellation records actual MAIN and dependent SIDE/BACK refunds with owner wager amount and shared command attribution |
| REG-M8-093 | [tests/integration/replay.test.ts](../tests/integration/replay.test.ts) | exact replay cap exports and replays without truncation and rejects excess intents atomically |
| REG-M8-094 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | reviewer boundary completes at 10000 and rejects a two-intent overflow before any mutation |
| REG-M8-095 | [tests/integration/browserDemo.test.ts](../tests/integration/browserDemo.test.ts) | defensive replay validation failure hides availability and preserves original finances and audit |
| REG-M8-096 | [tests/unit/m8Contract.test.ts](../tests/unit/m8Contract.test.ts) | eight current documents distinguish completed reviews closed findings and pending batch2 closure |
