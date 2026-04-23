# Issues Core Flows

## Happy paths

- `issues.projects.upsert`: Governed action exported by this plugin.
- `issues.issues.create`: Governed action exported by this plugin.
- `issues.issues.assign`: Governed action exported by this plugin.
- `issues.comments.add`: Governed action exported by this plugin.
- `issues.attachments.add`: Governed action exported by this plugin.
- `issues.dependencies.link`: Governed action exported by this plugin.
- `issues.inbox.transition`: Governed action exported by this plugin.
- `issues.sessions.attach`: Governed action exported by this plugin.

## Operational scenario matrix

- No operational scenario catalog is exported today.

## Action-level flows

### `issues.projects.upsert`

Governed action exported by this plugin.

Permission: `issues.projects.upsert`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.issues.create`

Governed action exported by this plugin.

Permission: `issues.issues.create`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.issues.assign`

Governed action exported by this plugin.

Permission: `issues.issues.assign`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.comments.add`

Governed action exported by this plugin.

Permission: `issues.comments.add`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.attachments.add`

Governed action exported by this plugin.

Permission: `issues.attachments.add`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.dependencies.link`

Governed action exported by this plugin.

Permission: `issues.dependencies.link`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.inbox.transition`

Governed action exported by this plugin.

Permission: `issues.inbox.transition`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `issues.sessions.attach`

Governed action exported by this plugin.

Permission: `issues.sessions.attach`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `issues.projects`, `issues.issues`, `issues.comments`, `issues.activity`, `issues.attachments`, `issues.inbox`, `issues.dependencies`, `issues.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


## Cross-package interactions

- Direct dependencies: `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`
- Requested capabilities: `ui.register.admin`, `api.rest.mount`, `data.write.issues`
- Integration model: Actions+Resources+UI
- ERPNext doctypes used as parity references: none declared
- Recovery ownership should stay with the host orchestration layer when the plugin does not explicitly export jobs, workflows, or lifecycle events.
