# PA1 deterministic production assets

Task PA1-T02. Recommended GPT Sol 6.1 / High; actual client model/effort NOT VERIFIED / NOT VERIFIED. Scope: reproducible transparent derivatives from the twelve passed T01 originals. Non-goals: source edits, new artwork, character assignment/UI, domain/gameplay/replay/RNG/policy changes. Stop on failed source receipt, unavailable pinned tools, output transparency/quality/size/reproducibility failure or ten repairs.

Sources remain unchanged in `art/source/characters/PA1_character_sources`. The read-only PNG audit checks all chunk CRCs/complete RGBA decode and matches the entire recorded T01 receipt before conversion. Retain original C2PA provenance there; transformed outputs do not copy a provenance signature for different pixels.

Fixed tools: Node v24.19.0, Playwright 1.63.0, bundled Chromium 153.0.8010.12. The pipeline checks actual versions and fails on mismatch. The repository lockfile retains the existing dependencies; no new dependency. Browser Canvas2D produces PNG at 240x320, uniform contain/center, transparent canvas, high-quality interpolation, no crop/stretch, no text/background/logo additions. Dwarves have centered transparent padding for their wider source aspect. Output per-file budget400000 bytes; at least1% fully transparent pixels required. These derivatives support portrait display up to80x106 CSS px at3x resolution.

```powershell
node scripts/build-character-assets.mjs
node scripts/build-character-assets.mjs --check
node scripts/verify-character-assets.mjs
```

The first command writes `public/characters/<canonical-id>.png` and [source/output/version receipts](../art/character-production.json). The second generates every image again with the pinned tools, compares exact PNG bytes and the complete receipt, and writes nothing. Run the second command after generation and at final verification. The third combines full source and decoded-production mechanical receipt equality with that pinned reproduction, without writes. All commands preserve sources. Reproducibility is defined for these exact pinned tools; an upgrade requires a separately reviewed receipt change.

T02 acceptance requires successful commands with checked exit codes, all twelve production portraits visually inspected on light/felt backgrounds, original source hashes unchanged, and official engineering/diff verification. The renderer is an offline asset tool; production gameplay never runs conversion or reads original files. No source file is replaced or hidden with CSS.
