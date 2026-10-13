# Casino — Interview Demo v1.0.0

Prerequisite: install Node.js **24.19.x** (supported range: >=24.19.0 and <25). This is a Node launcher, not a bundled-runtime EXE. No npm install or build is required.

1. Extract the **whole ZIP** into a folder. Do not launch inside the ZIP.
2. On Windows, double-click **START-DEMO.cmd**. Or open a terminal in this folder and run `node start-demo.mjs`.
3. Open the exact `http://127.0.0.1:PORT/` URL printed by the launcher.
4. Stop the terminal with **Ctrl+C**.

Do not double-click `dist/index.html`. If Node is missing, install the prerequisite, then launch again. An optional `node start-demo.mjs --port 8080` selects a port; an occupied port reports an error and leaves the existing process alone.

This single-player portfolio preview includes Blackjack, local computer guests, a casino lobby, and Baccarat. Credits are simulated and have no cash value. Session state is kept only in memory: refreshing, navigating between pages, or reopening starts a new 1,000-credit session and loses the prior history. Next-round/repeat controls preserve the current session. No M16 completion or production-casino claim is made.

Exact executed platform/browser versions and verification results are in the release candidate report. Only Windows is tested for the command launcher; macOS/Linux support has not been verified. `VERSION.json` identifies the game and packaging commits and every payload hash. `THIRD-PARTY-NOTICES.txt` preserves runtime dependency notices.
