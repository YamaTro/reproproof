import { randomUUID } from 'node:crypto';

import { safeRelativePath } from './security.js';

export interface GitHubIssueInput {
  readonly owner: string;
  readonly repository: string;
  readonly number: number;
  readonly url: string;
}

export interface GitHubIssueDocument {
  readonly title: string;
  readonly body: string;
  readonly url: string;
}

export interface DraftPullRequestInput {
  readonly issueUrl: string;
  readonly token: string;
  readonly candidatePath: string;
  readonly candidateContent: string;
  readonly reportSummary: string;
}

export interface DraftPullRequestResult {
  readonly url: string;
  readonly branch: string;
}

export function parseGitHubIssueUrl(value: string): GitHubIssueInput {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'github.com') throw new Error('Only https://github.com issue URLs are supported.');
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length !== 4 || parts[2] !== 'issues' || !/^\d+$/.test(parts[3] ?? '')) throw new Error('Expected a GitHub URL like https://github.com/owner/repository/issues/123.');
  const number = Number(parts[3]);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error('GitHub issue number is invalid.');
  return { owner: parts[0] as string, repository: parts[1] as string, number, url: url.toString() };
}

export async function fetchGitHubIssue(value: string, token?: string): Promise<GitHubIssueDocument> {
  const issue = parseGitHubIssueUrl(value);
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'reproproof/0.1.0',
    'x-github-api-version': '2022-11-28'
  };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(issue.owner)}/${encodeURIComponent(issue.repository)}/issues/${issue.number}`, {
    headers,
    signal: AbortSignal.timeout(30_000)
  });
  if (!response.ok) throw new Error(`GitHub API returned HTTP ${response.status}.`);
  const data = await response.json() as { title?: unknown; body?: unknown; html_url?: unknown; pull_request?: unknown };
  if (data.pull_request) throw new Error('The URL resolves to a pull request; v0.1 accepts issues only.');
  if (typeof data.title !== 'string') throw new Error('GitHub response did not contain a valid issue title.');
  return { title: data.title, body: typeof data.body === 'string' ? data.body : '', url: typeof data.html_url === 'string' ? data.html_url : issue.url };
}

async function githubJson<T>(url: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'reproproof/0.1.0',
      'x-github-api-version': '2022-11-28',
      ...(init.headers ?? {})
    },
    signal: AbortSignal.timeout(30_000)
  });
  if (!response.ok) throw new Error(`GitHub API write returned HTTP ${response.status}.`);
  return await response.json() as T;
}

export async function createDraftPullRequest(input: DraftPullRequestInput): Promise<DraftPullRequestResult> {
  const issue = parseGitHubIssueUrl(input.issueUrl);
  safeRelativePath('/reproproof-github-tree', input.candidatePath);
  const api = `https://api.github.com/repos/${encodeURIComponent(issue.owner)}/${encodeURIComponent(issue.repository)}`;
  const repository = await githubJson<{ default_branch: string }>(api, input.token);
  const base = await githubJson<{ object: { sha: string } }>(`${api}/git/ref/heads/${encodeURIComponent(repository.default_branch)}`, input.token);
  const commit = await githubJson<{ tree: { sha: string } }>(`${api}/git/commits/${base.object.sha}`, input.token);
  const blob = await githubJson<{ sha: string }>(`${api}/git/blobs`, input.token, {
    method: 'POST',
    body: JSON.stringify({ content: input.candidateContent, encoding: 'utf-8' })
  });
  const tree = await githubJson<{ sha: string }>(`${api}/git/trees`, input.token, {
    method: 'POST',
    body: JSON.stringify({ base_tree: commit.tree.sha, tree: [{ path: input.candidatePath, mode: '100644', type: 'blob', sha: blob.sha }] })
  });
  const newCommit = await githubJson<{ sha: string }>(`${api}/git/commits`, input.token, {
    method: 'POST',
    body: JSON.stringify({ message: `test: add reproduction for issue #${issue.number}`, tree: tree.sha, parents: [base.object.sha] })
  });
  const branch = `reproproof-issue-${issue.number}-${randomUUID().slice(0, 8)}`;
  await githubJson<{ ref: string }>(`${api}/git/refs`, input.token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: newCommit.sha })
  });
  try {
    const pull = await githubJson<{ html_url: string }>(`${api}/pulls`, input.token, {
      method: 'POST',
      body: JSON.stringify({
        title: `test: reproduce issue #${issue.number}`,
        head: branch,
        base: repository.default_branch,
        draft: true,
        body: `Draft generated by ReproProof for human review. It does not contain a fix and must not be auto-merged.\n\n${input.reportSummary}\n\nCloses nothing; relates to #${issue.number}.`
      })
    });
    return { url: pull.html_url, branch };
  } catch (error) {
    await fetch(`${api}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${input.token}`, 'user-agent': 'reproproof/0.1.0', 'x-github-api-version': '2022-11-28' }
    }).catch(() => undefined);
    throw error;
  }
}
