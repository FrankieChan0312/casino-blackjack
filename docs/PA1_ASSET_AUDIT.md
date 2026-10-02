# PA1 source asset audit

Task: PA1-T01. Audit start: 2026-10-02 19:50:54 +08:00. Repository: `C:\Users\user\Documents\GitHub\casino-blackjack`.

Current asset gate: PASS for all twelve staged sources after the resumed audit, 2026-10-02 21:33:22 +08:00. PA1-T01 IMPLEMENTED / VERIFIED after final official harness PASS/0 inspected21:43:19; publication pending. Actual originals are under the designated directory's `PA1_character_sources` child; preserve those paths and bytes. Prior staging/missing-source evidence below remains historical. Current T01 cumulative repairs1/10 for explicit Buffer import in the audit script; availability was not a repair cycle. Source gate itself required no repair.

Expected filenames: `elf_male.png`, `elf_female.png`, `knight_male.png`, `knight_female.png`, `mage_male.png`, `mage_female.png`, `noble_male.png`, `noble_female.png`, `halforc_male.png`, `halforc_female.png`, `dwarf_male.png`, `dwarf_female.png`.

Initial checkpoint: no canonical character source files were found in the repository; source directory/generation direction had been requested before the owner supplied the staging instruction. The executed inventory and individual missing-source results below retain that initial evidence; no staged source has been inspected in this waiting update.

## Executed inventory

Mechanical repository inventory PASS (exit 0):

```powershell
rg --files --hidden --no-ignore -g '!node_modules/**' -g '!.git/**' -g '!dist/**' -g '!test-results/**' -g '!playwright-report/**' -g '*.png' -g '*.webp' -g '*.jpg' -g '*.jpeg' -g '*.svg' -g '*.avif' -g '*.gif'
```

Only existing `docs/images` gameplay screenshots were returned. A second inventory including ignored `test-results` also found only gameplay screenshots. No `assets` or `public` directory exists. `src/ui/CasinoPerson.tsx` contains the existing inline M9 vector dealer/guests, not the requested canonical source artwork. The source audit is limited to this repository; no unrelated repository or private directory was searched.

## Individual gate

| Source ID | Source path/hash | Dimensions/alpha | Visual text/logo/scenery/framing | Gate |
| --- | --- | --- | --- | --- |
| elf_male | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| elf_female | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| knight_male | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| knight_female | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| mage_male | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| mage_female | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| noble_male | unavailable | BLOCKED | NOT RUN; owner-reported scene/banner/text concern unverified | ASSET NOT READY |
| noble_female | unavailable | BLOCKED | NOT RUN; owner-reported scene/banner/text concern unverified | ASSET NOT READY |
| halforc_male | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| halforc_female | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| dwarf_male | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |
| dwarf_female | unavailable | BLOCKED | NOT RUN | ASSET NOT READY |

No source or production asset is declared usable. No failed art has been cropped, masked or disguised with CSS. Preserve this missing-source checkpoint when adding subsequent receipts; it is not a repair cycle. PA1-T01 repairs: 0/10. Production pipeline/model/UI tasks depend on the source gate.

## Resumed complete source audit - 2026-10-02 21:33:22 +08:00

Node read-only audit PASS/0: exact twelve basenames, PNG signature, every chunk CRC, complete inflate/unfilter decode, RGBA8 alpha, dimensions/aspect, material transparency, file SHA256 and decoded RGBA SHA256. Independent System.Drawing decoder/counters agree. Both file and decoded-pixel hashes are unique. All files contain only caBX C2PA provenance in ancillary metadata; no tEXt/zTXt/iTXt/eXIf metadata. Observed claim-generator provenance identifies OpenAI Media Service API; source provenance is retained unchanged, not a claim of cryptographic signature verification.

All actual paths have prefix `art/source/characters/PA1_character_sources/`. Full alpha histograms and decoded hashes: [machine receipt](PA1_SOURCE_AUDIT.json).

| Filename | Dimensions | Aspect W/H | Fully transparent | SHA256 | Mechanical | Visual |
| --- | --- | --- | --- | --- | --- | --- |
| elf_male.png | 1086x1448 | 0.750000 | 25.8394% | `fc22fa69b51a99c386048c637f0c419f9da81cd84448ced636bb04f80715b889` | PASS | PASS |
| elf_female.png | 1086x1448 | 0.750000 | 24.9700% | `f1e85fb45af93b13d148ed1d5966b745baa06b253b9424830906e9a50a94fb97` | PASS | PASS |
| knight_male.png | 1086x1448 | 0.750000 | 22.5940% | `7b78fc7b735fa80cc3e5f44d7a04dcd1daf85e4aa79feae27a033658a1d076c4` | PASS | PASS |
| knight_female.png | 1086x1448 | 0.750000 | 22.0380% | `a1cde162e0826fe68621346235fc7be61c087a908bb164ea94de6030b83cd151` | PASS | PASS |
| mage_male.png | 1086x1448 | 0.750000 | 19.9295% | `05c1308f34f888be6896a4f355a473b2cf59c08cb767ef8e25947465c794b109` | PASS | PASS |
| mage_female.png | 1086x1448 | 0.750000 | 15.1814% | `5b0189202bed9a535e852d8ef8ca10178947a84365e5988299e3e97683fb8af6` | PASS | PASS |
| noble_male.png | 1086x1448 | 0.750000 | 25.5401% | `24835b5bba47cef2bc17e4d807bf31f410607461e90387042d18277e9ded397f` | PASS | PASS |
| noble_female.png | 1086x1448 | 0.750000 | 30.4389% | `0b7df086510bc567cf77ab6f35e4ec99c92cb20322a6384e52108ca86ac6d23d` | PASS | PASS |
| halforc_male.png | 1086x1448 | 0.750000 | 13.4545% | `2b41f2181c80aba53941bbdd7005a0f2961d58744e3f098970d0168213682167` | PASS | PASS |
| halforc_female.png | 1086x1448 | 0.750000 | 18.2890% | `86409e51cd122ab9cd31d67db9295c4990f4194c408020a6b6350ad0c0ecbc26` | PASS | PASS |
| dwarf_male.png | 1122x1402 | 0.800285 | 19.5658% | `26dfc1e8752e7e4c6ae23eb8c196646bea55d559e242fc2de78cc65d3dbf6524` | PASS | PASS |
| dwarf_female.png | 1122x1402 | 0.800285 | 22.1630% | `4cbd5662ca1990ae463c8a0096e08b5b41578323815741af020027fafe349034` | PASS | PASS |

Individual full-resolution inspection and four browser-composited felt/light contact sheets PASS: every character has a clearly visible face, usable upper-body framing, distinct supplied canonical design and sufficient source resolution; no scenery/background, text, logo, frame/nameplate or banner. Elves show blond hair/pointed ears/green and gold garments; knights blue/red plated armor; mages purple robes/staff and hand magic; nobles red/navy/ivory court garments; half-orcs green skin/tusks/fur; dwarves red hair, fur and heavy armor/hammer. Male/female pairs are distinct. Dwarf 1122x1402 vs other1086x1448 aspect difference is recorded; T02 must contain/pad rather than stretch.

`noble_male.png` = Lucien, blond male noble, blue gem/navy waistcoat/red fur cape. `noble_female.png` = Celestine, blond female noble, red jeweled crown/red-ivory dress. Both are the owner-supplied transparent replacement presentation, with no old scene/banner/text. Old images were not supplied here, so no invented old-versus-new byte comparison is claimed.

Initial raw viewer colored-fringe suspicion was diagnosed with actual alpha samples (near-transparent edge pixels) and correct Chromium compositing on felt and light backgrounds. All individual visual quality gates PASS; no source edit or CSS disguise. Preview labels/background are audit-page markup, not baked into source PNGs. Read-only preview command: `node scripts/preview-character-sources.mjs`, screenshots in ignored test-results/pa1-source-{felt,light}-{1,2}.png. T02 production conversion NOT RUN.

T01 source hashes remain unchanged after all inspection. T01 repair count remains0/10. Prior missing-source and staging-wait records retained; this resumes the existing task.
