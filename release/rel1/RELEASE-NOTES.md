# Casino — Interview Demo v1.0.0

Draft notes only: no GitHub release/tag/upload is established by this file.

Download the custom **casino-interview-demo-v1.0.0.zip** asset and **SHA256SUMS.txt**. GitHub's automatic **Source code (zip)/(tar.gz)** archives are source snapshots, not the lightweight playable demo.

Requires Node.js >=24.19.0 and <25; no npm install/build is needed. Extract the whole ZIP, open its folder, double-click START-DEMO.cmd on Windows (or run `node start-demo.mjs`), open the printed 127.0.0.1 URL, and stop with Ctrl+C. Do not launch from inside the ZIP or open dist/index.html directly.

Includes the casino lobby, Blackjack with local computer guests, and Baccarat. Single-player simulated credits only. Sessions are in memory; refresh/navigation resets credits and history. No M16 completion, multiplayer or production-casino claim. Tested Node24.19.0 / Windows10.0.26200.9457 / Chromium153.0.8010.12; other platforms are unverified.

Game source: `920e1035f22eb7c770c50a409e977bcb33ee66ca`. Packaging source: `dfdfc4ac8d4b40ca4d6af19153d50a5fecc5cd77`. ZIP: 2,977,572 bytes / 2.8396339417 MiB / 26 files. SHA-256: `de05a4692d50f099724d6875ca2cb5118f0b94c2b795eaa6b18099d4c546a6fb`.

Proposed new tag: `interview-demo-v1.0.0`, targeting the exact verified packaging source above. Reconcile current remote/tag/release state before creating it. Upload only ZIP and SHA256SUMS.txt to a draft prerelease; download the uploaded draft to a new directory, compare hash and run extraction/startup smoke before publishing. Publication additionally requires the genuinely separate-client fresh-session review. Verify public asset access without owner credentials and downloaded hash after publication. No clobber/force operation.
