import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const issueProjects = pgTable("issue_projects", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  ownerKind: text("owner_kind").notNull(),
  ownerId: text("owner_id").notNull(),
  defaultQueue: text("default_queue").notNull(),
  issueCount: integer("issue_count").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const issues = pgTable("issues", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  queue: text("queue").notNull(),
  assigneeKind: text("assignee_kind"),
  assigneeId: text("assignee_id"),
  reporterKind: text("reporter_kind").notNull(),
  reporterId: text("reporter_id").notNull(),
  sessionId: text("session_id"),
  runtimeId: text("runtime_id"),
  labelCount: integer("label_count").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const issueComments = pgTable("issue_comments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  issueId: text("issue_id").notNull(),
  actorKind: text("actor_kind").notNull(),
  actorId: text("actor_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const issueActivity = pgTable("issue_activity", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  issueId: text("issue_id").notNull(),
  type: text("type").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const issueAttachments = pgTable("issue_attachments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  issueId: text("issue_id").notNull(),
  label: text("label").notNull(),
  uri: text("uri").notNull(),
  kind: text("kind").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const issueInbox = pgTable("issue_inbox", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  issueId: text("issue_id").notNull(),
  queue: text("queue").notNull(),
  reason: text("reason").notNull(),
  ownerId: text("owner_id"),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const issueDependencies = pgTable("issue_dependencies", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  issueId: text("issue_id").notNull(),
  blockerIssueId: text("blocker_issue_id").notNull(),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const issueSessions = pgTable("issue_sessions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  issueId: text("issue_id").notNull(),
  sessionId: text("session_id").notNull(),
  workDir: text("work_dir"),
  runtimeId: text("runtime_id"),
  workspaceId: text("workspace_id"),
  agentProfileId: text("agent_profile_id"),
  status: text("status").notNull(),
  lastResumedAt: timestamp("last_resumed_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
