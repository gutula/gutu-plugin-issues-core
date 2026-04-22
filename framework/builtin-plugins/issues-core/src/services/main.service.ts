import { loadJsonState, updateJsonState } from "@platform/ai-runtime";
import { normalizeActionInput } from "@platform/schema";

export type IssueActorKind = "user" | "agent";
export type IssueProjectStatus = "active" | "paused" | "archived";
export type IssueStatus = "open" | "planned" | "in-progress" | "waiting-human" | "completed" | "cancelled" | "escalated";
export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueInboxReason = "assignment" | "mention" | "waiting-human" | "escalation" | "blocker";
export type IssueInboxStatus = "open" | "acked" | "resolved";
export type IssueAttachmentKind = "artifact" | "approval-packet" | "workspace-link" | "report";
export type IssueSessionStatus = "attached" | "resumable" | "closed";
export type IssueDependencyStatus = "active" | "cleared";

export type IssueProjectRecord = {
  id: string;
  tenantId: string;
  label: string;
  status: IssueProjectStatus;
  ownerKind: IssueActorKind;
  ownerId: string;
  defaultQueue: string;
  createdAt: string;
  updatedAt: string;
};

export type IssueRecord = {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  summary: string;
  status: IssueStatus;
  priority: IssuePriority;
  queue: string;
  labels: string[];
  reporterKind: IssueActorKind;
  reporterId: string;
  assigneeKind: IssueActorKind | null;
  assigneeId: string | null;
  sessionId: string | null;
  workDir: string | null;
  runtimeId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IssueCommentRecord = {
  id: string;
  tenantId: string;
  issueId: string;
  actorKind: IssueActorKind;
  actorId: string;
  body: string;
  createdAt: string;
};

export type IssueActivityRecord = {
  id: string;
  tenantId: string;
  issueId: string;
  type: "created" | "assigned" | "commented" | "attachment-added" | "session-linked" | "dependency-linked" | "inbox-transition";
  summary: string;
  createdAt: string;
};

export type IssueAttachmentRecord = {
  id: string;
  tenantId: string;
  issueId: string;
  label: string;
  uri: string;
  kind: IssueAttachmentKind;
  createdAt: string;
};

export type IssueInboxItemRecord = {
  id: string;
  tenantId: string;
  issueId: string;
  queue: string;
  reason: IssueInboxReason;
  ownerId: string | null;
  status: IssueInboxStatus;
  createdAt: string;
  updatedAt: string;
};

export type IssueSessionRecord = {
  id: string;
  tenantId: string;
  issueId: string;
  sessionId: string;
  workDir: string | null;
  runtimeId: string | null;
  workspaceId: string | null;
  agentProfileId: string | null;
  status: IssueSessionStatus;
  lastResumedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IssueDependencyRecord = {
  id: string;
  tenantId: string;
  issueId: string;
  blockerIssueId: string;
  status: IssueDependencyStatus;
  createdAt: string;
  updatedAt: string;
};

type IssuesState = {
  projects: IssueProjectRecord[];
  issues: IssueRecord[];
  comments: IssueCommentRecord[];
  activity: IssueActivityRecord[];
  attachments: IssueAttachmentRecord[];
  inbox: IssueInboxItemRecord[];
  dependencies: IssueDependencyRecord[];
  sessions: IssueSessionRecord[];
};

export type UpsertIssueProjectInput = {
  tenantId: string;
  actorId: string;
  projectId: string;
  label: string;
  status?: IssueProjectStatus | undefined;
  ownerKind: IssueActorKind;
  ownerId: string;
  defaultQueue: string;
};

export type CreateIssueInput = {
  tenantId: string;
  actorId: string;
  issueId: string;
  projectId: string;
  title: string;
  summary: string;
  priority: IssuePriority;
  queue: string;
  labels?: string[] | undefined;
  reporterKind: IssueActorKind;
  reporterId: string;
  assigneeKind?: IssueActorKind | undefined;
  assigneeId?: string | undefined;
  status?: IssueStatus | undefined;
  sessionId?: string | undefined;
  workDir?: string | undefined;
  runtimeId?: string | undefined;
  workspaceId?: string | undefined;
  agentProfileId?: string | undefined;
};

export type AssignIssueInput = {
  tenantId: string;
  actorId: string;
  issueId: string;
  assigneeKind: IssueActorKind;
  assigneeId: string;
  queue: string;
  status?: Extract<IssueStatus, "planned" | "in-progress" | "waiting-human" | "escalated"> | undefined;
};

export type AddIssueCommentInput = {
  tenantId: string;
  actorId: string;
  issueId: string;
  commentId: string;
  actorKind: IssueActorKind;
  body: string;
  notifyActorIds?: string[] | undefined;
};

export type AddIssueAttachmentInput = {
  tenantId: string;
  actorId: string;
  issueId: string;
  attachmentId: string;
  label: string;
  uri: string;
  kind: IssueAttachmentKind;
};

export type AttachIssueSessionInput = {
  tenantId: string;
  actorId: string;
  issueId: string;
  sessionId: string;
  workDir?: string | undefined;
  runtimeId?: string | undefined;
  workspaceId?: string | undefined;
  agentProfileId?: string | undefined;
  mode: "attach" | "resume" | "close";
};

export type LinkIssueDependencyInput = {
  tenantId: string;
  actorId: string;
  dependencyId: string;
  issueId: string;
  blockerIssueId: string;
};

export type TransitionIssueInboxItemInput = {
  tenantId: string;
  actorId: string;
  inboxItemId: string;
  status: Exclude<IssueInboxStatus, "open">;
};

const issuesStateFile = "issues-core.json";

function seedIssuesState(): IssuesState {
  return normalizeIssuesState({
    projects: [
      {
        id: "project:pack0-ops",
        tenantId: "tenant-platform",
        label: "Pack 0 Operations",
        status: "active",
        ownerKind: "user",
        ownerId: "actor-admin",
        defaultQueue: "queue:ops",
        createdAt: "2026-04-22T13:00:00.000Z",
        updatedAt: "2026-04-22T13:00:00.000Z"
      }
    ],
    issues: [
      {
        id: "issue:pack0-review",
        tenantId: "tenant-platform",
        projectId: "project:pack0-ops",
        title: "Review escalated ops queue",
        summary: "Initial seeded issue showing agent-assigned collaboration state.",
        status: "waiting-human",
        priority: "high",
        queue: "queue:ops",
        labels: ["ops", "approval"],
        reporterKind: "user",
        reporterId: "actor-admin",
        assigneeKind: "agent",
        assigneeId: "agent-profile:ops-triage",
        sessionId: "session:pack0-review",
        workDir: "/workspaces/pack0-review",
        runtimeId: "runtime:local-dev",
        createdAt: "2026-04-22T13:05:00.000Z",
        updatedAt: "2026-04-22T13:08:00.000Z"
      }
    ],
    comments: [
      {
        id: "comment:pack0-review",
        tenantId: "tenant-platform",
        issueId: "issue:pack0-review",
        actorKind: "user",
        actorId: "actor-admin",
        body: "Escalated for finance-safe review.",
        createdAt: "2026-04-22T13:06:00.000Z"
      }
    ],
    activity: [
      {
        id: "activity:pack0-review:created",
        tenantId: "tenant-platform",
        issueId: "issue:pack0-review",
        type: "created",
        summary: "Issue created in Pack 0 Operations.",
        createdAt: "2026-04-22T13:05:00.000Z"
      }
    ],
    attachments: [
      {
        id: "attachment:pack0-review",
        tenantId: "tenant-platform",
        issueId: "issue:pack0-review",
        label: "Approval Packet",
        uri: "artifact://approval-packets/pack0-review",
        kind: "approval-packet",
        createdAt: "2026-04-22T13:07:00.000Z"
      }
    ],
    inbox: [
      {
        id: "inbox:pack0-review",
        tenantId: "tenant-platform",
        issueId: "issue:pack0-review",
        queue: "queue:ops",
        reason: "waiting-human",
        ownerId: "actor-admin",
        status: "open",
        createdAt: "2026-04-22T13:06:30.000Z",
        updatedAt: "2026-04-22T13:06:30.000Z"
      }
    ],
    dependencies: [],
    sessions: [
      {
        id: "issue-session:pack0-review",
        tenantId: "tenant-platform",
        issueId: "issue:pack0-review",
        sessionId: "session:pack0-review",
        workDir: "/workspaces/pack0-review",
        runtimeId: "runtime:local-dev",
        workspaceId: "workspace:ops-review",
        agentProfileId: "agent-profile:ops-triage",
        status: "resumable",
        lastResumedAt: "2026-04-22T13:08:00.000Z",
        createdAt: "2026-04-22T13:05:30.000Z",
        updatedAt: "2026-04-22T13:08:00.000Z"
      }
    ]
  });
}

function loadIssuesState(): IssuesState {
  return normalizeIssuesState(loadJsonState(issuesStateFile, seedIssuesState));
}

function persistIssuesState(updater: (state: IssuesState) => IssuesState): IssuesState {
  return normalizeIssuesState(updateJsonState(issuesStateFile, seedIssuesState, updater));
}

export function listIssueProjects(): IssueProjectRecord[] {
  return loadIssuesState().projects.sort((left, right) => left.label.localeCompare(right.label));
}

export function listIssues(): IssueRecord[] {
  return loadIssuesState().issues.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function listIssueComments(): IssueCommentRecord[] {
  return loadIssuesState().comments.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function listIssueActivity(): IssueActivityRecord[] {
  return loadIssuesState().activity.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function listIssueAttachments(): IssueAttachmentRecord[] {
  return loadIssuesState().attachments.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function listIssueInbox(): IssueInboxItemRecord[] {
  return loadIssuesState().inbox.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function listIssueDependencies(): IssueDependencyRecord[] {
  return loadIssuesState().dependencies.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function listIssueSessions(): IssueSessionRecord[] {
  return loadIssuesState().sessions.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getIssuesOverview() {
  const state = loadIssuesState();
  const blockedIssueIds = new Set(state.dependencies.filter((dependency) => dependency.status === "active").map((dependency) => dependency.issueId));
  return {
    totals: {
      projects: state.projects.length,
      issues: state.issues.length,
      waitingHuman: state.issues.filter((issue) => issue.status === "waiting-human").length,
      escalated: state.issues.filter((issue) => issue.status === "escalated").length,
      resumableSessions: state.sessions.filter((session) => session.status === "resumable").length,
      blockedIssues: blockedIssueIds.size,
      openInboxItems: state.inbox.filter((item) => item.status !== "resolved").length
    },
    inboxByReason: summarizeCounts(state.inbox.map((item) => item.reason))
  };
}

export function upsertIssueProject(input: UpsertIssueProjectInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  persistIssuesState((state) => ({
    ...state,
    projects: upsertById(state.projects, {
      id: input.projectId,
      tenantId: input.tenantId,
      label: input.label,
      status: input.status ?? "active",
      ownerKind: input.ownerKind,
      ownerId: input.ownerId,
      defaultQueue: input.defaultQueue,
      createdAt: state.projects.find((entry) => entry.id === input.projectId && entry.tenantId === input.tenantId)?.createdAt ?? now,
      updatedAt: now
    })
  }));

  return {
    ok: true as const,
    projectId: input.projectId,
    status: input.status ?? "active"
  };
}

export function createIssue(input: CreateIssueInput) {
  normalizeActionInput(input);
  const state = loadIssuesState();
  const project = state.projects.find((entry) => entry.id === input.projectId && entry.tenantId === input.tenantId);
  if (!project) {
    throw new Error(`Unknown project '${input.projectId}'.`);
  }

  const now = new Date().toISOString();
  const status = input.status ?? (input.assigneeId ? "in-progress" : "open");
  const issue: IssueRecord = {
    id: input.issueId,
    tenantId: input.tenantId,
    projectId: input.projectId,
    title: input.title,
    summary: input.summary,
    status,
    priority: input.priority,
    queue: input.queue,
    labels: uniqueSorted(input.labels ?? []),
    reporterKind: input.reporterKind,
    reporterId: input.reporterId,
    assigneeKind: input.assigneeKind ?? null,
    assigneeId: input.assigneeId ?? null,
    sessionId: input.sessionId ?? null,
    workDir: input.workDir ?? null,
    runtimeId: input.runtimeId ?? null,
    createdAt: state.issues.find((entry) => entry.id === input.issueId && entry.tenantId === input.tenantId)?.createdAt ?? now,
    updatedAt: now
  };

  const inboxEntries: IssueInboxItemRecord[] = [];
  if (issue.assigneeId) {
    inboxEntries.push(createInboxEntry(issue, "assignment", issue.assigneeId, now));
  }
  if (status === "waiting-human") {
    inboxEntries.push(createInboxEntry(issue, "waiting-human", input.actorId, now));
  }
  if (status === "escalated") {
    inboxEntries.push(createInboxEntry(issue, "escalation", input.actorId, now));
  }

  const sessionRecord =
    input.sessionId !== undefined
      ? createOrUpdateSessionRecord(
          state.sessions.find((entry) => entry.issueId === input.issueId && entry.tenantId === input.tenantId) ?? null,
          {
            tenantId: input.tenantId,
            issueId: input.issueId,
            sessionId: input.sessionId,
            workDir: input.workDir ?? null,
            runtimeId: input.runtimeId ?? null,
            workspaceId: input.workspaceId ?? null,
            agentProfileId: input.agentProfileId ?? null,
            status: "attached",
            timestamp: now
          }
        )
      : null;

  persistIssuesState((currentState) => ({
    ...currentState,
    projects: currentState.projects.map((entry) =>
      entry.id === project.id && entry.tenantId === project.tenantId ? { ...entry, updatedAt: now } : entry
    ),
    issues: upsertById(currentState.issues, issue),
    activity: [
      ...currentState.activity,
      {
        id: `activity:${input.issueId}:created:${now}`,
        tenantId: input.tenantId,
        issueId: input.issueId,
        type: "created",
        summary: `Issue created in ${project.label}.`,
        createdAt: now
      },
      ...(sessionRecord === null
        ? []
        : [
            {
              id: `activity:${input.issueId}:session:${now}`,
              tenantId: input.tenantId,
              issueId: input.issueId,
              type: "session-linked" as const,
              summary: `Session ${sessionRecord.sessionId} attached to issue.`,
              createdAt: now
            }
          ])
    ],
    inbox: dedupeById([...currentState.inbox, ...inboxEntries]),
    sessions: sessionRecord === null ? currentState.sessions : upsertById(currentState.sessions, sessionRecord)
  }));

  return {
    ok: true as const,
    issueId: input.issueId,
    status,
    inboxCount: inboxEntries.length
  };
}

export function assignIssue(input: AssignIssueInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  let nextStatus: IssueStatus = input.status ?? "in-progress";
  let issueId = input.issueId;
  persistIssuesState((state) => {
    const existing = getIssueOrThrow(state, input.tenantId, input.issueId);
    issueId = existing.id;
    nextStatus = input.status ?? (existing.status === "waiting-human" ? "waiting-human" : "in-progress");
    const updated: IssueRecord = {
      ...existing,
      assigneeKind: input.assigneeKind,
      assigneeId: input.assigneeId,
      queue: input.queue,
      status: nextStatus,
      updatedAt: now
    };
    return {
      ...state,
      issues: upsertById(state.issues, updated),
      activity: [
        ...state.activity,
        {
          id: `activity:${input.issueId}:assigned:${now}`,
          tenantId: input.tenantId,
          issueId: input.issueId,
          type: "assigned",
          summary: `Issue assigned to ${input.assigneeKind}:${input.assigneeId}.`,
          createdAt: now
        }
      ],
      inbox: dedupeById([
        ...state.inbox.filter((entry) => !(entry.issueId === input.issueId && entry.reason === "assignment" && entry.status === "open")),
        createInboxEntry(updated, "assignment", input.assigneeId, now)
      ])
    };
  });

  return {
    ok: true as const,
    issueId,
    assigneeId: input.assigneeId,
    status: nextStatus
  };
}

export function addIssueComment(input: AddIssueCommentInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  let inboxCount = 0;
  persistIssuesState((state) => {
    const issue = getIssueOrThrow(state, input.tenantId, input.issueId);
    const notifyEntries = uniqueSorted(input.notifyActorIds ?? []).map((actorId) =>
      createInboxEntry(issue, "mention", actorId, now, input.commentId)
    );
    inboxCount = notifyEntries.length;
    return {
      ...state,
      comments: upsertById(state.comments, {
        id: input.commentId,
        tenantId: input.tenantId,
        issueId: input.issueId,
        actorKind: input.actorKind,
        actorId: input.actorId,
        body: input.body,
        createdAt: now
      }),
      activity: [
        ...state.activity,
        {
          id: `activity:${input.issueId}:comment:${input.commentId}`,
          tenantId: input.tenantId,
          issueId: input.issueId,
          type: "commented",
          summary: `Comment added by ${input.actorKind}:${input.actorId}.`,
          createdAt: now
        }
      ],
      inbox: dedupeById([...state.inbox, ...notifyEntries]),
      issues: upsertById(state.issues, { ...issue, updatedAt: now })
    };
  });

  return {
    ok: true as const,
    commentId: input.commentId,
    inboxCount
  };
}

export function addIssueAttachment(input: AddIssueAttachmentInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  persistIssuesState((state) => {
    getIssueOrThrow(state, input.tenantId, input.issueId);
    return {
      ...state,
      attachments: upsertById(state.attachments, {
        id: input.attachmentId,
        tenantId: input.tenantId,
        issueId: input.issueId,
        label: input.label,
        uri: input.uri,
        kind: input.kind,
        createdAt: now
      }),
      activity: [
        ...state.activity,
        {
          id: `activity:${input.issueId}:attachment:${input.attachmentId}`,
          tenantId: input.tenantId,
          issueId: input.issueId,
          type: "attachment-added",
          summary: `Attachment ${input.label} linked to issue.`,
          createdAt: now
        }
      ]
    };
  });

  return {
    ok: true as const,
    attachmentId: input.attachmentId
  };
}

export function linkIssueDependency(input: LinkIssueDependencyInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  let status: IssueDependencyStatus = "active";
  persistIssuesState((state) => {
    const issue = getIssueOrThrow(state, input.tenantId, input.issueId);
    const blocker = getIssueOrThrow(state, input.tenantId, input.blockerIssueId);
    if (issue.id === blocker.id) {
      throw new Error("An issue cannot block itself.");
    }
    if (createsDependencyCycle(state.dependencies, issue.id, blocker.id)) {
      throw new Error(`Dependency '${issue.id}' -> '${blocker.id}' would create a blocker cycle.`);
    }

    status = isClosedIssue(blocker) ? "cleared" : "active";
    const dependency: IssueDependencyRecord = {
      id: input.dependencyId,
      tenantId: input.tenantId,
      issueId: issue.id,
      blockerIssueId: blocker.id,
      status,
      createdAt: state.dependencies.find((entry) => entry.id === input.dependencyId && entry.tenantId === input.tenantId)?.createdAt ?? now,
      updatedAt: now
    };
    const blockerInboxEntries =
      status === "active"
        ? [createInboxEntry(issue, "blocker", issue.assigneeId ?? issue.reporterId, now, blocker.id)]
        : [];

    return {
      ...state,
      dependencies: upsertById(state.dependencies, dependency),
      activity: [
        ...state.activity,
        {
          id: `activity:${input.issueId}:dependency:${input.dependencyId}`,
          tenantId: input.tenantId,
          issueId: input.issueId,
          type: "dependency-linked",
          summary:
            status === "cleared"
              ? `Dependency on ${blocker.id} was recorded but already cleared.`
              : `Issue blocked by ${blocker.id}.`,
          createdAt: now
        }
      ],
      inbox: dedupeById([...state.inbox, ...blockerInboxEntries]),
      issues: upsertById(state.issues, {
        ...issue,
        status: status === "active" && issue.status === "open" ? "planned" : issue.status,
        updatedAt: now
      })
    };
  });

  return {
    ok: true as const,
    dependencyId: input.dependencyId,
    status
  };
}

export function transitionIssueInboxItem(input: TransitionIssueInboxItemInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  let issueId = "";
  persistIssuesState((state) => {
    const existing = state.inbox.find((entry) => entry.id === input.inboxItemId && entry.tenantId === input.tenantId);
    if (!existing) {
      throw new Error(`Unknown inbox item '${input.inboxItemId}'.`);
    }
    if (existing.status === "resolved" && input.status !== "resolved") {
      throw new Error(`Inbox item '${input.inboxItemId}' is already resolved.`);
    }
    issueId = existing.issueId;
    return {
      ...state,
      inbox: upsertById(state.inbox, {
        ...existing,
        status: input.status,
        updatedAt: now
      }),
      activity: [
        ...state.activity,
        {
          id: `activity:${existing.issueId}:inbox:${input.inboxItemId}:${now}`,
          tenantId: input.tenantId,
          issueId: existing.issueId,
          type: "inbox-transition",
          summary: `Inbox item ${existing.reason} moved to ${input.status}.`,
          createdAt: now
        }
      ]
    };
  });

  return {
    ok: true as const,
    inboxItemId: input.inboxItemId,
    issueId,
    status: input.status
  };
}

export function attachIssueSession(input: AttachIssueSessionInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  let sessionRecordId = "";
  let status: IssueSessionStatus = input.mode === "close" ? "closed" : input.mode === "resume" ? "resumable" : "attached";
  persistIssuesState((state) => {
    const issue = getIssueOrThrow(state, input.tenantId, input.issueId);
    const existing = state.sessions.find((entry) => entry.issueId === input.issueId && entry.tenantId === input.tenantId) ?? null;
    const nextSession = createOrUpdateSessionRecord(existing, {
      tenantId: input.tenantId,
      issueId: input.issueId,
      sessionId: input.sessionId,
      workDir: input.workDir ?? issue.workDir,
      runtimeId: input.runtimeId ?? issue.runtimeId,
      workspaceId: input.workspaceId ?? null,
      agentProfileId: input.agentProfileId ?? null,
      status: input.mode === "close" ? "closed" : input.mode === "resume" ? "resumable" : "attached",
      timestamp: now
    });
    sessionRecordId = nextSession.id;
    status = nextSession.status;
    const nextIssue: IssueRecord = {
      ...issue,
      sessionId: nextSession.sessionId,
      workDir: nextSession.workDir,
      runtimeId: nextSession.runtimeId,
      status: input.mode === "close" ? issue.status : "in-progress",
      updatedAt: now
    };

    return {
      ...state,
      issues: upsertById(state.issues, nextIssue),
      sessions: upsertById(state.sessions, nextSession),
      activity: [
        ...state.activity,
        {
          id: `activity:${input.issueId}:session:${nextSession.sessionId}:${now}`,
          tenantId: input.tenantId,
          issueId: input.issueId,
          type: "session-linked",
          summary:
            input.mode === "close"
              ? `Session ${nextSession.sessionId} closed.`
              : input.mode === "resume"
                ? `Session ${nextSession.sessionId} resumed.`
                : `Session ${nextSession.sessionId} attached.`,
          createdAt: now
        }
      ]
    };
  });

  return {
    ok: true as const,
    issueId: input.issueId,
    sessionRecordId,
    status
  };
}

function normalizeIssuesState(state: IssuesState): IssuesState {
  const issues = state.issues.map((entry) => ({ ...entry, labels: uniqueSorted(entry.labels) }));
  const issuesById = new Map(issues.map((entry) => [`${entry.tenantId}:${entry.id}`, entry] as const));
  return {
    projects: state.projects.map((entry) => ({ ...entry })),
    issues,
    comments: state.comments.map((entry) => ({ ...entry })),
    activity: state.activity.map((entry) => ({ ...entry })),
    attachments: state.attachments.map((entry) => ({ ...entry })),
    inbox: state.inbox.map((entry) => ({ ...entry })),
    dependencies: (state.dependencies ?? []).map((entry) => {
      const blocker = issuesById.get(`${entry.tenantId}:${entry.blockerIssueId}`);
      return {
        ...entry,
        status: blocker && isClosedIssue(blocker) ? "cleared" : entry.status
      };
    }),
    sessions: state.sessions.map((entry) => ({ ...entry }))
  };
}

function getIssueOrThrow(state: IssuesState, tenantId: string, issueId: string): IssueRecord {
  const issue = state.issues.find((entry) => entry.id === issueId && entry.tenantId === tenantId);
  if (!issue) {
    throw new Error(`Unknown issue '${issueId}'.`);
  }
  return issue;
}

function createInboxEntry(issue: IssueRecord, reason: IssueInboxReason, ownerId: string | null, timestamp: string, suffix?: string): IssueInboxItemRecord {
  return {
    id: `inbox:${issue.id}:${reason}:${suffix ?? ownerId ?? "unowned"}`,
    tenantId: issue.tenantId,
    issueId: issue.id,
    queue: issue.queue,
    reason,
    ownerId,
    status: "open",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function createsDependencyCycle(dependencies: IssueDependencyRecord[], issueId: string, blockerIssueId: string) {
  const adjacency = dependencies
    .filter((entry) => entry.status === "active")
    .reduce<Map<string, string[]>>((map, entry) => {
      const next = map.get(entry.issueId) ?? [];
      next.push(entry.blockerIssueId);
      map.set(entry.issueId, next);
      return map;
    }, new Map<string, string[]>());
  const stack = [blockerIssueId];
  const visited = new Set<string>();
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === issueId) {
      return true;
    }
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    for (const next of adjacency.get(current) ?? []) {
      stack.push(next);
    }
  }
  return false;
}

function isClosedIssue(issue: IssueRecord) {
  return issue.status === "completed" || issue.status === "cancelled";
}

function createOrUpdateSessionRecord(
  existing: IssueSessionRecord | null,
  input: {
    tenantId: string;
    issueId: string;
    sessionId: string;
    workDir: string | null;
    runtimeId: string | null;
    workspaceId: string | null;
    agentProfileId: string | null;
    status: IssueSessionStatus;
    timestamp: string;
  }
): IssueSessionRecord {
  return {
    id: existing?.id ?? `issue-session:${input.issueId}`,
    tenantId: input.tenantId,
    issueId: input.issueId,
    sessionId: input.sessionId,
    workDir: input.workDir,
    runtimeId: input.runtimeId,
    workspaceId: input.workspaceId,
    agentProfileId: input.agentProfileId,
    status: input.status,
    lastResumedAt: input.status === "resumable" ? input.timestamp : existing?.lastResumedAt ?? null,
    createdAt: existing?.createdAt ?? input.timestamp,
    updatedAt: input.timestamp
  };
}

function summarizeCounts(values: string[]) {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  const remaining = items.filter((entry) => entry.id !== item.id);
  return [...remaining, item];
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  return items.reduce<T[]>((accumulator, item) => upsertById(accumulator, item), []);
}
