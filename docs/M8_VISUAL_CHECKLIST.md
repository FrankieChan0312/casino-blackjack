# M8 visual / game-feel manual acceptance

Owner acceptance is pending. Automated layout, keyboard and secrecy checks do not judge whether the game feels polished. M8 is not ACCEPTED; final combined-HEAD independent recheck is still required. All credits are simulated.

Start the normal app with `npm.cmd run dev`. For repeatable decisions, open **Advanced demo settings**, choose the stated profile/seed and **Start new demo session** before betting; this explicitly resets simulated credits. Finish the current round before starting a different session.

1. Open a normal **Classic Blackjack** session with the seed blank. Confirm the title and simulation-credit disclosure are easy to find.
2. At **1280x900**, inspect the felt/rail, top-center Dealer, seven identifiable seats and lower-center **You**. Decide whether this reads as a Blackjack game and whether the primary controls are easy to find.
3. Open betting, choose a MAIN chip amount, then press **Set Your MAIN**. Selecting a chip changes only the input; verify Available and Reserved change only after Set. Try optional Pair/THREE_CARD amounts; there is no promotional maximum-bet control.
4. Press **Close betting and deal**. Inspect ranks, suits, red/black distinction, totals and the Dealer card back. No hidden identity should appear in visible or accessible labels.
5. Use **Hit**, **Stand**, then **Continue table** where available. Verify clear current-turn text and hand/result feedback, with returned and net simulated credits.
6. Judge action-button size, hierarchy and press response. Inspect a disabled action and expand **Action guidance** for its explanation. Confirm Available, Reserved and Pending stay distinct, including half-credit returns.
7. Start **Classic / seed36**, Seat1, default MAIN, deal and **Split**. Inspect ordered Hand A/B, ACTIVE marker and the completed first child after Stand. Do completed children remain understandable?
8. Start **Classic / seed0**, Seat1, default MAIN and deal. Inspect the Ace-up Insurance panel, exact required amount and distinct choices; Even Money appears only when eligible. The hole card stays hidden before the decision.
9. In a fresh setup enable Computer Seat2, open betting, explicitly fund its MAIN, select Bet Behind target Seat2 and set your back amount. Verify controller/follower wording and separate exposure/results. For the advanced follow-panel inspection, use the isolated E2E server (`npm.cmd run dev -- --mode e2e --port 4173 --strictPort`) and `/?fixture=follow-split`: ADD/NO ADD must explain target/hand/matching amount and first-child-only effect. The production Hit/Stand computer policy does not create Split/Double windows.
10. Start **Five-Card Charlie Demo / seed21**, Seat1, default MAIN, deal, **Hit three times**, then Continue table. Check **Charlie Win**, five cards, 1:1 profit and exact returned amount. Rule wording is a legal Hit bringing the hand to exactly five total cards at21 or less, never “fifth Hit.”
11. Inspect the secondary Demo/Audit area. Replay the completed seeded session; original results must remain. Open public history and check readable seat/occupancy/action/actor/amount/UTC/result; configuration must not say Awaiting result. Replay JSON appears only after explicitly requesting it at completion.
12. At **1280x900** and **768x1024**, inspect first-screen hierarchy and reflow; no page horizontal scroll or obstructed controls.
13. At **320x720**, inspect the current HUMAN cards/actions before secondary seats, a visible Dealer, readable controls and no page horizontal overflow. Tools stay below gameplay. Scrolling through split children is acceptable.
14. Reload and use only **Tab / Shift+Tab / Enter / Space** for setup, wagers and Hit/Stand. Check the skip link, focus ring, labels and decision controls. Focus must remain visible.
15. Enable OS/browser **reduced motion**, reload and repeat a round. Cards, current-hand/result markers and controls remain usable; entry/press/emphasis transitions are disabled. No sound is added.

Record what feels better or worse, viewport and scenario. Return to the same independent reviewer conversation with the final published HEAD. Only after reviewer NO FINDINGS, required findings CLOSED, full harness PASS and owner approval of the game feel may the owner explicitly say **“I accept M8.”** Deployment is NOT RUN.
