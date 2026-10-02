# PA1 inspected screenshots

Reproduce with `npm.cmd run test:e2e -- tests/browser/pa1.spec.ts`. Chromium uses a deterministic presentation chooser and public controlled gameplay fixture; no hidden card or private shoe is published. E03 writes all twelve avatar views; E04 writes three viewport views; E05 writes two failed-image/200% root-text views. These are test fixtures, not production randomness or deployment evidence.

All seventeen images individually visually inspected at the T06 checkpoint. Transparent portraits have distinct visible faces and no baked text, frame, banner or scenery. Identity labels, explicit Human/Computer/You ownership, wagers, current-hand cues and cards remain separate. Noble views show Lucien/Celestine replacements. Dealer remains the existing illustration. Expanded character picker shows a native selector with visible focus. At320px guests use existing expandable public-card summaries; vertical scrolling remains deliberate. Character selection is secondary to actions.

Failed-image views deliberately show the browser's broken-image/alt treatment; full names/archetypes/controller text remain separately visible. Root text enlargement is200%, not an OS zoom or screen-reader certification. Existing decorative card corners/pips can extend at enlarged text, while primary rank/suit labels and playable actions remain visible. No card CSS or gameplay was changed. This bounded check does not claim comprehensive WCAG conformance or assistive-technology testing.

| Identity | Actual player hand |
| --- | --- |
| Caelan | [Male Elf](images/pa1-avatar-elf_male.png) |
| Elaria | [Female Elf](images/pa1-avatar-elf_female.png) |
| Roland | [Male Human Knight](images/pa1-avatar-knight_male.png) |
| Seraphine | [Female Human Knight](images/pa1-avatar-knight_female.png) |
| Alaric | [Male Mage](images/pa1-avatar-mage_male.png) |
| Nyra | [Female Mage](images/pa1-avatar-mage_female.png) |
| Lucien | [Male Noble](images/pa1-avatar-noble_male.png) |
| Celestine | [Female Noble](images/pa1-avatar-noble_female.png) |
| Garruk | [Male Half-Orc Warrior](images/pa1-avatar-halforc_male.png) |
| Vesha | [Female Half-Orc Warrior](images/pa1-avatar-halforc_female.png) |
| Borin | [Male Dwarf](images/pa1-avatar-dwarf_male.png) |
| Brynja | [Female Dwarf](images/pa1-avatar-dwarf_female.png) |

| View | Screenshot |
| --- | --- |
| Desktop1280x900, focused native selector | [Desktop](images/pa1-responsive-1280.png) |
| Tablet768x1024, focused native selector | [Tablet](images/pa1-responsive-768.png) |
| Mobile320x720, focused native selector | [Mobile](images/pa1-responsive-320.png) |
| Desktop failed portraits +200% root text | [Fallback desktop](images/pa1-text-fallback-1280.png) |
| Mobile failed portraits +200% root text | [Fallback mobile](images/pa1-text-fallback-320.png) |

Production contact sheets were individually inspected in T02: [felt1](images/pa1-production-felt-1.png), [felt2](images/pa1-production-felt-2.png), [light1](images/pa1-production-light-1.png), [light2](images/pa1-production-light-2.png). Individual source receipts are in [asset audit](PA1_ASSET_AUDIT.md). Git preserves original M9 and earlier screenshot versions; current M9 views reflect the authorized fantasy presentation.
