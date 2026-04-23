# Issues Core Developer Guide

Projects, issues, comments, inbox, attachments, and resumable issue sessions for the governed work OS.

**Maturity Tier:** `Hardened`

## Purpose And Architecture Role

Defines the governed issue and work-item domain used by AI runtimes, operators, and automations to coordinate tracked execution.

### This plugin is the right fit when

- You need **issues**, **work items**, **governed execution tracking** as a governed domain boundary.
- You want to integrate through declared actions, resources, jobs, workflows, and UI surfaces instead of implicit side effects.
- You need the host application to keep plugin boundaries honest through manifest capabilities, permissions, and verification lanes.

### This plugin is intentionally not

- Not an everything-and-the-kitchen-sink provider abstraction layer.
- Not a substitute for explicit approval, budgeting, and audit governance in the surrounding platform.

## Repo Map

| Path | Purpose |
| --- | --- |
| `package.json` | Root extracted-repo manifest, workspace wiring, and repo-level script entrypoints. |
| `framework/builtin-plugins/issues-core` | Nested publishable plugin package. |
| `framework/builtin-plugins/issues-core/src` | Runtime source, actions, resources, services, and UI exports. |
| `framework/builtin-plugins/issues-core/tests` | Unit, contract, integration, and migration coverage where present. |
| `framework/builtin-plugins/issues-core/docs` | Internal domain-doc source set kept in sync with this guide. |
| `framework/builtin-plugins/issues-core/db/schema.ts` | Database schema contract when durable state is owned. |
| `framework/builtin-plugins/issues-core/src/postgres.ts` | SQL migration and rollback helpers when exported. |

## Manifest Contract

| Field | Value |
| --- | --- |
| Package Name | `@plugins/issues-core` |
| Manifest ID | `issues-core` |
| Display Name | Issues Core |
| Domain Group | AI Systems |
| Default Category | Business / Work Management |
| Version | `0.1.0` |
| Kind | `plugin` |
| Trust Tier | `first-party` |
| Review Tier | `R1` |
| Isolation Profile | `same-process-trusted` |
| Framework Compatibility | ^0.1.0 |
| Runtime Compatibility | bun>=1.3.12 |
| Database Compatibility | postgres, sqlite |

## Dependency Graph And Capability Requests

| Field | Value |
| --- | --- |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core` |
| Recommended Plugins | None |
| Capability Enhancing | None |
| Integration Only | None |
| Suggested Packs | None |
| Standalone Supported | Yes |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.issues` |
| Provides Capabilities | `issues.issues`, `issues.projects`, `issues.inbox`, `issues.sessions` |
| Owns Data | `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.sessions` |

### Dependency interpretation

- Direct plugin dependencies describe package-level coupling that must already be present in the host graph.
- Requested capabilities tell the host what platform services or sibling plugins this package expects to find.
- Provided capabilities and owned data tell integrators what this package is authoritative for.

## Public Integration Surfaces

| Type | ID / Symbol | Access / Mode | Notes |
| --- | --- | --- | --- |
| Action | `issues.projects.upsert` | Permission: `issues.projects.upsert` | Idempotent<br>Audited |
| Action | `issues.issues.create` | Permission: `issues.issues.create` | Idempotent<br>Audited |
| Action | `issues.issues.assign` | Permission: `issues.issues.assign` | Idempotent<br>Audited |
| Action | `issues.comments.add` | Permission: `issues.comments.add` | Idempotent<br>Audited |
| Action | `issues.attachments.add` | Permission: `issues.attachments.add` | Idempotent<br>Audited |
| Action | `issues.dependencies.link` | Permission: `issues.dependencies.link` | Idempotent<br>Audited |
| Action | `issues.inbox.transition` | Permission: `issues.inbox.transition` | Idempotent<br>Audited |
| Action | `issues.sessions.attach` | Permission: `issues.sessions.attach` | Idempotent<br>Audited |
| Resource | `issues.projects` | Portal disabled | Governed project containers for issue queues and collaboration state.<br>Purpose: Keep project ownership, queue defaults, and collaboration boundaries explicit and auditable.<br>Admin auto-CRUD enabled<br>Fields: `label`, `status`, `ownerId`, `defaultQueue`, `updatedAt` |
| Resource | `issues.issues` | Portal disabled | Durable issue inventory with human or agent assignees.<br>Purpose: Track collaboration work items, queue routing, and session linkage without hiding state in workflow blobs.<br>Admin auto-CRUD enabled<br>Fields: `title`, `status`, `priority`, `queue`, `assigneeId`, `updatedAt` |
| Resource | `issues.comments` | Portal disabled | Durable issue comment thread entries.<br>Purpose: Retain human and agent discussion history in a typed auditable record.<br>Admin auto-CRUD enabled<br>Fields: `issueId`, `actorId`, `createdAt` |
| Resource | `issues.activity` | Portal disabled | Issue activity timeline covering creation, assignment, comments, attachments, and sessions.<br>Purpose: Provide operator-visible issue history without requiring raw workflow replay inspection.<br>Admin auto-CRUD enabled<br>Fields: `issueId`, `type`, `createdAt` |
| Resource | `issues.attachments` | Portal disabled | Attachment references linked to issues.<br>Purpose: Keep evidence and external artifact links typed and auditable.<br>Admin auto-CRUD enabled<br>Fields: `issueId`, `label`, `kind`, `createdAt` |
| Resource | `issues.inbox` | Portal disabled | Issue inbox entries for assignments, mentions, waiting-human work, and escalations.<br>Purpose: Give operators a durable queue for collaboration follow-up instead of relying on implicit notifications alone.<br>Admin auto-CRUD enabled<br>Fields: `issueId`, `queue`, `reason`, `ownerId`, `status`, `updatedAt` |
| Resource | `issues.dependencies` | Portal disabled | Explicit blocker relationships between issues.<br>Purpose: Keep issue blockers durable and queryable instead of burying dependency state in free-form comments.<br>Admin auto-CRUD enabled<br>Fields: `issueId`, `blockerIssueId`, `status`, `updatedAt` |
| Resource | `issues.sessions` | Portal disabled | Issue-linked runtime session resume metadata.<br>Purpose: Keep session resume context durable so collaboration and runtime flows can reconnect safely.<br>Admin auto-CRUD enabled<br>Fields: `issueId`, `sessionId`, `runtimeId`, `status`, `updatedAt` |





### UI Surface Summary

| Surface | Present | Notes |
| --- | --- | --- |
| UI Surface | Yes | A bounded UI surface export is present. |
| Admin Contributions | Yes | Additional admin workspace contributions are exported. |
| Zone/Canvas Extension | No | No dedicated zone extension export. |

## Hooks, Events, And Orchestration

This plugin should be integrated through **explicit commands/actions, resources, jobs, workflows, and the surrounding Gutu event runtime**. It must **not** be documented as a generic WordPress-style hook system unless such a hook API is explicitly exported.

- No standalone plugin-owned lifecycle event feed is exported today.
- No plugin-owned job catalog is exported today.
- No plugin-owned workflow catalog is exported today.
- Recommended composition pattern: invoke actions, read resources, then let the surrounding Gutu command/event/job runtime handle downstream automation.

## Storage, Schema, And Migration Notes

- Database compatibility: `postgres`, `sqlite`
- Schema file: `framework/builtin-plugins/issues-core/db/schema.ts`
- SQL helper file: `framework/builtin-plugins/issues-core/src/postgres.ts`
- Migration lane present: Yes

The plugin does not export a dedicated SQL helper module today. Treat the schema and resources as the durable contract instead of inventing undocumented SQL behavior.

## Failure Modes And Recovery

- Action inputs can fail schema validation or permission evaluation before any durable mutation happens.
- If downstream automation is needed, the host must add it explicitly instead of assuming this plugin emits jobs.
- There is no separate lifecycle-event feed to rely on today; do not build one implicitly from internal details.
- Schema regressions are expected to show up in the migration lane and should block shipment.

## Mermaid Flows

### Primary Lifecycle

```mermaid
flowchart LR
  caller["Host or operator"] --> action["issues.projects.upsert"]
  action --> validation["Schema + permission guard"]
  validation --> service["Issues Core service layer"]
  service --> state["issues.projects"]
  state --> ui["Admin contributions"]
```



## Integration Recipes

### 1. Host wiring

```ts
import { manifest, upsertIssueProjectAction, IssueProjectResource, adminContributions, uiSurface } from "@plugins/issues-core";

export const pluginSurface = {
  manifest,
  upsertIssueProjectAction,
  IssueProjectResource,
  
  
  adminContributions,
  uiSurface
};
```

Use this pattern when your host needs to register the plugin’s declared exports without reaching into internal file paths.

### 2. Action-first orchestration

```ts
import { manifest, upsertIssueProjectAction } from "@plugins/issues-core";

console.log("plugin", manifest.id);
console.log("action", upsertIssueProjectAction.id);
```

- Prefer action IDs as the stable integration boundary.
- Respect the declared permission, idempotency, and audit metadata instead of bypassing the service layer.
- Treat resource IDs as the read-model boundary for downstream consumers.

### 3. Cross-plugin composition

- Compose this plugin through action invocations and resource reads.
- If downstream automation becomes necessary, add it in the surrounding Gutu command/event/job runtime instead of assuming this plugin already exports a hook surface.

## Test Matrix

| Lane | Present | Evidence |
| --- | --- | --- |
| Build | Yes | `bun run build` |
| Typecheck | Yes | `bun run typecheck` |
| Lint | Yes | `bun run lint` |
| Test | Yes | `bun run test` |
| Unit | Yes | 2 file(s) |
| Contracts | Yes | 2 file(s) |
| Integration | Yes | 1 file(s) |
| Migrations | Yes | 1 file(s) |

### Verification commands

- `bun run build`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run test:contracts`
- `bun run test:integration`
- `bun run test:migrations`
- `bun run test:unit`
- `bun run docs:check`

## Current Truth And Recommended Next

### Current truth

- Exports 8 governed actions: `issues.projects.upsert`, `issues.issues.create`, `issues.issues.assign`, `issues.comments.add`, `issues.attachments.add`, `issues.dependencies.link`, `issues.inbox.transition`, `issues.sessions.attach`.
- Owns 8 resource contracts: `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.
- Adds richer admin workspace contributions on top of the base UI surface.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.

### Current gaps

- No standalone plugin-owned event, job, or workflow catalog is exported yet; compose it through actions, resources, and the surrounding Gutu runtime.
- The repo does not yet export a domain parity catalog with owned entities, reports, settings surfaces, and exception queues.

### Recommended next

- Deepen workflow, notification, and AI handoff coverage as issues become a broader cross-plugin execution spine.
- Add stronger SLA, queue, and reconciliation surfaces once issue state becomes operationally critical.
- Add deeper provider, persistence, or evaluation integrations only where the shipped control-plane contracts already prove stable.
- Expand operator diagnostics and release gating where the current lifecycle already exposes strong evidence paths.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

### Later / optional

- More connector breadth, richer evaluation libraries, and domain-specific copilots after the baseline contracts settle.
