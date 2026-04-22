import { defineResource } from "@platform/schema";
import { z } from "zod";

import {
  issueActivity,
  issueAttachments,
  issueComments,
  issueDependencies,
  issueInbox,
  issueProjects,
  issues,
  issueSessions
} from "../../db/schema";

export const IssueProjectResource = defineResource({
  id: "issues.projects",
  description: "Governed project containers for issue queues and collaboration state.",
  businessPurpose: "Keep project ownership, queue defaults, and collaboration boundaries explicit and auditable.",
  table: issueProjects,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    label: z.string().min(2),
    status: z.enum(["active", "paused", "archived"]),
    ownerKind: z.enum(["user", "agent"]),
    ownerId: z.string().min(2),
    defaultQueue: z.string().min(2),
    issueCount: z.number().int().nonnegative(),
    updatedAt: z.string()
  }),
  fields: {
    label: { searchable: true, sortable: true, label: "Project" },
    status: { filter: "select", label: "Status" },
    ownerId: { searchable: true, sortable: true, label: "Owner" },
    defaultQueue: { searchable: true, sortable: true, label: "Queue" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["label", "status", "ownerId", "defaultQueue", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Project registry used by collaboration-aware automation and operator control rooms.",
    citationLabelField: "label",
    allowedFields: ["label", "status", "ownerKind", "ownerId", "defaultQueue", "updatedAt"]
  }
});

export const IssueResource = defineResource({
  id: "issues.issues",
  description: "Durable issue inventory with human or agent assignees.",
  businessPurpose: "Track collaboration work items, queue routing, and session linkage without hiding state in workflow blobs.",
  table: issues,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    projectId: z.string().min(2),
    title: z.string().min(3),
    status: z.enum(["open", "planned", "in-progress", "waiting-human", "completed", "cancelled", "escalated"]),
    priority: z.enum(["low", "medium", "high", "critical"]),
    queue: z.string().min(2),
    assigneeKind: z.enum(["user", "agent"]).nullable(),
    assigneeId: z.string().nullable(),
    reporterKind: z.enum(["user", "agent"]),
    reporterId: z.string().min(2),
    sessionId: z.string().nullable(),
    runtimeId: z.string().nullable(),
    labelCount: z.number().int().nonnegative(),
    updatedAt: z.string()
  }),
  fields: {
    title: { searchable: true, sortable: true, label: "Issue" },
    status: { filter: "select", label: "Status" },
    priority: { filter: "select", label: "Priority" },
    queue: { searchable: true, sortable: true, label: "Queue" },
    assigneeId: { searchable: true, sortable: true, label: "Assignee" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["title", "status", "priority", "queue", "assigneeId", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Issue inventory for collaboration-aware automation, operator routing, and issue-linked agent sessions.",
    citationLabelField: "title",
    allowedFields: ["title", "status", "priority", "queue", "assigneeKind", "assigneeId", "reporterId", "sessionId", "runtimeId", "updatedAt"]
  }
});

export const IssueCommentResource = defineResource({
  id: "issues.comments",
  description: "Durable issue comment thread entries.",
  businessPurpose: "Retain human and agent discussion history in a typed auditable record.",
  table: issueComments,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    issueId: z.string().min(2),
    actorKind: z.enum(["user", "agent"]),
    actorId: z.string().min(2),
    body: z.string().min(2),
    createdAt: z.string()
  }),
  fields: {
    issueId: { searchable: true, sortable: true, label: "Issue" },
    actorId: { searchable: true, sortable: true, label: "Actor" },
    createdAt: { sortable: true, label: "Created" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["issueId", "actorId", "createdAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Comment history for issue triage and operator handoff.",
    citationLabelField: "issueId",
    allowedFields: ["issueId", "actorKind", "actorId", "body", "createdAt"]
  }
});

export const IssueActivityResource = defineResource({
  id: "issues.activity",
  description: "Issue activity timeline covering creation, assignment, comments, attachments, and sessions.",
  businessPurpose: "Provide operator-visible issue history without requiring raw workflow replay inspection.",
  table: issueActivity,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    issueId: z.string().min(2),
    type: z.enum(["created", "assigned", "commented", "attachment-added", "session-linked", "dependency-linked", "inbox-transition"]),
    summary: z.string().min(2),
    createdAt: z.string()
  }),
  fields: {
    issueId: { searchable: true, sortable: true, label: "Issue" },
    type: { filter: "select", label: "Type" },
    createdAt: { sortable: true, label: "Created" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["issueId", "type", "createdAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Activity timeline for collaboration-aware investigations.",
    citationLabelField: "issueId",
    allowedFields: ["issueId", "type", "summary", "createdAt"]
  }
});

export const IssueAttachmentResource = defineResource({
  id: "issues.attachments",
  description: "Attachment references linked to issues.",
  businessPurpose: "Keep evidence and external artifact links typed and auditable.",
  table: issueAttachments,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    issueId: z.string().min(2),
    label: z.string().min(2),
    uri: z.string().min(3),
    kind: z.enum(["artifact", "approval-packet", "workspace-link", "report"]),
    createdAt: z.string()
  }),
  fields: {
    issueId: { searchable: true, sortable: true, label: "Issue" },
    label: { searchable: true, sortable: true, label: "Attachment" },
    kind: { filter: "select", label: "Kind" },
    createdAt: { sortable: true, label: "Created" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["issueId", "label", "kind", "createdAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Artifact linkage for approvals, reports, and runtime workspaces attached to issues.",
    citationLabelField: "label",
    allowedFields: ["issueId", "label", "uri", "kind", "createdAt"]
  }
});

export const IssueInboxResource = defineResource({
  id: "issues.inbox",
  description: "Issue inbox entries for assignments, mentions, waiting-human work, and escalations.",
  businessPurpose: "Give operators a durable queue for collaboration follow-up instead of relying on implicit notifications alone.",
  table: issueInbox,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    issueId: z.string().min(2),
    queue: z.string().min(2),
    reason: z.enum(["assignment", "mention", "waiting-human", "escalation", "blocker"]),
    ownerId: z.string().nullable(),
    status: z.enum(["open", "acked", "resolved"]),
    updatedAt: z.string()
  }),
  fields: {
    issueId: { searchable: true, sortable: true, label: "Issue" },
    queue: { searchable: true, sortable: true, label: "Queue" },
    reason: { filter: "select", label: "Reason" },
    ownerId: { searchable: true, sortable: true, label: "Owner" },
    status: { filter: "select", label: "Status" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["issueId", "queue", "reason", "ownerId", "status", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Collaboration queue view for operators, agents, and follow-up automations.",
    citationLabelField: "issueId",
    allowedFields: ["issueId", "queue", "reason", "ownerId", "status", "updatedAt"]
  }
});

export const IssueDependencyResource = defineResource({
  id: "issues.dependencies",
  description: "Explicit blocker relationships between issues.",
  businessPurpose: "Keep issue blockers durable and queryable instead of burying dependency state in free-form comments.",
  table: issueDependencies,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    issueId: z.string().min(2),
    blockerIssueId: z.string().min(2),
    status: z.enum(["active", "cleared"]),
    updatedAt: z.string()
  }),
  fields: {
    issueId: { searchable: true, sortable: true, label: "Issue" },
    blockerIssueId: { searchable: true, sortable: true, label: "Blocked By" },
    status: { filter: "select", label: "Status" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["issueId", "blockerIssueId", "status", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Dependency graph edges for issue-aware routing, board pivots, and operator blocker analysis.",
    citationLabelField: "issueId",
    allowedFields: ["issueId", "blockerIssueId", "status", "updatedAt"]
  }
});

export const IssueSessionResource = defineResource({
  id: "issues.sessions",
  description: "Issue-linked runtime session resume metadata.",
  businessPurpose: "Keep session resume context durable so collaboration and runtime flows can reconnect safely.",
  table: issueSessions,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    issueId: z.string().min(2),
    sessionId: z.string().min(2),
    workDir: z.string().nullable(),
    runtimeId: z.string().nullable(),
    workspaceId: z.string().nullable(),
    agentProfileId: z.string().nullable(),
    status: z.enum(["attached", "resumable", "closed"]),
    lastResumedAt: z.string().nullable(),
    updatedAt: z.string()
  }),
  fields: {
    issueId: { searchable: true, sortable: true, label: "Issue" },
    sessionId: { searchable: true, sortable: true, label: "Session" },
    runtimeId: { searchable: true, sortable: true, label: "Runtime" },
    status: { filter: "select", label: "Status" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["issueId", "sessionId", "runtimeId", "status", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Resume metadata for issue-linked runtime handoff and collaboration recovery.",
    citationLabelField: "sessionId",
    allowedFields: ["issueId", "sessionId", "workDir", "runtimeId", "workspaceId", "agentProfileId", "status", "lastResumedAt", "updatedAt"]
  }
});

export const issueResources = [
  IssueProjectResource,
  IssueResource,
  IssueCommentResource,
  IssueActivityResource,
  IssueAttachmentResource,
  IssueInboxResource,
  IssueDependencyResource,
  IssueSessionResource
] as const;
