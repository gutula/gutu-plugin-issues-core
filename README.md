# Issues Core

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Governed collaboration primitives for projects, issues, comments, activity, inbox queues, attachments, and resumable issue sessions.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-0f766e) ![Verification: Docs+Build+Typecheck+Lint+Test+Contracts+Integration+Migrations](https://img.shields.io/badge/Verification-Docs%2BBuild%2BTypecheck%2BLint%2BTest%2BContracts%2BIntegration%2BMigrations-6b7280) ![DB: postgres+sqlite](https://img.shields.io/badge/DB-postgres%2Bsqlite-2563eb) ![Integration Model: Actions+Resources+Builders+UI](https://img.shields.io/badge/Integration%20Model-Actions%2BResources%2BBuilders%2BUI-6b7280)

**Maturity Tier:** `Hardened`

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party plugin |
| Domain group | AI Systems |
| Primary focus | projects, issues, comments, inbox, attachments, resumable sessions |
| Best when | You want Multica-style agents-as-teammates collaboration without abandoning governed policy, audit, and replay-safe state. |
| Composes through | Actions+Resources+Builders+UI |

- `issues-core` gives the governed work OS a first-class collaboration plane instead of leaving issue state, comments, and resumable sessions hidden inside higher-level packs.
- `company-builder-core`, `automation-core`, and future operating-model packs consume this layer rather than redefining issue workflows locally.

## What It Does Now

- Exports 8 governed actions: `issues.projects.upsert`, `issues.issues.create`, `issues.issues.assign`, `issues.comments.add`, `issues.attachments.add`, `issues.dependencies.link`, `issues.inbox.transition`, `issues.sessions.attach`.
- Owns 8 public resources: `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.
- Adds an `issues` workspace plus `issue-builder` and `project-builder` under `tools`.
- Persists polymorphic issue reporters and assignees, comment threads, operator inbox items, explicit blocker dependencies, and resumable runtime session linkage.
- Gives Pack 0 and future autopilot flows a durable place to land escalations, waiting-human work, and runtime handoff context.

## Maturity

`issues-core` is `Hardened` because it exports durable collaboration contracts, ships operator-facing admin surfaces, and carries unit, contract, integration, and migration coverage for the public surface.

## Verified Capability Summary

- Group: **AI Systems**
- Verification surface: **Docs+Build+Typecheck+Lint+Test+Contracts+Integration+Migrations**
- Tests discovered: **6** files across unit, contract, integration, and migration lanes
- Integration model: **Actions+Resources+Builders+UI**
- Database support: **postgres + sqlite**

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package | `@plugins/issues-core` |
| Manifest ID | `issues-core` |
| Repo | `gutu-plugin-issues-core` |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.issues` |
| Provided Capabilities | `issues.issues`, `issues.projects`, `issues.inbox`, `issues.sessions` |
| Runtime | bun>=1.3.12 |
| Database | postgres, sqlite |
| Integration Model | Actions+Resources+Builders+UI |

## Capability Matrix

| Surface | Count | Details |
| --- | --- | --- |
| Actions | 8 | `issues.projects.upsert`, `issues.issues.create`, `issues.issues.assign`, `issues.comments.add`, `issues.attachments.add`, `issues.dependencies.link`, `issues.inbox.transition`, `issues.sessions.attach` |
| Resources | 8 | `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions` |
| Builders | 2 | `issue-builder`, `project-builder` |
| Workspaces | 1 | `issues` |
| UI | Present | issue board, issue builder, project builder, admin commands |

## Quick Start For Integrators

Use this repo inside a compatible Gutu workspace so its `workspace:*` dependencies resolve truthfully.

```bash
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import {
  manifest,
  createIssueAction,
  assignIssueAction,
  IssueResource,
  IssueSessionResource
} from "@plugins/issues-core";

console.log(manifest.id);
console.log(createIssueAction.id);
console.log(assignIssueAction.id);
console.log(IssueResource.id, IssueSessionResource.id);
```

## Current Test Coverage

- Root verification scripts: `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:contracts`, `bun run test:integration`, `bun run test:migrations`, `bun run test:unit`, `bun run docs:check`
- Unit files: 2
- Contracts files: 2
- Integration files: 1
- Migrations files: 1

## Known Boundaries And Non-Goals

- This plugin owns collaboration state, not the lower-level AI runtime or workflow orchestration primitives.
- It models issue-linked sessions and inbox posture, but it does not execute external runtimes by itself.
- Rich portal-grade discussion UX and public collaboration are intentionally out of scope for this operator-first rollout.

## Recommended Next Milestones

- Add board swimlane presets and watch-list-aware queue views on top of the shipped blocker graph.
- Add signed template issue/project install flows for reusable operating-model packs.
- Deepen cross-plugin evidence linking so issue activity can directly reference approvals, evals, and runtime logs.
- Add richer live-presence and collaboration UX once real external transports replace the same-process fixture posture.

## More Docs

See [DEVELOPER.md](./DEVELOPER.md), [TODO.md](./TODO.md), [SECURITY.md](./SECURITY.md), and [CONTRIBUTING.md](./CONTRIBUTING.md).
