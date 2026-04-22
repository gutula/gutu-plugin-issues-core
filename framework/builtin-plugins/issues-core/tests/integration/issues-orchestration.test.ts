import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  addIssueComment,
  assignIssue,
  attachIssueSession,
  createIssue,
  getIssuesOverview,
  listIssueActivity,
  listIssueDependencies,
  listIssueInbox,
  listIssueSessions,
  linkIssueDependency,
  transitionIssueInboxItem,
  upsertIssueProject
} from "../../src/services/main.service";

describe("issues orchestration", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-issues-integration-"));
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

  it("runs project -> issue -> comment -> assignment -> session through the collaboration plane", () => {
    upsertIssueProject({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      projectId: "project:company-finance",
      label: "Company Finance",
      ownerKind: "user",
      ownerId: "actor-admin",
      defaultQueue: "queue:finance"
    });

    createIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:finance-1",
      projectId: "project:company-finance",
      title: "Review finance exception",
      summary: "Finance queue needs a governed exception review.",
      priority: "critical",
      queue: "queue:finance",
      reporterKind: "user",
      reporterId: "actor-admin",
      assigneeKind: "agent",
      assigneeId: "agent-profile:finance-reviewer",
      status: "waiting-human"
    });
    addIssueComment({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:finance-1",
      commentId: "comment:finance-1",
      actorKind: "user",
      body: "Route this to the named reviewer as well.",
      notifyActorIds: ["actor-reviewer"]
    });
    assignIssue({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:finance-1",
      assigneeKind: "user",
      assigneeId: "actor-reviewer",
      queue: "queue:finance-review",
      status: "waiting-human"
    });
    attachIssueSession({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      issueId: "issue:finance-1",
      sessionId: "session:finance-1",
      workDir: "/workspaces/finance-1",
      runtimeId: "runtime:finance-daemon",
      mode: "resume"
    });
    linkIssueDependency({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      dependencyId: "dependency:finance-1:pack0-review",
      issueId: "issue:finance-1",
      blockerIssueId: "issue:pack0-review"
    });
    const blockerInbox = listIssueInbox().find((entry) => entry.issueId === "issue:finance-1" && entry.reason === "blocker");
    transitionIssueInboxItem({
      tenantId: "tenant-platform",
      actorId: "actor-reviewer",
      inboxItemId: blockerInbox?.id ?? "",
      status: "acked"
    });

    expect(listIssueActivity().filter((entry) => entry.issueId === "issue:finance-1").length).toBeGreaterThanOrEqual(4);
    expect(listIssueInbox().some((entry) => entry.issueId === "issue:finance-1" && entry.ownerId === "actor-reviewer")).toBe(true);
    expect(listIssueDependencies().some((entry) => entry.issueId === "issue:finance-1" && entry.blockerIssueId === "issue:pack0-review")).toBe(true);
    expect(listIssueSessions().find((entry) => entry.issueId === "issue:finance-1")?.status).toBe("resumable");
    expect(getIssuesOverview().totals.resumableSessions).toBeGreaterThanOrEqual(1);
    expect(getIssuesOverview().totals.blockedIssues).toBeGreaterThanOrEqual(1);
  });
});
