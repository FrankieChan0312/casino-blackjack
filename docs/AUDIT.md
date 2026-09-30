# Public audit v1

An observational local trail, not an event-sourced database. `createAuditTrail` observes real before/result transitions. `createReplaySession` records accepted commands and audit rejection attempts separately; rejected intents do not mutate gameplay or enter the successful replay journal.

Every public event is frozen, and returned event arrays are frozen snapshots. Schema `auditVersion=1` explicitly includes sequence, ISO UTC timestamp, type, profileId, roundId, actorId, seat, handId, wagerId, commandId, amountUnits, returnedUnits, outcome, status and reason. Nullable fields mean not applicable. Sequence is contiguous within a session and authoritative for order; timestamps may be identical. The default clock calls runtime Date.toISOString; tests inject UTC strings. Clocks without UTC are rejected.

Categories include session/profile start, seat configuration, wager target change/cancel, OPEN/CLOSE/initial deal, Insurance/Even Money/decline, human and observed computer Hit/Stand, Double/Split and child attribution, Surrender, follower decisions, Charlie, dealer completion, settlement/refunds, integrity fault, NEXT and explicit replay start/completion. Command IDs identify attempts, including rejections. Human main/side choices use local-human; target controller primitives and computer mains use the actual owner; back financial decisions/results use the follower. System progression/commit and dealer completion are labelled separately.

Amount units are half credits. Wager SET records the target stake; action amounts identify affected/existing stake (Double's matching addition); settlement/refund records contain actual funded stake and gross return. Follow amounts identify attached stake; effective funding/exposure is authoritative in final result records. No current-round pending return becomes available credit because of audit.

The public schema never accepts card objects, ranks/suits, physical card IDs, future order, discarded ownership, seed or PRNG state. Even a VOID event does not reveal a previously hidden hole. Full deterministic replay packages live behind a separate COMMITTED/VOID export boundary and must not be confused with this safe trail. Prior-round events stay immutable when NEXT starts new play; a deliberate new session/reset creates a new trail and explicitly restores simulation starting credits.

Scope is local memory only. No audit authenticity, tamper resistance, certification, server authority, persistence, gambling compliance or production recovery claim.
