import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  addIssueAttachment,
  addIssueComment,
  assignIssue,
  attachIssueSession,
  createIssue,
  listIssueAttachments,
  listIssueComments,
  listIssueDependencies,
  listIssueInbox,
  listIssueProjects,
  listIssues,
  listIssueSessions,
  linkIssueDependency,
  transitionIssueInboxItem,
  upsertIssueProject
} from "../../src/services/main.service";

describe("issues-core services", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-issues-core-state-"));
    process.env.GUTU_STATE_DIR = stateDir;
  });

  afterEach(() => {
    rmSync(stateDir, { recursive: true, force: true });
    if (previousStateDir === undefined) {
      delete process.env.GUTU_STATE_DIR;
      return;
    }
    process.env.GUTU_STATE_DIR = previousStateDir;
  });

  it("creates projects and issues with polymorphic assignees", () => {
    upsertIssueProject({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      projectId: "project:support",
      label: "Support Project",
      ownerKind: "user",
      ownerId: "actor-admin",
      defaultQueue: "queue:support"
    });

    const created = createIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:support-1",
      projectId: "project:support",
      title: "Investigate support escalation",
      summary: "Support escalation needs an agent triage pass.",
      priority: "high",
      queue: "queue:support",
      labels: ["support", "triage"],
      reporterKind: "user",
      reporterId: "actor-admin",
      assigneeKind: "agent",
      assigneeId: "agent-profile:support-triage",
      sessionId: "session:support-1",
      workDir: "/workspaces/support-1",
      runtimeId: "runtime:local-dev"
    });

    expect(created.status).toBe("in-progress");
    expect(listIssueProjects().some((entry) => entry.id === "project:support")).toBe(true);
    expect(listIssues().find((entry) => entry.id === "issue:support-1")?.assigneeKind).toBe("agent");
    expect(listIssueSessions().find((entry) => entry.issueId === "issue:support-1")?.runtimeId).toBe("runtime:local-dev");
  });

  it("adds comments, attachments, assignments, and resumable sessions", () => {
    createIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:ops-2",
      projectId: "project:pack0-ops",
      title: "Ops issue for comment flow",
      summary: "Seed an issue to validate collaboration updates.",
      priority: "medium",
      queue: "queue:ops",
      reporterKind: "user",
      reporterId: "actor-admin"
    });

    addIssueComment({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:ops-2",
      commentId: "comment:ops-2",
      actorKind: "user",
      body: "Need another pair of eyes here.",
      notifyActorIds: ["actor-reviewer"]
    });
    addIssueAttachment({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:ops-2",
      attachmentId: "attachment:ops-2",
      label: "Workspace Link",
      uri: "workspace://ops-2",
      kind: "workspace-link"
    });
    const assigned = assignIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:ops-2",
      assigneeKind: "user",
      assigneeId: "actor-reviewer",
      queue: "queue:ops-review",
      status: "waiting-human"
    });
    const session = attachIssueSession({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:ops-2",
      sessionId: "session:ops-2",
      workDir: "/workspaces/ops-2",
      runtimeId: "runtime:review-daemon",
      mode: "resume"
    });

    expect(assigned.status).toBe("waiting-human");
    expect(session.status).toBe("resumable");
    expect(listIssueComments().some((entry) => entry.id === "comment:ops-2")).toBe(true);
    expect(listIssueAttachments().some((entry) => entry.id === "attachment:ops-2")).toBe(true);
    expect(listIssueInbox().filter((entry) => entry.issueId === "issue:ops-2").length).toBeGreaterThanOrEqual(2);
    expect(listIssueSessions().find((entry) => entry.issueId === "issue:ops-2")?.lastResumedAt).not.toBeNull();
  });

  it("links blocker dependencies and acknowledges inbox follow-up", () => {
    createIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:blocker-1",
      projectId: "project:pack0-ops",
      title: "Blocking issue",
      summary: "This issue must close before downstream work can continue.",
      priority: "high",
      queue: "queue:ops",
      reporterKind: "user",
      reporterId: "actor-admin"
    });
    createIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:blocked-1",
      projectId: "project:pack0-ops",
      title: "Blocked issue",
      summary: "This issue depends on another issue.",
      priority: "medium",
      queue: "queue:ops",
      reporterKind: "user",
      reporterId: "actor-admin",
      assigneeKind: "user",
      assigneeId: "actor-reviewer"
    });

    const dependency = linkIssueDependency({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      dependencyId: "dependency:blocked-1:blocker-1",
      issueId: "issue:blocked-1",
      blockerIssueId: "issue:blocker-1"
    });
    const blockerInbox = listIssueInbox().find((entry) => entry.issueId === "issue:blocked-1" && entry.reason === "blocker");
    const transitioned = transitionIssueInboxItem({
      tenantId: "tenant-platform",
      actorId: "actor-reviewer",
      inboxItemId: blockerInbox?.id ?? "",
      status: "acked"
    });

    expect(dependency.status).toBe("active");
    expect(listIssueDependencies().some((entry) => entry.id === "dependency:blocked-1:blocker-1")).toBe(true);
    expect(transitioned.status).toBe("acked");
  });
});
