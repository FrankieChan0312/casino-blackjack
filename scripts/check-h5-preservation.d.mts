import type { Buffer } from 'node:buffer';

export interface GitSourceIdentity {
  oid: string;
  sha256: string;
}
export interface CanonicalGitSource extends GitSourceIdentity {
  bytes: Buffer;
  text: string;
}
export interface H5SourceIdentity {
  id: string;
  historicalGitSha256: string;
  approvedSourceSha256: string;
}
export interface M15SourceIdentity {
  file: string;
  originalSha256: string;
  approvedSha256: string;
  approvedEdits: { from: string; to: string }[];
}
export function readGitBlob(root: string, identity: GitSourceIdentity): CanonicalGitSource;
export function readGitBlobs(root: string, identities: GitSourceIdentity[]): CanonicalGitSource[];
export function parseGitSourceAttributes(files: string[], output: Buffer): Map<string, Map<string, string>>;
export function readGitSourceAttributes(root: string, files: string[]): Map<string, Map<string, string>>;
export function canonicalizeGitSource(root: string, file: string, bytes: Buffer): CanonicalGitSource;
export function verifyWorkingSource(root: string, file: string, identity: GitSourceIdentity): CanonicalGitSource;
export function compareH5Source(original: string, current: string, entry: H5SourceIdentity): { id: string; newIds: string[] };
export function compareM15Source(original: string, current: string, entry: M15SourceIdentity): { file: string };
export function verifyM15OutputPreservation(root?: string): { status: string; files: number; nativeCases: number };
export function compareM15ValidatorSource(original: string, current: string, entry: M15SourceIdentity): { file: string };
export function verifyM15ValidatorPreservation(root?: string): { status: string; files: number; nativeCases: number };
export function verifyH5Preservation(root?: string): {
  status: string;
  factories: number;
  newCases: number;
  checkpoints: number;
  staticAssertionSites: number;
  screenshotOperations: number;
  missingScenarios: number;
  omittedAssertions: number;
  omittedScreenshots: number;
  nonTargetPaths: number;
  gitSubprocessesWithinInvocation: number;
  m15: { status: string; files: number; nativeCases: number };
  m15Validator: { status: string; files: number; nativeCases: number };
  h6: { status: string; originalAssertions: number; originalBlob: string; approvedSha256: string };
};
export function comparePublicationValidatorSource(original: string, current: string): { file: string };
