import type { DealerConfiguration, DealerFormalAsset } from './dealerPresentation.js';

// Owner-provided source/runtime files are retained unchanged; see art/source/dealers/MANIFEST.json.
export const FORMAL_DEALER_POOL = ['noble_female', 'knight_female', 'mage_female', 'elf_female', 'halforc_female'] as const;
const files = [
  ['noble_female', 'cfd6a5aff817b19c38363bdefd52ed6a18993b6eb57d5619a7155daad5af8beb', '73a1409d5db2e4565e294bebbef1c61f729b063f94e3c4afbc4bd46434dbddab', '0b7df086510bc567cf77ab6f35e4ec99c92cb20322a6384e52108ca86ac6d23d', '653583f627ae1f9b62186934417d292a9d20c23b694914c9b5644587a16e9472'],
  ['knight_female', '09d869cc5ec6fe8160526832a77e5aaf09bebb623a488800bf9db43f67931a9c', '8b4a4566ff56a135a8109549c93c3714b0c5f62bde1c8a3de21a5b52355a2b3d', 'a1cde162e0826fe68621346235fc7be61c087a908bb164ea94de6030b83cd151', 'cdcdb1fb3c44977469647ff852a84133b8c5444c57a4de777f92f229e8466052'],
  ['mage_female', 'e5f1bb09cddede5e25b6c89217bc1554a5db0b7a13a698a0403158cdbb92604b', 'aaf123b256a272be9a13091ece2bbff4bcd6f17bd0cf5090ec003aa8bb7b63ed', '5b0189202bed9a535e852d8ef8ca10178947a84365e5988299e3e97683fb8af6', '0a48367b8645e5c284f118188a44f7b43cb5bcefc846d1af360910182960802e'],
  ['elf_female', 'dce9191837a86c49582535010c8321e63d8eeb76ae653a9c84743a0ec48909d6', '6145c299ec6abf5d4071b7f8d47e5a80173f42a949166ad1951d078b8d56f0f9', 'f1e85fb45af93b13d148ed1d5966b745baa06b253b9424830906e9a50a94fb97', 'cd339e633c187cc2917a5259defaed888b42887d9ae48313977ab201854dc3ee'],
  ['halforc_female', 'fb9b9ec828ec1ee6bb50cbb2e19b2239953644fb1e40697d071f79b8119f7998', 'ccc53b5417a0d071d859e8e97d5e0dcf84c2ac4fec10581f36397dfafc9122a6', '86409e51cd122ab9cd31d67db9295c4990f4194c408020a6b6350ad0c0ecbc26', '41bf5d62cfae4382346f711f2efdccb30b46f632a9ca467de6c0fa104c9535a6'],
] as const;
export const FORMAL_DEALER_ASSETS: readonly DealerFormalAsset[] = Object.freeze(files.map(([characterId, sourceSha256, sha256, originalSha256, playerSha256]): DealerFormalAsset => ({
  characterId, role: 'dealer', variant: 'formal', format: 'png', transparent: true,
  width: 240, height: 320, aspectRatio: '3:4', src: '/characters/dealer/' + characterId + '/formal.png', sha256,
  safeCrop: 'contain-face-hair-upper-body', provenance: {
    original: { path: 'art/source/characters/PA1_character_sources/' + characterId + '.png', sha256: originalSha256 },
    canonicalPlayer: { path: 'public/characters/' + characterId + '.png', sha256: playerSha256 },
    derivedSource: { path: 'art/source/dealers/' + characterId + '/formal.png', sha256: sourceSha256, width: 1086, height: 1448 },
    method: 'Owner-provided source/runtime pair imported unchanged; resize method not declared in manifest',
    originalProvenanceReference: 'docs/PA1_SOURCE_AUDIT.json; art/source/dealers/MANIFEST.json',
    licensingReview: 'Owner-provided and approved for this project; no independently verified generation/licensing claim',
  }, review: { ownerApproval: 'docs/M10_T04B_EVIDENCE/owner-task.txt; owner-resume.txt; art/source/dealers/MANIFEST.json',
    identityComparison: 'docs/M10_T04B_EVIDENCE/visual-review.json', decodedAssetEvidence: 'docs/M10_T04B_EVIDENCE/runtime-asset-audit.json',
    dealerZoneEvidence: 'docs/M10_T04B_EVIDENCE/screenshots/index.json' },
})));
export const FORMAL_DEALER_CONFIGURATION: DealerConfiguration = Object.freeze({
  preferredCharacterId: 'noble_female', rotationPool: FORMAL_DEALER_POOL, assets: FORMAL_DEALER_ASSETS,
});
