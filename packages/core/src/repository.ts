import { lstat, readFile, readdir } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';
import { safeRelativePath } from './security.js';
import type { RepositoryProfile } from './types.js';

const guidanceNames = new Set(['README.md', 'README.rst', 'CONTRIBUTING.md', 'AGENTS.md']);
const manifestNames = new Set(['package.json', 'pyproject.toml', 'pytest.ini', 'vitest.config.ts', 'vitest.config.js', 'jest.config.js', 'jest.config.ts']);

async function findKnown(root: string, maxDepth = 3): Promise<string[]> {
  const found: string[] = [];
  async function walk(current: string, depth: number): Promise<void> {
    if (depth > maxDepth) return;
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (['.git', 'node_modules', 'dist', '.venv', '__pycache__'].includes(entry.name)) continue;
      const absolute = join(current, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) await walk(absolute, depth + 1);
      else if (guidanceNames.has(entry.name) || manifestNames.has(entry.name)) found.push(relative(root, absolute).replaceAll('\\', '/'));
    }
  }
  await walk(root, 0);
  return found.sort();
}

export async function analyzeRepository(root: string): Promise<RepositoryProfile> {
  const stat = await lstat(root);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Repository path must be a real directory, not a symlink.');
  const files = await findKnown(root);
  const manifests = files.filter((file) => manifestNames.has(basename(file)));
  const guidanceFiles = files.filter((file) => guidanceNames.has(basename(file)));
  const languages: Array<'node' | 'python'> = [];
  const frameworks: Array<'jest' | 'vitest' | 'node-test' | 'pytest'> = [];
  const packageJson = manifests.find((file) => basename(file) === 'package.json');
  if (packageJson) {
    languages.push('node');
    const content = await readFile(safeRelativePath(root, packageJson), 'utf8');
    if (/vitest/i.test(content)) frameworks.push('vitest');
    else if (/jest/i.test(content)) frameworks.push('jest');
    else frameworks.push('node-test');
  }
  if (manifests.some((file) => ['pyproject.toml', 'pytest.ini'].includes(basename(file)))) {
    languages.push('python');
    frameworks.push('pytest');
  }
  return { root, languages, testFrameworks: frameworks, guidanceFiles, manifests };
}

export async function readRepositoryContext(profile: RepositoryProfile, byteLimit = 120_000): Promise<Record<string, string>> {
  const selected: Record<string, string> = {};
  let used = 0;
  for (const path of [...profile.guidanceFiles, ...profile.manifests]) {
    const content = await readFile(safeRelativePath(profile.root, path), 'utf8');
    const remaining = byteLimit - used;
    if (remaining <= 0) break;
    selected[path] = content.slice(0, remaining);
    used += Buffer.byteLength(selected[path] ?? '', 'utf8');
  }
  return selected;
}
