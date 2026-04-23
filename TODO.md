# Issues Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Exports 8 governed actions: `issues.projects.upsert`, `issues.issues.create`, `issues.issues.assign`, `issues.comments.add`, `issues.attachments.add`, `issues.dependencies.link`, `issues.inbox.transition`, `issues.sessions.attach`.
- Owns 8 resource contracts: `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.
- Adds richer admin workspace contributions on top of the base UI surface.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.

## Current Gaps

- No standalone plugin-owned event, job, or workflow catalog is exported yet; compose it through actions, resources, and the surrounding Gutu runtime.
- The repo does not yet export a domain parity catalog with owned entities, reports, settings surfaces, and exception queues.

## Recommended Next

- Deepen workflow, notification, and AI handoff coverage as issues become a broader cross-plugin execution spine.
- Add stronger SLA, queue, and reconciliation surfaces once issue state becomes operationally critical.
- Add deeper provider, persistence, or evaluation integrations only where the shipped control-plane contracts already prove stable.
- Expand operator diagnostics and release gating where the current lifecycle already exposes strong evidence paths.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

## Later / Optional

- More connector breadth, richer evaluation libraries, and domain-specific copilots after the baseline contracts settle.
