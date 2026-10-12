export function assertH6Source(source: string, original: string): { originalBlob: string; originalSha256: string; approvedSha256: string };
export function verifyH6Preservation(): { status: string; version: number; originalBlob: string; originalSha256: string; approvedSha256: string; protectedFiles: Record<string, string> };
