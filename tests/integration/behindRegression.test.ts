import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import * as g from '../../src/domain/behindGame.js';
import * as c from '../../src/domain/behindController.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';
import type { Rank } from '../../src/domain/card.js';
import { accepted as ok, backedGame, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

const registered: number[] = [];
function reg(id: number, title: string, assertions: () => void) {
  registered.push(id);
  it(`REG-M6-${String(id).padStart(3, '0')} ${title}`, assertions);
}
const root = 'round-1/seat-1';
function open(seated = false) {
  let s = ok(g.openBehindBetting(behindFixture(['10', '10', '9', '10', '8', '8'], [seat(1), seat(2), ...(seated ? [seat(3, 'HUMAN')] : [])])));
  s = ok(g.setBehindMainWager(s, 1, 200));
  return ok(g.setBehindMainWager(s, 2, 200));
}
function double(stake = 200, card: Rank = '9') {
  return ok(c.beginControllerDouble(backedGame(['5', '9', '6', '8', card], stake), 'computer-1', root));
}
function split(stake = 200, cards: readonly Rank[] = ['8', '9', '8', '8', '8', '2', '3', '4']) {
  return ok(c.beginControllerSplit(backedGame(cards, stake), 'computer-1', root));
}
function finish(s: g.BehindGameState) {
  return s.table.game.round!.phase === 'ROUND_COMPLETE' ? s : ok(g.advanceBehindTable(s));
}
function paid(ranks: readonly Rank[], stake = 200) {
  return ok(g.settleBehindWagers(finish(backedGame(ranks, stake))));
}
function empty(s: g.BehindGameState): g.BehindGameState {
  const shoe = s.table.game.shoe;
  return { ...s, table: { ...s.table, game: { ...s.table.game,
    shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } } };
}
function faultDouble(choice: 'ADD' | 'NO_ADD', stake = 200) {
  return ok(c.decideDoubleFollow(empty(double(stake)), root, choice));
}
function ace(stake = 200, natural = false, hole: Rank = '6') {
  return backedGame(natural ? ['A', 'A', 'K', hole] : ['8', 'A', '8', hole, '2'], stake);
}
function mixedSplit(choice: 'ADD' | 'NO_ADD') {
  let s = ok(c.decideSplitFollow(split(200, ['8', '9', '8', '8', '10', '2']), root, choice));
  for (const id of [root + '.1', root + '.2']) s = ok(c.standControllerHand(s, 'computer-1', id));
  return ok(g.settleBehindWagers(finish(s)));
}

reg(1, 'spectator participant', () => { const s = open(); expect(g.controlledSeat(s)).toBeNull(); expect(s.human!.participantId).toBe('local-human'); });
reg(2, 'seated participant', () => { expect(g.controlledSeat(open(true))).toBe(3); });
reg(3, 'one controlled seat maximum', () => { const s = behindFixture(); expect(g.configureBehindSeats(s, [seat(2, 'HUMAN')]).state).toBe(s); });
reg(4, 'participant funds persist through seat movement', () => {
  let s = paid(['10', '9', '10', '8']);
  s = ok(g.prepareNextBehindRound(s));
  s = ok(g.configureBehindSeats(s, [seat(4, 'HUMAN')]));
  expect(s.human!.bankroll.available).toBe(2200);
  s = ok(g.configureBehindSeats(s, [{ seatNumber: 4, occupancy: 'EMPTY', sittingOut: false }]));
  expect(s.human!.bankroll.available).toBe(2200);
});
reg(5, 'no duplicate spendable bankroll', () => {
  const s = ok(g.setBackWager(open(true), 1, 2000));
  expect(s.table).not.toHaveProperty('bankrolls'); expect(s.human!.bankroll.available).toBe(0);
  expect(g.setBehindMainWager(s, 3, 20)).toMatchObject({ ok: false, error: 'INSUFFICIENT_FUNDS' });
});
reg(6, 'original minimum', () => { expect(ok(g.setBackWager(open(), 1, 20)).backWagers[0].stakeUnits).toBe(20); });
reg(7, 'original maximum', () => { expect(ok(g.setBackWager(open(), 1, 2000)).human!.bankroll).toEqual({ available: 0, reserved: 2000 }); });
reg(8, 'original increment', () => { const s = open(); for (const v of [19, 21, 20.5, 2002, NaN]) expect(g.setBackWager(s, 1, v).state).toBe(s); });
reg(9, 'exact available funding', () => { const s = ok(g.setBackWager(open(), 1, 1800)); expect(ok(g.setBackWager(s, 2, 200)).human!.bankroll.available).toBe(0); });
reg(10, 'insufficient request atomic', () => { const s = ok(g.setBackWager(open(), 1, 1800)); expect(g.setBackWager(s, 2, 202)).toEqual({ ok: false, state: s, error: 'INSUFFICIENT_FUNDS' }); });
reg(11, 'multi-target shared available', () => { let s = ok(g.setBackWager(open(), 1, 1000)); s = ok(g.setBackWager(s, 2, 600)); expect(s.human!.bankroll).toEqual({ available: 400, reserved: 1600 }); });
reg(12, 'cannot back own seat', () => { let s = open(true); s = ok(g.setBehindMainWager(s, 3, 200)); expect(g.setBackWager(s, 3, 200).ok).toBe(false); });
reg(13, 'EMPTY target rejected', () => { const s = open(); expect(g.setBackWager(s, 7, 20).state).toBe(s); });
reg(14, 'sitting-out target rejected', () => { const s = ok(g.openBehindBetting(behindFixture(undefined, [seat(1, 'COMPUTER', true)]))); expect(g.setBackWager(s, 1, 20).ok).toBe(false); });
reg(15, 'MAIN prerequisite', () => { const s = ok(g.cancelBehindMainWager(open(), 1)); expect(g.setBackWager(s, 1, 20).ok).toBe(false); });
reg(16, 'delta increase and decrease', () => { let s = ok(g.setBackWager(open(), 1, 200)); s = ok(g.setBackWager(s, 1, 300)); expect(s.human!.bankroll.available).toBe(1700); s = ok(g.setBackWager(s, 1, 100)); expect(s.human!.bankroll).toEqual({ available: 1900, reserved: 100 }); expect(s.backWagers).toHaveLength(1); });
reg(17, 'cancel releases once', () => { const s = ok(g.cancelBackWager(ok(g.setBackWager(open(), 1, 200)), 1)); expect(s.human!.bankroll.available).toBe(2000); expect(g.cancelBackWager(s, 1).state).toBe(s); });
reg(18, 'target MAIN cancellation cascades', () => { const s = ok(g.cancelBehindMainWager(ok(g.setBackWager(open(), 1, 200)), 1)); expect(s.backWagers).toEqual([]); expect(s.human!.bankroll.reserved).toBe(0); expect(s.computers[0].bankroll.available).toBe(2000); });
reg(19, 'close freezes original', () => { const s = backedGame(['8', '9', '8', '8']); expect(Object.isFrozen(s.backWagers[0])).toBe(true); expect(g.setBackWager(s, 1, 100).state).toBe(s); expect(g.cancelBackWager(s, 1).state).toBe(s); });
reg(20, 'no side bets behind', () => { const s = open(true); for (const type of ['PAIR', 'THREE_CARD'] as const) expect(g.setBehindSideWager(s, 1, type, 20).ok).toBe(false); });
reg(21, 'no computer automatic back', () => { const s = ok(g.openBehindBetting(behindFixture(undefined, [seat(1)], false))); expect(s.backWagers).toEqual([]); expect(g.setBackWager(s, 1, 20).ok).toBe(false); });
reg(22, 'ordinary win', () => { expect(paid(['10', '9', '10', '8']).backResults[0]).toMatchObject({ outcome: 'PLAYER_WIN', grossReturnUnits: 400 }); });
reg(23, 'ordinary loss', () => { expect(paid(['10', '10', '8', '9']).backResults[0]).toMatchObject({ outcome: 'DEALER_WIN', grossReturnUnits: 0 }); });
reg(24, 'ordinary push', () => { expect(paid(['10', '10', '8', '8']).backResults[0]).toMatchObject({ outcome: 'PUSH', grossReturnUnits: 200 }); });
reg(25, 'controller bust follower loses', () => { const s = paid(['10', '9', '6', '8', 'K']); expect(s.table.game.round!.players[0].outcomeReason).toBe('PLAYER_BUST'); expect(s.backResults[0].grossReturnUnits).toBe(0); });
reg(26, 'original Natural', () => { expect(paid(['A', '9', 'K', '8']).backResults[0]).toMatchObject({ outcome: 'PLAYER_BLACKJACK', grossReturnUnits: 500 }); });
reg(27, 'Dealer Natural push', () => { expect(paid(['A', 'K', 'K', 'A']).backResults[0]).toMatchObject({ outcome: 'PUSH', grossReturnUnits: 200 }); });
function surrenderFixture() {
  const s = backedGame(['8', '9', '8', '8'], 50);
  // Independent outcome fixture: no local bot Surrender policy is introduced.
  return { ...s, table: { ...s.table, game: { ...s.table.game, round: { ...s.table.game.round!,
    phase: 'DEALER_TURN' as const, currentSeat: null, currentHandId: null,
    players: s.table.game.round!.players.map((hand) => ({ ...hand, complete: true, decisionTaken: true,
      outcome: 'SURRENDERED' as const, outcomeReason: 'LATE_SURRENDER' as const })) } } } };
}
reg(28, 'follower follows controller Surrender', () => { const s = surrenderFixture(); expect(g.getBackResults(s)[0]).toMatchObject({ outcome: 'SURRENDERED', grossReturnUnits: 25 }); expect(s.human!.bankroll.reserved).toBe(50); });
reg(29, 'follower has no target action authority', () => { const s = backedGame(['8', '9', '8', '8']); for (const action of ['HIT', 'STAND', 'DOUBLE', 'SPLIT', 'SURRENDER'] as const) expect(g.actBehindHand(s, root, action).ok).toBe(false); expect(c.beginControllerDouble(s, 'local-human', root).ok).toBe(false); });
reg(30, 'pending follower return unavailable', () => { const s = backedGame(['A', '9', 'K', '8']); expect(g.getBackResults(s)[0].grossReturnUnits).toBe(500); expect(s.human!.bankroll.available).toBe(1800); });
reg(31, 'controller Double funds accepted first', () => { const s = double(); expect(s.computers[0].bankroll).toEqual({ available: 1600, reserved: 400 }); expect(s.human!.bankroll).toEqual({ available: 1800, reserved: 200 }); });
reg(32, 'Double follow before card', () => { const s = double(); expect(s.table.game.shoe.inPlay).toHaveLength(4); expect(s.table.game.round!.players[0].cards).toHaveLength(2); expect(g.advanceBehindTable(s).state).toBe(s); });
reg(33, 'Double ADD', () => { const s = ok(c.decideDoubleFollow(double(), root, 'ADD')); expect(s.human!.bankroll).toEqual({ available: 1600, reserved: 400 }); });
reg(34, 'Double NO_ADD', () => { const s = ok(c.decideDoubleFollow(double(), root, 'NO_ADD')); expect(s.human!.bankroll).toEqual({ available: 1800, reserved: 200 }); });
reg(35, 'Double exact funds', () => { expect(ok(c.decideDoubleFollow(double(1000), root, 'ADD')).human!.bankroll.available).toBe(0); });
reg(36, 'Double insufficient follower', () => { const s = ok(c.decideDoubleFollow(double(1200), root, 'ADD')); expect(s.followDecisions[0]).toMatchObject({ choice: 'NO_ADD', fundingError: 'INSUFFICIENT_FUNDS' }); expect(s.human!.bankroll).toEqual({ available: 800, reserved: 1200 }); });
reg(37, 'insufficient follower does not block controller', () => { const s = ok(c.decideDoubleFollow(double(2000), root, 'ADD')); expect(s.table.game.round!.players[0]).toMatchObject({ complete: true, stakeUnits: 400 }); expect(s.table.game.shoe.inPlay).toHaveLength(5); });
reg(38, 'Double ADD exposure', () => { expect(ok(c.decideDoubleFollow(double(), root, 'ADD')).backExposures[0].stakeUnits).toBe(400); });
reg(39, 'Double NO_ADD exposure', () => { expect(ok(c.decideDoubleFollow(double(), root, 'NO_ADD')).backExposures[0].stakeUnits).toBe(200); });
reg(40, 'Double win', () => { const s = finish(ok(c.decideDoubleFollow(double(), root, 'ADD'))); expect(g.getBackResults(s)[0]).toMatchObject({ outcome: 'PLAYER_WIN', grossReturnUnits: 800 }); });
reg(41, 'Double loss', () => { const s = finish(ok(c.decideDoubleFollow(double(200, '2'), root, 'ADD'))); expect(g.getBackResults(s)[0]).toMatchObject({ outcome: 'DEALER_WIN', grossReturnUnits: 0 }); });
reg(42, 'Double push', () => { const s = finish(ok(c.decideDoubleFollow(double(200, '6'), root, 'ADD'))); expect(g.getBackResults(s)[0]).toMatchObject({ outcome: 'PUSH', grossReturnUnits: 400 }); });
reg(43, 'Double decision irreversible', () => { const s = ok(c.decideDoubleFollow(double(), root, 'NO_ADD')); expect(c.decideDoubleFollow(s, root, 'ADD').state).toBe(s); expect(s.table.game.shoe.inPlay).toHaveLength(5); });
reg(44, 'rejected ADD no exposure', () => { const s = ok(c.decideDoubleFollow(double(1200), root, 'ADD')); expect(s.backExposures.map((e) => e.stakeUnits)).toEqual([1200]); expect(s.human!.bankroll.reserved).toBe(1200); });
reg(45, 'controller Split accepted independently', () => { const s = split(); expect(s.computers[0].bankroll.reserved).toBe(400); expect(s.table.game.round!.players).toHaveLength(2); expect(s.human!.bankroll.reserved).toBe(200); });
reg(46, 'Split decision before child cards', () => { const s = split(); expect(s.table.game.shoe.inPlay).toHaveLength(4); expect(s.table.game.round!.players.map((h) => h.cards.length)).toEqual([1, 1]); });
reg(47, 'Split ADD', () => { expect(ok(c.decideSplitFollow(split(), root, 'ADD')).human!.bankroll.reserved).toBe(400); });
reg(48, 'Split NO_ADD', () => { expect(ok(c.decideSplitFollow(split(), root, 'NO_ADD')).human!.bankroll.reserved).toBe(200); });
reg(49, 'Split exact funds', () => { expect(ok(c.decideSplitFollow(split(1000), root, 'ADD')).human!.bankroll).toEqual({ available: 0, reserved: 2000 }); });
reg(50, 'Split insufficient safe fallback', () => { const s = ok(c.decideSplitFollow(split(1200), root, 'ADD')); expect(s.followDecisions[0]).toMatchObject({ choice: 'NO_ADD', fundingError: 'INSUFFICIENT_FUNDS' }); expect(s.computers[0].bankroll.reserved).toBe(400); });
reg(51, 'first-child physical fallback', () => { const initial = backedGame(['8', '9', '8', '8', '2']); const card = initial.table.game.round!.players[0].cards[0]; const s = ok(c.decideSplitFollow(ok(c.beginControllerSplit(initial, 'computer-1', root)), root, 'NO_ADD')); expect(s.backExposures[0].handId).toBe(root + '.1'); expect(s.table.game.round!.players[0].cards[0]).toBe(card); });
reg(52, 'NO_ADD no second exposure', () => { expect(ok(c.decideSplitFollow(split(), root, 'NO_ADD')).backExposures.map((e) => e.handId)).toEqual([root + '.1']); });
reg(53, 'ADD equal child stakes', () => { expect(ok(c.decideSplitFollow(split(), root, 'ADD')).backExposures.map((e) => e.stakeUnits)).toEqual([200, 200]); });
reg(54, 'depth-first card order', () => { let s = ok(c.decideSplitFollow(split(200, ['8', '9', '8', '8', '2', '3']), root, 'ADD')); expect(s.table.game.round!.players[1].cards).toHaveLength(1); s = ok(c.standControllerHand(s, 'computer-1', root + '.1')); expect(s.table.game.round!.players.map((h) => h.cards.map((v) => v.rank))).toEqual([['8', '2'], ['8', '3']]); });
function resplit(choice: 'ADD' | 'NO_ADD') {
  const initial = ok(c.decideSplitFollow(split(), root, 'ADD'));
  return ok(c.decideSplitFollow(ok(c.beginControllerSplit(initial, 'computer-1', root + '.1')), root + '.1', choice));
}
reg(55, 're-split new follow window', () => { const s = ok(c.beginControllerSplit(ok(c.decideSplitFollow(split(), root, 'ADD')), 'computer-1', root + '.1')); expect(s.followWindow!.handId).toBe(root + '.1'); expect(s.table.game.shoe.inPlay).toHaveLength(5); });
reg(56, 're-split ADD', () => { expect(resplit('ADD').backExposures.map((e) => e.handId)).toEqual([root + '.1.1', root + '.1.2', root + '.2']); });
reg(57, 're-split NO_ADD', () => { expect(resplit('NO_ADD').backExposures.map((e) => e.handId)).toEqual([root + '.1.1', root + '.2']); });
reg(58, 'untracked descendant no window', () => { let s = ok(c.decideSplitFollow(split(200, ['8', '9', '8', '8', '2', '8', '3']), root, 'NO_ADD')); s = ok(c.standControllerHand(s, 'computer-1', root + '.1')); s = ok(c.beginControllerSplit(s, 'computer-1', root + '.2')); expect(s.followWindow).toBeNull(); expect(s.backExposures.map((e) => e.handId)).toEqual([root + '.1']); });
reg(59, 'Split decision irreversible', () => { const s = ok(c.decideSplitFollow(split(), root, 'NO_ADD')); expect(c.decideSplitFollow(s, root, 'ADD').state).toBe(s); });
reg(60, 'Split Aces tracking', () => { const s = ok(c.decideSplitFollow(split(200, ['A', '9', 'A', '8', 'K', 'A']), root, 'ADD')); expect(s.table.game.round!.players.map((h) => [h.cards.length, h.splitAces, h.complete])).toEqual([[2, true, true], [2, true, true]]); expect(g.getBackResults(finish(s)).map((e) => e.grossReturnUnits)).toEqual([400, 0]); });
reg(61, 'four-leaf cap independent of follower funds', () => { let s = ok(c.decideSplitFollow(split(200, ['8', '9', '8', '8', '8', '8', '8']), root, 'ADD')); for (const path of ['.1', '.1.1']) s = ok(c.decideSplitFollow(ok(c.beginControllerSplit(s, 'computer-1', root + path)), root + path, 'ADD')); expect(c.beginControllerSplit(s, 'computer-1', root + '.1.1.1')).toEqual({ ok: false, state: s, error: 'HAND_LIMIT_REACHED' }); expect(s.human!.bankroll.available).toBe(1200); });
reg(62, 'Ace includes back bettor', () => { const s = ace(); expect(s.backInsurance[0].choice).toBe('PENDING'); expect(s.table.peekPerformed).toBe(false); });
reg(63, 'Insurance exact half original', () => { expect(ok(g.decideBackInsurance(ace(), 1, 'INSURANCE')).backInsurance[0].stakeUnits).toBe(100); });
reg(64, 'Insurance odd unit', () => { expect(ok(g.decideBackInsurance(ace(50), 1, 'INSURANCE')).backInsurance[0].stakeUnits).toBe(25); });
reg(65, 'Insurance exact funds', () => { const s = ace(50); const exact = { ...s, human: { ...s.human!, bankroll: { available: 25, reserved: 50 } } }; expect(ok(g.decideBackInsurance(exact, 1, 'INSURANCE')).human!.bankroll).toEqual({ available: 0, reserved: 75 }); });
reg(66, 'Insurance insufficient atomic', () => { const s = ace(2000); expect(g.decideBackInsurance(s, 1, 'INSURANCE')).toEqual({ ok: false, state: s, error: 'INSUFFICIENT_FUNDS' }); expect(s.table.peekPerformed).toBe(false); });
reg(67, 'controller Insurance independent', () => { const s = ok(g.decideBackInsurance(ace(), 1, 'INSURANCE')); expect(s.table.insuranceDecisions[0].choice).toBe('DECLINE'); expect(s.computers[0].bankroll.reserved).toBe(200); });
reg(68, 'Even Money eligibility', () => { const s = ace(); expect(g.decideBackInsurance(s, 1, 'EVEN_MONEY').state).toBe(s); expect(ok(g.decideBackInsurance(ace(200, true), 1, 'EVEN_MONEY')).backInsurance[0].choice).toBe('EVEN_MONEY'); });
reg(69, 'Even Money no reserve', () => { expect(ok(g.decideBackInsurance(ace(2000, true), 1, 'EVEN_MONEY')).human!.bankroll).toEqual({ available: 0, reserved: 2000 }); });
reg(70, 'Insurance and Even Money exclude each other', () => { const s = ok(g.decideBackInsurance(ace(200, true), 1, 'INSURANCE')); expect(g.decideBackInsurance(s, 1, 'EVEN_MONEY').state).toBe(s); expect(g.getBackResults(s).map((e) => e.outcome)).toEqual(['PLAYER_BLACKJACK', 'LOSS']); });
reg(71, 'controller Even Money independent', () => { const s = ok(g.decideBackInsurance(ace(200, true, 'K'), 1, 'EVEN_MONEY')); expect(s.table.insuranceDecisions[0].choice).toBe('DECLINE'); expect(s.table.game.round!.players[0].outcome).toBe('PUSH'); expect(g.getBackResults(s)[0].grossReturnUnits).toBe(400); });
reg(72, 'no Insurance after Split', () => { let s = ok(g.decideBackInsurance(ace(), 1, 'DECLINE')); s = ok(c.decideSplitFollow(ok(c.beginControllerSplit(s, 'computer-1', root)), root, 'ADD')); expect(g.decideBackInsurance(s, 1, 'INSURANCE').state).toBe(s); expect(s.backInsurance).toHaveLength(1); });
reg(73, 'peek waits for final follower', () => { const s = ace(200, false, 'K'); expect(s.table.peekPerformed).toBe(false); expect(s.table.game.round!.players[0].outcome).toBeUndefined(); expect(ok(g.decideBackInsurance(s, 1, 'DECLINE')).table.peekPerformed).toBe(true); });
reg(74, 'negative peek secrecy', () => { const s = ok(g.decideBackInsurance(ace(), 1, 'DECLINE')); expect(s.table.game.round!.dealerNaturalExcluded).toBe(true); expect(getPublicBehindView(s).round!.dealer.holeCard).toBeNull(); });
reg(75, 'ordinary follower final settlement', () => { expect(paid(['10', '9', '10', '8'], 50).human!.bankroll).toEqual({ available: 2050, reserved: 0 }); });
reg(76, 'Double ADD final settlement', () => { expect(ok(g.settleBehindWagers(finish(ok(c.decideDoubleFollow(double(), root, 'ADD'))))).human!.bankroll).toEqual({ available: 2400, reserved: 0 }); });
reg(77, 'Double NO_ADD final settlement', () => { expect(ok(g.settleBehindWagers(finish(ok(c.decideDoubleFollow(double(), root, 'NO_ADD'))))).human!.bankroll).toEqual({ available: 2200, reserved: 0 }); });
reg(78, 'Split independent mixed settlement', () => { expect(mixedSplit('ADD').backResults.map((e) => [e.outcome, e.grossReturnUnits])).toEqual([['PLAYER_WIN', 400], ['DEALER_WIN', 0]]); });
reg(79, 'Split NO_ADD first only settlement', () => { expect(mixedSplit('NO_ADD').backResults.map((e) => e.handId)).toEqual([root + '.1']); });
reg(80, 'Surrender exact half return', () => { expect(ok(g.settleBehindWagers(finish(surrenderFixture()))).human!.bankroll).toEqual({ available: 1975, reserved: 0 }); });
reg(81, 'Natural 3:2 integer payout', () => { expect(paid(['A', '9', 'K', '8'], 50).human!.bankroll.available).toBe(2075); });
reg(82, 'Even Money 1:1 final payout', () => { const s = ok(g.decideBackInsurance(ace(50, true, 'K'), 1, 'EVEN_MONEY')); expect(ok(g.settleBehindWagers(s)).human!.bankroll.available).toBe(2050); });
reg(83, 'one unified commit for controller and follower', () => { let s = finish(backedGame(['10', '9', '10', '8'])); expect(s.computers[0].bankroll.available).toBe(1800); expect(s.human!.bankroll.available).toBe(1800); s = ok(g.settleBehindWagers(s)); expect(s.computers[0].bankroll.available).toBe(2200); expect(s.human!.bankroll.available).toBe(2200); expect(s.table.phase).toBe('COMMITTED'); });
reg(84, 'duplicate settlement no second effect', () => { const s = paid(['10', '9', '10', '8']); expect(g.settleBehindWagers(s).state).toBe(s); expect(s.human!.bankroll.available).toBe(2200); });
reg(85, 'follower result attribution', () => { expect(paid(['10', '9', '10', '8']).backResults[0]).toEqual({ participantId: 'local-human', roundId: 'round-1', targetSeat: 1, handId: root, parentHandId: null, wagerId: `${root}/BACK/local-human`, stakeUnits: 200, outcome: 'PLAYER_WIN', grossReturnUnits: 400, netUnits: 200, status: 'COMMITTED' }); });
reg(86, 'VOID original stake', () => { const s = ok(g.voidBehindRound(faultDouble('NO_ADD'))); expect(s.backResults[0]).toMatchObject({ outcome: 'VOID', grossReturnUnits: 200, netUnits: 0 }); });
reg(87, 'VOID accepted Double addition', () => { const s = ok(g.voidBehindRound(faultDouble('ADD'))); expect(s.backResults[0].grossReturnUnits).toBe(400); expect(s.human!.bankroll.available).toBe(2000); });
reg(88, 'VOID Split and Re-split additions', () => { let s = ok(c.decideSplitFollow(split(), root, 'ADD')); s = ok(c.beginControllerSplit(empty(s), 'computer-1', root + '.1')); s = ok(c.decideSplitFollow(s, root + '.1', 'ADD')); s = ok(g.voidBehindRound(s)); expect(s.backResults.map((e) => e.grossReturnUnits)).toEqual([200, 200, 200]); expect(s.human!.bankroll.available).toBe(2000); });
reg(89, 'VOID purchased Insurance', () => { let s = ok(g.decideBackInsurance(ace(), 1, 'INSURANCE')); s = ok(g.advanceBehindTable(empty(s))); s = ok(g.voidBehindRound(s)); expect(s.backResults.map((e) => e.grossReturnUnits)).toEqual([200, 100]); expect(s.backResults.every((e) => e.outcome === 'VOID')).toBe(true); });
reg(90, 'rejected/no-add exposure never refunded hypothetically', () => { const s = ok(g.voidBehindRound(faultDouble('ADD', 1200))); expect(s.backResults[0].grossReturnUnits).toBe(1200); expect(s.human!.bankroll.available).toBe(2000); });
reg(91, 'duplicate VOID no second effect', () => { const s = ok(g.voidBehindRound(faultDouble('ADD'))); expect(g.voidBehindRound(s).state).toBe(s); });
reg(92, 'VOID and normal settlement exclude each other', () => { const v = ok(g.voidBehindRound(faultDouble('ADD'))); expect(g.settleBehindWagers(v).state).toBe(v); const p = paid(['10', '9', '10', '8']); expect(g.voidBehindRound(p).state).toBe(p); });
reg(93, 'multiple targets settle independently', () => { let s = ok(g.setBackWager(open(), 1, 200)); s = ok(g.setBackWager(s, 2, 50)); s = ok(g.closeBehindBetting(s, 'unused', noRandom)); s = ok(g.settleBehindWagers(finish(s))); expect(s.backResults.map((e) => [e.targetSeat, e.stakeUnits, e.grossReturnUnits])).toEqual([[1, 200, 400], [2, 50, 100]]); expect(s.human!.bankroll.available).toBe(2250); });
reg(94, 'public projection secrecy and no private controls', () => { const s = ace(); const v = getPublicBehindView(s); expect(v.round!.dealer.visibleCards).toHaveLength(1); const json = JSON.stringify(v); for (const secret of ['computers', 'bankrolls', 'cutPosition', 'deckIndex', 'originalCards', 'ownerId']) expect(json).not.toContain(`"${secret}"`); });
reg(95, 'M7 browser implementation absent at accepted M6 baseline', () => {
  const acceptedM6 = '681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5';
  const git = (...args: string[]) => execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, ...args], { encoding: 'utf8' });
  const files = git('ls-tree', '-r', '--name-only', acceptedM6, '--', 'src').trim().split('\n');
  expect(files.some((file) => /\.(tsx|jsx|html)$/.test(file))).toBe(false);
  expect(files.every((file) => !/app|pages|components/.test(file))).toBe(true);
  const pkg = JSON.parse(git('show', `${acceptedM6}:package.json`)) as { dependencies?: object; devDependencies: object };
  expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('react');
  expect(git('show', `${acceptedM6}:docs/STATE.md`)).toContain('M7: **NOT STARTED**');
});

it('REG-M6 completeness: exactly 001..095, no missing or duplicate IDs', () => {
  expect(registered).toHaveLength(95);
  expect(new Set(registered).size).toBe(95);
  expect([...registered].sort((a, b) => a - b)).toEqual(Array.from({ length: 95 }, (_, i) => i + 1));
});
