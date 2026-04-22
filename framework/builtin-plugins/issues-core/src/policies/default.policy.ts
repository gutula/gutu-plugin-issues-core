import { definePolicy } from "@platform/permissions";

export const issuesPolicy = definePolicy({
  id: "issues-core.default",
  rules: [
    {
      permission: "issues.read",
      allowIf: ["role:admin", "role:operator", "role:support"]
    },
    {
      permission: "issues.projects.upsert",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "issues.issues.create",
      allowIf: ["role:admin", "role:operator", "role:support"],
      requireReason: true,
      audit: true
    },
    {
      permission: "issues.issues.assign",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "issues.comments.add",
      allowIf: ["role:admin", "role:operator", "role:support"],
      audit: true
    },
    {
      permission: "issues.attachments.add",
      allowIf: ["role:admin", "role:operator"],
      audit: true
    },
    {
      permission: "issues.sessions.attach",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "issues.builders.use",
      allowIf: ["role:admin", "role:operator"]
    }
  ]
});
