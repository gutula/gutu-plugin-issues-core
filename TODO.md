# Issues Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Added durable resources for projects, issues, comments, activity, attachments, inbox, and issue sessions.
- Added action contracts for project upsert, issue create and assign, comment add, attachment add, and session attach or resume.
- Added an `issues` workspace plus `issue-builder` and `project-builder`.
- Added integration and migration coverage for collaboration and session-handling flows.
- Added explicit blocker dependency modeling plus guarded inbox acknowledgement and resolution flows.

## Current Gaps

- Board swimlane presets and dependency-aware watch lists are not modeled yet.
- Session evidence is linked textually rather than through a richer artifact graph.

## Recommended Next

- Add watch lists and dependency-aware queue or board views on top of the shipped blocker graph.
- Expand attachment typing and evidence linkage for approvals, evals, and runtime logs.
- Add signed project template install flows for common operating models.

## Later / Optional

- Public or external collaboration surfaces once the operator-first admin flow stabilizes.
- Rich live-presence features after real transport adapters replace the same-process fixture state.
