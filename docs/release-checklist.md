# v0.1.0 release checklist

Do not mark an unchecked item complete without evidence.

## Local gates

- [x] Apache-2.0 license and OSS governance files exist.
- [x] `corepack pnpm check` succeeds locally.
- [x] Node and Python controlled E2E fixtures produce verified assertion failures.
- [x] Mock mode reports zero tokens and zero estimated API cost.
- [x] npm returned 404 for `reproproof` and `@reproproof/cli` on 2026-07-11, indicating no package at those exact names at that time.
- [ ] GitHub public API confirms repository name availability immediately before creation. A network approval limit prevented the final API query locally.
- [ ] Docker sandbox image builds and both fixtures pass inside it.
- [ ] Action workflow passes on `ubuntu-latest` and `windows-latest`.
- [ ] CodeQL and dependency review pass.
- [ ] Cloud and local provider protocols have opt-in live smoke tests without committing keys.
- [ ] Draft PR flow is live-tested in an owned disposable repository with minimal permissions.

## Replace placeholders

- [x] Replace every `OWNER/reproproof` URL in templates and docs.
- [ ] Add the real private security-reporting route.
- [ ] Confirm package scope ownership before npm publication.
- [ ] Add a factual copyright owner/year only if desired.

Find placeholders with:

```bash
rg -n 'OWNER|実績取得後に記入|申請者本人' README* docs .github
```

Application placeholders are expected until evidence exists; repository URL placeholders are not.

## GitHub publication commands

Requires GitHub CLI, an authenticated intended account, and successful name/secret checks:

```bash
gh auth status
gh api user --jq .login
gh repo view YamaTro/reproproof
gh repo create YamaTro/reproproof --public --source=. --remote=origin --description "Evidence-first bug reproduction for open-source maintainers" --push
gh repo edit YamaTro/reproproof --enable-discussions --add-topic oss --add-topic bug-reproduction --add-topic testing --add-topic maintainers --add-topic typescript
gh workflow run CI --repo YamaTro/reproproof
gh run list --repo YamaTro/reproproof --workflow CI --limit 5
```

Create only the substantive issues drafted in [initial-issues.md](initial-issues.md), after reviewing them:

```bash
gh issue create --repo YamaTro/reproproof --title "Roadmap: validate the v0.1 security and evidence boundaries" --body-file .github/issue-drafts/roadmap.md --label roadmap
gh issue create --repo YamaTro/reproproof --title "Add a wrong-reason failure classification fixture" --body-file .github/issue-drafts/good-first-wrong-reason.md --label "good first issue,testing"
```

After every required workflow is green and release notes are reviewed:

```bash
git tag -s v0.1.0 -m "ReproProof v0.1.0"
git push origin v0.1.0
gh release view v0.1.0 --repo YamaTro/reproproof
```

The tag command requires a configured signing key. If signing is unavailable, configure signing rather than silently publishing an unverifiable tag.

## Pages and package publication

- [ ] Enable GitHub Pages with GitHub Actions as the source.
- [ ] Verify the deployed URL and all links.
- [ ] Review packed npm contents and provenance configuration.
- [ ] Publish packages only after ownership, 2FA/provenance, and workspace dependency rewriting are verified.

No npm publication is required for the source-only v0.1 release if packaging is not yet safe.
