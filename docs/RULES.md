# Blackjack House Rules v1.1

Document date: 2026-09-28  
Document task: RULES-1.1  
Intended repository location: `docs/RULES.md`  
Status: finalized rules text for planning; not an implementation, verification, acceptance, or deployment report.

## R01. Authority, profiles, and delivery boundary

This document defines this portfolio's own simulated-credit Blackjack rules. It is not an international standard, a reproduction of one provider's complete product, a gaming certification, or evidence of licensing. External references explain selected mechanics; the explicit choices below govern this project.

The target base profile is `CLASSIC_6D_S17_V1_1`. The optional, later demonstration profile is `CHARLIE5_6D_S17_V1_1`. The base profile does not award any Charlie bonus. Rules and paytables are immutable during a round and identified in its record.

Defined functionality is not necessarily implemented. `SPEC.md` must map each milestone to the applicable rule IDs and required checks. In particular, M1 remains a headless, one-seat foundation: cards, shoe, scoring, initial Blackjack resolution, Hit/Stand, S17, and deterministic tests. Wagers, extra seats, additional actions, side bets, and variants must not be advertised or exposed before their own verification.

This export has not been installed into a verified repository. Repository path, branch, commit, tests, fresh-session review, and push status have not been established by this document.

## R02. Table, seats, and participants

The target table has seven numbered seats and one dealer. A seat can be empty or controlled by one human or an explicitly labelled computer player. One participant controls at most one seat, but may also place permitted Bet Behind wagers on other seats. Spectators may place Bet Behind wagers without taking a seat.

Only seats with a valid, funded main wager at betting close receive cards. At least one such seat is required. All active seats play against the same dealer hand and consume the same persistent shoe. A player's hand ending does not end other hands or the table round.

Joining, leaving, changing controllers, and changing bot occupancy occur only between rounds, before betting opens. Occupancy is frozen through completion or voiding. A player may sit out a round. Bots may not appear, disappear, receive free extra credit, or be selected based on unrevealed cards during play.

The initial playable delivery is a local human with bots, or a local spectator watching bots. Separate-browser human multiplayer is a later, separately scoped feature. Seven modelled seats do not establish network multiplayer or a live human dealer.

## R03. Shoe and card identities

Use six standard 52-card decks: 312 physical cards, without jokers. Each rank/suit combination occurs six times. Individual physical copies must remain distinguishable for integrity and replay purposes; two Queens of Spades from different decks are legitimate distinct cards.

Shuffle the complete shoe when it is created. Draw without replacement. Completed-round cards enter the discard collection and cannot return to the live shoe. Starting a round does not itself reshuffle. No burn card, continuous shuffler, or insertion of replacement cards is used in v1.1.

At all times, available, in-play, and discarded physical cards must form a disjoint accounting of the current shoe's cards. A new shoe receives a new identity.

## R04. Cut card and exhaustion

Select one uniformly distributed integer cut position when each shoe is created:

- `ceil(312 * 0.70) = 219` cards consumed, inclusive lower bound.
- `floor(312 * 0.80) = 249` cards consumed, inclusive upper bound.
- Every integer from 219 through 249 is eligible; there are 31 positions.

This bounded-random policy is a project choice, not a casino-wide requirement. A fixed cut depth is not intrinsically invalid. The chosen position stays unchanged throughout that shoe's lifetime. The cut marker is not a playing card and does not increase the 312-card inventory.

Consumption counts every physical card dealt, including the dealer hole card and split-hand cards. At `consumed >= cutPosition`, reshuffling becomes pending. Finish the active round without interruption, then retire the old shoe before the next deal. Do not randomly change the threshold at every round.

Before dealing to `n` active seats, at least `2*n + 2` cards must be available. If this initial-deal check fails, prepare a new shoe before dealing anything. This is a minimum check, not a proof that a heavily split multiplayer round cannot exhaust the shoe.

If a required draw unexpectedly finds no card during an active round, do not insert cards, shuffle mid-round, fabricate a card, or award a gameplay win. Pause with an integrity error and apply the whole-round VOID procedure in R17. This replaces the earlier unsupported promise that a penetration threshold alone prevents every possible exhaustion case.

Shuffling and cut selection must accept controlled randomness for tests. Live card order and the cut position must not be adjusted in response to wagers, balances, or outcomes. A seeded replay product feature is not required in M1.

## R05. Card values and natural Blackjack

Numeric cards count at face value; J, Q, and K count as 10. An Ace counts as 1 or 11. Use the greatest total not exceeding 21 where possible; otherwise use the minimum total, which is a bust. A hand is soft only when an Ace is currently counted as 11 without busting.

Examples: `A,9 = 20`; `A,9,5 = 15`; `A,A,9 = 21`; `A,A,9,9 = 20`; `A,6 = soft 17`; `A,6,10 = hard 17`.

A natural Blackjack is an original, unsplit, two-card hand containing an Ace and a ten-valued card. Three-card 21 is not natural. A split-origin hand is never natural, even when its two cards are `A,K`. Naturals are resolved before ordinary hand comparison.

## R06. Simulated credits and wager limits

All chips are free simulated credits with no redemption value, purchase, deposit, withdrawal, transfer, or real-money payment. A new demo session starts each participating account with 1,000 credits. A deliberate session reset may restore that amount only between completed/void rounds; it must be labelled and recorded as a reset, not gambling profit. No automatic replenishment occurs during a round.

| Wager | Minimum | Maximum | Increment |
| --- | ---: | ---: | ---: |
| Original main wager | 10 credits | 1,000 credits | 1 credit |
| Original Bet Behind wager, per target seat | 10 credits | 1,000 credits | 1 credit |
| Pair side bet, per own active seat | 1 credit | 100 credits | 1 credit |
| Three-card side bet, per own active seat | 1 credit | 100 credits | 1 credit |
| Insurance | Exactly half the applicable original main/back wager, or decline | Same | Exact half |

These limits are portfolio defaults, not market-standard claims. Side bets require an accompanying own-seat main wager. No separate main wager is required for a spectator's Bet Behind wager. Side bets cannot be placed behind another seat in v1.1.

Amounts are represented in integer half-credit units: 1 unit = 0.5 credit. Original main, back, and side wagers use whole credits; insurance and returns may use half credits. Reject invalid, negative, non-finite, out-of-range, or incorrectly incremented amounts. Never silently round a wager or payout.

The 1,000-credit main limit applies to the original bet, not to the post-Double total. Four split hands, each subsequently doubled, can require total main exposure of `8 * originalBet`; insurance and side wagers are separate. This does not authorize credit or overdrafts.

## R07. Funding, reservation, and atomic rejection

`Available credits` means uncommitted credit, not a balance that includes stakes already reserved. Accepted bets and additions move their full amount out of available credit into reserved stakes.

Every main bet, side bet, Insurance purchase, Split, Re-split, Double, and Bet Behind addition must be fully affordable when accepted. Equality is sufficient: available 100 can fund an additional 100. Available 99.5 cannot.

Split and Re-split each require one additional wager equal to that hand's existing undoubled wager. Double requires one additional wager equal to the current hand wager. No partial Split, Double for less, credit, borrowing from another player, or spending anticipated winnings is allowed.

Reject an invalid or unfunded request before changing available credit, reserved stakes, cards, shoe order/position, gameplay randomness, turn, or hand/round state. An attempted-action diagnostic may be appended without changing gameplay. Return an explicit reason such as insufficient funds, wrong turn, invalid hand, or hand limit reached.

Validate again in the authoritative action handler. Disabled UI controls alone are insufficient. Repeated/stale requests must not apply twice. Funding is evaluated across all of a participant's commitments, including bets behind multiple seats.

Side-bet results, Insurance results, natural wins, surrender returns, and other current-round proceeds may be determined earlier, but remain unavailable until the table's final settlement. This explicit project policy prevents action order or early display of a result from making additional credit spendable mid-round.

## R08. Betting close, deal order, and information

Main, side, and original Bet Behind wagers may be placed, changed, or cancelled only while betting is open. Removing a qualifying main bet before the close cancels and refunds its dependent side/back wagers. A Bet Behind target must have a funded qualifying main wager at the close; otherwise refund that back bet before dealing.

At betting close, freeze wagers, seat participation, rules, and paytables. Afterwards only the rule-defined Insurance, Split, Re-split, Double, and Bet Behind follow decisions may reserve additional funds. No late main/side bets, arbitrary top-ups, or voluntary withdrawal of locked bets are allowed.

Deal in ascending active-seat order, skipping empty/sitting-out seats:

1. One face-up card to every active player, then the dealer upcard.
2. One face-up card to every active player, then the dealer face-down hole card.

All players receive both initial cards before any player acts. The original two-card snapshots remain available for side-bet evaluation after splitting or hitting.

Players and bots may observe public cards, actions, and public game state, but not the dealer hole card, future shoe order, secret seeds, or another player's private controls. A negative Blackjack peek must not disclose the hole-card identity. A browser-only demo is not claimed to resist an owner inspecting its memory; remote play will require a separately verified authoritative server.

## R09. Insurance, Even Money, and dealer peek

Use an American-style hole-card flow with the following project-specific timing.

When the upcard is an Ace, offer Insurance before checking the hole card. Each eligible main/back bettor independently chooses exactly half their own original wager or declines. Require sufficient available credit. Do not accept Insurance after the peek or against a ten-valued upcard. Insurance does not cover a later three-card dealer 21.

Insurance wins at 2:1 profit if and only if the dealer has natural Blackjack; otherwise the Insurance stake loses. It is a separate wager and cannot change the main hand result.

An eligible bettor whose original main/back hand is natural may choose Even Money instead: lock a 1:1 profit on that original stake regardless of the dealer peek. This is a direct settlement election, not a separately funded Insurance purchase. It requires no new chips. It is mutually exclusive with Insurance for the same original wager, irreversible after acceptance, and does not create both a 3:2 payout and a second award. Its credit remains pending until final table settlement.

Once all Ace-up decisions are closed, perform the dealer peek. Also peek immediately when the upcard is 10, J, Q, or K, without an Insurance window. For 2 through 9, dealer natural Blackjack is impossible and no peek is needed.

If the dealer is natural: honour accepted Even Money, push other original player naturals, lose other main/back stakes, and determine Insurance independently. No Hit, Split, Double, or Surrender follows. Initial-card side bets still retain their own results unless the entire round is voided.

If the dealer is not natural: Insurance loses, unconverted player naturals win at 3:2, and the remaining player hands continue. One player's natural does not end everyone else's round.

Taking or declining Insurance is not a player-hand action and does not remove otherwise-valid Late Surrender eligibility.

## R10. Player actions and hand sequencing

Resolve active seats in ascending order. Finish all hands belonging to the current seat before advancing to the next seat. A completed/bust/surrendered/natural hand accepts no further gameplay action.

**Hit:** draw exactly one card. Bust ends that hand as a loss. A non-natural total of 21 automatically ends that hand's decisions, but may still need dealer comparison. Otherwise the hand remains active.

**Stand:** end decisions for that hand without drawing. Do not end the whole table or skip unplayed split hands.

**Double:** allowed on any active two-card hand below 21, including eligible non-Ace split hands. It must be the first decision on that two-card hand. Reserve a full matching wager, draw exactly one card, then end the hand's decisions. No Hit, Split, Re-double, or Surrender follows. Double After Split is allowed; Double after splitting Aces is not.

**Split:** allowed on an active two-card hand of equal Blackjack splitting value. Aces pair with Aces; 2 through 9 pair with the same rank; any combination of 10/J/Q/K is eligible. Thus `10,K` may Split but is not a pair-side-bet win. Suit is irrelevant to Split eligibility.

Reserve the additional full wager and replace the parent with two ordered child hands, each retaining one original card. The first child retains the first-dealt card. After Bet Behind follow decisions, deal a second card to the first child and fully play it before dealing/playing the second child. Re-splitting follows this same depth-first order.

Non-Ace pairs may Re-split to a maximum of four total leaf hands per original seat in the round: at most three successful Split operations. Finished, busted, or surrendered leaf hands still count toward the cap. Available funds and the hand cap are independent requirements.

**Split Aces:** allow one split into two hands. Give each exactly one additional card, in order. Neither may Hit, Double, Surrender, or Re-split, including when another Ace arrives. `A` plus a ten-valued card after this split is ordinary 21 and pays at most 1:1 on an ordinary win.

## R11. Late Surrender

Permit Late Surrender only on an original, unsplit, non-natural two-card hand before its first Hit, Stand, Double, or Split. Dealer natural must already be excluded: by a negative peek for Ace/ten upcards, or by an upcard of 2 through 9.

Surrender ends the hand and returns half its original wager; the other half is lost. It needs no additional credit. It cannot be used on split hands, after doubling/hitting, or after dealer Blackjack is known. Taking or declining Insurance earlier does not prohibit this action.

Insurance and initial-card side bets remain independent. Associated Bet Behind stakes follow the controller's surrender, each receiving half of its own stake. A follower cannot independently surrender the main player's hand.

## R12. Dealer and main-hand results

After player decisions end, reveal the hole card. If at least one unresolved live hand requires dealer comparison, draw below 17 and stand on every 17 through 21, including soft 17. Stop on bust. The dealer never alters this policy to chase an individual player's total.

If no hand needs comparison because all outcomes are already determined, reveal the hole card at round completion but draw no unnecessary dealer cards. Early player bust does not reveal the hole card while other players still have decisions.

Main-hand precedence is:

1. Whole-round VOID, when required by R17.
2. Accepted Even Money and initial natural resolution from R09.
3. An already surrendered hand retains its half-loss result.
4. A player bust loses, even if the dealer later busts against another hand.
5. An eligible optional Charlie win is fixed by R16.
6. A surviving ordinary hand wins if the dealer busts.
7. Otherwise compare totals: higher wins, lower loses, equality pushes.

A hand result, its reason, the associated wager result, and the table round's completion are distinct concepts. One dealer result may settle many hands and many separate bettors; there is no single shared table winner.

## R13. Returns and one-time settlement

All quoted ratios mean **profit relative to the relevant stake**, not stake-inclusive return.

| Result | Gross return to available credit |
| --- | ---: |
| Ordinary win / optional Charlie win | `2 * stake` |
| Unconverted original natural, dealer not natural | `2.5 * stake` |
| Accepted Even Money | `2 * originalStake` |
| Push | `stake` |
| Loss / player bust | `0` |
| Late Surrender | `0.5 * originalStake` |
| Winning Insurance | `3 * insuranceStake` |
| Side bet paying k:1 | `(k + 1) * sideStake` |
| VOID | Return actual reserved stake without profit |

The stake has already left available credit; do not deduct it again on loss or add it twice on a win. A doubled hand settles using the full doubled stake. Split hands settle independently, including when one wins and another loses.

All payouts, releases, and refunds must be applied exactly once in the final table settlement. A repeated settlement or refund request must have no second financial effect. No current-round result is spendable before this commit. Record each wager's stake, result, gross return, and net profit/loss separately.

For example, starting with 1,000 and betting 100: an ordinary win ends at 1,100; natural at 1,150; push at 1,000; loss at 900; surrender at 950. A successful Double followed by an ordinary win ends at 1,200.

## R14. Initial-card side bets

The base target profile defines two optional side bets. They do not modify main-hand rules, consume extra cards, or entitle a player to act after a terminal hand. Only the immutable original deal is evaluated, once per placed side wager. Hit cards, split children, and dealer hit cards do not qualify. No side bet is automatically doubled or duplicated by Double/Split.

### Pair side bet (Perfect Pairs-style)

Both cards must have the same rank, not merely equal Blackjack points. `K,Q` and `10,J` lose. Classify only the highest applicable category:

| Category | Definition | Profit payout |
| --- | --- | ---: |
| Perfect pair | Same rank and same suit, different physical copies | 25:1 |
| Coloured pair | Same rank, same colour, different suits | 12:1 |
| Mixed pair | Same rank, opposite colours | 6:1 |
| None | Anything else | Loss |

Examples: `Q-spades/Q-spades` is perfect; `Q-spades/Q-clubs` is coloured; `Q-spades/Q-hearts` is mixed. Do not stack coloured and mixed awards under a perfect award.

### Three-card side bet (21+3-style)

Use the player's two original cards plus the dealer upcard. Suits and ranks are evaluated as three-card combinations, not Blackjack point totals. Classify and pay only the highest category:

| Category | Definition | Profit payout |
| --- | --- | ---: |
| Suited trips | Three equal ranks, all same suit | 100:1 |
| Straight flush | Three consecutive ranks, all same suit | 40:1 |
| Three of a kind | Three equal ranks, not suited trips | 30:1 |
| Straight | Three consecutive ranks, not a straight flush | 10:1 |
| Flush | Same suit, no higher qualifying category | 5:1 |
| None | Anything else | Loss |

Ace may be low in `A,2,3` or high in `Q,K,A`; `K,A,2` is not a straight. No wraparound is allowed. J/Q/K remain distinct ranks. A same-suit `K,A,2` may still win the lower flush category.

Side bets can win when the main hand loses, pushes, surrenders, or faces dealer Blackjack. Their evaluated returns remain pending until R13; a whole-round VOID overrides all of them.

These are this project's selected paytables. Provider-wide RTP numbers must not be copied to this six-deck configuration. References to commercial names identify mechanics, not affiliation or a licence. Use original presentation and assets.

## R15. Bet Behind and additional funding

Bet Behind attaches a bettor's own wager to another seat's original hand. The controller, not the follower, chooses Hit, Stand, Split, Double, and Surrender. A follower cannot bet behind their own seat, an empty seat, or a seat with no qualifying main bet.

A seated participant may also back other seats. One bettor may back multiple seats, with separate stakes and a shared available-credit limit. Back wagers never fund the controller's actions or create their own extra card draws.

**The following are explicit portfolio follow rules, not a claim that all providers use them.** Each accepted controller Split/Double is funded from the controller's own balance. Before any resulting new cards are dealt, followers of that affected hand choose whether to add their own funds. A follower's inability or refusal never blocks a legal funded controller action.

| Controller action | Follower adds funds | Follower declines or cannot afford |
| --- | --- | --- |
| Double | Reserve one additional amount equal to the follower's attached stake; settle its doubled stake on the forced-one-card result | Keep the original stake on that same resulting hand; do not get a free doubled payout |
| Split / Re-split | Reserve one additional amount equal to the affected attached stake; carry equal stakes to both ordered children | Carry the existing stake only to the first child (the child retaining the earlier-dealt card); no exposure on the second child |
| Hit / Stand | No addition needed; follow the resulting hand | Same |
| Late Surrender | No addition; return half the follower's own original attached stake | Same; no follower veto |

A no-add decision is irrevocable once cards are dealt. It cannot be changed after seeing the new cards, nor can the follower choose whichever split child wins. Further eligible actions on a tracked descendant create their own follow decision under the same policy. No automatic paid follow or silent partial funding is allowed.

Insurance and Even Money, where eligible, are each decided independently per original main/back wager in R09, not inherited from the seated player. Initial Insurance uses the original back stake; there is no new Insurance window after splitting. Side bets behind other seats are excluded in v1.1.

An unfunded attempt is rejected without changing that follower's funds or exposure; the disclosed no-add policy then applies as a separate resolved decision. If a future timed decision window expires, no-add is the default. All such choices must be made before the next new card is exposed.

## R16. Optional Five-Card Charlie profile

`CLASSIC_6D_S17_V1_1` has Charlie **OFF**. Define the separate, later `CHARLIE5_6D_S17_V1_1` demonstration profile as follows; it is not an additional M1 implementation requirement.

On a legal Hit producing exactly five cards with a total of 21 or less, the hand ends with a 1:1 Charlie win, without dealer-total comparison. Five means five total cards, not five additional hits after the opening two. Five cards totalling over 21 lose; the card-count check cannot override bust.

A fifth-card 21 gets only the Charlie 1:1 award, not a natural or stacked bonus. A hand reaching 21 on three/four cards automatically stops and cannot draw further to chase Charlie. Eligible non-Ace split hands may qualify separately. Split-Ace restrictions remain in force. Double ends after one additional card and cannot be used to keep drawing toward Charlie.

Dealer natural is resolved before any player Hit under R09, so this profile cannot reach Charlie after a dealer Blackjack. It does not override that earlier dealer win. Tracked Bet Behind hands share a valid Charlie result on their actual funded stakes. Side-bet rules do not change.

This is a custom demonstration variant. Do not describe it as a balanced commercial table, a standard casino rule, or a product with verified RTP/house edge.

## R17. Faults, round completion, and replay integrity

Once all decisions and outcomes are determined, apply settlement exactly once, move used cards to discard, and complete the round. New-round creation is a distinct action; if a reshuffle is pending, prepare the new shoe first. Starting a new round cannot mutate the archived prior round.

Illegal gameplay requests are rejections, not reasons to void a valid round. A genuine integrity failure, such as required-card exhaustion or a corrupted shoe, pauses the table. If safe continuation cannot be established, VOID the whole active round: return each actual reserved stake once, discard pending profits/losses, and record the fault. Since this ruleset defers all financial settlement, a void must not create early-award clawback or spendable negative balances. Preserve diagnostic evidence and retire the affected shoe before new play. No hidden automatic replay is allowed.

Human/bot actions, funds, and settlement need attributable records with round, seat, hand, wager, and action identifiers as applicable. Use actual runtime timestamps with an explicit offset/UTC and an ordered event sequence; a timestamp alone is not a uniqueness guarantee. Do not leak current shoe order or hole cards through player-visible logs.

Local untimed play may wait for the human. Any later timed/network mode must explicitly specify its durations before delivery; its safe gameplay defaults are Stand for the current playable hand, decline Insurance/Even Money, and no-add for Bet Behind. A new split hand requires its own decision window. A disconnected player's hand or wager is not silently deleted.

## R18. Rule-derived checks to carry into SPEC.md

These are expected cases to convert into executable checks; their presence is not a claim that tests have run.

| Case | Expected result |
| --- | --- |
| Six-deck inventory | 312 unique physical cards; six of each rank/suit |
| Cut boundaries | 219 and 249 allowed; 218 and 250 rejected |
| Cut reached during a multi-seat round | Finish the round; no mid-round reshuffle |
| Required draw on empty shoe | Integrity pause/VOID path, not a fabricated result |
| Player A busts, Player B still active | Only A's hand ends; B continues |
| Available 50; Double requires 100 | Reject; funds, cards, RNG, and turn unchanged |
| Available 100; Double requires 100 | Accept and leave available zero |
| Available 50; DAS requires 100 | Reject despite DAS being enabled |
| Three split leaf hands; no funds for a fourth | Reject for funds; no fourth hand |
| Four total leaf hands, including a busted hand | Further Split rejected |
| Split `10,K` with adequate funds | Split allowed; pair side bet loses |
| Split Aces produce `A,K` | Ordinary 21; no natural payout; no additional action |
| Ace-up Insurance request after peek | Reject |
| Dealer three-card 21 | Does not win Insurance |
| Even Money accepted on an eligible natural | 1:1 profit once; no concurrent Insurance or 3:2 award |
| Surrender versus dealer upcard 6 as first action | Allowed without a peek |
| Surrender after Hit or Split | Reject |
| Main loses; pair side bet qualifies | Independent side award remains pending |
| Side-bet winner tries to spend pending proceeds | Reject when currently available credit is insufficient |
| Suited trips qualify for multiple categories | Pay only 100:1 |
| `K,A,2` of different suits | Not a straight; no three-card award |
| Follower cannot match Double | Main action proceeds; follower keeps original stake |
| Follower cannot match Split | Main Split proceeds; follower tracks only first child |
| Duplicate payout/refund request | No second financial effect |
| Charlie OFF; five cards total 20 | No automatic Charlie win |
| Charlie ON; five cards total 22 | Bust, not Charlie |

## R19. Explicit exclusions and document responsibilities

Exclude real-money operations, paid chips, progressive jackpots, side bets beyond the two specified types, H17 tables, European no-hole-card rules, early surrender, re-splitting Aces, double-for-less, bonus 6/7-card awards, Spanish 21, Blackjack Switch, and Double Exposure from this v1.1 baseline. A newly approved variant requires a separately identified rules revision/profile and tests.

Network accounts, multiplayer transport, persistence guarantees, authentication, and reconnect implementation need their own milestone scope; they are not implied by these table rules. No LLM is needed to control the dealer or bots. A deterministic bot decision policy and legal fallbacks belong in the relevant design/specification task; do not advertise an optimal strategy without evidence.

`SPEC.md` owns milestone scope and acceptance criteria. `DESIGN.md` owns software structure and operational choices. `UX_UI.md` owns presentation and controls. `PLAN.md` owns tasks. `STATE.md` and `DEVELOPMENT_LOG.md` own actual progress, cumulative repair cycles, runtime development timestamps, evidence, and Git events. `LAB_MANUAL.md` explains concepts and tested failure cases. Do not duplicate these responsibilities here or claim that writing this document executes any control.

The supplied Karpathy guidelines remain separate, unchanged source material. Keep implementation minimal for the current milestone rather than building the full target profile or a generic rule framework in M1.

## References and provenance

Reference pages consulted on 2026-09-28. These are examples and definitions, not a shared universal ruleset. This project's funding rules, half-credit representation, limits, delayed settlement, exact cut interval, split traversal order, Bet Behind fallbacks, and optional five-card profile are explicit authored decisions.

- Evolution, *Live Blackjack*: seven-seat and Bet Behind product examples; distinct Blackjack variants. https://games.evolution.com/live-casino/live-blackjack/
- BetMGM Help, *Live Blackjack*: example main/Insurance and side-bet paytables and follower decision options. Its published feature set is not identical to this project's choices, including DAS and ten-up peek behaviour. https://help.betmgm.co.uk/hc/en-gb/articles/12186050178450-Live-Blackjack
- WinStar, *What Is Surrender in Blackjack?*: surrender timing and half-stake return. https://www.winstar.com/blog/what-is-surrender-in-blackjack/
- Galaxy Gaming, *Perfect Pairs Blackjack*: category definitions and commercial-name provenance. https://www.galaxygaming.com/products/perfect-pairs-blackjack
- Galaxy Gaming, *21+3*: the two-player-cards-plus-dealer-upcard structure and existence of different paytables; the exact five-category schedule in R14 is the selected BetMGM-style example, not a claim about every Galaxy version. https://www.galaxygaming.com/products/21-3

No provider text, logos, artwork, software, claimed certification, or published RTP is adopted as this project's own work. This document makes no legal conclusion about third-party rights or commercial distribution.
