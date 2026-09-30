# Local replay v1

Engineering/demo only; memory-based, no persistence, sync or production recovery.

`createReplaySession(seed, profileId, options)` initializes the explicit profile, uint32 seed and MULBERRY32_REJECTION_V1. Configuration records starting units (2000), HUMAN presence and developer demo-fault permission. Initial shoe identity is `local-shoe-1`; replacement identity derives from round number. There are no wall-clock inputs or undocumented random defaults. Round numbers, fund defaults and rules are versioned by replayVersion=1 and the profile ID.

Entries have contiguous sequence numbers starting at 1 and typed intent commands. CONFIGURE, OPEN, MAIN/SIDE/BACK (zero cancels), CLOSE, ACT, ACE, FOLLOW, ADVANCE, SETTLE, VOID and NEXT invoke real M6 handlers. Explicit developer CONTROLLER commands use owner-checked M6 primitives for advanced follower demonstrations; normal bots remain Hit/Stand-only. No state snapshot is accepted. The decoder rejects unknown keys/types, malformed JSON/configuration, unsupported version/algorithm, unknown commands and invalid sequences; handler rejection reports the failing sequence/reason. Maximum 10000 entries.

Developer-only DEMO_DRAW_FAULT is enabled only by explicit `demoFaults=true`. It records an unavailable subsequent draw in an active player phase and conserves physical accounting. It cannot itself VOID a valid round: a real required-draw handler must reach integrity failure first. This is controlled fault evidence, not player recovery. Normal browser controls never send this command. Arbitrary hidden state/card order is never imported.

Financial terminal boundaries COMMITTED/VOID allow `exportPackage`. Prior round outcomes are retained immutably; NEXT requires finalization. The package contains replayVersion, configuration, ordered commands and outcomeDigest. The seed can reconstruct hidden/future cards, so the package is separate from safe public state and unavailable in active-round UI. Internal getState is an explicit developer/domain orchestration boundary and must never reach React.

Outcome fingerprint: `fnv1a32-v1:xxxxxxxx`, FNV-1a uint32 over the UTF-16 code units of canonical JSON (sorted object keys, ordered arrays, omitted undefined fields). Selected outcome data includes profile, terminal public state, all committed own/table/follower result records and participant balances, across every finalized round. No timestamps. The fingerprint is deterministic comparison evidence, not cryptographic authentication. Replaying independently computes it and rejects mismatch.

Known supported seeds: 0 for Ace/Insurance demonstration, 21 for legal Charlie after three Hits, 36 for a non-Ace split (3,3 against 10,2). Tests use explicit expected results; seeds do not promise a particular optimal strategy. Do not expose PRNG state or add prediction controls.
