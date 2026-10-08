# HARNESS-H2 Repair 3 — large staged evidence publication

Authorized scope: repair the evidence validator's large-content buffer architecture. Recommended model GPT Sol 6.1; recommended effort High; client metadata confirms availability, selected runtime settings NOT VERIFIED. No product/source, timeout, raw-byte, H1/H4, dependency or runtime configuration change. M15 remains 7/10; Repair 8 NOT STARTED.

Baseline captured at 2026-10-08T03:03:21.620Z: main / 507d6d53b529f38b4510a8b488ed272216c0f5a9, 954 staged, no unstaged/untracked files; full index and 19,685 working SHA inventory captured privately. Existing 883 raw/binary working/index SHA values match. Old validator SHA256 9ebe8dce3febbef6f996b94aea06673564f913f2cf1b1bff307d5f8f120288c6.

ROOT CAUSE = HARNESS BUFFER ARCHITECTURE. Exact Git argv: `git -c core.safecrlf=false show :docs/M15_H4_EVIDENCE/q-pre-unified/native-captures-i-chromium.tar.gz`. Stdout is the exact indexed blob; only its SHA256 is required. Stderr contains Git diagnostics (empty in the original failure). The 71,698,590-byte valid archive exceeded the old 67,108,864-byte synchronous limit: ENOBUFS, native validator exit 1, Git status null / signal SIGTERM. Artifact SHA256 920063097e5e7b854ee6124784a1f2c3e36ac77f08f09883fd563cc744a31485; blob 739c983dd0b47c73314bd51399010ef1cef00e77. It remains intact.

Repair hypothesis: incremental working-file and Git stdout hashing can validate the same bytes with memory proportional to a chunk plus bounded path/attribute metadata. Git stderr is drained concurrently, bounded to a 64 KiB preview, with oversized complete diagnostics preserved on disk. Native exit code, signal, argv and operation are retained on failure. No content chunk array is accumulated. Tiny metadata/check commands retain a bounded 16 MiB buffer.

Step -> verification: preserve baseline -> index/path/blob/classification/raw SHA snapshot; surgical streaming repair -> H2 ordinary and 66 MiB synthetic regression, Git failure/classification/spaced Windows path cases, scoped lint; preservation -> H1/H4 focused tests and original raw/historical hashes; real publication -> unchanged 68.38 MiB archive, native exit 0; complete N -> authored whitespace, manifest/docs/links/privacy/staged consistency; final -> unchanged verify.ps1 exactly once without PNG pre-run; all-pass -> factual docs, diff review, normal commit/push/live parity.

Stop at the first new genuine failure. No H2 Repair 4, M15 Repair 8, timeout change, retry, M16 or deployment is authorized. First authored streaming repair makes H2 cumulative 3/10; H1/H3/H4 remain 1/1/3 each /10. Acceptance requires all focused gates, N and final verify PASS/native 0, unchanged product/raw/PNG inputs, exact main/remote parity and clean checkout. M15 human visual acceptance PENDING; genuinely fresh-session review NOT RUN.

## HARNESS-H2 Repair 3 stopped — 2026-10-08 11:07:58 +08:00

**HARNESS_H2_LARGE_PUBLICATION_BLOCKED**. First new failure: scoped ESLint native1, tests/tools/evidenceStreaming.test.mjs:21, URL no-undef (missing explicit node:url import). No source fix/retry or H2 Repair4. H1/H2/streaming35 and H4 focused91 PASS/native0, including66MiB incremental SHA regression with32KiB chunks. Real publication N and unchanged final verify.ps1 NOT RUN; commit/push NOT RUN. Existing68.38MiB archive retained. ROOT CAUSE of original ENOBUFS = HARNESS BUFFER ARCHITECTURE; historical PNG root cause remains UNKNOWN. [Exact stopped outcome and lossless outputs](HARNESS_H2_R3_EVIDENCE/index.md).

H1/H2/H3/H4 counts1/3/1/3 each /10; M15 remains7/10; Repair8 NOT STARTED. Human visual acceptance PENDING; fresh-session review NOT RUN; M16 NOT STARTED; deployment NOT RUN. STOP; WAITING FOR OWNER DECISION.
