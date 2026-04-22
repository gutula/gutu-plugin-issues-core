import { defineAction } from "@platform/schema";
import { z } from "zod";

import {
  addIssueAttachment,
  addIssueComment,
  assignIssue,
  attachIssueSession,
  createIssue,
  linkIssueDependency,
  transitionIssueInboxItem,
  upsertIssueProject
} from "../services/main.service";

const actorKindSchema = z.enum(["user", "agent"]);

export const upsertIssueProjectAction = defineAction({
  id: "issues.projects.upsert",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    projectId: z.string().min(2),
    label: z.string().min(2),
    status: z.enum(["active", "paused", "archived"]).optional(),
    ownerKind: actorKindSchema,
    ownerId: z.string().min(2),
    defaultQueue: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    projectId: z.string(),
    status: z.enum(["active", "paused", "archived"])
  }),
  permission: "issues.projects.upsert",
  idempotent: true,
  audit: true,
  handler: ({ input }) => upsertIssueProject(input)
});

export const createIssueAction = defineAction({
  id: "issues.issues.create",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    issueId: z.string().min(2),
    projectId: z.string().min(2),
    title: z.string().min(3),
    summary: z.string().min(3),
    priority: z.enum(["low", "medium", "high", "critical"]),
    queue: z.string().min(2),
    labels: z.array(z.string().min(1)).optional(),
    reporterKind: actorKindSchema,
    reporterId: z.string().min(2),
    assigneeKind: actorKindSchema.optional(),
    assigneeId: z.string().min(2).optional(),
    status: z.enum(["open", "planned", "in-progress", "waiting-human", "completed", "cancelled", "escalated"]).optional(),
    sessionId: z.string().min(2).optional(),
    workDir: z.string().min(2).optional(),
    runtimeId: z.string().min(2).optional(),
    workspaceId: z.string().min(2).optional(),
    agentProfileId: z.string().min(2).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    issueId: z.string(),
    status: z.enum(["open", "planned", "in-progress", "waiting-human", "completed", "cancelled", "escalated"]),
    inboxCount: z.number().int().nonnegative()
  }),
  permission: "issues.issues.create",
  idempotent: true,
  audit: true,
  handler: ({ input }) => createIssue(input)
});

export const assignIssueAction = defineAction({
  id: "issues.issues.assign",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    issueId: z.string().min(2),
    assigneeKind: actorKindSchema,
    assigneeId: z.string().min(2),
    queue: z.string().min(2),
    status: z.enum(["planned", "in-progress", "waiting-human", "escalated"]).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    issueId: z.string(),
    assigneeId: z.string(),
    status: z.enum(["open", "planned", "in-progress", "waiting-human", "completed", "cancelled", "escalated"])
  }),
  permission: "issues.issues.assign",
  idempotent: true,
  audit: true,
  handler: ({ input }) => assignIssue(input)
});

export const addIssueCommentAction = defineAction({
  id: "issues.comments.add",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    issueId: z.string().min(2),
    commentId: z.string().min(2),
    actorKind: actorKindSchema,
    body: z.string().min(2),
    notifyActorIds: z.array(z.string().min(2)).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    commentId: z.string(),
    inboxCount: z.number().int().nonnegative()
  }),
  permission: "issues.comments.add",
  idempotent: true,
  audit: true,
  handler: ({ input }) => addIssueComment(input)
});

export const addIssueAttachmentAction = defineAction({
  id: "issues.attachments.add",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    issueId: z.string().min(2),
    attachmentId: z.string().min(2),
    label: z.string().min(2),
    uri: z.string().min(3),
    kind: z.enum(["artifact", "approval-packet", "workspace-link", "report"])
  }),
  output: z.object({
    ok: z.literal(true),
    attachmentId: z.string()
  }),
  permission: "issues.attachments.add",
  idempotent: true,
  audit: true,
  handler: ({ input }) => addIssueAttachment(input)
});

export const linkIssueDependencyAction = defineAction({
  id: "issues.dependencies.link",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    dependencyId: z.string().min(2),
    issueId: z.string().min(2),
    blockerIssueId: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    dependencyId: z.string(),
    status: z.enum(["active", "cleared"])
  }),
  permission: "issues.dependencies.link",
  idempotent: true,
  audit: true,
  handler: ({ input }) => linkIssueDependency(input)
});

export const transitionIssueInboxItemAction = defineAction({
  id: "issues.inbox.transition",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    inboxItemId: z.string().min(2),
    status: z.enum(["acked", "resolved"])
  }),
  output: z.object({
    ok: z.literal(true),
    inboxItemId: z.string(),
    issueId: z.string(),
    status: z.enum(["acked", "resolved"])
  }),
  permission: "issues.inbox.transition",
  idempotent: true,
  audit: true,
  handler: ({ input }) => transitionIssueInboxItem(input)
});

export const attachIssueSessionAction = defineAction({
  id: "issues.sessions.attach",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    issueId: z.string().min(2),
    sessionId: z.string().min(2),
    workDir: z.string().min(2).optional(),
    runtimeId: z.string().min(2).optional(),
    workspaceId: z.string().min(2).optional(),
    agentProfileId: z.string().min(2).optional(),
    mode: z.enum(["attach", "resume", "close"])
  }),
  output: z.object({
    ok: z.literal(true),
    issueId: z.string(),
    sessionRecordId: z.string(),
    status: z.enum(["attached", "resumable", "closed"])
  }),
  permission: "issues.sessions.attach",
  idempotent: true,
  audit: true,
  handler: ({ input }) => attachIssueSession(input)
});

export const issueActions = [
  upsertIssueProjectAction,
  createIssueAction,
  assignIssueAction,
  addIssueCommentAction,
  addIssueAttachmentAction,
  linkIssueDependencyAction,
  transitionIssueInboxItemAction,
  attachIssueSessionAction
] as const;
