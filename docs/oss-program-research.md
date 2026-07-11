# OSS program and maintainer-needs research

Last verified: **2026-07-11 (JST)**. This document separates statements made by program owners from ReproProof's own conclusions. Program rules can change; re-check every linked source before applying.

## Executive finding

Both named programs exist and currently expose application forms. OpenAI uses a qualitative, rolling review for maintainers of active and important projects. Anthropic publishes several objective tracks, but a new project with no adoption does not satisfy them. ReproProof should be built for genuine maintainer value and measured adoption; neither program should be treated as a launch-time entitlement.

## OpenAI: Codex for Open Source

### Confirmed official information

Source: [application form](https://openai.com/form/codex-for-oss/) and [program terms](https://developers.openai.com/codex/codex-for-oss-terms).

- Status: the form displayed a Submit control and stated that applications are reviewed on a rolling basis on the verification date.
- Who can apply: maintainers of active open-source projects. OpenAI looks for meaningful usage, broad adoption, or clear ecosystem importance, plus evidence of active maintenance.
- Maintainer role: the form asks whether the applicant is a primary or core maintainer.
- Signals named by OpenAI: repository usage, ecosystem importance, pull-request review, issue triage, release management, and other ongoing maintenance.
- Stated benefits: six months of ChatGPT Pro including Codex; possible API credits for eligible maintainer workflows; conditional Codex Security access for qualified repositories.
- Form fields observed: first and last name, ChatGPT-account email, public GitHub username, public repository URL, maintainer role, a 500-character qualification explanation, interest in Codex Security and/or API credits, OpenAI Organization ID, a 500-character API-credit use explanation, and an optional 500-character note.
- Terms: benefits are discretionary, non-transferable, and not guaranteed. Accurate information and verification of repository affiliation/control may be required. Unauthorized scanning is forbidden. Fraud, multiple identities, and misleading metrics may cause rejection or revocation.

### Not specified by the official sources

- No numeric minimum for stars, downloads, dependents, contributors, or Criticality Score is published.
- No fixed application response time or guaranteed credit amount is published.
- No explicit minimum age appears in the program-specific form or terms reviewed. General account/service terms still apply.

### ReproProof judgment

ReproProof is not currently a credible applicant: it has no public repository, releases, external users, or maintenance history. Apply only after public evidence shows active maintenance plus meaningful use or ecosystem importance.

## Anthropic: Claude for Open Source

### Confirmed official information

Sources: [program page](https://claude.com/contact-sales/claude-for-oss) and [terms](https://www.anthropic.com/claude-for-oss-terms).

- Status: the page displayed “Apply now”; terms say applications are rolling until Anthropic closes the period or reaches its cap.
- Benefit: six consecutive months of Claude Max 20x. The terms state the base subscription is complimentary, but overages may be charged. Existing paid subscriptions resume after the benefit period unless canceled.
- Cap: the terms state up to 10,000 approved recipients unless Anthropic increases it.
- The applicant must satisfy at least one maintainer or ecosystem-impact track and every general requirement.
- Published maintainer-track alternatives:
  - 500 dependent repositories in aggregate; or
  - 100 dependent packages in aggregate; or
  - 200,000 combined monthly registry downloads; or
  - listed committer/maintainer of a recognized foundation or language project; or
  - 100 merged PRs to public repositories the applicant does not own in the prior 12 months; or
  - 20 unique external contributors with merged PRs to a maintained repository in the prior 12 months; or
  - a maintained repository with OpenSSF Criticality Score at least 0.4.
- Discretionary ecosystem-impact track: maintainers or significant contributors may explain why the ecosystem meaningfully depends on their project even without a numeric threshold.
- General requirements include: natural person; at least 18 or local age of majority, whichever is greater; eligible country and export/sanctions status; GitHub account in good standing and at least two years old; public OSS activity in the preceding 90 days; contribution to an OSI-approved project; not Anthropic staff/contractor or immediate household/family.
- Application information: GitHub OAuth sign-in, GitHub-associated email, planned use, and a qualification explanation of at most 500 words.
- Anthropic explicitly discounts trivial, duplicative, automated, or manipulated activity and may revoke benefits for artificial inflation.

### ReproProof judgment

The owner’s stated age of 18 satisfies the age floor only if 18 is also the age of majority in their jurisdiction. GitHub-account age, eligible residence, and recent public activity are unverified. ReproProof starts at zero on every project-adoption threshold. Do not apply yet.

## OpenSSF Criticality Score

Confirmed official source: [OpenSSF Criticality Score](https://openssf.org/projects/criticality-score/).

- It defines project influence/importance on a 0-to-1 scale.
- Its goals are to score open-source projects, identify projects the community depends on, and guide proactive security improvement.
- Anthropic explicitly uses 0.4 as one eligibility route. OpenAI does not publish a Criticality Score threshold.
- Judgment: it is an influence signal, not a target to game. A new repository should expect a low or absent score.

## Similar support programs

These are adjacent rather than interchangeable:

- [GitHub Secure Open Source Fund](https://github.com/open-source/github-secure-open-source-fund): rolling security-focused support for maintainers; the page states $10,000 per selected project, security programming, an 18+ rule, community traction/adoption, governance, and GitHub Sponsors regional availability.
- [GitHub open-source benefits](https://github.com/open-source): GitHub states that eligible maintainers can receive benefits such as Copilot Pro, Actions capacity, maintainer community access, Sponsors, and security/funding programs.
- [OpenSSF Alpha-Omega](https://openssf.org/community/alpha-omega/): partners with critical projects and ecosystems on sustainable security improvement and vulnerability finding/fixing; not a general new-project credit program.
- [Sovereign Tech Agency programs](https://www.sovereign.tech/programs): funds and supports critical open digital infrastructure through fund, resilience, standards, fellowship, and challenge mechanisms; selection and timelines differ by program.

## Maintainer needs and evidence for the product

### Confirmed evidence

- OpenAI’s own program page names review, issue triage, releases, security, and code quality as significant maintainer workload.
- GitHub’s [issue guidance](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/quickstart) asks bug reporters for reproduction steps and expected versus actual behavior.
- scikit-learn’s [minimal reproducer guidance](https://scikit-learn.org/stable/developers/minimal_reproducer.html) calls a minimal reproducible example key to efficient community communication.
- The peer-reviewed/preprint systems [LIBRO](https://arxiv.org/abs/2209.11515), [Issue2Test](https://arxiv.org/abs/2503.16320), and [Echo](https://arxiv.org/abs/2603.07326) demonstrate both demand and difficulty. Their reported success rates remain far below 100%, so an honest tool must expose uncertainty and execution evidence.
- [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github) and [SWE-agent](https://github.com/SWE-agent/SWE-agent) focus primarily on resolving issues and opening code-change PRs.

### Inference

There is room for a narrower, maintainer-controlled product that stops before the fix: parse a report, identify missing facts, generate a candidate reproduction, execute it in isolation, and provide a reviewable patch plus evidence. This is not proof of market adoption; it is the product hypothesis to validate with maintainer interviews and opt-in pilots.

## Open research questions

- Will maintainers trust a reproduction-only tool more than a full repair agent?
- Is local setup cost lower than the time saved on triage?
- Which repositories permit safe, deterministic dependency setup without network access?
- What validation best detects a test that fails for the wrong reason?
- Which report fields are actionable across different project cultures?

No user count, recommendation, benchmark beyond the controlled fixtures, or program acceptance is implied by this research.
