import { lstat } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';

const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{16,}\b/g,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\b(?:api[_-]?key|token|secret|password)\s*[:=]\s*[^\s]+/gi
];

export function maskSecrets(value: string): string {
  return SECRET_PATTERNS.reduce((masked, pattern) => masked.replace(pattern, '[REDACTED]'), value);
}

export function safeRelativePath(root: string, candidate: string): string {
  if (!candidate || candidate.includes('\0')) throw new Error('Candidate path is empty or contains a null byte.');
  const absoluteRoot = resolve(root);
  const absoluteCandidate = resolve(absoluteRoot, candidate);
  if (absoluteCandidate !== absoluteRoot && !absoluteCandidate.startsWith(`${absoluteRoot}${sep}`)) {
    throw new Error(`Candidate path escapes the workspace: ${candidate}`);
  }
  return absoluteCandidate;
}

export function sanitizedEnvironment(source: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  // APPDATA is required for Python's per-user site-packages on Windows. Credential
  // variables remain excluded, and child code never receives provider/GitHub keys.
  const allowed = ['PATH', 'Path', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'APPDATA', 'LANG', 'LC_ALL', 'CI'];
  return Object.fromEntries(allowed.flatMap((key) => source[key] === undefined ? [] : [[key, source[key]]])) as NodeJS.ProcessEnv;
}

export function containsSymlink(pathParts: readonly string[], lstat: (path: string) => { isSymbolicLink(): boolean }): boolean {
  return pathParts.some((part) => lstat(part).isSymbolicLink());
}

export async function assertNoSymlinkParents(root: string, candidate: string): Promise<void> {
  const absoluteRoot = resolve(root);
  const parent = dirname(safeRelativePath(root, candidate));
  const parts = relative(absoluteRoot, parent).split(/[\\/]/).filter(Boolean);
  let current = absoluteRoot;
  for (const part of parts) {
    current = resolve(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) throw new Error(`Candidate path crosses a symbolic link: ${part}`);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') break;
      throw error;
    }
  }
}
