# Launch materials — drafts only

Nothing in this file has been posted or sent. URLs point to the intended repository and will work only after publication.

## 90-second demo script

**0–10s:** “A vague bug report is not a failing test. ReproProof helps maintainers bridge that gap without claiming more than the evidence shows.”

**10–25s:** Show `fixtures/issues/node-add.md`: expected, actual, steps, environment, and deterministic candidate for the offline demo.

**25–40s:** Run `corepack pnpm demo`. Explain that mock mode makes no API call and no issue text becomes a command.

**40–58s:** Open `report.md`: missing information, detected environment, exact command, exit code, duration, and assertion output.

**58–70s:** Open `candidate.patch`: “This is reviewable; ReproProof did not fix or merge anything.”

**70–82s:** Show the security warning: disposable copy, minimal environment, no inherited secrets—but no hardened kernel/container limits yet.

**82–90s:** “Try it on the included fixtures, inspect the evidence, and tell us which maintainer workflow should shape the first real pilot.”

## English announcement

> ReproProof is a new Apache-2.0 CLI for OSS maintainers: turn bug-report prose into structured missing-information analysis, a reviewable failing-test patch, and execution evidence. It is provider-neutral and defaults to an offline mock mode. The v0.1 preview supports Node and Python fixtures; limitations are documented plainly. Repository: https://github.com/YamaTro/reproproof

## 日本語告知文

> ReproProof は、バグ報告の文章から不足情報を整理し、確認可能な失敗テストのパッチと実行証拠を作る Apache-2.0 の CLI です。特定の LLM に依存せず、デフォルトの Mock モードは API キー不要・外部通信なしです。v0.1 は Node/Python の preview で、制限事項も公開しています。https://github.com/YamaTro/reproproof

## Hacker News draft

Title: `Show HN: ReproProof – evidence-first bug reproduction for OSS maintainers`

Body: explain the reproduction-only boundary, offline demo, two controlled fixtures, false-positive lesson, security limitation, and request specific feedback on report usefulness. Do not mention unearned adoption metrics.

## Reddit draft

Title: `I’m building an evidence-first issue-to-failing-test CLI for OSS maintainers`

Body: disclose maintainer/tool-builder status, explain what works, show exact limitations, link source and threat model, and ask whether reviewers prefer patch + logs or a structured question draft. Post only to communities whose self-promotion rules allow it.

## X draft

> ReproProof preview: issue prose → missing facts → reviewable failing-test patch → execution evidence. Local-first, provider-neutral, mock mode by default. No auto-merge and no invented “reproduced” claims. Node/Python fixtures today; hardened sandbox next. https://github.com/YamaTro/reproproof

## Zenn article outline/draft

Title: `OSSメンテナー向け「バグ再現の証拠」を作る ReproProof を開発した`

Sections: メンテナーの再現コスト; 修正エージェントではなく再現に絞る理由; 5分デモ; アーキテクチャ; prompt injection と実行分離; pytest 不在を誤って再現扱いした初期バグと改善; 現在の制限; 貢献方法. State that external adoption is zero at launch.

## dev.to article outline/draft

Title: `Building ReproProof: Why bug reproduction needs evidence before AI patches`

Sections: problem; competitive boundary; provider-neutral interfaces; deterministic mock CI; disposable-copy execution; explicit cloud consent; adapter-specific failure assessment; controlled benchmark; threat model; contributor extension points; request for opt-in maintainers.

## Social preview specification

- Canvas: 1280 × 640 px.
- Background: near-black navy `#0B1020`; high-contrast white text.
- Accent: evidence green `#42D392` and caution amber `#F6C85F`.
- Copy: `ReproProof` and `Issue → failing test → evidence`.
- Visual: three terminal cards connected by arrows; final card has a check beside “assertion captured,” not a generic AI robot.
- Safe area: keep all critical text 80 px from edges; minimum 48 px title; no provider logos or unverified badges.
- Alt text: “ReproProof transforms an issue into a failing-test patch and evidence report.”

## Maintainer outreach draft

> I maintain ReproProof, a local-first tool that produces a failing-test candidate and evidence from a bug report. I’m looking for a small number of opt-in design partners, not asking you to install a bot or accept an AI PR. If this workflow is relevant, would you be willing to review a sample report based only on a fixture or an issue you explicitly authorize? I will not post to your tracker without permission, and unsuccessful results will be documented.

## Candidate projects for consent-based discovery

Do not contact or open issues automatically. After v0.1, evaluate public contribution policies and ask privately/appropriately only where maintainers invite tool feedback: scikit-learn, pytest, Vitest, Jest, FastAPI, Pydantic, ESLint, Ruff, pnpm, and Home Assistant. These are candidates because they have active bug-report/test workflows across supported ecosystems, not because they have endorsed ReproProof.
